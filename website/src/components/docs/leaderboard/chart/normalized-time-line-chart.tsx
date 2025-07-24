import { TooltipProvider } from '@/components/common/tooltip-wrapper';
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
import { LineChartRenderer } from './resolve-rate-line-chart';
import { ChartProps } from './types';

export interface ChartData {
  duration: number;
  [seriesName: string]: number;
}

export function NormalizedTimeLineChart({
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
    '/data/benchmark/chart/normalized-time-line/chart-data.json',
    '/data/benchmark/chart/normalized-time-line/chart-config.json',
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
    xKeys: ['duration'],
    // expandLogDomain: true,
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
                // explanation={explanation}
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
              scale="log"
            />
            {legend}
          </div>
        </ChartCard>
      </Dialog>
    </>
  );
}
