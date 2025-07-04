import React, { forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Divider } from '../common/ui/divider';
import { UnderlineText } from '../common/ui/underline-text';
import { h } from './h';

interface Props {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}
export const H1 = forwardRef<HTMLHeadingElement, Props>(
  ({ className, children, ...rest }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          'my-4! scroll-m-20 text-4xl! font-extrabold tracking-tight text-balance break-words',
          className,
        )}
        {...rest}
      >
        {children}
      </h1>
    );
  },
);

export const H2 = forwardRef<HTMLHeadingElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'my-4! scroll-m-20 pb-2 text-3xl! font-extrabold tracking-tight first:mt-0',
          className,
        )}
        {...rest}
      >
        {children}
      </h2>
    );
  },
);

export const H3 = forwardRef<HTMLHeadingElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'scroll-m-20 text-3xl! font-semibold tracking-tight',
          className,
        )}
        {...rest}
      >
        {children}
      </h3>
    );
  },
);

export const H4 = forwardRef<HTMLHeadingElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn(
          'scroll-m-20 text-2xl! font-semibold tracking-tight',
          className,
        )}
        {...rest}
      >
        {children}
      </h4>
    );
  },
);

export const H5 = forwardRef<HTMLHeadingElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn(
          'scroll-m-20 text-xl! font-semibold tracking-tight',
          className,
        )}
        {...rest}
      >
        {children}
      </h5>
    );
  },
);

export const H6 = forwardRef<HTMLHeadingElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <h6
        ref={ref}
        className={cn(
          'scroll-m-20 text-lg! font-semibold tracking-tight',
          className,
        )}
        {...rest}
      >
        {children}
      </h6>
    );
  },
);

export function P({ children, className, ...rest }: Props) {
  return (
    <p
      className={cn(
        'leading-7 text-muted-foreground [&:not(:first-child)]:mt-6',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

export function Blockquote({ children, className, ...rest }: Props) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...rest}
    >
      {children}
    </blockquote>
  );
}

export function Table({ children, className, ...rest }: Props) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full text-foreground', className)} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className, ...rest }: Props) {
  return (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...rest}
    >
      {' '}
      {children}
    </th>
  );
}

export function Thead({ children, className, ...rest }: Props) {
  return (
    <thead
      className={cn('m-0 border-t p-0 even:bg-muted', className)}
      {...rest}
    >
      {children}
    </thead>
  );
}

export function Tbody({ children, className, ...rest }: Props) {
  return (
    <tbody
      className={cn('m-0 border-t p-0 even:bg-muted', className)}
      {...rest}
    >
      {children}
    </tbody>
  );
}

export function Tr({ children, className, ...rest }: Props) {
  return (
    <tr className={cn('m-0 border-t p-0 even:bg-muted', className)} {...rest}>
      {children}
    </tr>
  );
}

export function Td({ children, className, ...rest }: Props) {
  return (
    <td
      className={cn(
        'border px-4 py-2 text-left text-foreground [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

export function Ul({ children, className, ...rest }: Props) {
  return (
    <ul
      className={cn(
        'my-6 ml-3 list-disc text-foreground [&>li]:mt-2',
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  );
}

export function Li({ children, className, ...rest }: Props) {
  return (
    <li
      className={cn(
        'text-foreground [&>p]:my-0 [&>p]:mt-2 [&>p]:leading-7',
        className,
      )}
      {...rest}
    >
      {children}
    </li>
  );
}

export function A({
  children,
  href = '#',
  className,
  ...rest
}: Props & {
  href?: string;
}) {
  return (
    <a
      href={href}
      className={cn('font-semibold text-active no-underline', className)}
      {...rest}
    >
      <UnderlineText>{children}</UnderlineText>
    </a>
  );
}

export function Code({ children, className, ...rest }: Props) {
  let processedChildren = '';
  if (typeof children === 'string') {
    processedChildren = children.replace(/^`|`$/g, '').trim();
  }
  return (
    <code
      className={cn('relative inline rounded font-mono text-sm', className)}
      {...rest}
    >
      {processedChildren || children}
    </code>
  );
}

export function Lead({ children, className, ...rest }: Props) {
  return (
    <p className={cn('text-base text-muted-foreground', className)} {...rest}>
      {children}
    </p>
  );
}

export function Large({ children, className, ...rest }: Props) {
  return (
    <p className={cn('text-lg font-semibold', className)} {...rest}>
      {children}
    </p>
  );
}

export function Strong({ children, className, ...rest }: Props) {
  return (
    <strong
      className={cn('font-semibold text-foreground', className)}
      {...rest}
    >
      {children}
    </strong>
  );
}

export function Small({ children, className, ...rest }: Props) {
  return (
    <small
      className={cn('text-sm leading-none font-medium', className)}
      {...rest}
    >
      {children}
    </small>
  );
}

export function Muted({ children, className, ...rest }: Props) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...rest}>
      {children}
    </p>
  );
}

export function Pre({ children, className, ...rest }: Props) {
  const [copied, setCopied] = useState(false);
  // const lang = rest['data-language'] || 'plaintext';

  const extractTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (Array.isArray(node)) return node.map(extractTextContent).join('');
    if (React.isValidElement(node)) {
      return extractTextContent((node.props as any).children);
    }
    return '';
  };

  const handleCopy = async () => {
    const codeText = extractTextContent(children);

    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative overflow-x-auto rounded-lg bg-accent!">
      {/* <div className="text-ring flex items-center justify-between p-[0_1rem] py-2 text-center text-xs font-semibold"> */}
      {/*   <span>{lang}</span> */}
      {/*   <button */}
      {/*     onClick={handleCopy} */}
      {/*     className="hover:text-foreground flex items-center gap-1 transition-colors duration-200" */}
      {/*     aria-label="Copy code" */}
      {/*   > */}
      {/*     {copied ? ( */}
      {/*       <svg */}
      {/*         width="14" */}
      {/*         height="14" */}
      {/*         viewBox="0 0 24 24" */}
      {/*         fill="none" */}
      {/*         stroke="currentColor" */}
      {/*         strokeWidth="2" */}
      {/*       > */}
      {/*         <polyline points="20,6 9,17 4,12"></polyline> */}
      {/*       </svg> */}
      {/*     ) : ( */}
      {/*       <svg */}
      {/*         width="14" */}
      {/*         height="14" */}
      {/*         viewBox="0 0 24 24" */}
      {/*         fill="none" */}
      {/*         stroke="currentColor" */}
      {/*         strokeWidth="2" */}
      {/*       > */}
      {/*         <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> */}
      {/*         <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path> */}
      {/*       </svg> */}
      {/*     )} */}
      {/*     <span className="text-[10px]">{copied ? 'Copied!' : 'Copy'}</span> */}
      {/*   </button> */}
      {/* </div> */}
      <pre
        className={cn(
          'my-0! bg-code-background! p-4 px-0 pt-8 text-sm',
          className,
        )}
        {...rest}
      >
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-1 transition-colors duration-200 hover:text-background dark:hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
          <span className="text-[10px]">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
        {children}
      </pre>
    </div>
  );
}

export const mdComponents = {
  h1: h(1),
  h2: h(2),
  h3: h(3),
  h4: h(4),
  h5: h(5),
  h6: h(6),
  strong: Strong,
  p: P,
  blockquote: Blockquote,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  ul: Ul,
  li: Li,
  hr: Divider,
  lead: Lead,
  large: Large,
  small: Small,
  muted: Muted,
  pre: Pre,
  code: Code,
  a: A,
};
