import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { CollapsibleLegend } from '@/components/docs/leaderboard/chart/atoms/collapsible-legend';
import { useChartData } from '@/hooks/chart/use-chart-data';
import { useChartPopover } from '@/hooks/chart/use-chart-popover';
import { cn } from '@/lib/utils';
import { ChartCard } from './atoms/chart-card';
import { ChartControls } from './atoms/chart-controls';
import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { ChartProps, ChartRendererProps } from './types';

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
  className,
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
        className,
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

function BarChartRenderer({
  data,
  config,
  isExpanded = false,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
}: ChartRendererProps) {
  return (
    <ChartContainer
      config={config}
      className="min-h-[200px] w-full overflow-x-hidden"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ bottom: 20, right: 20 }}
        barGap={0}
        barCategoryGap={isExpanded ? '10%' : '5%'}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={true}
          axisLine={false}
          tickFormatter={(value) =>
            isExpanded ? value : `${value.slice(0, 7)}...`
          }
        >
          <Label value={xAxisLabel} position="insideBottom" offset={-15} />
        </XAxis>
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        >
          <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {Object.keys(config).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={config?.[key].color}
            barSize={isExpanded ? 30 : 15}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
