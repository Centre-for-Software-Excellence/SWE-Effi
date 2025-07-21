import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Award, Crown, Medal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { formatScore } from '@/lib/utils';
import { ColumnConfig } from '../tables-card';

export type LeaderboardRVUData = {
  scaffold: string;
  model: string;
  avgTotalTimeU: number;
  avgTotalTimeR: number;
  avgCPUTimeU: number;
  avgCPUTimeR: number;
  avgInfTimeU: number;
  avgInfTimeR: number;
  avgTotalTokensU: number;
  avgTotalTokensR: number;
  avgLLMRequestsU: number;
  avgLLMRequestsR: number;
};

export type LeaderboardRVUTooltips = {
  avgTotalTime: string;
  avgCPUTime: string;
  avgInfTime: string;
  avgTotalTokens: string;
  avgLLMRequests: string;
};

export type RankedLeaderboardRVUData = LeaderboardRVUData & {
  rank: number;
};

export const columns = ({
  tooltips,
  headers,
}: {
  tooltips?: ColumnConfig;
  headers?: ColumnConfig;
}): ColumnDef<RankedLeaderboardRVUData>[] => {
  const {
    rank,
    scaffold,
    model,
    avgTotalTime,
    avgCPUTime,
    avgInfTime,
    avgTotalTokens,
    avgLLMRequests,
    avgTotalTimeU,
    avgTotalTimeR,
    avgCPUTimeU,
    avgCPUTimeR,
    avgInfTimeU,
    avgInfTimeR,
    avgTotalTokensU,
    avgTotalTokensR,
    avgLLMRequestsU,
    avgLLMRequestsR,
  } = headers || {};
  return [
    {
      id: rank,
      accessorKey: 'rank',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.rank}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {rank}
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => {
        const rankValue: number = row.getValue(rank || 'rank');
        return (
          <div className="flex items-center justify-start">
            {rankValue === 1 ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : rankValue === 2 ? (
              <Medal className="h-5 w-5 text-gray-400" />
            ) : rankValue === 3 ? (
              <Award className="h-5 w-5 text-amber-600" />
            ) : (
              <span className="font-bold text-muted-foreground">
                #{rankValue}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: scaffold,
      accessorKey: 'scaffold',
      header: () => (
        <TooltipWrapper title={tooltips?.scaffold}>
          <span>{scaffold}</span>
        </TooltipWrapper>
      ),
      cell: ({ row }) => {
        const value: string = row.getValue(scaffold || 'scaffold');
        return (
          <div className="font-medium">
            {value.length > 30 ? `${value.slice(0, 30)}...` : value}
          </div>
        );
      },
    },
    {
      id: model,
      accessorKey: 'model',
      header: () => (
        <TooltipWrapper title={tooltips?.model}>
          <span>{model}</span>
        </TooltipWrapper>
      ),
      cell: ({ row }) => {
        const modelValue: string = row.getValue(model || 'model');
        return (
          <div className="font-medium">
            {modelValue.length > 30
              ? `${modelValue.slice(0, 30)}...`
              : modelValue}
          </div>
        );
      },
    },
    // Grouped column for Avg Total Time
    {
      id: avgTotalTime || 'avgTotalTime',
      header: () => (
        <TooltipWrapper title={tooltips?.avgTotalTime}>
          <span>{avgTotalTime || 'Mean Total Time'} (seconds)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgTotalTimeU,
          accessorKey: 'avgTotalTimeU',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Unresolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(
              avgTotalTimeU || 'avgTotalTimeU',
            );
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
        {
          id: avgTotalTimeR,
          accessorKey: 'avgTotalTimeR',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Resolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(
              avgTotalTimeR || 'avgTotalTimeR',
            );
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
      ],
    },
    // Grouped column for Avg CPU Time
    {
      id: avgCPUTime || 'avgCPUTime',
      header: () => (
        <TooltipWrapper title={tooltips?.avgCPUTime}>
          <span>{avgCPUTime} (seconds)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgCPUTimeU,
          accessorKey: 'avgCPUTimeU',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Unresolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(avgCPUTimeU || 'avgCPUTimeU');
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
        {
          id: avgCPUTimeR,
          accessorKey: 'avgCPUTimeR',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Resolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(avgCPUTimeR || 'avgCPUTimeR');
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
      ],
    },
    // Grouped column for Avg Inference Time
    {
      id: avgInfTime || 'avgInfTime',
      header: () => (
        <TooltipWrapper title={tooltips?.avgInfTime}>
          <span>{avgInfTime} (seconds)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgInfTimeU,
          accessorKey: 'avgInfTimeU',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Unresolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(avgInfTimeU || 'avgInfTimeU');
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
        {
          id: avgInfTimeR,
          accessorKey: 'avgInfTimeR',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Resolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(avgInfTimeR || 'avgInfTimeR');
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
      ],
    },
    // Grouped column for Avg Total Tokens
    {
      id: avgTotalTokens || 'avgTotalTokens',
      header: () => (
        <TooltipWrapper title={tooltips?.avgTotalTokens}>
          <span>{avgTotalTokens} (K)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgTotalTokensU,
          accessorKey: 'avgTotalTokensU',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Unresolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(
              avgTotalTimeU || 'avgTotalTokensU',
            );
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
        {
          id: avgTotalTokensR,
          accessorKey: 'avgTotalTokensR',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Resolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(
              avgTotalTokensR || 'avgTotalTokensR',
            );
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
      ],
    },
    // Grouped column for Avg LLM Requests
    {
      id: avgLLMRequests || 'avgLLMRequests',
      header: () => (
        <TooltipWrapper title={tooltips?.avgLLMRequests}>
          <span>Avg LLM Requests</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgLLMRequestsU,
          accessorKey: 'avgLLMRequestsU',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Unresolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(
              avgLLMRequestsU || 'avgLLMRequestsU',
            );
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
        {
          id: avgLLMRequestsR,
          accessorKey: 'avgLLMRequestsR',
          header: () => (
            <TooltipWrapper title={''}>
              <div className="flex w-full items-center justify-end">
                Resolved
              </div>
            </TooltipWrapper>
          ),
          cell: ({ row }) => {
            const value: string = row.getValue(
              avgLLMRequestsR || 'avgLLMRequestsR',
            );
            return (
              <div className="text-right font-medium">{formatScore(value)}</div>
            );
          },
        },
      ],
    },
  ];
};
