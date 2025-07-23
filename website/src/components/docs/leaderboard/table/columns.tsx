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
  total: number;
  cpuTime: number;
  infTime: number;
  inputToken: number;
  outputToken: number;
  calls: number;
  resolveRate: number;
  precision?: number;
};

export type RankedLeaderboardData = LeaderboardData & { rank: number };

export const columns = ({
  tooltips,
  headers,
}: {
  tooltips?: ColumnConfig;
  headers?: ColumnConfig;
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
    total,
    cpuTime,
    infTime,
    inputToken,
    outputToken,
    calls,
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
              {rank || 'Rank'}
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => {
        const rankNumber: number = row.getValue(rank || 'rank');
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
      id: scaffold,
      accessorKey: 'scaffold',
      header: () => (
        <TooltipWrapper title={tooltips?.scaffold}>
          <span>{scaffold}</span>
        </TooltipWrapper>
      ),
      cell: ({ row }) => {
        const scaffold: string = row.getValue(headers?.scaffold || 'scaffold');
        return (
          <div className="text-left font-medium">
            {scaffold.length > 30 ? `${scaffold.slice(0, 30)}...` : scaffold}
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
          <div className="text-left font-medium">
            {modelValue.length > 30
              ? `${modelValue.slice(0, 30)}...`
              : modelValue}
          </div>
        );
      },
    },
    {
      id: tokenEfficiency,
      accessorKey: 'tokenEfficiency',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.tokenEfficiency}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start text-active"
            >
              <ArrowUpDown className="h- 4 mr-2 w-4" />
              {tokenEfficiency} (%)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium text-active">
          {formatScore(row.getValue(tokenEfficiency || 'tokenEfficiency'))}
          <Progress
            value={row.getValue(tokenEfficiency || 'tokenEfficiency')}
            className="ml-auto h-2 w-16 bg-active/20"
            indicatorClassName="bg-active"
          />
        </div>
      ),
    },
    {
      id: gpuEfficiency,
      accessorKey: 'gpuEfficiency',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.gpuEfficiency}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {gpuEfficiency} (%)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(gpuEfficiency || 'gpuEfficiency'))}
          <Progress
            value={row.getValue(gpuEfficiency || 'gpuEfficiency')}
            className="ml-auto h-2 w-16"
          />
        </div>
      ),
    },
    {
      id: cpuEfficiency,
      accessorKey: 'cpuEfficiency',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.cpuEfficiency}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {cpuEfficiency} (%)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(cpuEfficiency || 'cpuEfficiency'))}
          <Progress
            value={row.getValue(cpuEfficiency || 'cpuEfficiency')}
            className="ml-auto h-2 w-16"
          />
        </div>
      ),
    },
    {
      id: costEfficiency,
      accessorKey: 'costEfficiency',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.costEfficiency}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {costEfficiency} (%)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(costEfficiency || 'costEfficiency'))}
          <Progress
            value={row.getValue(costEfficiency || 'costEfficiency')}
            className="ml-auto h-2 w-16"
          />
        </div>
      ),
    },
    {
      id: resolveRate,
      accessorKey: 'resolveRate',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.resolveRate}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {resolveRate} (%)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          <span className="font-bold">
            {formatScore(row.getValue(resolveRate || 'resolveRate'))}
          </span>
          <Progress
            value={row.getValue(resolveRate || 'resolveRate')}
            className="ml-auto h-2 w-16"
          />
        </div>
      ),
    },
    {
      id: total,
      accessorKey: 'total',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.total}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />

              <div className="text-center">
                <div>Mean Normalized</div>
                <div>Time (seconds)</div>
              </div>
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(total || 'total'))}
        </div>
      ),
    },
    {
      id: cpuTime,
      accessorKey: 'cpuTime',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.cpuTime}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {cpuTime} (seconds)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(cpuTime || 'cpuTime'))}
        </div>
      ),
    },
    {
      id: infTime,
      accessorKey: 'infTime',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.infTime}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <div className="text-center">
                <div>Mean Normalized </div>
                <div>Inference Time (seconds)</div>
              </div>
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(infTime || 'infTime'))}
        </div>
      ),
    },
    {
      id: inputToken,
      accessorKey: 'inputToken',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.inputToken}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {inputToken} (K)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(inputToken || 'inputToken'))}
        </div>
      ),
    },
    {
      id: outputToken,
      accessorKey: 'outputToken',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.outputToken}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {outputToken} (K)
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(outputToken || 'outputToken'))}
        </div>
      ),
    },
    {
      id: calls,
      accessorKey: 'calls',
      header: ({ column }) => {
        return (
          <TooltipWrapper title={tooltips?.calls}>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="flex items-center justify-start"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {calls}{' '}
            </button>
          </TooltipWrapper>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatScore(row.getValue(calls || 'calls'))}
        </div>
      ),
    },
    // {
    //   accessorKey: 'precision',
    //   header: ({ column }) => {
    //     return (
    //       <TooltipWrapper title={tooltips?.precision}>
    //         <button
    //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //           className="flex items-center justify-start"
    //         >
    //           Precision
    //           <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </button>
    //       </TooltipWrapper>
    //     );
    //   },
    //   cell: ({ row }) => (
    //     <div className="text-left font-medium">
    //       <span className="font-bold">
    //         {formatScore(row.getValue('precision'))}
    //       </span>
    //       <Progress value={row.getValue('precision')} className="h-2 w-16" />
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: 'action',
    //   header: 'Actions',
    //   cell: ({ row }) => {
    //     const leaderboardData = row.original;
    //
    //     return (
    //       <DropdownMenu>
    //         {/* <DropdownMenuLabel></DropdownMenuLabel> */}
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(leaderboardData.id)}
    //           >
    //             Copy LeaderboardData ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           {/* <DropdownMenuItem */}
    //           {/*   onClick={() => { */}
    //           {/*     // TODO: add download dataset functionality */}
    //           {/*   }} */}
    //           {/* > */}
    //           {/*   Download Dataset */}
    //           {/* </DropdownMenuItem> */}
    //           <DropdownMenuItem
    //             onClick={() => {
    //               // navigate to the link
    //               // window.open(leaderboardData.siteLink, '_blank');
    //             }}
    //           >
    //             Visit Site
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];
};
