import { Layers } from 'lucide-react';

import { Button } from '@/components/common/ui/button';
import { ChartConfig } from '@/components/common/ui/chart';
import { ScrollArea } from '@/components/common/ui/scroll-area';
import { cn } from '@/lib/utils';

function LegendItem({
  color,
  label,
  legendStyle = 'default',
}: {
  key: string;
  color: string;
  label: string;
  legendStyle?: 'default' | 'cube';
}) {
  return (
    <div className="flex items-center gap-2 text-xs md:text-sm">
      <div
        className={cn('opacity relative', {
          'h-3 w-3 rounded-none': legendStyle === 'cube',
          'h-3 w-1 rounded-full': legendStyle === 'default',
        })}
        style={{
          backgroundColor: color,
        }}
      ></div>
      <span
        className={cn({
          'text-sm': legendStyle === 'default',
          'text-xs': legendStyle === 'cube',
        })}
      >
        {label}
      </span>
    </div>
  );
}

export function StackedLegend({
  keys,
  config,
  setActiveKeys,
}: {
  keys: string[];
  config: ChartConfig;
  setActiveKeys?: (keys: string[]) => void;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 p-2">
      {keys.map((k) => (
        <Button
          key={k}
          variant="ghost"
          className="cursor-default"
          onClick={() => setActiveKeys?.([k])}
        >
          <LegendItem
            legendStyle="cube"
            key={config[k].label as string}
            color={config[k].color as string}
            label={config[k].label as string}
          />
        </Button>
      ))}
    </div>
  );
}
export function HoverableLegend({
  keys,
  config,
}: {
  keys: string[];
  config: ChartConfig;
}) {
  return (
    <div className="group absolute top-0 right-0 z-30 m-2 mr-4 flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-background p-4 pr-0 hover:h-[200px] hover:w-auto hover:border">
      <ScrollArea className="h-[200px] pr-4">
        <Layers className="h-4 w-4 text-muted-foreground group-hover:opacity-0" />
        <div className="hidden flex-col gap-2 group-hover:flex">
          {keys.map((k) => (
            <LegendItem
              key={config[k].label as string}
              color={config[k].color as string}
              label={config[k].label as string}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
