import { Suspense } from 'react';

import { H4, Lead } from '@/components/md';
import { getLeaderboardUIConfig } from '@/config/ui/leaderboard';
import { CallsBarChart } from './chart/calls-bar-chart';
import { CostBarChart } from './chart/cost-bar-chart';
import { MetricsRadarChart } from './chart/metrics-radar-chart';
import { ResolveRateLineChart } from './chart/resolve-rate-line-chart';
import { TimePercentageBarChart } from './chart/time-percentage-bar-chart';

export default function AnalyticsCard() {
  const ui = getLeaderboardUIConfig().analytics;
  const resolveRateChartUI = ui.resolveRateLineChart;
  const callsBarChartUI = ui.numCallsBarChart;
  const timePercentageBarChartUI = ui.timePercentageBarChart;
  const costBarChartUI = ui.costBarChart;
  const metricRadarChartUI = ui.metricsRadarChart;
  return (
    <section className="flex flex-col space-y-4">
      {ui.title && (
        <H4 className="my-8 flex w-full items-center gap-2">{ui.title}</H4>
      )}
      {ui.description && <Lead>{ui.description}</Lead>}
      <Suspense fallback={<div className="h-96 w-full" />}>
        <ResolveRateLineChart {...resolveRateChartUI} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <CallsBarChart {...callsBarChartUI} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <TimePercentageBarChart {...timePercentageBarChartUI} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <CostBarChart {...costBarChartUI} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <MetricsRadarChart {...metricRadarChartUI} />
      </Suspense>
    </section>
  );
}
