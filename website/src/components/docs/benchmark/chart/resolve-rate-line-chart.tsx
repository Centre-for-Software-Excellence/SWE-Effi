import { useEffect, useMemo, useState } from 'react';
import { Maximize2, Minimize2, SlidersHorizontal } from 'lucide-react';
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  TooltipProvider,
  TooltipWrapper,
} from '@/components/common/tooltip-wrapper';
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Slider } from '@/components/common/ui/slider';
import { CollapsibleLegend } from '@/components/docs/benchmark/chart/collapsible-legend';
import { ResolveRateEntry as ChartData } from '@/lib/data/generate';
import { cn } from '@/lib/utils';
import { ChartExplanation } from './chart-explanation';

interface LineChartDottedProps {
  chartTitle: string;
  chartDescription: string;
}

interface ChartSettingsProps {
  xRange: [number, number];
  maxTokens: number;
  setXRange: (range: [number, number]) => void;
  setActiveKeys: (keys: string[]) => void;
  keys: string[];
  onClose: () => void;
}

function ChartSettings({
  xRange,
  maxTokens,
  setXRange,
  keys,
  setActiveKeys,
}: ChartSettingsProps) {
  return (
    <DialogContent className="z-99 mx-auto flex max-w-sm flex-col items-center justify-center">
      <div className="z-99 flex flex-col items-start space-y-4 px-4 pb-4">
        <h1 className="text-muted-foreground">Total Tokens Range</h1>
        <div className="w-xs max-w-sm sm:w-sm">
          <Slider
            value={xRange}
            onValueChange={(val) => setXRange(val as [number, number])}
            min={0}
            max={maxTokens}
            step={maxTokens / 100}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span>{xRange[0].toFixed(0)}</span>
            <span>{xRange[1].toFixed(0)}</span>
          </div>
        </div>

        <h1 className="text-muted-foreground">Filter Model/Scaffold</h1>
        <Input
          onChange={(e) =>
            setActiveKeys(
              keys.filter((k) =>
                k.toLowerCase().includes(e.target.value.toLowerCase()),
              ),
            )
          }
          className="max-w-sm"
        />
      </div>
    </DialogContent>
  );
}

// Explanation content
const explanationContent = {
  overview: 'This line chart displays ....',
  insight: 'Some insight about the chart',
  methodology: 'something about the methodology',
  note: ['some notes1 ', 'some notes2 '],
};

export function ResolveRateLineChart({
  chartTitle,
  chartDescription,
}: LineChartDottedProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch('/data/benchmark/chart/resolve-rate-line/chart-data.json').then(
        (res) => res.json(),
      ),
      fetch('/data/benchmark/chart/resolve-rate-line/chart-config.json').then(
        (res) => res.json(),
      ),
    ])
      .then(([chartData, chartConfig]) => {
        setChartData(chartData);
        setChartConfig(chartConfig);
        setActiveKeys(Object.keys(chartConfig));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setLoading(false);
      });
  }, []);

  // UI related
  const [popover, setPopOver] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  // x axis range
  const maxTokens = useMemo(
    () => Math.max(...chartData.map((d) => d.totalTokens)),
    [chartData],
  );
  const [xRange, setXRange] = useState<[number, number]>([0, 6.2]);

  // keys should be displayed
  const [activeKeys, setActiveKeys] = useState<string[]>();

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
    <>
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <ChartSettings
          xRange={xRange}
          setActiveKeys={setActiveKeys}
          keys={Object.keys(chartConfig)}
          maxTokens={maxTokens}
          setXRange={setXRange}
          onClose={() => setOpenSettings(false)}
        />

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
            {/* Card Header */}
            <CardHeader className="flex w-full items-start justify-between space-y-0 pb-2 sm:flex-row">
              <div>
                <CardTitle className="text-sm md:text-lg">
                  {chartTitle}
                </CardTitle>
                <CardDescription className="text-sm md:text-lg">
                  {chartDescription}
                </CardDescription>
              </div>
              {/* Buttons */}
              <TooltipProvider>
                <div className="flex items-center gap-1 sm:justify-between sm:gap-2">
                  <ChartExplanation content={explanationContent} />
                  <TooltipWrapper title="Settings">
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center gap-2 bg-accent text-foreground hover:bg-background hover:text-foreground"
                        onClick={() => setOpenSettings(!openSettings)}
                      >
                        <SlidersHorizontal />
                      </Button>
                    </DialogTrigger>
                  </TooltipWrapper>
                  <CollapsibleLegend
                    keys={activeKeys || []}
                    config={chartConfig}
                  />
                  <TooltipWrapper title={popover ? 'Collapse' : 'Expand'}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPopOver(!popover)}
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
              <div className="relative">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full overflow-x-hidden"
                >
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 22, bottom: 16 }}
                  >
                    <CartesianGrid vertical={false} />
                    <YAxis
                      width={20}
                      tickFormatter={(value) => (value + '').slice(0, 3)}
                    >
                      <Label
                        value="Resolve Rate (Resolved Instances/500)"
                        angle={-90}
                        position="inside"
                        dx={-25}
                        className="text-[8px] md:text-sm"
                      />
                    </YAxis>
                    <XAxis
                      type="number"
                      dataKey="totalTokens"
                      tickLine={true}
                      axisLine={true}
                      domain={[xRange[0], xRange[1]]}
                      allowDataOverflow={true}
                      tickFormatter={(value) => (value + '').slice(0, 3)}
                      tickCount={10}
                      height={20}
                    >
                      <Label
                        value="Total Tokens (input_tokens + output_tokens) (1e6)"
                        position="insideBottom"
                        offset={-15}
                        className="text-[8px] md:text-sm"
                      />
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
                        stroke={chartConfig[key].color}
                        strokeWidth={1}
                        dot={false}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </Dialog>
    </>
  );
}
