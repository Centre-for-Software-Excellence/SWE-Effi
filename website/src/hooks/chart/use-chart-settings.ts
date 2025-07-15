import { useEffect, useMemo, useState } from 'react';

import { ChartConfig } from '@/components/common/ui/chart';

interface UseChartSettingsProps {
  chartData: any[];
  chartConfig: ChartConfig | null;
  xKeys?: string[];
  defaultDomain?: [number, number];
  takeAllKeys?: boolean;
}

export function useChartSettings({
  chartData,
  chartConfig,
  xKeys,
  defaultDomain,
  takeAllKeys = true,
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

  const [domain, setDomain] = useState<[number, number]>(
    defaultDomain || [0, max],
  );

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
    max,
    domain,
    setDomain,
  };
}
