import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'default' | 'screen';
}
export function Loading({ size = 'default' }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-background text-muted-foreground',
        size === 'screen'
          ? 'fixed top-0 left-0 z-99 h-screen w-screen'
          : 'fixed top-12 left-0 z-99 h-[calc(100vh-176px)] w-screen',
      )}
    >
      <span className="animate-text-loading">Loading...</span>
      <div className="animate-loading-2 h-px w-[400px] bg-gradient-to-r from-transparent via-foreground to-transparent" />
    </div>
  );
}
