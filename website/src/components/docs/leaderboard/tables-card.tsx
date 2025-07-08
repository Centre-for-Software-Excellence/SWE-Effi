// import { useEffect, useState } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

// import { Card, CardContent } from '@/components/common/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/ui/tabs';
import { H5, H6 } from '@/components/md';
import { getLeaderboardData, getLeaderboardDataRVU } from '@/lib/data/get';
import { cn } from '@/lib/utils';
import { columns, RankedLeaderboardData } from './table/columns';
import {
  columns as columnsRVU,
  RankedLeaderboardRVUData,
} from './table/columns-rvu';
import { DataTable } from './table/data-table';

export type ColumnTooltips = Partial<
  Record<keyof RankedLeaderboardRVUData | keyof RankedLeaderboardData, string>
>;
export type Table = {
  tabTitle: string;
  tableTitle: string;
  filterPlaceholder?: string;
  columnTooltips: ColumnTooltips;
};

export type Tables = Record<string, Table>;

export type TableData = RankedLeaderboardRVUData | RankedLeaderboardData;

export default function TablesCard({
  tablesUi,
  className,
}: {
  tablesUi: Tables;
  className?: string;
}) {
  const { leaderboard, leaderboardRVU } = tablesUi;

  // TODO: temporary mannually defined leaderboard data
  const data: RankedLeaderboardData[] = getLeaderboardData();
  const dataRVU: RankedLeaderboardRVUData[] = getLeaderboardDataRVU();

  // const [data, setData] = useState<RankedLeaderboardData[]>([]);
  // const [dataRVU, setDataRVU] = useState<RankedLeaderboardRVUData[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');
  // useEffect(() => {
  //   Promise.all([
  //     fetch('/data/benchmark/table/leaderboard/data.json').then((res) =>
  //       res.json(),
  //     ),
  //     fetch('/data/benchmark/table/leaderboard/data-rvu.json').then((res) =>
  //       res.json(),
  //     ),
  //   ])
  //     .then(([data1, data2]) => {
  //       setData(data1);
  //       setDataRVU(data2);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err.message);
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  // TODO: loading component
  // if (loading) {
  //   <Card>
  //     <CardContent className="flex h-96 items-center justify-center p-8">
  //       <div>Loading leaderboards...</div>
  //     </CardContent>
  //   </Card>;
  // }

  // TODO: error message
  // if (error) {
  //   <Card>
  //     <CardContent className="flex h-96 items-center justify-center p-8">
  //       <div className="text-destructive">{error}</div>
  //     </CardContent>
  //   </Card>;
  // }

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
            <H6 className="mb-0!">{leaderboard.tableTitle}</H6>
            <DataTable
              columns={columns(leaderboard.columnTooltips)}
              data={data}
            />
          </TabsContent>
          <TabsContent value="Leaderboard RVU">
            <H6 className="mb-0!">{leaderboardRVU.tableTitle}</H6>
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
