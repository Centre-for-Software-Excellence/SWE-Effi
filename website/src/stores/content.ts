import { create } from 'zustand';

import { logger } from './logger';
import { useTocStore } from './toc';

interface Frontmatter {
  title?: string;
  description?: string;
  author?: string[];
  date?: string;
  tags?: string[];
  draft?: boolean;
  [key: string]: any;
}

interface ContentState {
  Component?: React.ComponentType<any> | null;
  frontmatter?: Frontmatter | null;
  render: (path: string) => Promise<void>;
  lastError: Error | null | undefined;
}

export const useContentStore = create<ContentState>(
  logger(
    (set) => ({
      renderId: 0,
      Component: null,
      frontmatter: null,
      lastError: null,
      render: async (path: string) => {
        try {
          const mdxModules = import.meta.glob('/src/docs/**/*.mdx');
          const importer = mdxModules[path];
          if (!importer) {
            throw new Error(`[MDX] no module found for path "${path}"`);
          }
          importer().then((mod: any) => {
            set({
              Component: mod.default || null,
              frontmatter: mod.frontmatter || null,
            });
            useTocStore.getState().updateHeadings(mod.headings || []);
          });
        } catch (e: any) {
          console.error(`Failed to render Markdown: ${e.stack}`);
          set({
            Component: null,
            frontmatter: null,
            lastError: new Error('Failed to render Markdown'),
          });
        }
      },
    }),
    {
      name: 'Markdown Content Sotre',
      showDiff: false,
      enabled: import.meta.env.DEV,
    },
  ),
);
