import { Dialog } from '@radix-ui/react-dialog';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { useChartData } from '@/hooks/chart/use-chart-data';
import { useChartPopover } from '@/hooks/chart/use-chart-popover';
import { useChartSettings } from '@/hooks/chart/use-chart-settings';
import { cn } from '@/lib/utils';
import { ChartCard } from './atoms/chart-card';
import { ChartControls } from './atoms/chart-controls';
import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { StackedLegend } from './atoms/chart-legend';
import { ChartProps, ChartRendererProps } from './types';

export interface ChartData {
  metric: string;
  [key: string]: number | string | undefined;
}

export function MetricsRadarChart({
  title,
  description,
  overview,
  insight,
  className,
  polarAngleAxisDataKey,
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
    '/data/benchmark/chart/metrics-radar/chart-data.json',
    '/data/benchmark/chart/metrics-radar/chart-config.json',
  );

  const { isExpanded, toggleExpanded } = useChartPopover();
  const { activeKeys, setActiveKeys } = useChartSettings({
    chartData,
    chartConfig,
  });

  const legend = (
    <StackedLegend
      keys={Object.keys(chartConfig || {})}
      config={chartConfig || {}}
      setActiveKeys={setActiveKeys}
    />
  );

  const explanation = <ChartExplanation content={explanationContent} />;

  return (
    <>
      <Dialog>
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
              />
            </TooltipProvider>
          </ChartHeader>

          <div className="relative px-4">
            <RadarChartRenderer
              data={chartData}
              isExpanded={isExpanded}
              config={chartConfig}
              activeKeys={activeKeys}
              polarAngleAxisDataKey={polarAngleAxisDataKey}
            />
          </div>

          {legend}
        </ChartCard>
      </Dialog>
    </>
  );
}

function RadarChartRenderer({
  data,
  config,
  activeKeys,
  polarAngleAxisDataKey,
}: ChartRendererProps) {
  const configKeys = activeKeys || Object.keys(config || {});
  return (
    <ChartContainer config={config} className="h-[300px] w-full md:h-[400px]">
      <RadarChart
        data={data}
        margin={{
          top: -40,
          bottom: -10,
        }}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey={polarAngleAxisDataKey} />
        <PolarGrid />
        <Radar
          key={configKeys[0]}
          dataKey={configKeys[0]}
          stroke={config[configKeys[0]]?.color}
          fill={config[configKeys[0]]?.color}
          fillOpacity={0.6}
        />
      </RadarChart>
    </ChartContainer>
  );
}
