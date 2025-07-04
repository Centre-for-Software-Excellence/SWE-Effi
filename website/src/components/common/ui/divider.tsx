import { cn } from '@/lib/utils';

export function Divider({
  className,
  hasToc = false,
}: {
  className?: string;
  hasToc?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative my-8 flex w-full items-center justify-center overflow-x-visible',
        className,
      )}
    >
      <span
        className={cn(
          'absolute left-1/2 h-px w-full -translate-x-1/2 animate-expand-x bg-[linear-gradient(to_right,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] md:w-[calc(100vw-17.5rem)]',
          hasToc && 'lg:w-[calc(100vw-31.5rem)]',
        )}
      />
    </div>
  );
}
