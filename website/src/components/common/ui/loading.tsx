import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'default' | 'screen';
}
export function Loading({ size = 'default' }: LoadingProps) {
  return (
    <div
      className={cn(
        'animate-text-loading flex flex-col items-center justify-center text-muted-foreground',
        size === 'default' ? 'fixed inset-0' : 'h-screen w-screen',
      )}
    >
      Loading...
      <div className="animate-loading-2 h-px w-[400px] bg-gradient-to-r from-transparent via-foreground to-transparent" />
    </div>
  );
}
