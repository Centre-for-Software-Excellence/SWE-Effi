import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Award, Crown, Medal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Progress } from '@/components/common/ui/progress';
import { formatScore } from '@/lib/utils';
import { ColumnConfig } from '../tables-card';

export type LeaderboardData = {
  scaffold: string;
  model: string;
  gpuEfficiency: number;
  cpuEfficiency: number;
  costEfficiency: number;
  tokenEfficiency: number;
  resolveRate: number;
  precision?: number;

  avgDuration: number;
  avgDurationR: number;
  avgDurationU: number;

  avgCPUTime: number;
  avgCPUTimeR: number;
  avgCPUTimeU: number;

  avgInfTime: number;
  avgInfTimeR: number;
  avgInfTimeU: number;

  avgInputTokens: number;
  avgInputTokensR: number;
  avgInputTokensU: number;

  avgOutputTokens: number;
  avgOutputTokensR: number;
  avgOutputTokensU: number;

  avgLLMRequests: number;
  avgLLMRequestsR: number;
  avgLLMRequestsU: number;
};

export type RankedLeaderboardData = LeaderboardData & { rank: number };

export const columns = ({
  tooltips,
  headers,
  activeSortColumn = 'gpuEfficiency',
  onSortColumnChange,
}: {
  tooltips?: ColumnConfig;
  headers?: ColumnConfig;
  activeSortColumn?: string;
  onSortColumnChange?: (columnId: string) => void;
}): ColumnDef<RankedLeaderboardData>[] => {
  const {
    rank,
    scaffold,
    model,
    tokenEfficiency,
    gpuEfficiency,
    cpuEfficiency,
    costEfficiency,
    resolveRate,
    // precision,

    duration,
    avgDuration,
    avgDurationR,
    avgDurationU,

    CPUTime,
    avgCPUTime,
    avgCPUTimeR,
    avgCPUTimeU,

    infTime,
    avgInfTime,
    avgInfTimeR,
    avgInfTimeU,

    inputTokens,
    avgInputTokens,
    avgInputTokensR,
    avgInputTokensU,

    outputTokens,
    avgOutputTokens,
    avgOutputTokensR,
    avgOutputTokensU,

    llmRequests,
    avgLLMRequests,
    avgLLMRequestsR,
    avgLLMRequestsU,

    total,
    resolved,
    unresolved,
  } = headers || {};
  const createSortableHeader = (
    columnId: string,
    displayText: string,
    tooltipText?: string,
  ) => {
    const isActive = activeSortColumn === columnId;
    return ({ column }: any) => (
      <TooltipWrapper title={tooltipText}>
        <button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
            if (onSortColumnChange) {
              onSortColumnChange(columnId);
            }
          }}
          className={`flex items-center justify-start ${isActive ? 'text-active' : ''}`}
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {displayText}
        </button>
      </TooltipWrapper>
    );
  };

  const createProgressCell = (columnId: string, isActive: boolean = false) => {
    return ({ row }: any) => (
      <div
        className={`text-right font-medium ${isActive ? 'text-active' : ''}`}
      >
        {formatScore(row.getValue(columnId))}
        <Progress
          aria-label={`${columnId} progress bar`}
          value={row.getValue(columnId)}
          className={`ml-auto h-2 w-16 ${isActive ? 'bg-active/20' : ''}`}
          indicatorClassName={isActive ? 'bg-active' : ''}
        />
      </div>
    );
  };

  const createSimpleCell = (columnId: string, isActive: boolean = false) => {
    return ({ row }: any) => (
      <div
        className={`text-right font-medium ${isActive ? 'text-active' : ''}`}
      >
        {formatScore(row.getValue(columnId))}
      </div>
    );
  };

  return [
    {
      id: 'rank',
      accessorKey: 'rank',
      header: createSortableHeader('rank', rank || 'Rank', tooltips?.rank),
      cell: ({ row }) => {
        const rankNumber: number = row.getValue('rank');
        return (
          <div className="flex items-center justify-start">
            {rankNumber === 1 ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : rankNumber === 2 ? (
              <Medal className="h-5 w-5 text-gray-400" />
            ) : rankNumber === 3 ? (
              <Award className="h-5 w-5 text-amber-600" />
            ) : (
              <span className="font-bold text-muted-foreground">
                #{rankNumber}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'scaffold',
      accessorKey: 'scaffold',
      header: () => (
        <TooltipWrapper title={tooltips?.scaffold}>
          <span>{scaffold || 'Scaffold'}</span>
        </TooltipWrapper>
      ),
      cell: ({ row }) => {
        const scaffoldValue: string = row.getValue('scaffold');
        return (
          <div className="text-left font-medium">
            {scaffoldValue && scaffoldValue.length > 30
              ? `${scaffoldValue.slice(0, 30)}...`
              : scaffoldValue}
          </div>
        );
      },
    },
    {
      id: 'model',
      accessorKey: 'model',
      header: () => (
        <TooltipWrapper title={tooltips?.model}>
          <span>{model || 'Model'}</span>
        </TooltipWrapper>
      ),
      cell: ({ row }) => {
        const modelValue: string = row.getValue('model');
        return (
          <div className="text-left font-medium">
            {modelValue && modelValue.length > 30
              ? `${modelValue.slice(0, 30)}...`
              : modelValue}
          </div>
        );
      },
    },
    {
      id: 'tokenEfficiency',
      accessorKey: 'tokenEfficiency',
      header: createSortableHeader(
        'tokenEfficiency',
        `${tokenEfficiency || 'Token Efficiency'} (%)`,
        tooltips?.tokenEfficiency,
      ),
      cell: createProgressCell(
        'tokenEfficiency',
        activeSortColumn === 'tokenEfficiency',
      ),
    },
    {
      id: 'gpuEfficiency',
      accessorKey: 'gpuEfficiency',
      header: createSortableHeader(
        'gpuEfficiency',
        `${gpuEfficiency || 'GPU Efficiency'} (%)`,
        tooltips?.gpuEfficiency,
      ),
      cell: createProgressCell(
        'gpuEfficiency',
        activeSortColumn === 'gpuEfficiency',
      ),
    },
    {
      id: 'cpuEfficiency',
      accessorKey: 'cpuEfficiency',
      header: createSortableHeader(
        'cpuEfficiency',
        `${cpuEfficiency || 'CPU Efficiency'} (%)`,
        tooltips?.cpuEfficiency,
      ),
      cell: createProgressCell(
        'cpuEfficiency',
        activeSortColumn === 'cpuEfficiency',
      ),
    },
    {
      id: 'costEfficiency',
      accessorKey: 'costEfficiency',
      header: createSortableHeader(
        'costEfficiency',
        `${costEfficiency || 'Cost Efficiency'} (%)`,
        tooltips?.costEfficiency,
      ),
      cell: createProgressCell(
        'costEfficiency',
        activeSortColumn === 'costEfficiency',
      ),
    },
    {
      id: 'resolveRate',
      accessorKey: 'resolveRate',
      header: createSortableHeader(
        'resolveRate',
        `${resolveRate || 'Resolve Rate'} (%)`,
        tooltips?.resolveRate,
      ),
      cell: ({ row }) => {
        const isActive = activeSortColumn === 'resolveRate';
        return (
          <div
            className={`text-right font-medium ${isActive ? 'text-active' : ''}`}
          >
            <span className="font-bold">
              {formatScore(row.getValue('resolveRate'))}
            </span>
            <Progress
              aria-label="Resolve Rate progress bar"
              value={row.getValue('resolveRate')}
              className={`ml-auto h-2 w-16 ${isActive ? 'bg-active/20' : ''}`}
              indicatorClassName={isActive ? 'bg-active' : ''}
            />
          </div>
        );
      },
    },
    {
      id: duration || 'duration',
      header: () => (
        <TooltipWrapper title={tooltips?.duration}>
          <span>{duration || 'Mean Normalized Time'} (seconds)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgDuration,
          accessorKey: 'avgDuration',
          header: createSortableHeader(
            'avgDuration',
            total || 'Total',
            tooltips?.avgDuration,
          ),
          cell: createSimpleCell(
            avgDuration || 'avgDuration',
            activeSortColumn === 'avgDuration',
          ),
        },
        {
          id: avgDurationR,
          accessorKey: 'avgDurationR',
          header: createSortableHeader(
            'avgDurationR',
            resolved || 'Resolved',
            tooltips?.avgDurationR,
          ),
          cell: createSimpleCell(
            avgDurationR || 'avgDurationR',
            activeSortColumn === 'avgDurationR',
          ),
        },
        {
          id: avgDurationU,
          accessorKey: 'avgDurationU',
          header: createSortableHeader(
            'avgDurationU',
            unresolved || 'Unresolved',
            tooltips?.avgDurationU,
          ),
          cell: createSimpleCell(
            avgDurationU || 'avgDurationU',
            activeSortColumn === 'avgDurationU',
          ),
        },
      ],
    },
    {
      id: CPUTime || 'CPU Time',
      header: () => (
        <TooltipWrapper title={tooltips?.CPUTime}>
          <span>{CPUTime || 'Mean CPU Time'} (seconds)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgCPUTime,
          accessorKey: 'avgCPUTime',
          header: createSortableHeader(
            'avgCPUTime',
            total || 'Total',
            tooltips?.avgCPUTime,
          ),
          cell: createSimpleCell(
            avgCPUTime || 'avgCPUTime',
            activeSortColumn === 'avgCPUTime',
          ),
        },
        {
          id: avgCPUTimeR,
          accessorKey: 'avgCPUTimeR',
          header: createSortableHeader(
            'avgCPUTimeR',
            resolved || 'Resolved',
            tooltips?.avgCPUTimeR,
          ),
          cell: createSimpleCell(
            avgCPUTimeR || 'avgCPUTimeR',
            activeSortColumn === 'avgCPUTimeR',
          ),
        },
        {
          id: avgCPUTimeU,
          accessorKey: 'avgCPUTimeU',
          header: createSortableHeader(
            'avgCPUTimeU',
            unresolved || 'Unresolved',
            tooltips?.avgCPUTimeU,
          ),
          cell: createSimpleCell(
            avgCPUTimeU || 'avgCPUTimeU',
            activeSortColumn === 'avgCPUTimeU',
          ),
        },
      ],
    },
    {
      id: infTime || 'Mean Normalized Inference Time',
      header: () => (
        <TooltipWrapper title={tooltips?.infTime}>
          <span>{infTime || 'Mean Normalized Inference Time'} (seconds)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgInfTime,
          accessorKey: 'avgInfTime',
          header: createSortableHeader(
            'avgInfTime',
            total || 'Total',
            tooltips?.avgInfTime,
          ),
          cell: createSimpleCell(
            avgInfTime || 'avgInfTime',
            activeSortColumn === 'avgInfTime',
          ),
        },
        {
          id: avgInfTimeR,
          accessorKey: 'avgInfTimeR',
          header: createSortableHeader(
            'avgInfTimeR',
            resolved || 'Resolved',
            tooltips?.avgInfTimeR,
          ),
          cell: createSimpleCell(
            avgInfTimeR || 'avgInfTimeR',
            activeSortColumn === 'avgInfTimeR',
          ),
        },
        {
          id: avgInfTimeU,
          accessorKey: 'avgInfTimeU',
          header: createSortableHeader(
            'avgInfTimeU',
            unresolved || 'Unresolved',
            tooltips?.avgInfTimeU,
          ),
          cell: createSimpleCell(
            avgInfTimeU || 'avgInfTimeU',
            activeSortColumn === 'avgInfTimeU',
          ),
        },
      ],
    },
    {
      id: inputTokens || 'Mean Input Tokens',
      header: () => (
        <TooltipWrapper title={tooltips?.inputTokens}>
          <span>{inputTokens || 'Mean Input Tokens'} (K)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgInputTokens,
          accessorKey: 'avgInputTokens',
          header: createSortableHeader(
            'avgInputTokens',
            total || 'Total',
            tooltips?.avgInputTokens,
          ),
          cell: createSimpleCell(
            avgInputTokens || 'avgInputTokens',
            activeSortColumn === 'avgInputTokens',
          ),
        },
        {
          id: avgInputTokensR,
          accessorKey: 'avgInputTokensR',
          header: createSortableHeader(
            'avgInputTokensR',
            resolved || 'Resolved',
            tooltips?.avgInputTokensR,
          ),
          cell: createSimpleCell(
            avgInputTokensR || 'avgInputTokensR',
            activeSortColumn === 'avgInputTokensR',
          ),
        },
        {
          id: avgInputTokensU,
          accessorKey: 'avgInputTokensU',
          header: createSortableHeader(
            'avgInputTokensU',
            unresolved || 'Unresolved',
            tooltips?.avgInputTokensU,
          ),
          cell: createSimpleCell(
            avgInputTokensU || 'avgInputTokensU',
            activeSortColumn === 'avgInputTokensU',
          ),
        },
      ],
    },
    {
      id: outputTokens || 'Mean Output Tokens',
      header: () => (
        <TooltipWrapper title={tooltips?.outputTokens}>
          <span>{outputTokens || 'Mean Output Tokens'} (K)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgOutputTokens,
          accessorKey: 'avgOutputTokens',
          header: createSortableHeader(
            'avgOutputTokens',
            total || 'Total',
            tooltips?.avgOutputTokens,
          ),
          cell: createSimpleCell(
            avgOutputTokens || 'avgOutputTokens',
            activeSortColumn === 'avgOutputTokens',
          ),
        },
        {
          id: avgOutputTokensR,
          accessorKey: 'avgOutputTokensR',
          header: createSortableHeader(
            'avgOutputTokensR',
            resolved || 'Resolved',
            tooltips?.avgOutputTokensR,
          ),
          cell: createSimpleCell(
            avgOutputTokensR || 'avgOutputTokensR',
            activeSortColumn === 'avgOutputTokensR',
          ),
        },
        {
          id: avgOutputTokensU,
          accessorKey: 'avgOutputTokensU',
          header: createSortableHeader(
            'avgOutputTokensU',
            unresolved || 'Unresolved',
            tooltips?.avgOutputTokensU,
          ),
          cell: createSimpleCell(
            avgOutputTokensU || 'avgOutputTokensU',
            activeSortColumn === 'avgOutputTokensU',
          ),
        },
      ],
    },
    {
      id: llmRequests || 'Mean LLM Calls',
      header: () => (
        <TooltipWrapper title={tooltips?.llmRequests}>
          <span>{llmRequests || 'Mean LLM Calls'} (K)</span>
        </TooltipWrapper>
      ),
      columns: [
        {
          id: avgLLMRequests,
          accessorKey: 'avgLLMRequests',
          header: createSortableHeader(
            'avgLLMRequests',
            total || 'Total',
            tooltips?.avgLLMRequests,
          ),
          cell: createSimpleCell(
            avgLLMRequests || 'avgLLMRequests',
            activeSortColumn === 'avgLLMRequests',
          ),
        },
        {
          id: avgLLMRequestsR,
          accessorKey: 'avgLLMRequestsR',
          header: createSortableHeader(
            'avgLLMRequestsR',
            resolved || 'Resolved',
            tooltips?.avgLLMRequestsR,
          ),
          cell: createSimpleCell(
            avgLLMRequestsR || 'avgLLMRequestsR',
            activeSortColumn === 'avgLLMRequestsR',
          ),
        },
        {
          id: avgLLMRequestsU,
          accessorKey: 'avgLLMRequestsU',
          header: createSortableHeader(
            'avgLLMRequestsU',
            unresolved || 'Unresolved',
            tooltips?.avgLLMRequestsU,
          ),
          cell: createSimpleCell(
            avgLLMRequestsU || 'avgLLMRequestsU',
            activeSortColumn === 'avgLLMRequestsU',
          ),
        },
      ],
    },
  ];
};
