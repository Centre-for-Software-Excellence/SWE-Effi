import { Suspense } from 'react';

import { UnderlineLink } from '@/components/common/underline-link';
import { H4, Lead } from '@/components/md';
import { getLeaderboardUIConfig } from '@/config/ui/leaderboard';
import { CallsBarChart } from './chart/calls-bar-chart';
import { CostBarChart } from './chart/cost-bar-chart';
import { MetricsRadarChart } from './chart/metrics-radar-chart';
import { NormalizedTimeLineChart } from './chart/normalized-time-line-chart';
import { ResolveRateLineChart } from './chart/resolve-rate-line-chart';
import { TimePercentageBarChart } from './chart/time-percentage-bar-chart';

export default function AnalyticsCard() {
  const ui = getLeaderboardUIConfig().analytics;
  const {
    resolveRateLineChart,
    normalizedTimeLineChart,
    numCallsBarChart,
    timePercentageBarChart,
    costBarChart,
    metricsRadarChart,
  } = ui;
  return (
    <section className="flex flex-col space-y-4">
      {ui.title && (
        <H4 className="my-8 flex w-full items-center gap-2">{ui.title}</H4>
      )}
      {ui.description && (
        <Lead>
          {ui.description + ' '}
          <UnderlineLink
            href={ui?.blogLink || '#'}
            className="text-base font-bold text-active"
          >
            blog post
          </UnderlineLink>
        </Lead>
      )}
      <Suspense fallback={<div className="h-96 w-full" />}>
        <MetricsRadarChart {...metricsRadarChart} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <ResolveRateLineChart {...resolveRateLineChart} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <NormalizedTimeLineChart {...normalizedTimeLineChart} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <CallsBarChart {...numCallsBarChart} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <TimePercentageBarChart {...timePercentageBarChart} />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <CostBarChart {...costBarChart} />
      </Suspense>
    </section>
  );
}
