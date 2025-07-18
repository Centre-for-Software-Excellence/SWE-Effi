import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { StaggeredContent } from '@/components/common/staggered-content';
import { Button } from '@/components/common/ui/button';
import { Divider } from '@/components/common/ui/divider';
import CitationCard from '@/components/docs/leaderboard/citation-card';
import PartnersCard from '@/components/docs/leaderboard/partners-card';
import TablesCard from '@/components/docs/leaderboard/tables-card';
import { H1, P } from '@/components/md';
import { getLeaderboardUIConfig } from '@/config/ui/leaderboard';
import { cn } from '@/lib/utils';

const AnalyticsCard = lazy(
  () => import('@/components/docs/leaderboard/analytics-card'),
);

export default function Page() {
  const navigate = useNavigate();
  const ui = getLeaderboardUIConfig();
  return (
    <StaggeredContent>
      <div className="flex h-full w-full flex-col space-y-8 pb-18 font-sans">
        <img
          src="/SWE-Effi/logos/swe-effi.png"
          alt="SWE-Effi"
          className="mx-auto h-16 w-auto sm:h-20 md:h-24 lg:h-28"
        />

        <H1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600/85 bg-clip-text text-center leading-tight font-extrabold! tracking-tight text-transparent md:text-5xl! dark:from-zinc-500/80 dark:via-zinc-200 dark:to-zinc-300">
          {ui.title}
        </H1>
        <P className="text-center">{ui.description}</P>
        <div className="mb-0 flex w-full flex-wrap justify-center gap-4 px-4 py-2 sm:px-2 md:gap-8">
          {ui.buttonLinks?.map(
            ({ title, href: link, external, icon: Icon, disabled }, idx) => (
              <Button
                disabled={disabled}
                key={title + idx}
                variant="default"
                size="lg"
                className={cn(
                  'h-12 w-full rounded-full bg-foreground text-xl text-background transition-all duration-300 xs:w-36',
                  !disabled &&
                    'hover:scale-110 hover:border hover:border-foreground hover:bg-background hover:text-foreground',
                )}
                onClick={() => {
                  if (external) {
                    window.open(link, '_blank', 'noopener,noreferrer');
                    return;
                  }
                  navigate(link);
                }}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {title}
              </Button>
            ),
          )}
        </div>
        <Divider className="my-16" />
        <TablesCard tablesUi={ui.tables} caption={false} show={[true, true]} />
        <Divider className="my-18" />
        <Suspense fallback={<div className="h-96 w-full" />}>
          <AnalyticsCard />
        </Suspense>
        <Divider className="mb-16" />
        <CitationCard />
        <Divider className="mt-16" />
        <PartnersCard />
      </div>
    </StaggeredContent>
  );
}
