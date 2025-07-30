import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';

import { mdComponents, Muted } from '@/components/md';
import { useCurrentHeadings } from '@/hooks/use-current-headings';
import { useContentStore } from '@/stores/content';
import { StaggeredContent } from '../common/staggered-content';
import { Frontmatter } from './frontmatter';

export function MDXViewer({ path }: { path: string }) {
  const { Component, render } = useContentStore();
  useEffect(() => {
    render(path);
  }, [render, path]);
  useCurrentHeadings();
  return (
    <article className="mx-auto prose bg-background p-4 md:shrink-1 prose-headings:mt-4">
      <StaggeredContent>
        <Frontmatter />
        <MDXProvider components={mdComponents}>
          {Component ? (
            <Component />
          ) : (
            <div className="relative before:fixed before:inset-0 before:-translate-x-full before:animate-loading before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent md:before:-translate-x-full">
              <Muted className="animate-pulse">Loading…</Muted>
            </div>
          )}
        </MDXProvider>
      </StaggeredContent>
    </article>
  );
}
