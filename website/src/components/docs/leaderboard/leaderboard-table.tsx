import { useMemo, useState } from 'react';

import { rankLeaderboardData } from '@/lib/data/get';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { ColumnConfig } from './tables-card';

export function LeaderboardTable({
  rawData,
  tooltips,
  headers,
}: {
  rawData: any[];
  tooltips?: ColumnConfig;
  headers?: ColumnConfig;
}) {
  const [activeSortColumn, setActiveSortColumn] = useState('gpuEfficiency');

  const rankedData = useMemo(() => {
    return rankLeaderboardData(rawData, activeSortColumn as any);
  }, [rawData, activeSortColumn]);

  const tableColumns = useMemo(() => {
    return columns({
      tooltips,
      headers,
      activeSortColumn,
      onSortColumnChange: setActiveSortColumn,
    });
  }, [tooltips, headers, activeSortColumn]);

  const handleSortingChange = (sortColumn: string) => {
    setActiveSortColumn(sortColumn);
  };
  return (
    <DataTable
      headers={headers}
      data={rankedData}
      columns={tableColumns}
      onSortingChange={handleSortingChange}
      activeSortColumn={activeSortColumn}
    />
  );
}
