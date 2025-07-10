import { ReactNode } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

import { Button } from '@/components/common/ui/button';

interface ChartControlsProps {
  explanation?: ReactNode;
  expandButton?: {
    isExpanded: boolean;
    onToggle: () => void;
  };
  settingsButton?: ReactNode;
}

export function ChartControls({
  explanation,
  expandButton,
  settingsButton,
}: ChartControlsProps) {
  return (
    <div className="flex items-center justify-end">
      {explanation}
      {settingsButton}
      {expandButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={expandButton.onToggle}
          className="ml-2 bg-accent text-foreground transition-transform duration-200 ease-in-out hover:scale-130 hover:bg-background hover:text-foreground"
        >
          {expandButton.isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
