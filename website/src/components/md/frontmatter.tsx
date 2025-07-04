import { cn } from '@/lib/utils';
import { useContentStore } from '@/stores/content';
import { H1, Lead, Muted } from '.';
import { Divider } from '../common/ui/divider';

export function Frontmatter({ className }: { className?: string }) {
  const { frontmatter } = useContentStore();
  return (
    frontmatter && (
      <div className={cn('flex flex-col', className)}>
        <H1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text leading-tight font-bold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400">
          {frontmatter?.title}
        </H1>
        <Lead>{frontmatter?.description}</Lead>
        {/* <div className="flex flex-row gap-2"> */}
        {/*   {frontmatter?.tags?.map((tag, index) => ( */}
        {/*     <span */}
        {/*       key={index} */}
        {/*       className="rounded-lg bg-muted px-2 py-1 text-muted-foreground" */}
        {/*     > */}
        {/*       {tag} */}
        {/*     </span> */}
        {/*   ))} */}
        {/* </div> */}
        {frontmatter?.date && (
          <div className="flex w-full flex-row items-center">
            {/* <div className="flex flex-row gap-2"> */}
            {/*   {frontmatter?.author?.map((author, index) => ( */}
            {/*     <A href="" key={index} className="text-muted-foreground"> */}
            {/*       {author} */}
            {/*     </A> */}
            {/*   ))} */}
            {/* </div> */}
            <Muted>{frontmatter?.date}</Muted>
          </div>
        )}
        {Object.entries(frontmatter).length !== 0 && <Divider hasToc={true} />}
      </div>
    )
  );
}
