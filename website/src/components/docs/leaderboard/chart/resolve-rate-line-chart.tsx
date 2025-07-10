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
    max,
    domain,
    setDomain,
  } = useChartSettings({
    chartData,
    chartConfig,
    xKeys: ['totalTokens'],
    defaultDomain: [0, 2.2],
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
          max={max}
          step={0.01}
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig || {})}
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
          tickLine={true}
          axisLine={true}
          domain={domain}
          allowDataOverflow={true}
          tickFormatter={(value) => (value + '').slice(0, 3)}
          tickCount={10}
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
