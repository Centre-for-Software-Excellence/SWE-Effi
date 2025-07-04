'use client';

import { useEffect, useState } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from 'recharts';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Button } from '@/components/common/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/common/ui/chart';
import { CollapsibleLegend } from '@/components/docs/benchmark/chart/collapsible-legend';
import { CallsEntry as ChartData } from '@/lib/data/generate';
import { cn } from '@/lib/utils';
import { ChartExplanation } from './chart-explanation';

const explanationContent = {
  overview: 'This bar chart displays ....',
  insight: 'Some insight about the chart',
  methodology: 'something about the methodology',
  note: ['some notes1 ', 'some notes2 '],
};

export function CallsBarChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<string[] | null>(null);
  useEffect(() => {
    Promise.all([
      fetch('/data/benchmark/chart/calls-bar/chart-data.json').then((res) =>
        res.json(),
      ),
      fetch('/data/benchmark/chart/calls-bar/chart-config.json').then((res) =>
        res.json(),
      ),
    ])
      .then(([chartData, chartConfig]) => {
        setChartData(chartData);
        setChartConfig(chartConfig);
        setKeys(Object.keys(chartConfig));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setLoading(false);
      });
  }, []);

  const [popover, setPopover] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center p-8">
          <div>Loading chart...</div>
        </CardContent>
      </Card>
    );
  }
  if (!chartConfig) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center p-8">
          <div>No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    !loading && (
      <div
        className={cn(
          popover
            ? 'fixed inset-0 z-50 h-screen bg-black/50 backdrop-blur-sm'
            : 'relative p-0 lg:p-8',
        )}
      >
        <Card
          className={cn(
            'relative overflow-y-visible rounded shadow-none',
            popover &&
              'top-1/2 left-1/2 w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2 lg:max-w-7xl',
          )}
        >
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle># of Calls</CardTitle>
              <CardDescription>Desription?</CardDescription>
            </div>
            <TooltipProvider>
              <div className="flex items-center gap-1 sm:justify-between sm:gap-2">
                <ChartExplanation content={explanationContent} />
                <CollapsibleLegend keys={keys || []} config={chartConfig} />
                <TooltipWrapper title={popover ? 'Collapse' : 'Expand'}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPopover(!popover)}
                    className={cn(
                      'hidden items-center gap-2 bg-accent text-foreground transition-transform duration-200 ease-in-out hover:scale-130 hover:bg-background hover:text-foreground sm:flex',
                      popover ? 'hover:scale-90' : 'hover:scale-110',
                    )}
                  >
                    {popover ? (
                      <Minimize2 className="h-4 w-4" aria-hidden />
                    ) : (
                      <Maximize2 className="h-4 w-4" aria-hidden />
                    )}
                    <span className="sr-only">Expand chart</span>
                  </Button>
                </TooltipWrapper>
              </div>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full overflow-x-hidden"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ bottom: 20, right: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="scaffold"
                  tickLine={true}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${!popover && value.length > 7 ? `${value.slice(0, 7)}...` : value}`
                  }
                >
                  <Label
                    value="Scaffold"
                    position="insideBottom"
                    offset={-15}
                  />
                </XAxis>
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                >
                  <Label
                    value="# of Calls"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                {keys?.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={chartConfig[key].color}
                    barSize={popover ? 30 : 15}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    )
  );
}
