import { Suspense } from 'react';

import { H4, Lead } from '@/components/md';
import { getLeaderboardUIConfig } from '@/config/ui/leaderboard';
import { CallsBarChart } from './chart/calls-bar-chart';
import { ResolveRateLineChart } from './chart/resolve-rate-line-chart';

export default function AnalyticsCard() {
  const ui = getLeaderboardUIConfig().analytics;
  const resolveRateChartUI = ui.resolveRateLineChart;
  const callsBarChartUI = ui.numCallsBarChart;
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
    </section>
  );
}
