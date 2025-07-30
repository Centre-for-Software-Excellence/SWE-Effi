import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/common/theme-provider';
import { Button } from '@/components/common/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ModeToggle({
  className,
  simple = true,
}: {
  className?: string;
  simple?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return simple ? (
    <Button
      aria-label="Toggle theme"
      variant="ghost"
      size="icon"
      className={cn(
        'bg-transparent hover:bg-transparent dark:hover:bg-transparent',
        className,
      )}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      )}
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle theme"
          variant="ghost"
          size="icon"
          className={cn('dark:bg-transparent', className)}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-99">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
