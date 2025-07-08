import { useCallback, useEffect } from 'react';

import { useTocStore } from '@/stores/toc';

export function useCurrentHeadings() {
  const { headings, setCurrentHeadings } = useTocStore();

  const checkVisibleHeading = useCallback(() => {
    const { innerHeight, scrollY } = window;
    let bestHeading = '';
    let minDistance = Infinity;

    const viewportCenter = scrollY + innerHeight / 2;

    for (let h = 0; h < headings.length; h++) {
      const { id, headingRef } = headings[h];
      if (!headingRef?.current) continue;

      const top = headingRef.current.getBoundingClientRect().top + scrollY;

      const distance = Math.abs(top - viewportCenter);

      if (top <= scrollY + innerHeight / 2 + 24) {
        if (distance < minDistance) {
          minDistance = distance;
          bestHeading = id;
        }
      }
    }

    const isAtBottom =
      document.documentElement.clientHeight + scrollY >=
      document.documentElement.scrollHeight - 50;

    if (isAtBottom && headings.length > 0) {
      bestHeading = headings[headings.length - 1].id;
    }

    if (bestHeading) {
      setCurrentHeadings([bestHeading]);
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
