import { cn } from '@/lib/utils';

export interface UnderlineTextProps {
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'middle' | 'right';
  gradient?: boolean;
  lineStyle?: 'bold' | 'thin';
}

export function UnderlineText({
  children,
  className,
  position = 'left',
  gradient = true,
  lineStyle = 'thin',
}: UnderlineTextProps) {
  return (
    <span>
      <span
        className={cn(
          `bg-gradient-to-r from-transparent via-foreground to-transparent bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 hover:text-foreground`,
          {
            'bg-[length:0%_2px] hover:bg-[length:100%_2px]':
              lineStyle === 'bold',
            'bg-[length:0%_1px] hover:bg-[length:100%_1px]':
              lineStyle === 'thin',
          },
          {
            'bg-bottom hover:bg-bottom': position === 'middle',
            'bg-right-bottom hover:bg-left-bottom': position === 'left',
            'bg-left-bottom hover:bg-right-bottom': position === 'right',
          },
          gradient
            ? 'from-transparent via-foreground to-transparent'
            : 'from-foreground to-foreground',
          className,
        )}
      >
        {children}
      </span>
    </span>
  );
}
