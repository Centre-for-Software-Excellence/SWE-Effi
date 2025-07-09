import { useCallback, useMemo } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import debounce from 'lodash/debounce';
import { SlidersHorizontal } from 'lucide-react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import { Button } from '@/components/common/ui/button';
import { DialogContent, DialogTrigger } from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Slider } from '@/components/common/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common/ui/tabs';

interface ChartSettingsProps {
  xRange?: [number, number];
  maxX?: number;
  setXRange?: (range: [number, number]) => void;
  setActiveKeys: (keys: string[]) => void;
  keys: string[];
  title?: string;
  onClose: () => void;
  data?: any[];
  setFilteredData?: (data: any[]) => void;
  field: string;
}

export function ChartSettingsButton({
  onClickAction,
}: {
  onClickAction: () => void;
}) {
  return (
    <TooltipWrapper title="Settings">
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center gap-2 bg-accent text-foreground hover:bg-background hover:text-foreground"
          onClick={onClickAction}
        >
          <SlidersHorizontal />
        </Button>
      </DialogTrigger>
    </TooltipWrapper>
  );
}

export function ChartSettings({
  xRange,
  maxX,
  setXRange,
  keys,
  setActiveKeys,
  title = 'Settings',
  data,
  setFilteredData,
  field,
}: ChartSettingsProps) {
  const filterKeys = useCallback(
    (value: string) => {
      if (!value.trim()) {
        setActiveKeys(keys);
        return;
      }
      setActiveKeys(
        keys.filter((k) => {
          return k.toLowerCase().includes(value.toLowerCase());
        }),
      );
    },
    [setActiveKeys, keys],
  );
  const filterField = useCallback(
    (value: string) => {
      if (!data || !setFilteredData) return;
      if (!value.trim()) {
        setFilteredData(data);
        return;
      }
      const filteredData = data.filter((item) =>
        item[field].toString().toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredData(filteredData);
    },
    [data, field, setFilteredData],
  );
  const debouncedFilterKeys = useMemo(() => {
    return debounce(filterKeys, 300);
  }, [filterKeys]);
  const debouncedFilterField = useMemo(() => {
    return debounce(filterField, 300);
  }, [filterField]);
  const fieldFilterTitle =
    field
      ?.split('-')
      .map((e) => e[0].toUpperCase() + e.slice(1))
      .join(' ') || 'Field';

  return (
    <DialogContent className="z-99 mx-auto flex max-w-sm flex-col items-center justify-center">
      <DialogTitle className="mb-4">{title}</DialogTitle>
      <div className="z-99 flex flex-col items-start space-y-4 px-4 pb-4">
        {xRange && maxX && setXRange && (
          <div className="flex flex-col items-start space-y-4">
            <h1 className="text-muted-foreground">X Range</h1>
            <div className="w-xs max-w-sm sm:w-sm">
              <Slider
                value={xRange}
                onValueChange={(val) => setXRange(val as [number, number])}
                min={0}
                max={maxX}
                step={maxX / 100}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span>{xRange[0].toFixed(0)}</span>
                <span>{xRange[1].toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}
        <Tabs defaultValue="filter-keys">
          {field && (
            <TabsList className="w-xs max-w-sm sm:w-sm">
              <TabsTrigger value="filter-keys">Data Series</TabsTrigger>
              <TabsTrigger value="filter-field">
                {fieldFilterTitle || 'Field'}
              </TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="filter-keys" className="w-xs max-w-sm sm:w-sm">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="filter-keys">Filter Data Series</Label>
              <Input
                type="text"
                id="filter-keys"
                onChange={(e) => {
                  const input = e.target.value;
                  debouncedFilterKeys(input);
                }}
              />
            </div>
          </TabsContent>
          {field && (
            <TabsContent
              value="filter-field"
              className="grid w-full max-w-sm items-center gap-3"
            >
              <Label htmlFor="filter-field">
                {'Filter ' + fieldFilterTitle}
              </Label>
              <Input
                type="text"
                id="filter-field"
                onChange={(e) => {
                  const input = e.target.value;
                  debouncedFilterField(input);
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DialogContent>
  );
}
