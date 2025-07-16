import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ChartConfig } from '@/components/common/ui/chart';
import { ChartData as CallsEntry } from '@/components/docs/leaderboard/chart/calls-bar-chart';
import { ChartData as CostEntry } from '@/components/docs/leaderboard/chart/cost-bar-chart';
import { ChartData as MetricEntry } from '@/components/docs/leaderboard/chart/metrics-radar-chart';
import { ChartData as ResolveRateEntry } from '@/components/docs/leaderboard/chart/resolve-rate-line-chart';
import { ChartData as TimePercentageEntry } from '@/components/docs/leaderboard/chart/time-percentage-bar-chart';
import { LeaderboardData } from '@/components/docs/leaderboard/table/columns';
import { LeaderboardRVUData } from '@/components/docs/leaderboard/table/columns-rvu';
import { tokens } from '@/styles/tokens';
import { createColorGenerator } from '../utils';
import { rankLeaderboardData, rankLeaderboardRVUData } from './get';

const DRYRUN = false;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface InputData {
  input_tokens?: number;
  output_tokens?: number;
  llm_calls?: number;
  duration?: number;
  resolved?: boolean;
  cpu_time?: number;
  gpu_time?: number;
  measured_gpu_time?: number;
  measured_duration?: number;
  [key: string]: number | boolean | string | undefined;
}

interface SummaryInputData {
  total_projects: number;
  total_tokens: number;
  avg_total_tokens: number;
  resolved: number;
  avg_resolved: number;
  input_tokens: number;
  avg_input_tokens: number;
  output_tokens: number;
  avg_output_tokens: number;
  llm_calls: number;
  avg_llm_calls: number;
  cpu_time: number;
  avg_cpu_time: number;
  gpu_time: number;
  avg_gpu_time: number;
  duration: number;
  avg_duration: number;
  measured_gpu_time: number;
  avg_measured_gpu_time: number;
  measured_duration: number;
  avg_measured_duration: number;
  resolved_total_input_tokens: number;
  resolved_avg_input_tokens: number;
  resolved_total_output_tokens: number;
  resolved_avg_output_tokens: number;
  resolved_total_llm_calls: number;
  resolved_avg_llm_calls: number;
  resolved_total_cpu_time: number;
  resolved_avg_cpu_time: number;
  resolved_total_gpu_time: number;
  resolved_avg_gpu_time: number;
  resolved_total_duration: number;
  resolved_avg_duration: number;
  resolved_total_measured_gpu_time: number;
  resolved_avg_measured_gpu_time: number;
  resolved_total_measured_duration: number;
  resolved_avg_measured_duration: number;
  unresolved_total_input_tokens: number;
  unresolved_avg_input_tokens: number;
  unresolved_total_output_tokens: number;
  unresolved_avg_output_tokens: number;
  unresolved_total_llm_calls: number;
  unresolved_avg_llm_calls: number;
  unresolved_total_cpu_time: number;
  unresolved_avg_cpu_time: number;
  unresolved_total_gpu_time: number;
  unresolved_avg_gpu_time: number;
  unresolved_total_duration: number;
  unresolved_avg_duration: number;
  unresolved_total_measured_gpu_time: number;
  unresolved_avg_measured_gpu_time: number;
  unresolved_total_measured_duration: number;
  unresolved_avg_measured_duration: number;
  precision: number;
  token_efficiency_auc: number;
  cost_efficiency_auc: number;
  cpu_efficiency_auc: number;
  gpu_efficiency_auc: number;
}

export type ChartName =
  | 'resolve-rate-line'
  | 'calls-bar'
  | 'time-percentage-bar'
  | 'cost-bar'
  | 'metrics-radar';

// color generator helper

