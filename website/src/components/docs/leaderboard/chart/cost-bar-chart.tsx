import { useEffect, useRef, useState } from 'react';
import { scaleLog } from 'd3-scale';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

import { TooltipProvider } from '@/components/common/tooltip-wrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { Dialog } from '@/components/common/ui/dialog';
import { ScrollArea } from '@/components/common/ui/scroll-area';
import { StackedLegend } from '@/components/docs/leaderboard/chart/atoms/chart-legend';
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
    '/data/benchmark/chart/cost-bar/chart-data.json',
    '/data/benchmark/chart/cost-bar/chart-config.json',
  );

  const { isExpanded, toggleExpanded } = useChartPopover();

  const {
    openSettings,
    setOpenSettings,
    activeKeys,
    setActiveKeys,
    filteredData,
    setFilteredData,
    min,
    max,
    domain,
    setDomain,
  } = useChartSettings({
    chartData,
    chartConfig,
    xKeys: ['failure-cost', 'success-cost'],
    expandLogDomain: true,
    logSlider: true,
  });

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
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <ChartSettings
          domain={domain}
          setDomain={setDomain}
          log={true}
          min={min}
          max={max}
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig || {})}
          data={chartData}
          setFilteredData={setFilteredData}
          onClose={() => setOpenSettings(false)}
          title="Settings"
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
                // explanation={explanation}
                expandButton={{ isExpanded, onToggle: toggleExpanded }}
                settingsButton={settingsButton}
              />
            </TooltipProvider>
          </ChartHeader>

          <div className="relative px-4">
            <HorizontalBarChartRenderer
              data={filteredData}
              isExpanded={isExpanded}
              config={chartConfig}
              activeKeys={activeKeys}
              domain={domain}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              yAxisDataKey={yAxisDataKey}
            />
          </div>
          {legend}
        </ChartCard>
      </Dialog>
    </>
  );
}

export function HorizontalBarChartRenderer({
  data,
  config,
  xAxisLabel,
  yAxisLabel,
  yAxisDataKey,
  domain,
  activeKeys,
}: ChartRendererProps) {
  const configKeys = activeKeys || Object.keys(config);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const scale = scaleLog(domain || [], [0, containerWidth]);
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
    <div ref={containerRef}>
      <ScrollArea
        type="always"
        scrollHideDelay={0}
        className="h-[300px] md:h-[400px]"
      >
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
            margin={{ left: 100, bottom: 0, top: 0 }}
            barGap={0}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              hide
              type="number"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              domain={domain}
              scale={scale}
              ticks={scale.ticks().filter((tick) => Math.log10(tick) % 1 === 0)}
              allowDataOverflow={true}
              // add this to make sure render corresponding vertical tick lines
              tickFormatter={(_) => {
                return '';
              }}
            />

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

            {configKeys?.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={config?.[key].color}
                barSize={15}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </ScrollArea>
      {/* dummy chart for displaying fixed x-axis */}
      <div className="flex h-[50px] justify-end">
        <ChartContainer
          config={config}
          style={{ width: containerWidth || '100%' }}
        >
          <BarChart layout="vertical" margin={{ left: 100, bottom: 20 }}>
            <CartesianGrid horizontal={false} />
            {/* dummay placeholder for xaxis to position correctly*/}
            <YAxis aria-hidden />
            <XAxis
              type="number"
              domain={domain}
              scale={scale}
              ticks={scale.ticks().filter((tick) => Math.log10(tick) % 1 === 0)}
              tickFormatter={(d) => {
                const exponent = Math.log10(d);
                const isPowerOfTen = exponent % 1 === 0;
                if (!isPowerOfTen) {
                  return '';
                }
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
            >
              <Label
                value={xAxisLabel}
                position="insideBottom"
                offset={-15}
                className="-translate-x-[50px] sm:-translate-x-0"
              />
            </XAxis>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
