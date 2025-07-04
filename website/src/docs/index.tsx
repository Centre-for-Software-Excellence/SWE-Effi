import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { StaggeredContent } from '@/components/common/staggered-content';
import { Button } from '@/components/common/ui/button';
import { Divider } from '@/components/common/ui/divider';
import CitationCard from '@/components/docs/benchmark/citation-card';
import Leaderboard from '@/components/docs/benchmark/leaderboard';
import PartnersCard from '@/components/docs/benchmark/partners-card';
import { H1, P } from '@/components/md';
import { getLeaderboardUIConfig } from '@/config/ui/leaderboard';

const AnalyticsCard = lazy(
  () => import('@/components/docs/benchmark/analytics-card'),
);

export default function Page() {
  const navigate = useNavigate();
  const ui = getLeaderboardUIConfig();
  return (
    <StaggeredContent>
      <div className="flex h-full w-full flex-col space-y-8 pb-18 font-sans">
        <H1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600/85 bg-clip-text text-center leading-tight font-extrabold! tracking-tight text-transparent md:text-5xl! dark:from-zinc-500/80 dark:via-zinc-200 dark:to-zinc-300">
          {ui.title}
        </H1>
        <P className="text-center">{ui.description}</P>
        <div className="mb-0 flex w-full flex-wrap justify-center gap-4 px-4 py-2 sm:px-2 md:gap-8">
          {ui.buttonLinks?.map(({ title, href: link, icon: Icon }, idx) => (
            <Button
              key={title + idx}
              variant="default"
              size="lg"
              className="h-12 w-full rounded-full bg-foreground text-xl text-background transition-all duration-300 hover:scale-110 hover:border hover:border-foreground hover:bg-background hover:text-foreground xs:w-36"
              onClick={() => {
                navigate(link);
              }}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {title}
            </Button>
          ))}
        </div>
        <Divider className="mt-16" />
        <Leaderboard />
        <Divider className="my-18" />
        <Suspense fallback={<div className="h-96 w-full" />}>
          <AnalyticsCard />
        </Suspense>
        <Divider className="my-16" />
        <PartnersCard />
        <Divider />
        <CitationCard />
      </div>
    </StaggeredContent>
  );
}