// write files helper
function writeJSON(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function buildResolveRateLineChart(opts?: {
  rawDir?: string;
  outDir?: string;
}) {
  const nextColor = createColorGenerator(tokens.d3);
  const rawDir =
    opts?.rawDir ?? path.join(__dirname, '../../../public/data/benchmark/raw');
  const outDir =
    opts?.outDir ??
    path.join(__dirname, '../../../public/data/benchmark/chart');

  const resolveCfg: ChartConfig = {};
  const resolveData: ResolveRateEntry[] = [];

  const jsonFiles = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const filePath = path.join(rawDir, file);

    let records: InputData[];
    try {
      records = Object.values(JSON.parse(fs.readFileSync(filePath, 'utf8')));
    } catch (e) {
      console.error(`Could not parse ${file}:`, e);
      continue;
    }

    const [scaffold, model] = path.basename(file, '.json').split('_');
    const seriesName = `${scaffold}/${model}`;

    // resolve rate data
    let resolvedSoFar = 0;
    records
      .map((r) => ({
        totalTokens: r?.input_tokens || 0 + (r?.output_tokens || 0),
        resolved: r.resolved,
      }))
      .sort((a, b) => a.totalTokens - b.totalTokens)
      .forEach(({ totalTokens, resolved }) => {
        if (resolved) resolvedSoFar++;
        resolveData.push({
          totalTokens: totalTokens / 1e6,
          [seriesName]: resolvedSoFar / records.length,
        });
      });

    if (!resolveCfg[seriesName]) {
      resolveCfg[seriesName] = {
        label: seriesName,
        color: nextColor(),
      };
    }
  }

  if (DRYRUN) {
    console.log(
      `Dry run: would write ${resolveData.length} resolve rate entries`,
    );
    writeJSON(
      path.join(outDir, 'tmp/resolve-rate-line/chart-data.json'),
      resolveData,
    );
    writeJSON(
      path.join(outDir, 'tmp/resolve-rate-line/chart-config.json'),
      resolveCfg,
    );
  } else {
    console.log(`Writing ${resolveData.length} resolve rate entries`);
    const rrDirName: ChartName = 'resolve-rate-line';
    writeJSON(path.join(outDir, `${rrDirName}/chart-data.json`), resolveData);
    writeJSON(path.join(outDir, `${rrDirName}/chart-config.json`), resolveCfg);
  }
}

export function buildCallsBarChart(opts?: {
  rawDir?: string;
  outDir?: string;
}) {
  const barColorNext = createColorGenerator(tokens.chartjs);
  const rawDir =
    opts?.rawDir ??
    path.join(__dirname, '../../../public/data/benchmark/raw/summary');
  const outDir =
    opts?.outDir ??
    path.join(__dirname, '../../../public/data/benchmark/chart');

  const callsCfg: ChartConfig = {};
  let callsData: CallsEntry[] = [];

  const jsonFiles = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const filePath = path.join(rawDir, file);

    let record: SummaryInputData;
    try {
      record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`Could not parse ${file}:`, e);
      continue;
    }

    const [scaffold, model] = path.basename(file, '.json').split('_');

    const entry: CallsEntry = callsData.find(
      (e) => e.scaffold === scaffold,
    ) || {
      scaffold,
    };
    entry[model] = record.llm_calls || 0;
    callsData = [...callsData.filter((e) => e.scaffold !== scaffold), entry];

    if (!callsCfg[model]) {
      callsCfg[model] = { label: model, color: barColorNext() };
    }
  }

  if (DRYRUN) {
    console.log(`Dry run: would write ${callsData.length} calls entries.`);
    writeJSON(path.join(outDir, 'tmp/calls-bar/chart-data.json'), callsData);
    writeJSON(path.join(outDir, 'tmp/calls-bar/chart-config.json'), callsCfg);
  } else {
    console.log(`Writing ${callsData.length} calls entries.`);
    const callsDirName: ChartName = 'calls-bar';
    writeJSON(path.join(outDir, `${callsDirName}/chart-data.json`), callsData);
    writeJSON(path.join(outDir, `${callsDirName}/chart-config.json`), callsCfg);
  }
}

