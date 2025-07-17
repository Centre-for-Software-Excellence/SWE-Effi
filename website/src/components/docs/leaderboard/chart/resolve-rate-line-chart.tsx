import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { Dialog } from '@/components/common/ui/dialog';
import { HoverableLegend } from '@/components/docs/leaderboard/chart/atoms/chart-legend';
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

// Helper function to generate log base-10 ticks
function generateLogTicks(min: number, max: number): number[] {
  const ticks: number[] = [];

  // Find the log10 bounds
  const logMin = Math.floor(Math.log10(min));
  const logMax = Math.ceil(Math.log10(max));

  // Generate ticks at powers of 10
  for (let i = logMin; i <= logMax; i++) {
    const tick = Math.pow(10, i);
    if (tick >= min * 0.95 && tick <= max * 1.05) {
      ticks.push(tick);
    }
  }

  // Ensure we have at least 2 ticks
  if (ticks.length === 0) {
    ticks.push(min, max);
  } else if (ticks.length === 1) {
    if (ticks[0] > min) ticks.unshift(Math.pow(10, logMin - 1));
    if (ticks[0] < max) ticks.push(Math.pow(10, logMax + 1));
  }

  return ticks.sort((a, b) => a - b);
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
    min,
    max,
    domain,
    setDomain,
  } = useChartSettings({
    chartData,
    chartConfig,
    xKeys: ['totalTokens'],
    expandLogDomain: true,
  });

  const settingsButton = (
    <ChartSettingsButton onClickAction={() => setOpenSettings(!openSettings)} />
  );

  const legend = (
    <HoverableLegend keys={activeKeys || []} config={chartConfig || {}} />
  );

  const explanation = <ChartExplanation content={explanationContent} />;

  return (
    <>
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        {/* Dialog content */}
        <ChartSettings
          domain={domain}
          setDomain={setDomain}
          min={min}
          max={max}
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig || {})}
          onClose={() => setOpenSettings(false)}
          title="Settings"
          step={0.001}
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
              domain={domain}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              xAxisDataKey={xAxisDataKey}
            />
            {legend}
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
  domain,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
}: ChartRendererProps) {
  const configKeys = activeKeys || Object.keys(config);

  // Generate dynamic ticks based on the actual domain
  const dynamicTicks = domain ? generateLogTicks(domain[0], domain[1]) : [];

  return (
    <ChartContainer config={config} className="h-[300px] w-full md:h-[400px]">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 0, right: 0, left: 22, bottom: 16 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis width={20} tickFormatter={(value) => (value + '').slice(0, 3)}>
          <Label value={yAxisLabel} position="inside" angle={-90} dx={-25} />
        </YAxis>
        <XAxis
          type="number"
          dataKey={xAxisDataKey}
          scale="log"
          tickLine={true}
          axisLine={true}
          domain={domain}
          allowDataOverflow={true}
          tickFormatter={(value) => {
            if (value >= 1) return value.toString();
            if (value >= 0.1) return value.toFixed(1);
            if (value >= 0.01) return value.toFixed(2);
            if (value >= 0.001) return value.toFixed(3);
            return value.toExponential(1);
          }}
          ticks={dynamicTicks}
          height={20}
        >
          {xAxisLabel && (
            <Label value={xAxisLabel} position="insideBottom" offset={-15} />
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
            type="linear"
            stroke={config?.[key]?.color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={true}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
