import {
  LeaderboardData,
  RankedLeaderboardData,
} from '@/components/docs/leaderboard/table/columns';
import {
  LeaderboardRVUData,
  RankedLeaderboardRVUData,
} from '@/components/docs/leaderboard/table/columns-rvu';
import leaderboardRVUData from '@/config/leaderboard/data-rvu.json';
import leaderboardData from '@/config/leaderboard/data.json';

type Column =
  | 'inputToken'
  | 'outputToken'
  | 'calls'
  | 'resolveRate'
  | 'precision';

export function rankLeaderboardData(
  data: LeaderboardData[],
): RankedLeaderboardData[] {
  const comparator = (
    dataA: LeaderboardData,
    dataB: LeaderboardData,
    columns: Column[] = ['resolveRate'],
  ) => {
    let diff = 0;
    for (const c of columns) {
      diff += (dataB[c] || 0) - (dataA[c] || 0);
    }
    return diff;
  };

  data.sort((a, b) => {
    return comparator(a, b, ['resolveRate']);
  });

  return data.map((e, index) => ({
    ...e,
    rank: index + 1,
  }));
}

export function rankLeaderboardRVUData(
  data: LeaderboardRVUData[],
): RankedLeaderboardRVUData[] {
  const comparator = (dataA: LeaderboardRVUData, dataB: LeaderboardRVUData) => {
    return dataA['avgTotalTimeR'] - dataB['avgTotalTimeR'];
  };

  data.sort((a, b) => {
    return comparator(a, b);
  });

  return data.map((performance, index) => ({
    ...performance,
    rank: index + 1,
  }));
}

// TODO: delete me after using useEffect approach
export function getLeaderboardData(): RankedLeaderboardData[] {
  const data: LeaderboardData[] = leaderboardData;
  return rankLeaderboardData(data);
}

// TODO: delete me after using useEffect approach
export function getLeaderboardDataRVU(): RankedLeaderboardRVUData[] {
  const data: LeaderboardRVUData[] = leaderboardRVUData;
  return rankLeaderboardRVUData(data);
}
