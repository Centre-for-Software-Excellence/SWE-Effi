import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/common/ui/scroll-area';
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
    <CollapsibleLegend
      keys={Object.keys(chartConfig || {})}
      config={chartConfig || {}}
      show={true}
    />
  );

  const explanation = <ChartExplanation content={explanationContent} />;

  return (
    <>
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <ChartSettings
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig || {})}
          data={chartData}
          setFilteredData={setFilteredData}
          onClose={() => setOpenSettings(false)}
          title="Setting"
          field="scaffold-model"
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
            <StackedBarChartRenderer
              data={filteredData}
              isExpanded={isExpanded}
              config={chartConfig || {}}
              activeKeys={activeKeys}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              yAxisDataKey={yAxisDataKey}
            />
          </div>
        </ChartCard>{' '}
      </Dialog>
    </>
  );
}

export function StackedBarChartRenderer({
  data,
  config,
  isExpanded = false,
  xAxisLabel,
  yAxisLabel,
  yAxisDataKey,
  activeKeys,
}: ChartRendererProps) {
  const configKeys = activeKeys || Object.keys(config);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    setContainerWidth(containerRef.current.offsetWidth);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div className="w-full" ref={containerRef}>
      <ScrollArea type="always" scrollHideDelay={0} className={cn('h-[400px]')}>
        <ChartContainer
          config={config}
          style={{
            height: Math.max(400, data.length * 40),
            width: containerWidth || '100%',
          }}
        >
          <BarChart
            layout="vertical"
            accessibilityLayer
            data={data}
            margin={{ left: 100 }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              hide
              orientation="bottom"
              type="number"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
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
            {configKeys.map((key) => (
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* dummy chart for displaying fixed x-axis */}
      <div className="flex h-[50px] justify-end">
        <ChartContainer
          config={config}
          style={{
            width: containerWidth || '100%',
          }}
        >
          <BarChart
            layout="vertical"
            accessibilityLayer
            data={data}
            margin={{ left: 100, bottom: 20 }}
          >
            <XAxis
              orientation="bottom"
              type="number"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
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
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(_value) => ``}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
