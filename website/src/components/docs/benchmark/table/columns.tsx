import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Award, Crown, Medal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Progress } from '@/components/common/ui/progress';

export type Performance = {
  rank: number;
  scaffold: string;
  model: string;
  total: number;
  cpuTime: number;
  inputToken: number;
  outputToken: number;
  calls: number;
  infTime: number;
  resolveRate: number;
  precision?: number;
};

function formatScore(score: string | undefined): string {
  const res = !score
    ? 'N/A'
    : parseFloat(score).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
  return res;
}

// TODO: tooltips
export const columns: ColumnDef<Performance>[] = [
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Ranked by resolve rate">
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
      <TooltipWrapper title="Name of software framework that using the LLM">
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
      <TooltipWrapper title="Name of Large Language Model">
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
    accessorKey: 'total',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Total time">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Total Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('total'))}
      </div>
    ),
  },
  {
    accessorKey: 'cpuTime',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Total CPU Time">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            CPU Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('cpuTime'))}
      </div>
    ),
  },
  {
    accessorKey: 'inputToken',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Number of input tokens in thousands">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Input tokens
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('inputToken'))}
      </div>
    ),
  },
  {
    accessorKey: 'outputToken',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Number of output tokens in thousands">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Output tokens
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('outputToken'))}
      </div>
    ),
  },
  {
    accessorKey: 'calls',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Number of inference calls to the LLM">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Calls
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('calls'))}
      </div>
    ),
  },
  {
    accessorKey: 'infTime',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Number of inference calls to the LLM">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Inference Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('infTime'))}
      </div>
    ),
  },
  {
    accessorKey: 'resolveRate',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Number of generated patches that correct resolved the issue">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Resolve Rate
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        <span className="font-bold">
          {formatScore(row.getValue('resolveRate'))}
        </span>
        <Progress value={row.getValue('resolveRate')} className="h-2 w-16" />
      </div>
    ),
  },
  {
    accessorKey: 'precision',
    header: ({ column }) => {
      return (
        <TooltipWrapper title="Number of correct patches out of all patches generated">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center justify-start"
          >
            Precision
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        </TooltipWrapper>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {formatScore(row.getValue('precision'))}
      </div>
    ),
  },
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
