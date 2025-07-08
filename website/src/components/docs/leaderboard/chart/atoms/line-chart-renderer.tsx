import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { ChartRendererProps } from '../types';

export function LineChartRenderer({
  data,
  config,
  activeKeys,
  xRange,
  xAxisLabel,
  yAxisLabel,
  xAxisDataKey,
}: ChartRendererProps) {
  return (
    <ChartContainer
      config={config}
      className="min-h-[200px] w-full overflow-x-hidden"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ top: 0, right: 0, left: 22, bottom: 16 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis width={20} tickFormatter={(value) => (value + '').slice(0, 3)}>
          {yAxisLabel && (
            <Label
              value={yAxisLabel}
              position="inside"
              angle={-90}
              dx={-25}
              className="text-[8px] md:text-sm"
            />
          )}
        </YAxis>
        <XAxis
          type="number"
          dataKey={xAxisDataKey}
          tickLine={true}
          axisLine={true}
          domain={xRange || [0, 'dataMax']}
          allowDataOverflow={true}
          tickFormatter={(value) => (value + '').slice(0, 3)}
          tickCount={10}
          height={20}
        >
          {xAxisLabel && (
            <Label
              value="Total Tokens (input_tokens + output_tokens) (1e6)"
              position="insideBottom"
              offset={-15}
              className="text-[8px] md:text-sm"
            />
          )}
        </XAxis>
        <ChartTooltip
          animationDuration={0}
          isAnimationActive={false}
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {activeKeys?.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="natural"
            stroke={config?.[key]?.color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
