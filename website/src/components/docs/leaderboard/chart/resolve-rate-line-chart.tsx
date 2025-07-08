import { SlidersHorizontal } from 'lucide-react';

import {
  TooltipProvider,
  TooltipWrapper,
} from '@/components/common/tooltip-wrapper';
import { Button } from '@/components/common/ui/button';
import { Dialog, DialogTrigger } from '@/components/common/ui/dialog';
import { CollapsibleLegend } from '@/components/docs/leaderboard/chart/atoms/collapsible-legend';
import { useChartData } from '@/hooks/chart/use-chart-data';
import { useChartPopover } from '@/hooks/chart/use-chart-popover';
import { useChartSettings } from '@/hooks/chart/use-chart-settings';
import { cn } from '@/lib/utils';
import { ChartCard } from './atoms/chart-card';
import { ChartControls } from './atoms/chart-controls';
import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { ChartSettings } from './atoms/chart-settings';
import { LineChartRenderer } from './atoms/line-chart-renderer';
import { ChartProps } from './types';

export interface ChartData {
  totalTokens: number;
  [seriesName: string]: number;
}

export function ResolveRateLineChart({
  title,
  description,
  overview,
  insight,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
}: ChartProps) {
  const explanationContent = {
    overview,
    insight,
  };

  const {
    data: chartData,
    config: chartConfig,
    loading,
    error,
  } = useChartData<ChartData>(
    '/data/benchmark/chart/resolve-rate-line/chart-data.json',
    '/data/benchmark/chart/resolve-rate-line/chart-config.json',
  );

  const { isExpanded, toggleExpanded } = useChartPopover();

  const {
    openSettings,
    setOpenSettings,
    activeKeys,
    setActiveKeys,
    maxTokens,
    xRange,
    setXRange,
  } = useChartSettings({ chartData, chartConfig });

  const settingsButton = (
    <TooltipWrapper title="Settings">
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center gap-2 bg-accent text-foreground hover:bg-background hover:text-foreground"
          onClick={() => setOpenSettings(!openSettings)}
        >
          <SlidersHorizontal />
        </Button>
      </DialogTrigger>
    </TooltipWrapper>
  );

  const legend = (
    <CollapsibleLegend keys={activeKeys || []} config={chartConfig || {}} />
  );

  const explanation = <ChartExplanation content={explanationContent} />;

  return (
    <>
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        {/* Dialog content */}
        <ChartSettings
          xRange={xRange}
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig || {})}
          maxX={maxTokens}
          setXRange={setXRange}
          onClose={() => setOpenSettings(false)}
        />

        <ChartCard
          isExpanded={isExpanded}
          loading={loading}
          error={error}
          className={cn(
            'relative overflow-y-visible rounded shadow-none',
            isExpanded &&
              'fixed top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2',
          )}
        >
          <ChartHeader title={title} description={description}>
            <TooltipProvider>
              <ChartControls
                explanation={explanation}
                legend={legend}
                expandButton={{ isExpanded, onToggle: toggleExpanded }}
                settingsButton={settingsButton}
              />
            </TooltipProvider>
          </ChartHeader>

          <div className="relative px-4">
            <LineChartRenderer
              data={chartData}
              config={chartConfig || {}}
              activeKeys={activeKeys}
              xRange={xRange}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              xAxisDataKey={xAxisDataKey}
            />
          </div>
        </ChartCard>
      </Dialog>
    </>
  );
}
