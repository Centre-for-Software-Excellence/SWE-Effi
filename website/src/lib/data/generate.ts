import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ChartConfig } from '@/components/common/ui/chart';
import { ChartData as CallsEntry } from '@/components/docs/leaderboard/chart/calls-bar-chart';
import { ChartData as CostEntry } from '@/components/docs/leaderboard/chart/cost-bar-chart';
import { ChartData as ResolveRateEntry } from '@/components/docs/leaderboard/chart/resolve-rate-line-chart';
import { ChartData as TimePercentageEntry } from '@/components/docs/leaderboard/chart/time-percentage-bar-chart';

const DRYRUN = false;

const colors = [
  '#f6524f',
  '#48aef5',
  '#bafb00',
  '#9da0ed',
  '#27eedf',
  '#f255a1',
  '#ffc102',
  '#f8520e',
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface InputData {
  input_tokens?: number;
  output_tokens?: number;
  llm_calls?: number;
  avg_cpu_time?: number;
  avg_gpu_time?: number;
  duration?: number;
  avg_duration?: number;
  avg_call_duration?: number;
  total_call_duration?: number;
  resolved?: boolean;
  resolved_avg_input_tokens?: number;
  resolved_avg_output_tokens?: number;
  unresolved_avg_input_tokens?: number;
  unresolved_avg_output_tokens?: number;
  [key: string]: number | boolean | string | undefined;
}

type Accumulator = Map<
  /* scaffold */ string,
  Map</* model */ string, { sum: number; count: number }>
>;

export type ChartName =
  | 'resolve-rate-line'
  | 'calls-bar'
  | 'time-percentage-bar'
  | 'cost-bar';

// color generator helper
const nextColor = (() => {
  let idx = 0;
  return () => colors[idx++ % colors.length];
})();

// write files helper
function writeJSON(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function buildBenchmarkCharts(opts?: {
  rawDir?: string;
  outDir?: string;
}) {
  const rawDir =
    opts?.rawDir ?? path.join(__dirname, '../../../public/data/benchmark/raw');
  const outDir =
    opts?.outDir ??
    path.join(__dirname, '../../../public/data/benchmark/chart');

  const resolveCfg: ChartConfig = {};
  const callsCfg: ChartConfig = {};
  const resolveData: ResolveRateEntry[] = [];
  const callsAcc: Accumulator = new Map();

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
          [seriesName]: resolvedSoFar / 500,
        });
      });

    if (!resolveCfg[seriesName]) {
      resolveCfg[seriesName] = {
        label: seriesName,
        color: nextColor(),
      };
    }

    // # of calls data
    const scaffoldMap =
      callsAcc.get(scaffold) ??
      new Map<string, { sum: number; count: number }>();
    const stats = scaffoldMap.get(model) ?? { sum: 0, count: 0 };

    for (const r of records) {
      stats.sum += r?.llm_calls || 0;
      stats.count += 1;
    }
    scaffoldMap.set(model, stats);
    callsAcc.set(scaffold, scaffoldMap);

    if (!callsCfg[model]) {
      callsCfg[model] = { label: model, color: nextColor() };
    }
  }

  // calls chart finalization
  const callsData: CallsEntry[] = [];
  for (const [scaffold, modelMap] of callsAcc) {
    const row: CallsEntry = { scaffold };
    for (const [model, { sum, count }] of modelMap) {
      row[model] = +(sum / count).toFixed(2);
    }
    callsData.push(row);
  }

  if (DRYRUN) {
    console.log(
      `Dry run: would write ${resolveData.length} resolve rate entries and ${callsData.length} calls entries.`,
    );
    writeJSON(
      path.join(outDir, 'tmp/resolve-rate-line/chart-data.json'),
      resolveData,
    );
    writeJSON(
      path.join(outDir, 'tmp/resolve-rate-line/chart-config.json'),
      resolveCfg,
    );
    writeJSON(path.join(outDir, 'tmp/calls-bar/chart-data.json'), callsData);
    writeJSON(path.join(outDir, 'tmp/calls-bar/chart-config.json'), callsCfg);
  } else {
    const rrDirName: ChartName = 'resolve-rate-line';
    writeJSON(path.join(outDir, `${rrDirName}/chart-data.json`), resolveData);
    writeJSON(path.join(outDir, `${rrDirName}/chart-config.json`), resolveCfg);

    const callsDirName: ChartName = 'calls-bar';
    writeJSON(path.join(outDir, `${callsDirName}/chart-data.json`), callsData);
    writeJSON(path.join(outDir, `${callsDirName}/chart-config.json`), callsCfg);
  }
}

export function buildSummaryCharts(opts?: {
  rawDir?: string;
  outDir?: string;
}) {
  const rawDir =
    opts?.rawDir ??
    path.join(__dirname, '../../../public/data/benchmark/raw/summary');
  const outDir =
    opts?.outDir ??
    path.join(__dirname, '../../../public/data/benchmark/chart');

  const timePercentageCfg: ChartConfig = {
    'cpu-time': {
      label: 'CPU Time %',
      color: colors[1],
    },
    'gpu-time': {
      label: 'GPU Time %',
      color: colors[0],
    },
  };

  const timePercentageData: TimePercentageEntry[] = [];
  const costCfg: ChartConfig = {
    'success-cost': {
      label: 'Success Cost',
      color: colors[1],
    },
    'failure-cost': {
      label: 'Failure Cost',
      color: colors[0],
    },
  };
  const costData: CostEntry[] = [];

  const jsonFiles = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));

  for (const file of jsonFiles) {
    const filePath = path.join(rawDir, file);

    let record: InputData;
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
  }

  if (DRYRUN) {
    console.log(
      `Dry run: would write ${timePercentageData.length} time percentage entries and ${costData.length} cost entries.`,
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
  } else {
    const tpDirName: ChartName = 'time-percentage-bar';
    const costDirName: ChartName = 'cost-bar';
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
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildBenchmarkCharts();
  buildSummaryCharts();
}
