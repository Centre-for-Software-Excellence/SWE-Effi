import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DRYRUN = false;

const colors = [
  '#f6524f',
  '#27eedf',
  '#bafb00',
  '#48aef5',
  '#9da0ed',
  '#f255a1',
  '#ffc102',
  '#f8520e',
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface InputData {
  input_tokens: number;
  output_tokens: number;
  llm_calls: number;
  duration: number;
  avg_call_duration: number;
  total_call_duration: number;
  resolved: boolean;
}

export interface ResolveRateEntry {
  totalTokens: number;
  [seriesName: string]: number;
}

export interface CallsEntry {
  scaffold: string;
  [key: string]: number | string | undefined;
}

interface ChartConfig {
  [seriesName: string]: { label: string; color: string };
}

type Accumulator = Map<
  /* scaffold */ string,
  Map</* model */ string, { sum: number; count: number }>
>;

export type ChartName = 'resolve-rate-line' | 'calls-bar';

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
        totalTokens: r.input_tokens + r.output_tokens,
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
      stats.sum += r.llm_calls;
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

if (import.meta.url === `file://${process.argv[1]}`) {
  buildBenchmarkCharts();
}
