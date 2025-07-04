import { cn } from '@/lib/utils';

interface StaggeredContentProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggeredContent({
  children,
  className,
  delay = 0,
}: StaggeredContentProps) {
  return (
    <div className={cn(`delay-[${delay}s] animate-fade-in`, className)}>
      {children}
    </div>
  );
}
