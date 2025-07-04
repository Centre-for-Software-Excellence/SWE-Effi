import { RefObject, useEffect, useRef } from 'react';

import { H1, H2, H3, H4, H5, H6 } from '@/components/md';
import { useTocStore } from '@/stores/toc';

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

// use it to wrap heading components and register them in to zustand store for later use in table of contents
export const h = (level: number) => {
  const H = (props: Props) => {
    const { id, children } = props;
    const refHeading = useRef<HTMLHeadingElement>(null);
    const registerHeading = useTocStore((state) => state.registerHeading);

    const HeadingComponent = [H1, H2, H3, H4, H5, H6][level - 1] || H1;

    useEffect(() => {
      if (id) registerHeading(id, refHeading as RefObject<HTMLHeadingElement>);
    }, [id, registerHeading]);

    return (
      <HeadingComponent
        {...props}
        ref={refHeading}
        id={id}
        className="text-foreground"
      >
        {children}
      </HeadingComponent>
    );
  };

  return (props: Props) => <H {...props} />;
};
