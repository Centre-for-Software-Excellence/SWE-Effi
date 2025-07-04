import { useCallback, useEffect } from 'react';

import { useTocStore } from '@/stores/toc';

export function useCurrentHeadings() {
  const { headings, setCurrentHeadings } = useTocStore();

  const checkVisibleHeading = useCallback(() => {
    const { innerHeight, scrollY } = window;
    const newVisibleHeadings: string[] = [];

    for (let h = 0; h < headings.length; h++) {
      const { id, headingRef } = headings[h];

      if (!headingRef?.current) {
        continue;
      }
      const top = headingRef?.current.getBoundingClientRect().top + scrollY;

      // for now, we only set one visible heading unless scrolled to the bottom
      // if the heading is visible in the viewport
      if (top > scrollY + 48 && top < scrollY + innerHeight) {
        // if scrolled to the bottom of the page, add all remaining headings
        if (
          document.documentElement.clientHeight + scrollY >=
          document.documentElement.scrollHeight - 10
        ) {
          newVisibleHeadings.push(...headings.slice(h).map((s) => s.id));
          if (
            newVisibleHeadings.join() !=
            headings
              .filter((s) => s.isVisible)
              .map((s) => s.id)
              .join()
          ) {
            setCurrentHeadings(newVisibleHeadings);
            break;
          }
        }
        newVisibleHeadings.push(id);
        setCurrentHeadings(newVisibleHeadings);
        break;
      }
    }
  }, [headings, setCurrentHeadings]);

  useEffect(() => {
    window.addEventListener('scroll', checkVisibleHeading, { passive: true });
    window.addEventListener('resize', checkVisibleHeading);

    return () => {
      window.removeEventListener('scroll', checkVisibleHeading);
      window.removeEventListener('resize', checkVisibleHeading);
    };
  }, [headings, checkVisibleHeading]);
}
