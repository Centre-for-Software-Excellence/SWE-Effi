import { useCallback, useMemo } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import debounce from 'lodash/debounce';
import { Settings } from 'lucide-react';

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
  domain?: [number, number];
  min?: number;
  max?: number;
  setDomain?: (range: [number, number]) => void;
  step?: number;
  setActiveKeys: (keys: string[]) => void;
  keys: string[];
  title?: string;
  onClose: () => void;
  data?: any[];
  setFilteredData?: (data: any[]) => void;
  field?: string;
  log?: boolean;
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
          variant="ghost"
          size="sm"
          className="flex items-center text-foreground hover:bg-accent"
          onClick={onClickAction}
        >
          <Settings />
        </Button>
      </DialogTrigger>
    </TooltipWrapper>
  );
}

export function ChartSettings({
  domain,
  min,
  max,
  setDomain,
  step = 1,
  keys,
  setActiveKeys,
  title = 'Settings',
  data,
  setFilteredData,
  field,
  log = false,
}: ChartSettingsProps) {
  const logToLinear = (value: number) => {
    const index = getPowerOfTenValues.findIndex((v) => v === value);
    return index;
  };

  const linearToLog = (index: number) => {
    return getPowerOfTenValues[index] || getPowerOfTenValues[0];
  };

  const getPowerOfTenValues = useMemo(() => {
    const values: number[] = [];
    const startPower = Math.floor(Math.log10(min || 1));
    const endPower = Math.ceil(Math.log10(max || 1));

    for (let power = startPower; power <= endPower; power++) {
      values.push(Math.pow(10, power));
    }
    return values;
  }, [min, max]);

  const handleSliderChange = (values: [number, number]) => {
    if (!setDomain) return;
    if (log) {
      const [minIndex, maxIndex] = values;
      const logMin = linearToLog(minIndex);
      const logMax = linearToLog(maxIndex);

      // Ensure max is greater than min
      if (logMax <= logMin) {
        const correctedMaxIndex = Math.min(
          maxIndex + 1,
          getPowerOfTenValues.length - 1,
        );
        const correctedMax = linearToLog(correctedMaxIndex);
        setDomain([logMin, correctedMax]);
      } else {
        setDomain([logMin, logMax]);
      }
    } else {
      setDomain(values);
    }
  };

  const formatValue = (value: number) => {
    const log = Math.log10(value);
    const isPowerOf10 = Math.abs(log - Math.round(log)) < 0.0001;

    if (isPowerOf10) {
      const exponent = Math.round(log);
      const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
      const exponentStr = exponent.toString();
      const superscriptStr = exponentStr
        .split('')
        .map((digit) => superscripts[parseInt(digit)])
        .join('');
      return `10${superscriptStr}`;
    }
    return value.toLocaleString();
  };

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
      if (!data || !setFilteredData || !field) return;
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
                placeholder={'E.g. ' + keys.join(', ')}
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
                placeholder={`E.g. ${data && data.length > 1 ? data[0][field] : field}`}
                onChange={(e) => {
                  const input = e.target.value;
                  debouncedFilterField(input);
                }}
              />
            </TabsContent>
          )}
        </Tabs>
        {domain && max && setDomain && step && (
          <div className="flex flex-col items-start space-y-4">
            <h1 className="text-foreground">
              Domain {log ? '(Log Scale)' : ''}
            </h1>
            <div className="w-xs max-w-sm sm:w-sm">
              <Slider
                value={
                  log
                    ? [logToLinear(domain[0]), logToLinear(domain[1])]
                    : domain
                }
                onValueChange={handleSliderChange}
                min={log ? 0 : min || 0}
                max={log ? getPowerOfTenValues.length - 1 : max}
                step={log ? 1 : step}
              />
              <div className="mt-2 flex justify-between text-xs">
                <span>
                  {log ? formatValue(domain[0]) : domain[0].toPrecision(4)}
                </span>
                <span>
                  {log ? formatValue(domain[1]) : domain[1].toPrecision(4)}
                </span>
              </div>
            </div>
          </div>
        )}
        <Button
          variant="default"
          onClick={() => {
            if (setDomain) {
              if (log) {
                console.log('newr domain: ', [
                  linearToLog(0),
                  linearToLog(getPowerOfTenValues.length - 1),
                ]);
                setDomain([
                  linearToLog(0),
                  linearToLog(getPowerOfTenValues.length - 1),
                ]);
              } else {
                setDomain([min || 0, max || 100]);
              }
            }
            if (setActiveKeys) {
              setActiveKeys(keys);
            }
            if (setFilteredData && data) {
              setFilteredData(data);
            }
          }}
          className="w-full"
        >
          Reset Chart
        </Button>
      </div>
    </DialogContent>
  );
}
