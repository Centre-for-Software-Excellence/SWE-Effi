import { DialogContent } from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Slider } from '@/components/common/ui/slider';

interface ChartSettingsProps {
  xRange: [number, number];
  maxX: number;
  setXRange: (range: [number, number]) => void;
  setActiveKeys: (keys: string[]) => void;
  keys: string[];
  onClose: () => void;
}

export function ChartSettings({
  xRange,
  maxX,
  setXRange,
  keys,
  setActiveKeys,
}: ChartSettingsProps) {
  return (
    <DialogContent className="z-99 mx-auto flex max-w-sm flex-col items-center justify-center">
      <div className="z-99 flex flex-col items-start space-y-4 px-4 pb-4">
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
