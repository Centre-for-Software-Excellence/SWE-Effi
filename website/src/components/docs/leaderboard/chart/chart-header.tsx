import { ReactNode } from 'react';

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/ui/card';

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
    <CardHeader
      className={`flex w-full items-start justify-between space-y-0 pb-2 sm:flex-row ${className || ''}`}
    >
      <div className="w-2/3">
        <CardTitle className="text-sm md:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm md:text-base">
          {description}
        </CardDescription>
      </div>
      {children && (
        <div className="flex items-center gap-1 sm:justify-between sm:gap-2">
          {children}
        </div>
      )}
    </CardHeader>
  );
}
