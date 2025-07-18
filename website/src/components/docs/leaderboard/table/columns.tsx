import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Award, Crown, Medal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Progress } from '@/components/common/ui/progress';
import { formatScore } from '@/lib/utils';
import { ColumnTooltips } from '../tables-card';

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

export const columns = (
  tooltips: ColumnTooltips,
): ColumnDef<RankedLeaderboardData>[] => [
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
        <div className="text-left font-medium">
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
        <div className="text-left font-medium">
          {model.length > 30 ? `${model.slice(0, 30)}...` : model}
        </div>
      );
    },
  },
  {
    accessorKey: 'gpuEfficiency',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.gpuEfficiency}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Inference Efficiency (%)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('gpuEfficiency'))}
        <Progress
          value={row.getValue('gpuEfficiency')}
          className="ml-auto h-2 w-16"
        />
      </div>
    ),
  },
  {
    accessorKey: 'cpuEfficiency',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.cpuEfficiency}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            CPU Efficiency (%)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('cpuEfficiency'))}
        <Progress
          value={row.getValue('cpuEfficiency')}
          className="ml-auto h-2 w-16"
        />
      </div>
    ),
  },
  {
    accessorKey: 'costEfficiency',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.costEfficiency}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Cost Efficiency (%)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('costEfficiency'))}
        <Progress
          value={row.getValue('costEfficiency')}
          className="ml-auto h-2 w-16"
        />
      </div>
    ),
  },
  {
    accessorKey: 'tokenEfficiency',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.tokenEfficiency}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="h- 4 mr-2 w-4" />
            Token Efficiency (%)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('tokenEfficiency'))}
        <Progress
          value={row.getValue('tokenEfficiency')}
          className="ml-auto h-2 w-16"
        />
      </div>
    ),
  },
  {
    accessorKey: 'resolveRate',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.resolveRate}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Resolve Rate (%)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        <span className="font-bold">
          {formatScore(row.getValue('resolveRate'))}
        </span>
        <Progress
          value={row.getValue('resolveRate')}
          className="ml-auto h-2 w-16"
        />
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.total}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
        {formatScore(row.getValue('total'))}
      </div>
    ),
  },
  {
    accessorKey: 'cpuTime',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.cpuTime}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Mean CPU Time (seconds)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('cpuTime'))}
      </div>
    ),
  },
  {
    accessorKey: 'infTime',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.infTime}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
        {formatScore(row.getValue('infTime'))}
      </div>
    ),
  },
  {
    accessorKey: 'inputToken',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.inputToken}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Mean Input tokens (K)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('inputToken'))}
      </div>
    ),
  },
  {
    accessorKey: 'outputToken',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.outputToken}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Mean Output tokens (K)
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('outputToken'))}
      </div>
    ),
  },
  {
    accessorKey: 'calls',
    header: ({ column }) => {
      return (
        <TooltipWrapper title={tooltips?.calls}>
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Mean number of LLM calls
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatScore(row.getValue('calls'))}
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
