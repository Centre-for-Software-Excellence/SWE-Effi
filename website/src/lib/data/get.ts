import {
  LeaderboardData,
  RankedLeaderboardData,
} from '@/components/docs/leaderboard/table/columns';

type Column = Exclude<keyof LeaderboardData, 'rank' | 'scaffold' | 'model'>;

export function rankLeaderboardData(
  data: LeaderboardData[],
  sortColumn: Column = 'tokenEfficiency',
): RankedLeaderboardData[] {
  const comparator = (
    dataA: LeaderboardData,
    dataB: LeaderboardData,
    column: Column = 'tokenEfficiency',
  ) => {
    // For most metrics, higher is better (descending sort)
    // For time-based & cost-based metrics, lower is better (ascending sort)
    const ascendingColumns: Column[] = [
      'avgDuration',
      'avgDurationR',
      'avgDurationU',
      'avgCPUTime',
      'avgCPUTimeR',
      'avgCPUTimeU',
      'avgInfTime',
      'avgInfTimeR',
      'avgInfTimeU',
      'avgInputTokens',
      'avgInputTokensR',
      'avgInputTokensU',
      'avgOutputTokens',
      'avgOutputTokensR',
      'avgOutputTokensU',
      'avgLLMRequests',
      'avgLLMRequestsR',
      'avgLLMRequestsU',
    ];

    const valueA = dataA[column] || 0;
    const valueB = dataB[column] || 0;

    if (ascendingColumns.includes(column)) {
      return valueA - valueB; // ascending for time metrics
    } else {
      return valueB - valueA; // descending for efficiency/rate metrics
    }
  };

  data.sort((a, b) => {
    return comparator(a, b, sortColumn);
  });

  return data.map((e, index) => ({
    ...e,
    rank: index + 1,
  }));
}
