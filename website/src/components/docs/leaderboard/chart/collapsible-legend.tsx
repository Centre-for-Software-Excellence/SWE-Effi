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

export function CollapsibleLegend({
  keys,
  config,
}: {
  keys: string[];
  config: ChartConfig;
}) {
  const [showLegend, setShowLegend] = useState(false);
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
            <CollapsibleContent className="scrollbar-thin max-h-[20ch] space-y-1 overflow-y-auto rounded-md border bg-background/70 p-2 md:max-h-[30ch] md:space-y-2">
              {keys.map((k) => (
                <div
                  key={config[k].label as string}
                  className="flex items-center gap-2 text-[8px] md:text-sm"
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
              {keys.map((k) => (
                <div
                  key={config[k].label as string}
                  className="flex items-center gap-2 text-[8px] md:text-sm"
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
              {keys.map((k) => (
                <div
                  key={config[k].label as string}
                  className="flex items-center gap-2 text-[8px] md:text-sm"
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
            </CollapsibleContent>
          </div>
        </div>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