export function buildSummaryCharts(opts?: {
  rawDir?: string;
  outDir?: string;
}) {
  const nextColor = createColorGenerator(tokens.chartjs);
  const nextRadarColor = createColorGenerator(tokens.chartjs);
  const rawDir =
    opts?.rawDir ??
    path.join(__dirname, '../../../public/data/benchmark/raw/summary');
  const outDir =
    opts?.outDir ??
    path.join(__dirname, '../../../public/data/benchmark/chart');

  const color1 = nextColor();
  const color2 = nextColor();

  const timePercentageCfg: ChartConfig = {
    'cpu-time': {
      label: 'CPU Time %',
      color: color1,
    },
    'gpu-time': {
      label: 'GPU Time %',
      color: color2,
    },
  };

  const timePercentageData: TimePercentageEntry[] = [];
  const costCfg: ChartConfig = {
    'success-cost': {
      label: 'Success Cost',
      color: color1,
    },
    'failure-cost': {
      label: 'Failure Cost',
      color: color2,
    },
  };
  const costData: CostEntry[] = [];

  const metricsCfg: ChartConfig = {};
  const metricsData: MetricEntry[] = [
    {
      metric: 'Resolve Rate',
    },
    {
      metric: 'Token Efficiency',
    },
    {
      metric: 'Cost Efficiency',
    },
    {
      metric: 'Cpu Efficiency',
    },
    {
      metric: 'Inference Efficiency',
    },
  ];

  const jsonFiles = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const filePath = path.join(rawDir, file);

    let record: SummaryInputData;
    try {
      record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`Could not parse ${file}:`, e);
      continue;
    }

    const [scaffold, model] = path.basename(file, '.json').split('_');
    const seriesName = `${scaffold}/${model}`;

    // time percentage data: (avg_cpu_time) / duration
    const cpuTime = record.avg_cpu_time || 0;
    const duration = record.avg_duration || 1;
    const timePercentage = Number(((cpuTime / duration) * 100).toFixed(2));
    const currentEntry = {
      'cpu-time': timePercentage,
      'gpu-time': Number((100 - timePercentage).toFixed(2)),
      'scaffold-model': seriesName,
    };
    timePercentageData.push(currentEntry);

    // cost data: (success cost: resolved_avg_input_tokens + resolved_avg_output_tokens, failure cost: unresolved_avg_input_tokens + unresolved_avg_output_tokens)
    const successCost =
      (record.resolved_avg_input_tokens || 0) +
      (record.resolved_avg_output_tokens || 0);
    const failureCost =
      (record.unresolved_avg_input_tokens || 0) +
      (record.unresolved_avg_output_tokens || 0);
    const costEntry: CostEntry = {
      'scaffold-model': seriesName,
      'success-cost': successCost,
      'failure-cost': failureCost,
    };
    costData.push(costEntry);

    // metrics data: (resolve_rage, token_efficiency, cost_efficiency, cpu_efficiency, inference_efficiency)
    for (const metric of metricsData) {
      switch (metric.metric) {
        case 'Resolve Rate':
          metric[seriesName] = (
            (record.resolved / record.total_projects) *
            100
          ).toPrecision(2);
          break;
        case 'Token Efficiency':
          metric[seriesName] = (record.token_efficiency_auc * 100).toPrecision(
            2,
          );
          break;
        case 'Cost Efficiency':
          metric[seriesName] = (record.cost_efficiency_auc * 100).toPrecision(
            2,
          );
          break;
        case 'Cpu Efficiency':
          metric[seriesName] = (record.cpu_efficiency_auc * 100).toPrecision(2);
          break;
        case 'Inference Efficiency':
          metric[seriesName] = (record.gpu_efficiency_auc * 100).toPrecision(2);
          break;
      }
      if (!metricsCfg[seriesName]) {
        metricsCfg[seriesName] = {
          label: seriesName,
          color: nextRadarColor(),
        };
      }
    }
  }
  metricsData.forEach((metric) => {
    // add min, max to the data as reference for the radar chart
    metric['Min'] = 0;
    metric['Max'] = 100;
  });

  if (DRYRUN) {
    console.log(
      `Dry run: would write ${timePercentageData.length} time percentage entries, ${costData.length} cost entries and ${metricsData.length} metrics entries.`,
    );
    writeJSON(
      path.join(outDir, 'tmp/time-percentage-bar/chart-data.json'),
      timePercentageData,
    );
    writeJSON(
      path.join(outDir, 'tmp/time-percentage-bar/chart-config.json'),
      timePercentageCfg,
    );
    writeJSON(path.join(outDir, 'tmp/cost-bar/chart-data.json'), costData);
    writeJSON(path.join(outDir, 'tmp/cost-bar/chart-config.json'), costCfg);
    writeJSON(
      path.join(outDir, 'tmp/metrics-radar/chart-data.json'),
      metricsData,
    );
    writeJSON(
      path.join(outDir, 'tmp/metrics-radar/chart-config.json'),
      metricsCfg,
    );
  } else {
    console.log(
      `Writing ${timePercentageData.length} time percentage entries and ${costData.length} cost entries.`,
    );
    const tpDirName: ChartName = 'time-percentage-bar';
    const costDirName: ChartName = 'cost-bar';
    const metricsDirName: ChartName = 'metrics-radar';
    writeJSON(
      path.join(outDir, `${tpDirName}/chart-data.json`),
      timePercentageData,
    );
    writeJSON(
      path.join(outDir, `${tpDirName}/chart-config.json`),
      timePercentageCfg,
    );
    writeJSON(path.join(outDir, `${costDirName}/chart-data.json`), costData);
    writeJSON(path.join(outDir, `${costDirName}/chart-config.json`), costCfg);
    writeJSON(
      path.join(outDir, `${metricsDirName}/chart-data.json`),
      metricsData,
    );
    writeJSON(
      path.join(outDir, `${metricsDirName}/chart-config.json`),
      metricsCfg,
    );
  }
}

