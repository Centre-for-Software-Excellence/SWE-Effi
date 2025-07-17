import { JSX } from 'react';
import {
  BookOpenText,
  ExternalLink,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

import { Github } from '@/components/common/icons';
import { ChartProps } from '@/components/docs/leaderboard/chart/types';
import { Tables } from '@/components/docs/leaderboard/tables-card';
import { type Link } from '.';

type TsxIcon = (props: any) => JSX.Element;
type ButtonLink = Link & {
  icon?: LucideIcon | TsxIcon;
};

interface LeaderboardUIConfig {
  title: string;
  description: string;
  buttonLinks: ButtonLink[];
  tables: Tables;
  analytics: {
    title?: string;
    description?: string;
    resolveRateLineChart: ChartProps;
    numCallsBarChart: ChartProps;
    timePercentageBarChart: ChartProps;
    costBarChart: ChartProps;
    metricsRadarChart: ChartProps;
  };
  citation: {
    citationTitle?: string;
    citationDescription?: string;
    bibtex?: string;
    apa?: string;
  };
}

export const getLeaderboardUIConfig = (): LeaderboardUIConfig => ({
  title: 'Holistic Evaluation of LLM-Based SWE Scaffolds', // main title
  description: 'Lead description of the leaderboard...', // main description
  // links for the buttons in the header
  buttonLinks: [
    {
      title: 'About',
      href: '/benchmark/agent-scaffold-blog',
      icon: Newspaper,
    },
    {
      title: 'Github',
      href: 'https://github.com/Center-for-Software-Excellence/SWE-Lens',
      external: true,
      icon: Github,
    },
    {
      title: 'Submit',
      href: '/guide/update-site-data',
      icon: ExternalLink,
    },
    {
      title: 'Paper',
      href: '#',
      icon: BookOpenText,
      disabled: true,
    },
  ],
  // leaderboard tables configuration
  tables: {
    leaderboard: {
      caption: 'Table 1: Scaffold comparison on SWE-bench tasks',
      tabTitle: 'Table 1',
      tableTitle: 'Scaffold comparison on SWE-bench tasks',
      filterPlaceholder: 'Filter models...',
      // if the tooltips is "" or not defined, the tooltip will not be shown
      columnTooltips: {
        rank: 'Ranked by resolve rate',
        scaffold: '',
        model: '',
        total: '',
        cpuTime: '',
        inputToken: 'Number of Input tokens in thousands',
        outputToken: 'Number of Output tokens in thousands',
        calls: 'Number of inference calls to the LLM',
        infTime: '',
        resolveRate:
          'Number of generated patches that correct resolved the issue',
        precision: 'Precision of the generated patches',
      },
    },
    leaderboardRVU: {
      caption:
        'Table 2: Token and time costs for resolved and unresolved instances',
      tabTitle: 'Table 2',
      tableTitle: 'Token and time costs for resolved and unresolved instances',
      filterPlaceholder: 'Filter models...',
      // if the tooltips is "" or not defined, the tooltip will not be shown
      columnTooltips: {
        rank: 'Ranked by total time resolved',
        scaffold: '',
        model: '',
        avgTotalTimeU: '',
        avgTotalTimeR: '',
        avgCPUTimeU: '',
        avgCPUTimeR: '',
        avgInfTimeU: '',
        avgInfTimeR: '',
        avgTotalTokensU: '',
        avgTotalTokensR: '',
        avgLLMRequestsU: '',
        avgLLMRequestsR: '',
      },
    },
  },
  analytics: {
    title: 'Analytics',
    description: 'Lead description about the analytics...',
    resolveRateLineChart: {
      title: 'Resolve Rate Line Chart',
      description: 'Lead description about the resolve rate line chart...',
      overview: 'Overview of the resolve rate line chart...',
      insight: 'Insight about the resolve rate line chart...',
      xAxisLabel: 'Total Tokens (input + output, in millions)',
      yAxisLabel: 'Resolve Rate',
      // ignore this
      xAxisDataKey: 'totalTokens',
    },
    numCallsBarChart: {
      title: 'Number of Calls Bar Chart',
      description: 'Lead description about the number of calls bar chart...',
      overview: 'Overview of the number of calls bar chart...',
      insight: 'Insight about the number of calls bar chart...',
      xAxisLabel: 'Scaffold',
      yAxisLabel: 'Number of Calls',
      // ignore this
      xAxisDataKey: 'scaffold',
    },
    timePercentageBarChart: {
      title: 'Agent Architecture Fingerprint: Where Does the Time Go? ',
      description: '(on average non-resolved runs)',
      overview: 'Overview of the time percentage bar chart...',
      insight: 'Insight about the time percentage bar chart...',
      xAxisLabel: 'Percentage of Total Runtime (Model Time %)',
      yAxisLabel: '',
      // ignore this
      yAxisDataKey: 'scaffold-model',
    },
    costBarChart: {
      title: 'The Cost of Success vs. The Cost of Failure',
      description: 'Lead description about the cost bar chart...',
      overview: 'Overview of the cost bar chart...',
      insight: 'Insight about the cost bar chart...',
      xAxisLabel: 'Average Token Cost (Log Scale)',
      yAxisLabel: '',
      // ignore this
      yAxisDataKey: 'scaffold-model',
    },
    metricsRadarChart: {
      title: 'Metrics Radar Chart',
      description: 'Lead description about the metrics radar chart...',
      overview: 'Overview of the metrics radar chart...',
      insight: 'Insight about the metrics radar chart...',
      // ignore this
      polarAngleAxisDataKey: 'metric',
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
