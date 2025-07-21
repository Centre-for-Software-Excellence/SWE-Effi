import { Button } from '@/components/common/ui/button';
import { cn } from '@/lib/utils';

interface ChartDataSelectorProps {
  activeDataTypes: Set<string>;
  onToggleDataType: (dataType: string) => void;
}

const dataTypes = [
  { key: 'total-time', label: 'Total Time' },
  { key: 'cpu-time', label: 'CPU Time' },
  { key: 'gpu-time', label: 'GPU Time' },
];
export function ChartDataSelector({
  activeDataTypes,
  onToggleDataType,
}: ChartDataSelectorProps) {
  return (
    <div className="absolute top-0 mb-0 flex h-8 w-fit -translate-y-full items-center justify-center gap-1.5 rounded-t p-2 pt-2 pb-0 text-muted-foreground">
      {dataTypes.map(({ key, label }) => {
        const isActive = activeDataTypes.has(key);
        return (
          <Button
            key={key}
            variant={'outline'}
            size="sm"
            onClick={() => onToggleDataType(key)}
            className={cn(
              'h-6 cursor-default rounded-t rounded-b-none border-b-0 text-sm font-medium whitespace-nowrap text-foreground dark:border-b-0',
              isActive
                ? 'bg-foreground text-background hover:bg-accent hover:text-accent-foreground dark:bg-foreground dark:text-background dark:hover:text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-background',
            )}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
