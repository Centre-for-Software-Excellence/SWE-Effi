import { lazy, Suspense } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Github } from '@/components/common/icons';
import { StaggeredContent } from '@/components/common/staggered-content';
import { Button } from '@/components/common/ui/button';
import { Divider } from '@/components/common/ui/divider';
import CitationCard from '@/components/docs/benchmark/citation-card';
import Leaderboard from '@/components/docs/benchmark/leaderboard';
import PartnersCard from '@/components/docs/benchmark/partners-card';
import { H1, P } from '@/components/md';

const AnalyticsCard = lazy(
  () => import('@/components/docs/benchmark/analytics-card'),
);

export default function Page() {
  const navigate = useNavigate();
  return (
    <StaggeredContent>
      <div className="flex h-full w-full flex-col space-y-8 pb-18 font-sans">
        <H1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600/85 bg-clip-text text-center leading-tight font-extrabold! tracking-tight text-transparent md:text-5xl! dark:from-zinc-500/80 dark:via-zinc-200 dark:to-zinc-300">
          Holistic Evaluation of LLM-Based SWE Scaffolds
        </H1>
        <P className="text-center">Lead description about the leaderboard...</P>
        <div className="mb-0 flex w-full flex-wrap justify-center gap-4 px-4 py-2 sm:px-2 md:gap-8">
          <Button
            variant="default"
            size="lg"
            className="h-12 w-full rounded-full bg-foreground text-xl text-background transition-all duration-300 hover:scale-110 hover:border hover:border-foreground hover:bg-background hover:text-foreground xs:w-36"
            onClick={() => {
              navigate('/docs/benchmark/agent-scaffold-blog');
            }}
          >
            <BookOpen />
            <span>About</span>
          </Button>
          <Button
            variant="default"
            className="h-12 w-full rounded-full bg-foreground text-xl text-background transition-all duration-300 hover:scale-110 hover:border hover:border-foreground hover:bg-background hover:text-foreground xs:w-36"
            size="lg"
          >
            <Github />
            <span>Github</span>
          </Button>
          <Button
            variant="default"
            className="h-12 w-full rounded-full bg-foreground text-xl text-background transition-all duration-300 hover:scale-110 hover:border hover:border-foreground hover:bg-background hover:text-foreground xs:w-36"
            size="lg"
            onClick={() => {
              navigate('/docs/guide/update-site-data');
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Submit
          </Button>
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
