import { cn } from '@/lib/utils';
import { useContentStore } from '@/stores/content';
import { useUIStore } from '@/stores/ui';
import { H1, H4, Lead, Muted } from '.';
import { Divider } from '../common/ui/divider';

export function Frontmatter({ className }: { className?: string }) {
  const { frontmatter } = useContentStore();
  const showToc = useUIStore((state) => state.showToc);
  return (
    frontmatter && (
      <div className={cn('flex flex-col', className)}>
        <H1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text leading-tight font-bold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400">
          {frontmatter?.title}
        </H1>
        {frontmatter?.description && <Lead>{frontmatter?.description}</Lead>}
        <div className="flex w-full flex-col items-start">
          <div className="flex flex-row gap-2 text-sm text-muted-foreground">
            {(frontmatter?.author && frontmatter.author.join(', ')) || ' '}
          </div>
          <Muted className="w-full text-end">{frontmatter?.date}</Muted>
        </div>
        {Object.entries(frontmatter).length !== 0 && (
          <Divider hasToc={showToc} />
        )}
      </div>
    )
  );
}

export function FrontmatterForTSX({
  className,
  frontmatter,
}: {
  className?: string;
  frontmatter: Record<string, any>;
}) {
  return (
    frontmatter && (
      <div className={cn('flex flex-col', className)}>
        <H4 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text leading-tight font-bold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400">
          {frontmatter?.title}
        </H4>
        {frontmatter?.description && <Lead>{frontmatter?.description}</Lead>}
        {frontmatter?.date && <Muted>{frontmatter?.date}</Muted>}
      </div>
    )
  );
}
