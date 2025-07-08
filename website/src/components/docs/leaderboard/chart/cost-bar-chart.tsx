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
  'failure-cost': number;
  'success-cost': number;
  [key: string]: string | number;
}

export function CostBarChart({
  title,
  description,
  overview,
  insight,
  xAxisLabel,
  yAxisLabel,
  yAxisDataKey,
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
    '/data/benchmark/chart/cost-bar/chart-data.json',
    '/data/benchmark/chart/cost-bar/chart-config.json',
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
        <HorizontalBarChartRenderer
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

export function HorizontalBarChartRenderer({
  data,
  config,
  isExpanded = false,
  xAxisLabel,
  yAxisLabel,
  yAxisDataKey,
}: ChartRendererProps) {
  const configKeys = Object.keys(config);
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
        barGap={0}
      >
        <CartesianGrid horizontal={false} />

        <XAxis
          type="number"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          domain={[10000, 'dataMax']}
          ticks={[100000, 1000000, 10000000]}
          tickFormatter={(value) => {
            const exponent = Math.log10(value);
            const superscripts = [
              '⁰',
              '¹',
              '²',
              '³',
              '⁴',
              '⁵',
              '⁶',
              '⁷',
              '⁸',
              '⁹',
            ];
            const exponentStr = exponent.toString();
            const superscriptStr = exponentStr
              .split('')
              .map((digit) => superscripts[parseInt(digit)])
              .join('');
            return `10${superscriptStr}`;
          }}
          scale="log"
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
        {configKeys.map((key) => (
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
