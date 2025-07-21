import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

// import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/common/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown-menu';
import { Input } from '@/components/common/ui/input';
import { ScrollArea, ScrollBar } from '@/components/common/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter = ['Base Model'],
}: DataTableProps<TData, TValue> & {
  filter?: string[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    // Custom global filter function to filter specific columns
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchColumns = filter.length > 0 ? filter : ['Base Model'];

      if (!filterValue) return true;
      const searchValue = filterValue.toLowerCase();

      // Debug: log the values
      console.log('Searching in columns:', searchColumns);
      searchColumns.forEach((col) => {
        console.log(`${col}:`, row.getValue(col));
      });

      return searchColumns.some((searchColumnId) => {
        const cellValue = row.getValue(searchColumnId);
        if (cellValue == null) return false;
        const matches = String(cellValue).toLowerCase().includes(searchValue);
        console.log(
          `${searchColumnId}: "${cellValue}" includes "${searchValue}"? ${matches}`,
        );
        return matches;
      });
    },
    // initialState: {
    //   pagination: {
    //     pageSize: 10,
    //   },
    // },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="relative overflow-x-auto">
      <div className="flex items-center justify-between pt-2">
        <Input
          placeholder={`Filter ${filter.join(' or ')}...`}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm focus:ring-0 focus-visible:ring-0 dark:focus:ring-0 dark:focus-visible:ring-0"
        />
        <div>
          <div className="flex items-center justify-end py-2 md:space-x-2 md:py-4">
            {/* <Button */}
            {/*   variant="outline" */}
            {/*   size="icon" */}
            {/*   onClick={() => table.previousPage()} */}
            {/*   disabled={!table.getCanPreviousPage()} */}
            {/* > */}
            {/*   <ChevronLeft /> */}
            {/* </Button> */}
            {/* <Button */}
            {/*   variant="outline" */}
            {/*   size="icon" */}
            {/*   onClick={() => table.nextPage()} */}
            {/*   disabled={!table.getCanNextPage()} */}
            {/* > */}
            {/*   <ChevronRight /> */}
            {/* </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Metrics
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {table
                  .getVisibleLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        disabled={!column.getCanHide()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`border-r border-border`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r border-border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
