import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import { CollapsibleLegend } from '@/components/docs/leaderboard/chart/atoms/collapsible-legend';
import { useChartData } from '@/hooks/chart/use-chart-data';
import { useChartPopover } from '@/hooks/chart/use-chart-popover';
import { cn } from '@/lib/utils';
import { BarChartRenderer } from './atoms/bar-chart-renderer';
import { ChartCard } from './atoms/chart-card';
import { ChartControls } from './atoms/chart-controls';
import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { ChartProps } from './types';

export interface ChartData {
  scaffold: string;
  [key: string]: number | string | undefined;
}

export function CallsBarChart({
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
    '/data/benchmark/chart/calls-bar/chart-data.json',
    '/data/benchmark/chart/calls-bar/chart-config.json',
  );

  const { isExpanded, toggleExpanded } = useChartPopover();

  const legend = (
    <CollapsibleLegend
      keys={Object.keys(chartConfig || {})}
      config={chartConfig || {}}
    />
  );

  const explanation = <ChartExplanation content={explanationContent} />;

  return (
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
          />
        </TooltipProvider>
      </ChartHeader>

      <div className="relative px-4">
        <BarChartRenderer
          data={chartData}
          isExpanded={isExpanded}
          config={chartConfig || {}}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          xAxisDataKey={xAxisDataKey}
        />
      </div>
    </ChartCard>
  );
}
