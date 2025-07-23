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
import { LeaderboardTable } from './leaderboard-table';
import { RankedLeaderboardData } from './table/columns';

export type ColumnConfig = Partial<
  Record<keyof RankedLeaderboardData, string>
> & { [key: string]: string | undefined };
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
  footerLink?: string;
};

export type Tables = Record<string, Table>;

export type TableData = RankedLeaderboardData;

export default function TablesCard({
  tablesUi,
  caption,
  className,
  showTabs = false,
}: {
  tablesUi: Tables;
  caption?: boolean;
  className?: string;
  show: [boolean, boolean]; // [showLeaderboard, showLeaderboardRVU]
  showTabs?: boolean;
}) {
  const { leaderboard } = tablesUi;

  const [data, setData] = useState<RankedLeaderboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([
      fetch(getBasePath('data/benchmark/table/leaderboard/data.json')).then(
        (res) => res.json(),
      ),
    ])
      .then(([data1]) => {
        setData(data1);
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
        <Tabs defaultValue={'Leaderboard'} className="rounded">
          {showTabs && (
            <TabsList>
              <TabsTrigger value="Leaderboard" className="rounded">
                {leaderboard.tabTitle}
              </TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="Leaderboard">
            <H6 className="mb-0!">{leaderboard.tableTitle}</H6>
            <LeaderboardTable
              rawData={data}
              tooltips={leaderboard.columnTooltips}
              headers={leaderboard.columnHeaders}
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
                  to={leaderboard.footerLink || '/about/introducing-SWE-effi'}
                  className="text-sm text-muted-foreground underline transition-all duration-300 hover:text-foreground"
                >
                  How we calculated the metrics ?
                </Link>
              </ul>
            </Note>
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  );
}
