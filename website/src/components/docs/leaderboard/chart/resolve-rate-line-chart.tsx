import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { Dialog } from '@/components/common/ui/dialog';
import { CollapsibleLegend } from '@/components/docs/leaderboard/chart/atoms/collapsible-legend';
import { useChartData } from '@/hooks/chart/use-chart-data';
import { useChartPopover } from '@/hooks/chart/use-chart-popover';
import { useChartSettings } from '@/hooks/chart/use-chart-settings';
import { cn } from '@/lib/utils';
import { ChartCard } from './atoms/chart-card';
import { ChartControls } from './atoms/chart-controls';
import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { ChartSettings, ChartSettingsButton } from './atoms/chart-settings';
import { ChartProps, ChartRendererProps } from './types';

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
  } = useChartSettings({
    chartData,
    chartConfig,
    xKey: 'totalTokens',
    defaultDomain: [0, 6.2],
  });

  const settingsButton = (
    <ChartSettingsButton onClickAction={() => setOpenSettings(!openSettings)} />
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
          title="Settings"
        />

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

function LineChartRenderer({
  data,
  config,
  activeKeys,
  xRange,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
}: ChartRendererProps) {
  const configKeys = activeKeys || Object.keys(config);
  return (
    <ChartContainer
      config={config}
      className="min-h-[200px] w-full overflow-x-hidden"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 0, right: 0, left: 22, bottom: 16 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis width={20} tickFormatter={(value) => (value + '').slice(0, 3)}>
          {yAxisLabel && (
            <Label
              value={yAxisLabel}
              position="inside"
              angle={-90}
              dx={-25}
              className="text-[8px] md:text-sm"
            />
          )}
        </YAxis>
        <XAxis
          type="number"
          dataKey={xAxisDataKey}
          tickLine={true}
          axisLine={true}
          domain={xRange || [0, 'dataMax']}
          allowDataOverflow={true}
          tickFormatter={(value) => (value + '').slice(0, 3)}
          tickCount={10}
          height={20}
        >
          {xAxisLabel && (
            <Label
              value="Total Tokens (input_tokens + output_tokens) (1e6)"
              position="insideBottom"
              offset={-15}
              className="text-[8px] md:text-sm"
            />
          )}
        </XAxis>
        <ChartTooltip
          animationDuration={0}
          isAnimationActive={false}
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {configKeys?.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="natural"
            stroke={config?.[key]?.color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
