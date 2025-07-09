import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { ChevronsUpDown } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Button } from '@/components/common/ui/button';
import { ChartConfig } from '@/components/common/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/common/ui/scroll-area';

export function CollapsibleLegend({
  keys,
  config,
  show = false,
}: {
  keys: string[];
  config: ChartConfig;
  show?: boolean;
}) {
  const [showLegend, setShowLegend] = useState(show);
  return (
    <Collapsible open={showLegend} onOpenChange={setShowLegend}>
      <CollapsibleTrigger asChild>
        <div className="relative">
          <TooltipWrapper title="Legend">
            <Button
              variant="outline"
              size="icon"
              className="flex items-center gap-2 bg-accent text-foreground hover:bg-background hover:text-foreground"
            >
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </TooltipWrapper>

          <div className="absolute top-10 right-0 z-10">
            <CollapsibleContent className="max-h-[20ch] rounded-md border bg-background/70 p-2 md:max-h-[30ch]">
              <ScrollArea
                className="h-full w-[200px] md:w-auto"
                style={{
                  height: Math.min(200, keys.length * 22) + 8,
                }}
              >
                <div className="flex flex-col space-y-2 pr-2">
                  {keys.map((k) => (
                    <div
                      key={config[k].label as string}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{
                          backgroundColor: config[k].color,
                        }}
                      />
                      <span className="truncate">{config[k].label}</span>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CollapsibleContent>
          </div>
        </div>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
