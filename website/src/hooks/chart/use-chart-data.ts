import { useEffect, useState } from 'react';

import { ChartConfig } from '@/components/common/ui/chart';

interface UseChartDataResult<T> {
  data: T[];
  config: ChartConfig | null;
  loading: boolean;
  error: string | null;
  keys: string[];
}

export function useChartData<T>(
  dataEndpoint: string,
  configEndpoint: string,
): UseChartDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(dataEndpoint).then((res) => res.json()),
      fetch(configEndpoint).then((res) => res.json()),
    ])
      .then(([chartData, chartConfig]) => {
        setData(chartData);
        setConfig(chartConfig);
        setKeys(Object.keys(chartConfig));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [dataEndpoint, configEndpoint]);

  return {
    data,
    config,
    loading,
    error,
    keys,
  };
}
