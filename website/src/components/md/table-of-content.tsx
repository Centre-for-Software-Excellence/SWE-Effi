import { memo, RefObject, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { TOCHeading, useTocStore } from '@/stores/toc';
import type { Heading } from '@/stores/toc';
import { ScrollArea } from '../common/ui/scroll-area';

type TOCItem = TOCHeading & {
  active: boolean;
};

function TOCItem({ level, active, value, id }: TOCItem) {
  const refItem = useRef<HTMLLIElement>(null);
  const registerTOCHeading = useTocStore((state) => state.registerTOCHeading);
  useEffect(() => {
    if (id) registerTOCHeading(id, refItem as React.RefObject<HTMLLIElement>);
  }, [id, registerTOCHeading]);
  return (
    <li ref={refItem} className={`line-clamp-3 py-1 leading-6`}>
      <div className={`relative`}>
        <a
          href={`#${id}`}
          title={value}
          className={cn(
            'decoration-none block max-w-full break-words transition-all duration-200 ease-in-out hover:text-foreground',
            active ? 'text-foreground' : 'text-muted-foreground',
          )}
          style={{
            paddingLeft: `${level * 0.75}rem`,
          }}
        >
          {value}
        </a>
      </div>
    </li>
  );
}

const HighlightedTOCHeading = memo(
  ({
    headings,
    scrollAreaRef,
  }: {
    headings: Heading[];
    scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  }) => {
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
      const scrollArea = scrollAreaRef.current;
      if (!scrollArea) return;

      // find the viewport
      const viewport = scrollArea.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (!viewport) return;

      const handleScroll = () => {
        setScrollTop(viewport.scrollTop);
      };

      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }, [scrollAreaRef]);

    const visibleHeadingIds = headings
      .filter((heading) => heading.isVisible)
      .map((heading) => heading.id);

    const elTocItems = headings.reduce((map, s) => {
      return {
        ...map,
        [s.id]: s.outlineRef?.current,
      };
    }, {}) as Record<string, HTMLLIElement | null | undefined>;

    const firstVisibleHeadingIndex = Math.max(
      0,
      headings.findIndex((heading) => heading.id === visibleHeadingIds[0]),
    );

    const height: number | string = visibleHeadingIds.reduce(
      (h, id) => h + (elTocItems[id]?.offsetHeight || 0),
      0,
    );

    const rawTop = headings
      .slice(0, firstVisibleHeadingIndex)
      .reduce((t, s) => t + (elTocItems[s.id]?.offsetHeight || 0), 0);

    const top = rawTop - scrollTop;

    const containerHeight = scrollAreaRef.current?.clientHeight || 0;
    const maxHeight = Math.max(0, containerHeight - Math.max(0, top));
    const finalHeight = Math.min(height as number, maxHeight);

    return (
      <div
        className="absolute left-3 w-px bg-gradient-to-t from-transparent via-foreground to-transparent transition-all duration-300"
        style={{
          height: finalHeight,
          top: Math.max(0, top),
          opacity: finalHeight > 0 ? 1 : 0,
        }}
        aria-hidden
      />
    );
  },
);

export function TableOfContent({ className }: { className?: string }) {
  const headings = useTocStore((state) => state.headings);
  const toc = useRef<HTMLDivElement>(null);
  const registerTOC = useTocStore((state) => state.registerTOC);
  useEffect(() => {
    registerTOC(toc as RefObject<HTMLDivElement>);
  }, [registerTOC]);
  const minimumLevel = (headings || []).reduce(
    (p, c) => Math.min(p, c.level),
    6,
  );

  return (
    <div
      className={cn(
        'relative h-full max-h-[calc(100vh-19rem)] animate-fade-slide-in-right text-sm',
        className,
      )}
    >
      <h2 className="mb-4 h-4 leading-4 font-[600] text-foreground/75">
        On This Page
      </h2>
      <ScrollArea
        ref={toc}
        className="relative max-h-[calc(100vh-theme(spacing.72))] [&>[data-radix-scroll-area-viewport]]:!max-h-[inherit]"
      >
        <span className="absolute top-0 bottom-0 left-3 w-px bg-gradient-to-t from-muted/50 via-muted to-muted/50" />
        <HighlightedTOCHeading headings={headings || []} scrollAreaRef={toc} />
        <ul className="list-none pl-6">
          {headings &&
            headings.map((heading) => (
              <TOCItem
                key={heading.id}
                {...heading}
                level={heading.level - minimumLevel}
                active={heading.isVisible}
              />
            ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
