import { JSX } from 'react';
import {
  BookOpenText,
  ExternalLink,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

import { Github } from '@/components/common/icons';
import { ChartProps } from '@/components/docs/leaderboard/chart/types';
import { type Link } from '.';

type TsxIcon = (props: any) => JSX.Element;
type ButtonLink = Link & {
  icon?: LucideIcon | TsxIcon;
};

interface LeaderboardUIConfig {
  title: string;
  description: string;
  buttonLinks: ButtonLink[];
  analytics: {
    title?: string;
    description?: string;
    resolveRateLineChart: ChartProps;
    numCallsBarChart: ChartProps;
  };
  citation: {
    citationTitle?: string;
    citationDescription?: string;
    bibtex?: string;
    apa?: string;
  };
}

export const getLeaderboardUIConfig = (): LeaderboardUIConfig => ({
  title: 'Holistic Evaluation of LLM-Based SWE Scaffolds',
  description: 'Lead description of the leaderboard...',
  buttonLinks: [
    {
      title: 'About',
      href: '/docs/benchmark/agent-scaffold-blog',
      icon: Newspaper,
    },
    {
      title: 'Github',
      href: 'https://github.com/Center-for-Software-Excellence/SWE-Lens',
      icon: Github,
    },
    {
      title: 'Submit',
      href: '/docs/guide/update-site-data',
      icon: ExternalLink,
    },
    {
      title: 'Paper',
      href: '#',
      icon: BookOpenText,
      disabled: true,
    },
  ],
  analytics: {
    title: 'Analytics',
    description: 'Lead description about the analytics...',
    resolveRateLineChart: {
      title: 'Resolve Rate Line Chart',
      description: 'Lead description about the resolve rate line chart...',
      overview: 'Overview of the resolve rate line chart...',
      insight: 'Insight about the resolve rate line chart...',
      xAxisLabel: 'Total Tokens (input tokens + output tokens) (1e6)',
      yAxisLabel: 'Resolve Rate (Resolved Instances/500)',
      xAxisDataKey: 'totalTokens',
    },
    numCallsBarChart: {
      title: 'Number of Calls Bar Chart',
      description: 'Lead description about the number of calls bar chart...',
      overview: 'Overview of the number of calls bar chart...',
      insight: 'Insight about the number of calls bar chart...',
      xAxisLabel: 'Scaffold',
      yAxisLabel: 'Number of Calls',
      xAxisDataKey: 'scaffold',
    },
  },
  citation: {
    citationTitle: 'Citation',
    citationDescription: 'Lead description about the citation...',
    bibtex: `@misc{xxxx2025, 
    title={Holistic Evaluation of LLM-Based SWE Scaffolds},
    author={xxx Team}, 
    year={2025},
    url={https://xxx},
    note={Accessed: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}}
}`,
    apa: `some apa citation here`,
  },
});