export function buildLeaderboardTables(opts?: {
  rawDir?: string;
  outDir?: string;
}) {
  const rawDir =
    opts?.rawDir ??
    path.join(__dirname, '../../../public/data/benchmark/raw/summary');
  const outDir =
    opts?.outDir ??
    path.join(__dirname, '../../../public/data/benchmark/table');

  const tableData: LeaderboardData[] = [];
  const tableRVUData: LeaderboardRVUData[] = [];

  const jsonFiles = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));
  for (const file of jsonFiles) {
    const filePath = path.join(rawDir, file);

    let record: SummaryInputData;
    try {
      record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`Could not parse ${file}:`, e);
      continue;
    }

    // process the scaffold model into ['Scaffold Name', 'Model Name'] format
    const [scaffold, model] = path
      .basename(file, '.json')
      .split('_')
      .map((name) =>
        name
          .split('-')
          .map((sec) => sec[0].toUpperCase() + sec.slice(1))
          .join(' '),
      );

    const leaderboardDataEntry: LeaderboardData = {
      scaffold,
      model,
      total: record.avg_duration,
      cpuTime: record.avg_cpu_time,
      inputToken: record.avg_input_tokens / 1000,
      outputToken: record.avg_output_tokens / 1000,
      calls: record.avg_llm_calls,
      infTime: record.avg_measured_gpu_time,
      resolveRate: (record.resolved / record.total_projects) * 100,
      precision: record.precision * 100,
    };

    const leaderboardRVUDataEntry: LeaderboardRVUData = {
      scaffold,
      model,
      avgTotalTimeU: record.unresolved_avg_duration,
      avgTotalTimeR: record.resolved_avg_duration,
      avgCPUTimeU: record.unresolved_avg_cpu_time,
      avgCPUTimeR: record.resolved_avg_cpu_time,
      avgInfTimeU: record.unresolved_avg_measured_gpu_time,
      avgInfTimeR: record.resolved_avg_measured_gpu_time,
      avgTotalTokensU:
        (record.unresolved_avg_input_tokens +
          record.unresolved_avg_output_tokens) /
        1000,
      avgTotalTokensR:
        (record.resolved_avg_input_tokens + record.resolved_avg_output_tokens) /
        1000,
      avgLLMRequestsU: record.unresolved_avg_llm_calls,
      avgLLMRequestsR: record.resolved_avg_llm_calls,
    };

    tableData.push(leaderboardDataEntry);
    tableRVUData.push(leaderboardRVUDataEntry);
  }

  const rankedTableData = rankLeaderboardData(tableData);
  const rankedTableRVUData = rankLeaderboardRVUData(tableRVUData);

  if (DRYRUN) {
    console.log(
      `Dry run: would write ${tableData.length} leaderboard data entries and ${tableRVUData.length} leaderboard RVU data entries.`,
    );
    writeJSON(path.join(outDir, 'tmp/leaderboard/data.json'), rankedTableData);
    writeJSON(
      path.join(outDir, 'tmp/leaderboard/data-rvu.json'),
      rankedTableRVUData,
    );
  } else {
    console.log(
      `Writing ${tableData.length} leaderboard data entries and ${tableRVUData.length} leaderboard RVU data entries.`,
    );
    writeJSON(path.join(outDir, `leaderboard/data.json`), rankedTableData);
    writeJSON(
      path.join(outDir, `leaderboard/data-rvu.json`),
      rankedTableRVUData,
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Generating data for charts and leaderboard...');
  buildResolveRateLineChart();
  buildCallsBarChart();
  buildSummaryCharts();
  buildLeaderboardTables();
  console.log('Data updated ✔️\n');
}
