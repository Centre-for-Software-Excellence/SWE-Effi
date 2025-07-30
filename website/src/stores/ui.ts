import { create } from 'zustand';

import { ResolvedDoc } from '@/lib/docs/resolver';
import { logger } from './logger';

export type UIState = {
  showSidebar: boolean;
  showToc: boolean;
  showFooter: boolean;
  loading: boolean;
  error: string | null;
  // this resolved doc will be used to render the mdx content, or, if the doc is tsx, we will directly use the module
  doc: ResolvedDoc | null;
  menuOpen: boolean;
  setShowSidebar: (show: boolean) => void;
  setShowToc: (show: boolean) => void;
  setShowFooter: (show: boolean) => void;
  setDoc: (doc: ResolvedDoc | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setMenuOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>(
  logger(
    (set) => ({
      showSidebar: true,
      showToc: false,
      showFooter: true,
      loading: false,
      doc: null,
      error: null,
      menuOpen: false,
      setShowSidebar: (show: boolean) => {
        set({ showSidebar: show });
      },
      setShowToc: (show: boolean) => {
        set({ showToc: show });
      },
      setShowFooter: (show: boolean) => {
        set({ showFooter: show });
      },
      setLoading: (loading: boolean) => {
        set({ loading });
      },
      setError: (error: string | null) => {
        set({ error });
      },
      setDoc: (doc: ResolvedDoc | null) => {
        set({ doc });
      },
      setMenuOpen: (open: boolean) => {
        set({ menuOpen: open });
      },
    }),
    { name: 'Toc Store', showDiff: true },
  ),
);
