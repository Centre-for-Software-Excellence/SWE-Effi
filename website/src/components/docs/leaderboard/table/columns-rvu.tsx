import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Award, Crown, Medal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { formatScore } from '@/lib/utils';
import { ColumnTooltips } from '../tables-card';

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

export const columns = (
  tooltips: ColumnTooltips,
): ColumnDef<RankedLeaderboardRVUData>[] => [
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.rank}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Rank
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => {
      const rank: number = row.getValue('rank');
      return (
        <div className="flex items-center justify-start">
          {rank === 1 ? (
            <Crown className="h-5 w-5 text-yellow-500" />
          ) : rank === 2 ? (
            <Medal className="h-5 w-5 text-gray-400" />
          ) : rank === 3 ? (
            <Award className="h-5 w-5 text-amber-600" />
          ) : (
            <span className="font-bold text-muted-foreground">#{rank}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'scaffold',
    header: () => (
      <TooltipWrapper title={tooltips?.scaffold}>
        <span>Scaffold</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const scaffold: string = row.getValue('scaffold');
      return (
        <div className="font-medium">
          {scaffold.length > 30 ? `${scaffold.slice(0, 30)}...` : scaffold}
        </div>
      );
    },
  },
  {
    accessorKey: 'model',
    header: () => (
      <TooltipWrapper title={tooltips?.model}>
        <span>Base Model</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const model: string = row.getValue('model');
      return (
        <div className="font-medium">
          {model.length > 30 ? `${model.slice(0, 30)}...` : model}
        </div>
      );
    },
  },
  // Grouped column for Avg Total Time
  {
    id: 'avgTotalTime',
    header: () => (
      <TooltipWrapper title={tooltips?.avgTotalTime}>
        <span>Avg Total Time (seconds)</span>
      </TooltipWrapper>
    ),
    columns: [
      {
        accessorKey: 'avgTotalTimeU',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">U</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgTotalTimeU');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
      {
        accessorKey: 'avgTotalTimeR',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">R</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgTotalTimeR');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
    ],
  },
  // Grouped column for Avg CPU Time
  {
    id: 'avgCPUTime',
    header: () => (
      <TooltipWrapper title={tooltips?.avgCPUTime}>
        <span>Avg CPU Time (seconds)</span>
      </TooltipWrapper>
    ),
    columns: [
      {
        accessorKey: 'avgCPUTimeU',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">U</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgCPUTimeU');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
      {
        accessorKey: 'avgCPUTimeR',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">R</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgCPUTimeR');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
    ],
  },
  // Grouped column for Avg Inference Time
  {
    id: 'avgInfTime',
    header: () => (
      <TooltipWrapper title={tooltips?.avgInfTime}>
        <span>Avg Inference Time (seconds)</span>
      </TooltipWrapper>
    ),
    columns: [
      {
        accessorKey: 'avgInfTimeU',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">U</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgInfTimeU');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
      {
        accessorKey: 'avgInfTimeR',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">R</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgInfTimeR');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
    ],
  },
  // Grouped column for Avg Total Tokens
  {
    id: 'avgTotalTokens',
    header: () => (
      <TooltipWrapper title={tooltips?.avgTotalTokens}>
        <span>Avg Total Tokens (K)</span>
      </TooltipWrapper>
    ),
    columns: [
      {
        accessorKey: 'avgTotalTokensU',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">U</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgTotalTokensU');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
      {
        accessorKey: 'avgTotalTokensR',
        header: () => (
          <TooltipWrapper title={'Resolved'}>
            <div className="flex w-full items-center justify-end">R</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgTotalTokensR');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
    ],
  },
  // Grouped column for Avg LLM Requests
  {
    id: 'avgLLMRequests',
    header: () => (
      <TooltipWrapper title={tooltips?.avgLLMRequests}>
        <span>Avg LLM Requests</span>
      </TooltipWrapper>
    ),
    columns: [
      {
        accessorKey: 'avgLLMRequestsU',
        header: () => (
          <TooltipWrapper title={'Unresolved'}>
            <div className="flex w-full items-center justify-end">U</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgLLMRequestsU');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
      {
        accessorKey: 'avgLLMRequestsR',
        header: () => (
          <TooltipWrapper title={'Resolved'}>
            <div className="flex w-full items-center justify-end">R</div>
          </TooltipWrapper>
        ),
        cell: ({ row }) => {
          const value: string = row.getValue('avgLLMRequestsR');
          return (
            <div className="text-right font-medium">{formatScore(value)}</div>
          );
        },
      },
    ],
  },
];
