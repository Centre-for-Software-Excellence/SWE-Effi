import { Suspense } from 'react';

import { H4, H5, Muted, Small } from '@/components/md';
import { CallsBarChart } from './chart/calls-bar-chart';
import { ResolveRateLineChart } from './chart/resolve-rate-line-chart';

export default function AnalyticsCard() {
  return (
    <section className="flex flex-col space-y-4">
      <H4 className="my-8 flex w-full items-center gap-2">Analytics</H4>
      <Muted>Maybe some description about the analytics section</Muted>
      <H5>Do we need a title for resolve rate chart</H5>
      <Small>Description?</Small>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <ResolveRateLineChart
          chartTitle="Resolve Rate vs. Total Tokens"
          chartDescription="description about the chart"
        />
      </Suspense>
      <H5>Do we need a title for num of calls chart</H5>
      <Small>Description?</Small>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <CallsBarChart />
      </Suspense>
    </section>
  );
}
