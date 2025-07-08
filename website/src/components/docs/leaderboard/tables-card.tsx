import { TooltipProvider } from '@radix-ui/react-tooltip';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/ui/tabs';
import { getLeaderboardData, getLeaderboardDataRVU } from '@/lib/data/get';
import { cn } from '@/lib/utils';
import { columns, Performance } from './table/columns';
import { columns as columnsRVU, PerformanceRVU } from './table/columns-rvu';
import { DataTable } from './table/data-table';

export type ColumnTooltips = Record<
  Partial<keyof Performance | keyof PerformanceRVU>,
  string
>;
export type Table = {
  tabTitle: string;
  filterPlaceholder?: string;
  columnTooltips: ColumnTooltips;
};

export type Tables = Record<string, Table>;

export default function TablesCard({
  tablesUi,
  className,
}: {
  tablesUi: Tables;
  className?: string;
}) {
  const data: Performance[] = getLeaderboardData();
  const dataRVU: PerformanceRVU[] = getLeaderboardDataRVU();
  const { leaderboard, leaderboardRVU } = tablesUi;

  return (
    <div
      className={cn(
        'overflow-x-auto font-sans text-foreground md:px-2',
        className,
      )}
    >
      <TooltipProvider>
        <Tabs defaultValue="Leaderboard" className="rounded">
          <TabsList>
            <TabsTrigger value="Leaderboard" className="rounded">
              {leaderboard.tabTitle}
            </TabsTrigger>
            <TabsTrigger value="Leaderboard RVU" className="rounded">
              {leaderboardRVU.tabTitle}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Leaderboard">
            <DataTable
              columns={columns(leaderboard.columnTooltips)}
              data={data}
            />
          </TabsContent>
          <TabsContent value="Leaderboard RVU">
            <DataTable
              columns={columnsRVU(leaderboardRVU.columnTooltips)}
              data={dataRVU}
            />
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  );
}
