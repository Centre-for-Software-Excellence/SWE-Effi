import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';

import { mdComponents } from '@/components/md';
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
          {Component ? <Component /> : <div>Loading…</div>}
        </MDXProvider>
      </StaggeredContent>
    </article>
  );
}
