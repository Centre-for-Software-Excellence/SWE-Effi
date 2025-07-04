import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';

interface LineChartRendererProps {
  data: any[];
  config: ChartConfig;
  isExpanded?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisDataKey: string;
}

export function BarChartRenderer({
  data,
  config,
  isExpanded = false,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
}: LineChartRendererProps) {
  return (
    <ChartContainer
      config={config}
      className="min-h-[200px] w-full overflow-x-hidden"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ bottom: 20, right: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={true}
          axisLine={false}
          tickFormatter={(value) =>
            isExpanded ? value : `${value.slice(0, 7)}...`
          }
        >
          <Label value={xAxisLabel} position="insideBottom" offset={-15} />
        </XAxis>
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        >
          <Label
            value={yAxisLabel}
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        {Object.keys(config).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={config?.[key].color}
            barSize={isExpanded ? 30 : 15}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
