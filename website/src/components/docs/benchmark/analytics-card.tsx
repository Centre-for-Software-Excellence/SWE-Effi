import { Suspense } from 'react';

import { H4, Muted } from '@/components/md';
import { getLeaderboardUIConfig } from '@/config/ui/leaderboard';
import { CallsBarChart } from './chart/calls-bar-chart';
import { ResolveRateLineChart } from './chart/resolve-rate-line-chart';

export default function AnalyticsCard() {
  const ui = getLeaderboardUIConfig().analytics;
  return (
    <section className="flex flex-col space-y-4">
      {ui.title && (
        <H4 className="my-8 flex w-full items-center gap-2">{ui.title}</H4>
      )}
      {ui.description && <Muted>{ui.description}</Muted>}
      <Suspense fallback={<div className="h-96 w-full" />}>
        <ResolveRateLineChart
          title={ui.resolveRateChartTitle}
          description={ui.resolveRateChartDescription}
          overview={ui.resolveRateChartOverview}
          insight={ui.resolveRateChartInsight}
        />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <CallsBarChart
          title={ui.callsBarChartTitle}
          description={ui.callsBarChartDescription}
          overview={ui.callsBarChartOverview}
          insight={ui.callsBarChartInsight}
        />
      </Suspense>
    </section>
  );
}
