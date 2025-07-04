import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/common/ui/tooltip';
import { cn } from '@/lib/utils';

interface TooltipWrapperProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export { TooltipProvider } from '@/components/common/ui/tooltip';

export function TooltipWrapper(props: TooltipWrapperProps) {
  const { title, children, className } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={cn('z-99', className)}>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );
}
