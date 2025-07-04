import { Performance } from '@/components/docs/benchmark/table/columns';
import { PerformanceRVU } from '@/components/docs/benchmark/table/columns-rvu';
import dataRVU from '@/config/leaderboard/data-rvu.json';
import data from '@/config/leaderboard/data.json';

type UnrankedPerformance = Omit<Performance, 'rank'>;
type UnrankedPerformanceRVU = Omit<PerformanceRVU, 'rank'>;

type Column =
  | 'inputToken'
  | 'outputToken'
  | 'calls'
  | 'resolveRate'
  | 'precision';

export function getLeaderboardData(): Performance[] {
  const performances: UnrankedPerformance[] = data;

  const comparator = (
    dataA: UnrankedPerformance,
    dataB: UnrankedPerformance,
    columns: Column[] = ['resolveRate'],
  ) => {
    let diff = 0;
    for (const c of columns) {
      diff += (dataB[c] || 0) - (dataA[c] || 0);
    }
    return diff;
  };

  performances.sort((a, b) => {
    return comparator(a, b, ['resolveRate']);
  });

  return performances.map((performance, index) => ({
    ...performance,
    rank: index + 1,
  }));
}

export function getLeaderboardDataRVU(): PerformanceRVU[] {
  const performances: UnrankedPerformanceRVU[] = dataRVU;

  const comparator = (
    dataA: UnrankedPerformanceRVU,
    dataB: UnrankedPerformanceRVU,
  ) => {
    console.log('Comparing:', dataA, dataB);
    return dataA['avgTotalTimeR'] - dataB['avgTotalTimeR'];
  };

  performances.sort((a, b) => {
    return comparator(a, b);
  });

  return performances.map((performance, index) => ({
    ...performance,
    rank: index + 1,
  }));
}
