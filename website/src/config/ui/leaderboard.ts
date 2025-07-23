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
    blogLink?: string;
    resolveRateLineChart: ChartProps;
    normalizedTimeLineChart: ChartProps;
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
  title: 'SWE-Effi: Holistic Efficiency Evaluation of LLM-Based SWE Scaffolds', // main title
  description:
    'We introduce SWE-Effi, a new leaderboard that re-evaluates agents based on holistic efficiency scores beyond simple resolve rate, offering a deeper insights into the balance between resolve rate (the outcome) and the resources consumed (token cost and execution time). ', // main description
  // links for the buttons in the header
  buttonLinks: [
    {
      title: 'About',
      href: '/about/introducing-SWE-effi',
      icon: Newspaper,
    },
    {
      title: 'Github',
      href: 'https://github.com/Center-for-Software-Excellence/SWE-Effi',
      external: true,
      icon: Github,
    },
    {
      title: 'Submit',
      href: '/about/submit-your-entry',
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
        'Table -  An overall comparison of agent scaffolds and models across the token usage, duration, and LLM API call metrics',
      tabTitle: 'Efficiency Evaluation',
      tableTitle: 'Scaffold comparison on SWE-bench tasks',
      filterPlaceholder: 'Filter models...',
      // if the tooltips is "" or not defined, the tooltip will not be shown
      columnHeaders: {
        rank: 'Rank',
        scaffold: 'Scaffold',
        model: 'Base Model',
        tokenEfficiency: 'Token Efficiency',
        costEfficiency: 'Cost Efficiency',
        gpuEfficiency: 'Inference Efficiency',
        cpuEfficiency: 'CPU Efficiency',
        resolveRate: 'Resolve Rate',
        precision: 'Precision',

        duration: 'Mean Normalized Time',
        avgDuration: 'Total',
        avgDurationR: 'Resolved',
        avgDurationU: 'Unresolved',

        CPUTime: 'Mean CPU Time',
        avgCPUTime: 'Total',
        avgCPUTimeR: 'Resolved',
        avgCPUTimeU: 'Unresolved',

        infTime: 'Mean Normalized Inference Time',
        avgInfTime: 'Total',
        avgInfTimeR: 'Resolved',
        avgInfTimeU: 'Unresolved',

        inputTokens: 'Mean Input Tokens',
        avgInputTokens: 'Total',
        avgInputTokensR: 'Resolved',
        avgInputTokensU: 'Unresolved',

        outputTokens: 'Mean Output Tokens',
        avgOutputTokens: 'Total',
        avgOutputTokensR: 'Resolved',
        avgOutputTokensU: 'Unresolved',

        llmRequests: 'Mean LLM Calls',
        avgLLMRequests: 'Total',
        avgLLMRequestsR: 'Resolved',
        avgLLMRequestsU: 'Unresolved',
      },
      columnTooltips: {
        rank: '',
        scaffold: 'Name of the agent scaffold',
        model: 'LLM name',
        gpuEfficiency: '',
        cpuEfficiency: '',
        costEfficiency: '',
        tokenEfficiency: '',
        resolveRate:
          'Number of generated patches that correctly resolved the issue',
        precision: 'Precision of the generated patches',

        avgDuration: 'Mean normalized duration per instance',
        avgDurationR: '',
        avgDurationU: '',

        avgCPUTime: 'Mean CPU task duration per instance',
        avgCPUTimeR: '',
        avgCPUTimeU: '',

        avgInfTime:
          'Normalized Inference Time (NIM): Mean Normalized Inference Time (NIM) per instance',
        avgInfTimeR: '',
        avgInfTimeU: '',

        avgInputTokens: 'Mean number of input tokens used for single issue',
        avgInputTokensR: '',
        avgInputTokensU: '',

        avgOutputTokens: 'Mean number of output tokens used for single issue',
        avgOutputTokensR: '',
        avgOutputTokensU: '',

        avgLLMRequests: 'Mean number of LLM API calls per instance',
        avgLLMRequestsR: '',
        avgLLMRequestsU: '',
      },
      footerTitle: 'Ranked by highest token efficiency AUC by default',
      footerDescription:
        'Used a subset of 50 issues randomly drawn from the well-respected SWE-bench-Verified dataset. To ensure this subset was a fair representation of the whole, we used stratified sampling, preserving the original distribution of issues across different software projects.',
      footers: [
        "Inference Efficiency (AUC) - Measures the agent's LLM-related latency, standardized across different hardware backends",
        "CPU Efficiency (AUC) - Measures the performance of the agent's local logic, independent of the LLM. This reveals the framework's own overhead.",
        "Cost Efficiency (AUC) - Assesses the agent's real-world financial viability. While closely related to token usage, this metric translates tokens into a standardized dollar value, making the cost tangible and directly comparable to development budgets.",

        'Token Efficiency (AUC) - Measures how effectively an agent uses LLM tokens. This reflects the core computational work required by the LLM, independent of fluctuating API prices.',
      ],
      footerLink: '/about/introducing-SWE-effi#experimental-settings',
    },
  },
  analytics: {
    title: 'Analytics',
    description:
      'Here are some visualization highlights of our analysis, for more details please read our ',
    blogLink: '/about/introducing-SWE-effi',
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
    normalizedTimeLineChart: {
      title: 'Resolve rate vs. Normalized Time',
      description:
        'Issue resolve rate across the normalized time taken to resolve the issue.',
      overview: '',
      insight: '',
      xAxisLabel: 'Normalized Time (seconds)',
      yAxisLabel: 'Resolve Rate',
      xAxisDataKey: 'duration',
    },
    numCallsBarChart: {
      title: 'Mean Num. of LLM calls per instance',
      description:
        'How many LLM requests did the agent scaffold use to attempt to issue resolution.',
      overview: 'Overview of the number of calls bar chart...',
      insight: 'Insight about the number of calls bar chart...',
      xAxisLabel: 'Scaffold',
      yAxisLabel: 'Number of Calls',
      // ignore this
      xAxisDataKey: 'scaffold',
    },
    timePercentageBarChart: {
      title: 'Agent Architecture Fingerprint: Where Does the Time Go? ',
      description: '(on average)',
      overview: 'Overview of the time percentage bar chart...',
      insight: 'Insight about the time percentage bar chart...',
      xAxisLabel: 'Percentage of Total Runtime (%)',
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
        'How efficient is the agent scaffold in terms of resolving issues, use of tokens, monetary cost, use of local resources, and LLM inference duration. Measured in normalized AUC (Area Under Curve). Higher is better.',
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
