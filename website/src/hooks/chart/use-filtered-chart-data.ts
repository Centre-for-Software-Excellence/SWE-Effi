import { useEffect, useMemo, useState } from 'react';

import { ChartConfig } from '@/components/common/ui/chart';
import { getBasePath } from '@/lib/utils/path';

interface UseFilteredChartDataResult<T> {
  data: T[];
  config: ChartConfig | null;
  loading: boolean;
  error: string | null;
  keys: string[];
  activeDataTypes: Set<string>;
  toggleDataType: (dataType: string) => void;
}

export function useFilteredChartData<T>(
  dataEndpoint: string,
  configEndpoint: string,
  defaultActiveDataTypes: string[],
): UseFilteredChartDataResult<T> {
  const [rawData, setRawData] = useState<T[]>([]);
  const [rawConfig, setRawConfig] = useState<ChartConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDataTypes, setActiveDataTypes] = useState<Set<string>>(
    new Set(defaultActiveDataTypes),
  );

  useEffect(() => {
    Promise.all([
      fetch(getBasePath(dataEndpoint)).then((res) => res.json()),
      fetch(getBasePath(configEndpoint)).then((res) => res.json()),
    ])
      .then(([chartData, chartConfig]) => {
        setRawData(chartData);
        setRawConfig(chartConfig);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [dataEndpoint, configEndpoint]);

  const toggleDataType = (dataType: string) => {
    setActiveDataTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataType)) {
        newSet.delete(dataType);
      } else {
        newSet.add(dataType);
      }
      return newSet;
    });
  };

  const { filteredConfig, filteredKeys } = useMemo(() => {
    if (!rawConfig || activeDataTypes.size === 0)
      return { filteredConfig: null, filteredKeys: [] };

    const filteredConfig: ChartConfig = {};
    const filteredKeys: string[] = [];

    Object.entries(rawConfig).forEach(([key, value]) => {
      const shouldInclude =
        activeDataTypes.size === 0 ||
        Array.from(activeDataTypes).some((dataType) => key.includes(dataType));

      if (shouldInclude) {
        filteredConfig[key] = value;
        filteredKeys.push(key);
      }
    });

    return { filteredConfig, filteredKeys };
  }, [rawConfig, activeDataTypes]);

  return {
    data: rawData,
    config: filteredConfig,
    loading,
    error,
    keys: filteredKeys,
    activeDataTypes,
    toggleDataType,
  };
}
