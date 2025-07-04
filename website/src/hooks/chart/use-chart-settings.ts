import { useEffect, useMemo, useState } from 'react';

import { ChartConfig } from '@/components/common/ui/chart';

interface UseChartSettingsProps {
  chartData: any[];
  chartConfig: ChartConfig | null;
}

export function useChartSettings({
  chartData,
  chartConfig,
}: UseChartSettingsProps) {
  const [openSettings, setOpenSettings] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const maxTokens = useMemo(
    () => Math.max(...chartData.map((d) => d.totalTokens)),
    [chartData],
  );

  const [xRange, setXRange] = useState<[number, number]>([0, 6.2]);

  useEffect(() => {
    if (chartConfig) {
      setActiveKeys(Object.keys(chartConfig));
    }
  }, [chartConfig]);

  return {
    openSettings,
    setOpenSettings,
    activeKeys,
    setActiveKeys,
    maxTokens,
    xRange,
    setXRange,
  };
}
