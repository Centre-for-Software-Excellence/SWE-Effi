export interface ChartProps {
  title: string;
  description: string;
  overview: string;
  insight: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  polarAngleAxisDataKey?: string;
  className?: string;
}

export interface ChartData {
  [key: string]: string | number | undefined;
}

export type ChartRendererProps = Partial<ChartProps> & {
  data: ChartData[];
  config: ChartConfig;
  isExpanded?: boolean;
  domain?: [number, number];
  range?: [number, number];
  activeKeys?: string[];
  scale?: 'linear' | 'log';
};
