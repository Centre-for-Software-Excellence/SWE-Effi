import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/common/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  isExpanded: boolean;
  loading?: boolean;
  error?: string | null;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  isExpanded,
  loading,
  error,
  children,
  className,
}: ChartCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center p-8">
          <div>Loading chart...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center p-8">
          <div>No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        isExpanded
          ? 'fixed inset-0 z-50 h-screen bg-black/50 backdrop-blur-sm'
          : 'relative p-0 lg:p-8',
        className,
      )}
    >
      <Card
        className={cn(
          'relative overflow-y-visible rounded shadow-none',
          isExpanded &&
            'top-1/2 left-1/2 w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2 lg:max-w-7xl',
        )}
      >
        {children}
      </Card>
    </div>
  );
}
