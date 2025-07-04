import { ReactNode } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

import { Button } from '@/components/common/ui/button';

interface ChartControlsProps {
  explanation?: ReactNode;
  legend?: ReactNode;
  expandButton?: {
    isExpanded: boolean;
    onToggle: () => void;
  };
  settingsButton?: ReactNode;
}

export function ChartControls({
  explanation,
  legend,
  expandButton,
  settingsButton,
}: ChartControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {explanation}
          {settingsButton}
          {legend}
          {expandButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={expandButton.onToggle}
              className="bg-accent text-foreground transition-transform duration-200 ease-in-out hover:scale-130 hover:bg-background hover:text-foreground"
            >
              {expandButton.isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
