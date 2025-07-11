import { RefObject } from 'react';
import { create } from 'zustand';

import { logger } from './logger';

export type Heading = TOCHeading & {
  headingRef: RefObject<HTMLHeadingElement> | null;
  outlineRef: RefObject<HTMLLIElement> | null;
  isVisible: boolean;
};
export type TocState = {
  toc: RefObject<HTMLDivElement> | null;
  headings: Heading[];
  updateHeadings: (headings: TOCHeading[]) => void;
  registerTOC: (ref: RefObject<HTMLDivElement>) => void;
  registerHeading: (id: string, ref: RefObject<HTMLHeadingElement>) => void; // Register a heading with its ID and ref
  registerTOCHeading: (id: string, ref: RefObject<HTMLLIElement>) => void; // Register an toc heading item with its ID and ref
  setCurrentHeadings: (id: string[]) => void; // Set the current heading based on its ID
};

export type TOCHeading = {
  value: string;
  id: string;
  level: number;
};

export const useTocStore = create<TocState>(
  logger(
    (set, get) => ({
      toc: null,
      headings: [],
      updateHeadings(headings: TOCHeading[]) {
        const prevSections = get().headings;
        const sections = headings.map((h) => {
          const prev = prevSections.find((s) => s.id === h.id);
          return {
            ...h,
            isVisible: prev ? prev.isVisible : false,
            headingRef: prev ? prev.headingRef : null,
            outlineRef: prev ? prev.outlineRef : null,
          };
        });
        set({ headings: sections });
      },
      registerTOC(ref: RefObject<HTMLDivElement>) {
        set({ toc: ref });
      },
      registerHeading: function registerHeading(
        id: string,
        ref: RefObject<HTMLHeadingElement>,
      ) {
        set((state) => ({
          headings: state.headings.map((s) =>
            s.id === id ? { ...s, headingRef: ref } : s,
          ),
        }));
      },

      registerTOCHeading(id: string, ref: RefObject<HTMLLIElement>) {
        set((state) => ({
          headings: state.headings.map((s) =>
            s.id === id ? { ...s, outlineRef: ref } : s,
          ),
        }));
      },
      setCurrentHeadings(ids: string[]) {
        if (get().toc?.current)
          get()
            .headings.filter((h) => ids.includes(h.id))
            .slice(-1)[0]
            .outlineRef?.current.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth',
            });
        set((state) => ({
          headings: state.headings.map((s) => ({
            ...s,
            isVisible: ids.includes(s.id),
          })),
        }));
      },
    }),
    { name: 'Toc Store', showDiff: true, enabled: import.meta.env.DEV },
  ),
);
