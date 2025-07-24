import {
  CartesianGrid,
  ComposedChart,
  Label,
  Scatter,
  XAxis,
  YAxis,
} from 'recharts';

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
// import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { ChartSettings, ChartSettingsButton } from './atoms/chart-settings';
import { ChartProps, ChartRendererProps } from './types';

export interface ChartData {
  llmCalls: number;
  [seriesName: string]: number; // input tokens
}

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

export function CallsInputScatterChart({
  title,
  description,
  // overview,
  // insight,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
  className,
}: ChartProps) {
  // const explanationContent = {
  //   overview,
  //   insight,
  // };

  const {
    data: chartData,
    config: chartConfig,
    loading,
    error,
  } = useChartData<ChartData>(
    '/data/benchmark/chart/calls-input-scatter/chart-data.json',
    '/data/benchmark/chart/calls-input-scatter/chart-config.json',
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
    xKeys: ['llmCalls'],
    yKeys: Object.keys(chartConfig || {}),
  });

  const settingsButton = (
    <ChartSettingsButton onClickAction={() => setOpenSettings(!openSettings)} />
  );

  const legend = (
    <HoverableLegend keys={activeKeys || []} config={chartConfig || {}} />
  );

  // const explanation = <ChartExplanation content={explanationContent} />;

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
          step={1}
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
                // explanation={explanation}
                expandButton={{ isExpanded, onToggle: toggleExpanded }}
                settingsButton={settingsButton}
              />
            </TooltipProvider>
          </ChartHeader>

          <div className="relative px-4">
            <ScatterChartRenderer
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

export function ScatterChartRenderer({
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
  const dynamicXTicks = domain ? generateLogTicks(domain[0], domain[1]) : [];
  return (
    <ChartContainer config={config} className="h-[300px] w-full md:h-[400px]">
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{ top: 0, right: 0, left: 66, bottom: 16 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          type="number"
          width={20}
          // we might need to find the actual range later (log_10 sacle)
          ticks={[10000, 100000, 1000000, 10000000, 100000000]}
          domain={['dataMin', 'dataMax']}
          allowDataOverflow={true}
          scale={'log'}
          tickFormatter={(value) => {
            const log = Math.log10(value);
            const isPowerOf10 = Math.abs(log - Math.round(log)) < 0.0001;
            console.log('isPowerOf10', isPowerOf10, log);

            if (isPowerOf10) {
              const exponent = Math.round(log);
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
            }
            return value.toLocaleString();
          }}
        >
          <Label value={yAxisLabel} position="inside" angle={-90} dx={-25} />
        </YAxis>
        <XAxis
          type="number"
          dataKey={xAxisDataKey}
          tickLine={true}
          axisLine={true}
          domain={domain}
          allowDataOverflow={true}
          tickFormatter={(value) => {
            return value;
          }}
          ticks={dynamicXTicks}
          height={20}
          scale="log"
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
          <Scatter
            name={key}
            dataKey={key}
            fill={config?.[key]?.color}
            isAnimationActive={false}
          />
        ))}
      </ComposedChart>
    </ChartContainer>
  );
}
