import { TooltipProvider } from '@radix-ui/react-tooltip';

import { getLeaderboardData, getLeaderboardDataRVU } from '@/lib/data/get';
import { cn } from '@/lib/utils';
import { columns, Performance } from './table/columns';
import { columns as columnsRVU, PerformanceRVU } from './table/columns-rvu';
import { DataTable } from './table/data-table';

export default function TablesCard() {
  const data: Performance[] = getLeaderboardData();
  const dataRVU: PerformanceRVU[] = getLeaderboardDataRVU();

  // TODO: add tabs
  return (
    <div className={cn('overflow-x-auto font-sans text-foreground md:px-2')}>
      <TooltipProvider>
        <DataTable columns={columns} data={data} />
        <DataTable columns={columnsRVU} data={dataRVU} />
      </TooltipProvider>
    </div>
  );
}
