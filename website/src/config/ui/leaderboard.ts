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
      caption:
        'Beyond just the resolve rate, we quantitatively measure a number of additional metrics such token consumption, local and inference duration, and LLM usage counts to understand the efficiency of agent scaffolds.',
      tabTitle: 'Table 1',
      tableTitle: 'Scaffold comparison on SWE-bench tasks',
      filterPlaceholder: 'Filter models...',
      // if the tooltips is "" or not defined, the tooltip will not be shown
      columnTooltips: {
        rank: 'Ranked by resolve rate',
        scaffold: 'Name of the agent scaffold',
        model: 'LLM name',
        total: 'Total mean duration including CPU and inference time (seconds)',
        cpuTime: "Duration of agent scaffold's local operations (seconds)",
        inputToken:
          'Mean number of input tokens used for single issue, measured in thousands',
        outputToken:
          'Mean number of output tokens used for single issue, measured in thousands',
        calls: 'Number of inference calls to the LLM',
        infTime:
          'Normalized Inference Time (NIM): mean normalized LLM inference time per single issue (seconds)',
        resolveRate:
          'Number of generated patches that correctly resolved the issue',
        precision: 'Precision of the generated patches',
      },
    },
    leaderboardRVU: {
      caption:
        'To understand the differences between how agent scaffolds handle successful and failed issue resolution attempts, we compare agent scaffold dynamics between resolved and unresolved cases across token consumption, local/inference duration, and number of LLM requests metrics.',
      tabTitle: 'Table 2',
      tableTitle: 'Token and time costs for resolved and unresolved instances',
      filterPlaceholder: 'Filter models...',
      // if the tooltips is "" or not defined, the tooltip will not be shown
      columnTooltips: {
        rank: 'Ranked by total time resolved',
        scaffold: 'Name of the agent scaffold',
        model: 'LLM name',
        avgTotalTime: 'Mean total duration per instance',
        avgCPUTime: 'Mean CPU task duration per instance',
        avgInfTime: 'Mean Normalized Inference Time (NIM) per instance',
        avgTotalTokens: 'Mean number of total tokens used per instance',
        avgLLMRequests: 'Mean number of LLM API calls per instance',
      },
    },
  },
  analytics: {
    title: 'Analytics',
    description:
      'Here we provide an in-depth analysis on the operational dynamics of agent scaffolds beyond just the resolve rate, with quantitative measurements and comparison between different metrics',
    resolveRateLineChart: {
      title: 'Resolve rate vs. total tokens used',
      description:
        'Issue resolve rate across the number of total tokens used per issue (in millions of tokens).',
      overview: '',
      insight: 'Insight about the resolve rate line chart...',
      xAxisLabel: 'Total Tokens (input tokens + output tokens) (Millions)',
      yAxisLabel: 'Resolve Rate',
      // ignore this
      xAxisDataKey: 'totalTokens',
    },
    numCallsBarChart: {
      title: 'Mean Num. of LLM calls per instance',
      description:
        'How many times did the agent scaffold use an LLM to attempt issue resolution',
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
      description:
        'How many tokens did the agent scaffold use on successfully resolved instances compared to failed attempts.',
      overview: 'Overview of the cost bar chart...',
      insight: 'Insight about the cost bar chart...',
      xAxisLabel: 'Average Token Cost (Log Scale)',
      yAxisLabel: '',
      // ignore this
      yAxisDataKey: 'scaffold-model',
    },
    metricsRadarChart: {
      title: 'Efficiency in multiple dimensions',
      description:
        'How efficient is the agent scaffold in terms of resolving issues, use of tokens, monetary cost, use of local resources, and LLM inference duration. Measured in normalized AUC (Area Under Curve).',
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
