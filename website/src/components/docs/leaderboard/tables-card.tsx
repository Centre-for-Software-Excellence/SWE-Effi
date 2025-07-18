import { useEffect, useState } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { Card, CardContent } from '@/components/common/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/ui/tabs';
import { H6, P } from '@/components/md';
import { cn } from '@/lib/utils';
import { getBasePath } from '@/lib/utils/path';
import { columns, RankedLeaderboardData } from './table/columns';
import {
  columns as columnsRVU,
  LeaderboardRVUTooltips,
  RankedLeaderboardRVUData,
} from './table/columns-rvu';
import { DataTable } from './table/data-table';

export type ColumnTooltips = Partial<
  Record<
    | (keyof RankedLeaderboardRVUData | keyof LeaderboardRVUTooltips)
    | keyof RankedLeaderboardData,
    string
  >
>;
export type Table = {
  caption: string;
  tabTitle: string;
  tableTitle: string;
  filterPlaceholder?: string;
  columnTooltips: ColumnTooltips;
};

export type Tables = Record<string, Table>;

export type TableData = RankedLeaderboardRVUData | RankedLeaderboardData;

export default function TablesCard({
  tablesUi,
  caption,
  className,
}: {
  tablesUi: Tables;
  caption?: boolean;
  className?: string;
}) {
  const { leaderboard, leaderboardRVU } = tablesUi;

  const [data, setData] = useState<RankedLeaderboardData[]>([]);
  const [dataRVU, setDataRVU] = useState<RankedLeaderboardRVUData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      fetch(getBasePath('data/benchmark/table/leaderboard/data.json')).then(
        (res) => res.json(),
      ),
      fetch(getBasePath('data/benchmark/table/leaderboard/data-rvu.json')).then(
        (res) => res.json(),
      ),
    ])
      .then(([data1, data2]) => {
        setData(data1);
        setDataRVU(data2);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // TODO: loading component
  if (loading) {
    <Card>
      <CardContent className="flex h-96 items-center justify-center p-8">
        <div>Loading leaderboards...</div>
      </CardContent>
    </Card>;
  }

  // TODO: error message
  if (error) {
    <Card>
      <CardContent className="flex h-96 items-center justify-center p-8">
        <div className="text-destructive">{error}</div>
      </CardContent>
    </Card>;
  }

  return (
    <div
      className={cn(
        'overflow-x-auto bg-background font-sans text-foreground md:px-2',
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
            {caption && (
              <h6 className="w-full text-center text-muted-foreground">
                {leaderboard.caption}
              </h6>
            )}
          </TabsContent>
          <TabsContent value="Leaderboard RVU">
            <H6 className="mb-0!">{leaderboardRVU.tableTitle}</H6>
            <DataTable
              columns={columnsRVU(leaderboardRVU.columnTooltips)}
              data={dataRVU}
            />
            {caption && (
              <h6 className="w-full text-center text-muted-foreground">
                {leaderboardRVU.caption}
              </h6>
            )}
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  );
}
