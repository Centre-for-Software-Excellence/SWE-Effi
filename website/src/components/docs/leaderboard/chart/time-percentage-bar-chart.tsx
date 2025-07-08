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
  'gpu-time': number;
  'cpu-time': number;
  [key: string]: string | number;
}

export function TimePercentageBarChart({
  title,
  description,
  overview,
  insight,
  xAxisLabel,
  yAxisLabel,
  yAxisDataKey,
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
    '/data/benchmark/chart/time-percentage-bar/chart-data.json',
    '/data/benchmark/chart/time-percentage-bar/chart-config.json',
  );

  const { isExpanded, toggleExpanded } = useChartPopover();

  const legend = (
    <CollapsibleLegend
      keys={Object.keys(chartConfig || {})}
      config={chartConfig || {}}
      show={true}
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
        <StackedBarChartRenderer
          data={chartData}
          isExpanded={isExpanded}
          config={chartConfig || {}}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          yAxisDataKey={yAxisDataKey}
        />
      </div>
    </ChartCard>
  );
}

export function StackedBarChartRenderer({
  data,
  config,
  isExpanded = false,
  xAxisLabel,
  yAxisLabel,
  yAxisDataKey,
}: ChartRendererProps) {
  const stackedConfigKeys = Object.keys(config);
  return (
    <ChartContainer
      config={config}
      className="min-h-[200px] w-full overflow-x-hidden"
    >
      <BarChart
        layout="vertical"
        accessibilityLayer
        data={data}
        margin={{ left: 100, bottom: 20 }}
      >
        <CartesianGrid horizontal={false} />

        <XAxis
          type="number"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          domain={[0, 100]}
        >
          <Label
            value={xAxisLabel}
            position="insideBottom"
            offset={-15}
            className="-translate-x-12 sm:-translate-x-0"
          />
        </XAxis>
        <YAxis
          type="category"
          dataKey={yAxisDataKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value.slice(0, 20)}...`}
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
        {stackedConfigKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={config?.[key].color}
            barSize={isExpanded ? 30 : 15}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
