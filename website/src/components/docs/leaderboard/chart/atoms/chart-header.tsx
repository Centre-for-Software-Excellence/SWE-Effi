import { ReactNode } from 'react';

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/ui/card';
import { cn } from '@/lib/utils';

interface ChartHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function ChartHeader({
  title,
  description,
  children,
  className,
}: ChartHeaderProps) {
  return (
    <div>
      <CardHeader
        className={cn('flex w-full flex-col space-y-2 pb-4', className)}
      >
        <div className="flex w-full flex-row items-start justify-between">
          <div>
            <CardTitle className="text-sm md:text-lg">
              {title?.length > 0 &&
                title
                  .split(' ')
                  .map(
                    (word) => word && word?.[0].toUpperCase() + word.slice(1),
                  )
                  .join(' ')}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {description}
            </CardDescription>
          </div>
          {children}
        </div>
      </CardHeader>
    </div>
  );
}
