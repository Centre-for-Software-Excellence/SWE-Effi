import { useState } from 'react';
import { Layers, MoreHorizontal } from 'lucide-react';

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
  activeKeys,
  setActiveKeys,
}: {
  keys: string[];
  config: ChartConfig;
  activeKeys?: string[];
  setActiveKeys?: (keys: string[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowEllipsis = keys.length > 3;
  const visibleKeys =
    shouldShowEllipsis && !isExpanded ? keys.slice(0, 3) : keys;

  const toggleKey = (key: string) => {
    if (activeKeys?.includes(key)) {
      setActiveKeys?.(activeKeys.filter((k) => k !== key));
    } else {
      setActiveKeys?.([...(activeKeys || []), key]);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 p-2">
      {visibleKeys.map((k) => (
        <Button
          key={k}
          variant="ghost"
          className={cn(
            'cursor-default',
            'hover:bg-background',
            activeKeys?.includes(k) && 'bg-muted hover:bg-muted',
          )}
          onClick={() => toggleKey(k)}
        >
          <LegendItem
            legendStyle="cube"
            key={config[k].label as string}
            color={config[k].color as string}
            label={config[k].label as string}
          />
        </Button>
      ))}
      {shouldShowEllipsis && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
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
              key={k}
              color={config[k]?.color as string}
              label={config[k]?.label as string}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
