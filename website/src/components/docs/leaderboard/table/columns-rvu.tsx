import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Award, Crown, Medal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { ColumnTooltips } from '../tables-card';

export type PerformanceRVU = {
  rank: number;
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

export const columns = (
  tooltips: ColumnTooltips,
): ColumnDef<PerformanceRVU>[] => [
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.rank}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
  {
    accessorKey: 'avgTotalTimeU',
    header: () => (
      <TooltipWrapper title={tooltips?.avgTotalTimeU}>
        <span>Average Total Time (U)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const attu: string = row.getValue('avgTotalTimeU');
      return (
        <div className="font-medium">
          {attu.length > 30 ? `${attu.slice(0, 30)}...` : attu}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgTotalTimeR',
    header: () => (
      <TooltipWrapper title={tooltips?.avgTotalTimeR}>
        <span>Average Total Time (R)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const attu: string = row.getValue('avgTotalTimeR');
      return (
        <div className="font-medium">
          {attu.length > 30 ? `${attu.slice(0, 30)}...` : attu}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgCPUTimeU',
    header: () => (
      <TooltipWrapper title={tooltips?.avgCPUTimeU}>
        <span>Average CPU Time (U)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgCPUTimeU');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgCPUTimeR',
    header: () => (
      <TooltipWrapper title={tooltips?.avgCPUTimeR}>
        <span>Average CPU Time (R)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgCPUTimeR');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgInfTimeU',
    header: () => (
      <TooltipWrapper title={tooltips?.avgInfTimeU}>
        <span>Average Inference Time (U)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgInfTimeU');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgInfTimeR',
    header: () => (
      <TooltipWrapper title={tooltips?.avgInfTimeR}>
        <span>Average Inference Time (R)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgInfTimeR');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgTotalTokensU',
    header: () => (
      <TooltipWrapper title={tooltips?.avgTotalTokensU}>
        <span>Average Total Tokens (U)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgTotalTokensU');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgTotalTokensR',
    header: () => (
      <TooltipWrapper title={tooltips?.avgTotalTokensR}>
        <span>Average Total Tokens (R)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgTotalTokensR');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgLLMRequestsU',
    header: () => (
      <TooltipWrapper title={tooltips?.avgLLMRequestsU}>
        <span>Average LLM Requests (U)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgLLMRequestsU');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
  {
    accessorKey: 'avgLLMRequestsR',
    header: () => (
      <TooltipWrapper title={tooltips?.avgLLMRequestsR}>
        <span>Average LLM Requests (R)</span>
      </TooltipWrapper>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue('avgLLMRequestsR');
      return (
        <div className="font-medium">
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </div>
      );
    },
  },
];
