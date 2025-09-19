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
    resolveRateLineChart: ChartProps & {
      highlightedLines?: string[];
    };
    normalizedTimeLineChart: ChartProps;
    numCallsBarChart: ChartProps;
    timePercentageBarChart: ChartProps;
    costBarChart: ChartProps;
    metricsRadarChart: ChartProps;
    callsInputScatterChart: ChartProps;
  };
  citation: {
    citationTitle?: string;
    citationDescription?: string;
    bibtex?: string;
    apa?: string;
  };
}

export const getLeaderboardUIConfig = (): LeaderboardUIConfig => ({
  title:
    'SWE-Effi: Holistic Effectiveness Evaluation of AI Systems Under Resource Constraints', // main title
  description:
    'We introduce SWE-Effi, a new leaderboard and metrics to re-evaluate AI agent systems in terms of holistic effectiveness scores beyond simple resolve rate. Focusing on software engineering, our proposed evaluation offers deeper insights into the balance between the resolve rate (the outcome) and the resources consumed (token cost and execution time).', // main description
  // links for the buttons in the header
  buttonLinks: [
    {
      title: 'About',
      href: '/about/introducing-SWE-effi',
      icon: Newspaper,
    },
    {
      title: 'Github',
      href: 'https://github.com/Centre-for-Software-Excellence/SWE-Effi',
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
      href: 'https://arxiv.org/abs/2509.09853',
      external: true,
      icon: BookOpenText,
    },
  ],
  // leaderboard tables configuration
  tables: {
    leaderboard: {
      caption:
        'Table 1 - An overall comparison of AI systems (combinations of agent scaffolds and models) across the token usage, duration, and LLM API call metrics. Note that AI systems can consume a lot of resources, but still have high effectiveness under the resource-specific budget due to a higher number of issues being resolved within a smaller resource budget.',
      tabTitle: 'Effectiveness Evaluation',
      tableTitle: 'AI system comparison on SWE-bench tasks',
      filterPlaceholder: 'Filter models...',
      // if the tooltips is "" or not defined, the tooltip will not be shown
      columnHeaders: {
        rank: 'Rank',
        scaffold: 'Scaffold',
        model: 'Base Model',
        tokenEfficiency: 'EuTB',
        costEfficiency: 'EuCB',
        gpuEfficiency: 'EuITB',
        cpuEfficiency: 'EuCTB',
        resolveRate: 'Resolve Rate',
        precision: 'Precision',

        duration: 'Mean Normalized Time',
        avgDuration: 'Mean Normalized Time (Total)',
        avgDurationR: 'Mean Normalized Time (Resolved)',
        avgDurationU: 'Mean Normalized Time (Unresolved)',

        CPUTime: 'Mean CPU Time',
        avgCPUTime: 'Mean CPU Time (Total)',
        avgCPUTimeR: 'Mean CPU Time (Resolved)',
        avgCPUTimeU: 'Mean CPU Time (Unresolved)',

        infTime: 'Mean Normalized Inference Time',
        avgInfTime: 'Mean Normalized Inference Time (Total)',
        avgInfTimeR: 'Mean Normalized Inference Time (Resolved)',
        avgInfTimeU: 'Mean Normalized Inference Time (Unresolved)',

        inputTokens: 'Mean Input Tokens',
        avgInputTokens: 'Mean Input Tokens (Total)',
        avgInputTokensR: 'Mean Input Tokens (Resolved)',
        avgInputTokensU: 'Mean Input Tokens (Unresolved)',

        outputTokens: 'Mean Output Tokens',
        avgOutputTokens: 'Mean Output Tokens (Total)',
        avgOutputTokensR: 'Mean Output Tokens (Resolved)',
        avgOutputTokensU: 'Mean Output Tokens (Unresolved)',

        llmRequests: 'Mean LLM Calls',
        avgLLMRequests: 'Mean LLM Calls (Total)',
        avgLLMRequestsR: 'Mean LLM Calls (Resolved)',
        avgLLMRequestsU: 'Mean LLM Calls (Unresolved)',

        total: 'Total',
        resolved: 'Resolved',
        unresolved: 'Unresolved',
      },
      columnTooltips: {
        rank: '',
        scaffold: '',
        model: '',
        gpuEfficiency: 'Effectiveness under Inference Time Budget',
        cpuEfficiency: 'Effectiveness under CPU Time Budget',
        costEfficiency: 'Effectiveness under Cost Budget',
        tokenEfficiency: 'Effectiveness under Token Budget',
        resolveRate:
          'Number of generated patches that correctly resolved the issue',
        precision: 'Precision of the generated patches',

        duration: 'Mean normalized duration per instance',
        avgDuration: '',
        avgDurationR: '',
        avgDurationU: '',

        CPUTime: 'Mean CPU task duration per instance',
        avgCPUTime: '',
        avgCPUTimeR: '',
        avgCPUTimeU: '',

        infTime:
          'Normalized Inference Time (NIM): Mean Normalized Inference Time (NIM) per instance',
        avgInfTime: '',
        avgInfTimeR: '',
        avgInfTimeU: '',

        inputTokens: 'Mean number of input tokens used for single issue',
        avgInputTokens: '',
        avgInputTokensR: '',
        avgInputTokensU: '',

        outputTokens: 'Mean number of output tokens used for single issue',
        avgOutputTokens: '',
        avgOutputTokensR: '',
        avgOutputTokensU: '',

        llmRequests: 'Mean number of LLM API calls per instance',
        avgLLMRequests: '',
        avgLLMRequestsR: '',
        avgLLMRequestsU: '',
      },
      footerTitle:
        'Ranked by the Effectiveness under Inference Time Budget (EuITB) by default',
      footerDescription:
        'Used a subset of 50 issues randomly drawn from the well-respected SWE-bench-Verified dataset. To ensure this subset was a fair representation of the whole, we used stratified sampling, preserving the original distribution of issues across different software projects.',
      footers: [
        'Effectiveness Under Token Budget (EuTB) - Measures how well the AI system performs under a capped number of LLM input/output tokens. This reflects the effectiveness of AI system at using the LLM-generated tokens, independent of fluctuating API prices. Calculated as the AUC of the resolve rate vs. total tokens per issue curve (up to 2M total tokens cap).',
        'Effectiveness under Cost Budget (EuCB) - Evaluates how efficiently the AI system uses monetary cost due to LLM usage costs, with regards to the issue resolution performance. Calculated as the AUC of the resolve rate vs. dollar cost per issue curve, capped at $1.00 USD.',
        'Effectiveness under CPU Time Budget (EuCTB) - Measures real-world time efficiency by assessing how much issue resolution progress an AI system makes per CPU time spent. This captures the impact of auxiliary logic like patch validation or test execution. AUC of resolve rate vs. CPU time per issue, capped at 30 minutes.',
        'Effectiveness under Inference Time Budget (EuITB) - Focuses on LLM-side latency efficiency, measuring how well the AI system uses its LLM inference time to make progress. Computed as AUC of resolve rate vs. normalized inference time per issue, also capped at 30 minutes. Unlike EuCB, this isolates LLM latency from pricing volatility.',
      ],
      footerLink: '/about/introducing-SWE-effi#accuracy-metrics',
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
      highlightedLines: [
        'auto-code-rover/qwen3-32B',
        'swe-agent/GPT-4o-mini-2024-07-18',
      ],
    },
    normalizedTimeLineChart: {
      title: 'Resolve rate vs. Normalized total time',
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
        'How many LLM requests did the scaffold use to attempt to issue resolution.',
      overview: 'Overview of the number of calls bar chart...',
      insight: 'Insight about the number of calls bar chart...',
      xAxisLabel: 'Scaffold',
      yAxisLabel: 'Number of Calls',
      // ignore this
      xAxisDataKey: 'scaffold',
    },
    timePercentageBarChart: {
      title: 'AI System Architecture Fingerprint: Where Does the Time Go? ',
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
        'How many tokens did the AI system use on successfully resolved instances compared to failed attempts.',
      overview: 'Overview of the cost bar chart...',
      insight: 'Insight about the cost bar chart...',
      xAxisLabel: 'Average Token Cost (Log Scale)',
      yAxisLabel: '',
      // ignore this
      yAxisDataKey: 'scaffold-model',
    },
    metricsRadarChart: {
      title: 'Effectiveness in multiple dimensions',
      description:
        'How efficient is the AI system in terms of resolving issues (resolve rate), use of tokens (EuTB), monetary cost (EuCB), use of local resources (EuCTB), and LLM inference duration (EuITB). Measured in normalized AUC (Area Under Curve). Higher is better.',
      overview: 'Overview of the metrics radar chart...',
      insight: 'Insight about the metrics radar chart...',
      // ignore this
      polarAngleAxisDataKey: 'metric',
    },
    callsInputScatterChart: {
      title: 'Input Tokens vs. LLM Calls',
      description:
        'How many input tokens did the agent scaffold use to attempt to issue resolution across the number of LLM calls made.',
      overview: '',
      insight: 'Insight about the calls input scatter chart...',
      xAxisLabel: '# of LLM Calls per instance',
      yAxisLabel: 'Total Input Tokens',
      // ignore this
      xAxisDataKey: 'llmCalls',
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
