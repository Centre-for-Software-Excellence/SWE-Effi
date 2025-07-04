import { JSX } from 'react';
import {
  BookOpenText,
  ExternalLink,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

import { Github } from '@/components/common/icons';
import { type Link } from '.';

type TsxIcon = (props: any) => JSX.Element;
type ButtonLink = Link & {
  icon?: LucideIcon | TsxIcon;
};

// type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

interface LeaderboardUIConfig {
  title: string;
  description: string;
  buttonLinks: ButtonLink[];
  analytics: {
    title?: string;
    description?: string;
    resolveRateChartTitle: string;
    resolveRateChartDescription: string;
    resolveRateChartOverview: string;
    resolveRateChartInsight: string;
    callsBarChartTitle: string;
    callsBarChartDescription: string;
    callsBarChartOverview: string;
    callsBarChartInsight: string;
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
    resolveRateChartTitle: 'Resolve Rate',
    resolveRateChartDescription:
      'Lead description about the resolve rate chart...',
    resolveRateChartOverview: 'Overview of the resolve rate chart...',
    resolveRateChartInsight: 'Insight about the resolve rate chart...',
    callsBarChartTitle: 'Calls Bar Chart',
    callsBarChartDescription: 'Lead description about the calls bar chart...',
    callsBarChartOverview: 'Overview of the calls bar chart...',
    callsBarChartInsight: 'Insight about the calls bar chart...',
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
