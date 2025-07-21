import { Dialog } from '@radix-ui/react-dialog';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/common/ui/scroll-area';
import { useChartData } from '@/hooks/chart/use-chart-data';
import { useChartPopover } from '@/hooks/chart/use-chart-popover';
import { useChartSettings } from '@/hooks/chart/use-chart-settings';
import { cn } from '@/lib/utils';
import { ChartCard } from './atoms/chart-card';
import { ChartControls } from './atoms/chart-controls';
import { ChartExplanation } from './atoms/chart-explanation';
import { ChartHeader } from './atoms/chart-header';
import { StackedLegend } from './atoms/chart-legend';
import { ChartSettings, ChartSettingsButton } from './atoms/chart-settings';
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

  const {
    openSettings,
    setOpenSettings,
    activeKeys,
    setActiveKeys,
    filteredData,
    setFilteredData,
  } = useChartSettings({ chartData, chartConfig });

  const settingsButton = (
    <ChartSettingsButton onClickAction={() => setOpenSettings(!openSettings)} />
  );

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
        <ChartSettings
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig || {})}
          data={chartData}
          setFilteredData={setFilteredData}
          onClose={() => setOpenSettings(false)}
          title="Settings"
          field="scaffold"
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
            <BarChartRenderer
              data={filteredData}
              isExpanded={isExpanded}
              config={chartConfig}
              activeKeys={activeKeys}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              xAxisDataKey={xAxisDataKey}
            />
          </div>

          {legend}
        </ChartCard>
      </Dialog>
    </>
  );
}

function BarChartRenderer({
  data,
  config,
  isExpanded = false,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
  activeKeys,
}: ChartRendererProps) {
  const barWidth = isExpanded ? 30 : 15;
  const numBars = activeKeys?.length || Object.keys(config).length;
  const categoryGap = 40;
  const categoryWidth = data.length * categoryGap;
  const calculatedWidth = data.length * numBars * barWidth + categoryWidth;
  const configKeys = activeKeys || Object.keys(config);
  return (
    <ScrollArea className="w-full" type="always">
      <ChartContainer
        config={config}
        className="h-[300px] min-w-full md:h-[400px]"
        style={{
          width: calculatedWidth,
        }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ bottom: 20, right: 20 }}
          barGap={0}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisDataKey}
            tickLine={true}
            axisLine={false}
            tickFormatter={(value) => value}
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
              className="-translate-x-[50px] sm:-translate-x-0"
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
      <ScrollBar orientation="horizontal" className="translate-y-[10px]" />
    </ScrollArea>
  );
}
