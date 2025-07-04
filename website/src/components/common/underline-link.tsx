import { Link } from 'react-router';

import {
  UnderlineText,
  UnderlineTextProps,
} from '@/components/common/ui/underline-text';
import { cn } from '@/lib/utils';

type UnderlineLinkProps = UnderlineTextProps & {
  href?: string;
};

export function UnderlineLink({
  href,
  children,
  className,
  gradient,
  position,
  ...props
}: UnderlineLinkProps) {
  return (
    <Link
      to={href || '#'}
      className={cn('text-sm font-normal text-muted-foreground', className)}
      {...props}
    >
      <UnderlineText gradient={gradient} position={position} lineStyle="thin">
        {children}
      </UnderlineText>
    </Link>
  );
}
