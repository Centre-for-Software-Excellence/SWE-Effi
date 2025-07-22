import { useEffect, useState } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Link } from 'react-router';

import { Card, CardContent } from '@/components/common/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/ui/tabs';
import { H6 } from '@/components/md';
import { Note } from '@/components/md/alerts';
import { cn } from '@/lib/utils';
import { getBasePath } from '@/lib/utils/path';
import { columns, RankedLeaderboardData } from './table/columns';
import {
  columns as columnsRVU,
  LeaderboardRVUTooltips,
  RankedLeaderboardRVUData,
} from './table/columns-rvu';
import { DataTable } from './table/data-table';

export type ColumnConfig = Partial<
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
  columnTooltips: ColumnConfig;
  columnHeaders?: ColumnConfig;
  footerTitle?: string;
  footerDescription?: string;
  footers?: string[];
};

export type Tables = Record<string, Table>;

export type TableData = RankedLeaderboardRVUData | RankedLeaderboardData;

export default function TablesCard({
  tablesUi,
  caption,
  className,
  show = [true, true], // [showLeaderboard, showLeaderboardRVU]
  showTabs = true,
}: {
  tablesUi: Tables;
  caption?: boolean;
  className?: string;
  show: [boolean, boolean]; // [showLeaderboard, showLeaderboardRVU]
  showTabs?: boolean;
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
        <Tabs
          defaultValue={show[0] ? 'Leaderboard' : 'Leaderboard RVU'}
          className="rounded"
        >
          {show[0] && show[1] && showTabs && (
            <TabsList>
              <TabsTrigger value="Leaderboard" className="rounded">
                {leaderboard.tabTitle}
              </TabsTrigger>
              <TabsTrigger value="Leaderboard RVU" className="rounded">
                {leaderboardRVU.tabTitle}
              </TabsTrigger>
            </TabsList>
          )}
          {show[0] && (
            <TabsContent value="Leaderboard">
              <H6 className="mb-0!">{leaderboard.tableTitle}</H6>
              <DataTable
                data={data}
                columns={columns({
                  tooltips: leaderboard.columnTooltips,
                  headers: leaderboard.columnHeaders,
                })}
                filter={['Base Model', 'Scaffold']}
              />
              {caption && (
                <h6 className="w-full text-center text-muted-foreground">
                  {leaderboard.caption}
                </h6>
              )}
              <Note title="Note" className="mt-8">
                <h5 className="mb-2 text-base">{leaderboard.footerTitle}</h5>
                <p className="mb-2 pl-4 text-sm opacity-85">
                  {leaderboard.footerDescription}
                </p>
                <ul className="flex list-disc flex-col gap-2 pl-2">
                  {leaderboard.footers?.map((footer, index) => (
                    <li key={index}>{footer}</li>
                  ))}
                  <Link
                    to="/about/introducing-swe-effi#experimental-settings"
                    className="text-sm text-muted-foreground underline transition-all duration-300 hover:text-foreground"
                  >
                    How we calculated the metrics ?
                  </Link>
                </ul>
              </Note>
            </TabsContent>
          )}
          {show[1] && (
            <TabsContent value="Leaderboard RVU">
              <H6 className="mb-0!">{leaderboardRVU.tableTitle}</H6>
              <DataTable
                columns={columnsRVU({
                  tooltips: leaderboardRVU.columnTooltips,
                  headers: leaderboardRVU.columnHeaders,
                })}
                data={dataRVU}
                filter={['Base Model', 'Scaffold']}
              />
              {caption && (
                <h6 className="w-full text-center text-muted-foreground">
                  {leaderboardRVU.caption}
                </h6>
              )}
              <Note title="Note" className="mt-8">
                <h5 className="mb-2 text-base">{leaderboardRVU.footerTitle}</h5>
                <p className="mb-2 pl-4 text-sm opacity-85">
                  {leaderboardRVU.footerDescription}
                </p>
                <ul className="flex list-disc flex-col gap-2 pl-2">
                  {leaderboardRVU.footers?.map((footer, index) => (
                    <li key={index}>{footer}</li>
                  ))}
                </ul>
              </Note>
            </TabsContent>
          )}
        </Tabs>
      </TooltipProvider>
    </div>
  );
}
