import { useEffect, useMemo, useState } from 'react';

import { ChartConfig } from '@/components/common/ui/chart';

function generateLogTicks(
  min: number,
  max: number,
  expandLogDomain: boolean,
): number[] {
  const ticks: number[] = [];

  // Find the log10 bounds
  const logMin = Math.floor(Math.log10(min));
  const logMax = Math.ceil(Math.log10(max));

  // Generate ticks at powers of 10
  for (let i = logMin; i <= logMax; i++) {
    const tick = Math.pow(10, i);
    if (expandLogDomain) {
      if (tick >= min * 0.95 && tick <= max * 1.05) {
        ticks.push(tick);
      }
    } else {
      ticks.push(tick);
    }
  }

  // Ensure we have at least 2 ticks
  if (ticks.length === 0) {
    ticks.push(min, max);
  } else if (ticks.length === 1) {
    if (ticks[0] > min) ticks.unshift(Math.pow(10, logMin - 1));
    if (ticks[0] < max) ticks.push(Math.pow(10, logMax + 1));
  }

  return ticks.sort((a, b) => a - b);
}

interface UseChartSettingsProps {
  chartData: any[];
  chartConfig: ChartConfig | null;
  xKeys?: string[];
  yKeys?: string[];
  defaultDomain?: [number, number];
  takeAllKeys?: boolean;
  expandLogDomain?: boolean;
  logSlider?: boolean;
  getRange?: boolean;
}

export function useChartSettings({
  chartData,
  chartConfig,
  xKeys,
  defaultDomain,
  takeAllKeys = true,
  expandLogDomain = false,
  logSlider = false,
  yKeys,
}: UseChartSettingsProps) {
  const [openSettings, setOpenSettings] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(
    () => chartData || [],
  );

  const max = useMemo(
    () =>
      Math.max(
        ...(xKeys?.map((key) => Math.max(...chartData.map((d) => d[key]))) || [
          Infinity,
        ]),
      ),
    [chartData, xKeys],
  );
  const min = useMemo(
    () =>
      Math.min(
        ...(xKeys?.map((key) => Math.min(...chartData.map((d) => d[key]))) || [
          -Infinity,
        ]),
      ),
    [chartData, xKeys],
  );

  const range = useMemo(() => {
    const yValues = yKeys
      ? yKeys.map((key) => chartData.map((d) => d[key])).flat()
      : [];
    const newMin = Math.min(...yValues);
    const newMax = Math.max(...yValues);
    return [newMin, newMax];
  }, [chartData, yKeys]);

  const [domain, setDomain] = useState<[number, number]>(
    defaultDomain || [0, max],
  );

  useEffect(() => {
    if (expandLogDomain) {
      const logMin = Number((min * 0.95).toFixed(3));
      const logMax = Number((max * 1.05).toFixed(3));
      setDomain([logMin, logMax]);
    } else {
      setDomain([min, max]);
    }
    if (logSlider) {
      const logTicks = generateLogTicks(min, max, false);
      setDomain([logTicks[0], logTicks[logTicks.length - 1]]);
    }
  }, [min, max, expandLogDomain, logSlider]);

  useEffect(() => {
    if (chartConfig) {
      const keys = Object.keys(chartConfig);
      setActiveKeys(takeAllKeys ? keys : [keys[0]]);
    }
  }, [chartConfig, takeAllKeys]);

  useEffect(() => {
    if (chartData) {
      setFilteredData(chartData);
    }
  }, [chartData]);

  return {
    filteredData,
    setFilteredData,
    openSettings,
    setOpenSettings,
    activeKeys,
    setActiveKeys,
    min,
    max,
    domain,
    setDomain,
    range,
  };
}
