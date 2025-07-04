'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Button } from '@/components/common/ui/button';
import { H5, Large } from '@/components/md';

export function ChartExplanation({
  content,
}: {
  content: {
    overview: string;
    insight: string;
    methodology?: string;
    note?: string[];
    tooltip?: string;
  };
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <>
      <TooltipWrapper title={content.tooltip || 'Chart Expanation'}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setShowExplanation(true);
          }}
          className="flex items-center gap-2 bg-accent text-xs text-foreground hover:bg-background hover:text-foreground sm:text-base"
        >
          <Info className="h-4 w-4" />
        </Button>
      </TooltipWrapper>
      {showExplanation && (
        <div className="scrollbar-hidden absolute inset-2 z-50 overflow-y-auto rounded border bg-background p-2 backdrop-blur-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <H5 className="flex items-center gap-2 leading-none font-semibold">
              Chart Analysis & Insights
            </H5>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setShowExplanation(false);
              }}
              className="flex items-center gap-2 bg-accent text-foreground hover:bg-background hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <Large className="mb-2 flex items-center gap-2 font-semibold">
                Overview
              </Large>
              <p className="leading-relaxed text-muted-foreground">
                {content.overview}
              </p>
            </div>
            {/* Insights */}
            <div>
              <Large className="mb-2 flex items-center gap-2 font-semibold">
                Insight
              </Large>
              <p className="leading-relaxed text-muted-foreground">
                {content.insight}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
