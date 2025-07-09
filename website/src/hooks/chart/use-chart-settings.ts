import { useEffect, useMemo, useState } from 'react';

import { ChartConfig } from '@/components/common/ui/chart';

interface UseChartSettingsProps {
  chartData: any[];
  chartConfig: ChartConfig | null;
  xKey?: string;
  defaultDomain?: [number, number];
}

export function useChartSettings({
  chartData,
  chartConfig,
  xKey,
  defaultDomain,
}: UseChartSettingsProps) {
  const [openSettings, setOpenSettings] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(
    () => chartData || [],
  );

  const maxTokens = useMemo(
    () => Math.max(...chartData.map((d) => (xKey ? d[xKey] : Infinity))),
    [chartData, xKey],
  );

  const [xRange, setXRange] = useState<[number, number]>(
    defaultDomain || [0, maxTokens],
  );

  useEffect(() => {
    if (chartConfig) {
      setActiveKeys(Object.keys(chartConfig));
    }
  }, [chartConfig]);

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
    maxTokens,
    xRange,
    setXRange,
  };
}
