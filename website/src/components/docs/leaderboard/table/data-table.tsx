import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/common/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/common/ui/command';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/common/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/common/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/ui/table';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ColumnConfig } from '../tables-card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSortingChange?: (sortColumn: string) => void;
  activeSortColumn?: string;
}

export function DataTable<TData, TValue>({
  headers,
  columns,
  data,
  filterOptions = [
    { value: 'model', label: 'Model' },
    { value: 'scaffold', label: headers?.scaffold || 'Scaffold' },
  ],
  onSortingChange,
  activeSortColumn = 'tokenEfficiency',
}: DataTableProps<TData, TValue> & {
  filterOptions?: {
    value: string;
    label: string;
  }[];
  onSortingChange?: (sortColumn: string) => void;
  activeSortColumn?: string;
  headers?: ColumnConfig;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [selectedFilterColumn, setSelectedFilterColumn] =
    useState<string>('model'); // Set default value
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const comboboxOptions = useMemo(() => {
    if (!data || data.length === 0) return [];

    const uniqueValues = new Set<string>();
    data.forEach((row: any) => {
      const value = row[selectedFilterColumn];
      if (value && typeof value === 'string') {
        uniqueValues.add(value);
      }
    });

    return Array.from(uniqueValues)
      .sort()
      .map((value) => ({
        value: value,
        label: value,
      }));
  }, [data, selectedFilterColumn]);

  const table = useReactTable({
    data,
    columns: columns.map((col) => ({
      ...col,
      meta: {
        ...col.meta,
        isActiveSortColumn: col.id === activeSortColumn,
        onColumnSort: (columnId: string) => {
          if (onSortingChange) {
            onSortingChange(columnId);
          }
        },
      },
    })),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const searchValue = filterValue.toLowerCase();

      const cellValue = row.getValue(selectedFilterColumn);
      if (cellValue == null) return false;
      return String(cellValue).toLowerCase().includes(searchValue);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  const getSelectedFilterLabel = () => {
    const selectedOption = filterOptions.find(
      (option) => option.value === selectedFilterColumn,
    );
    return selectedOption?.label || selectedFilterColumn;
  };
  const isMobile = useMobile();

  return (
    <div className="relative overflow-x-auto">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          {/* Filter Column Selector */}
          <Select
            value={selectedFilterColumn}
            onValueChange={(value) => {
              setSelectedFilterColumn(value);
              // Clear the search when changing filter column
              setGlobalFilter('');
            }}
          >
            <SelectTrigger aria-label="Filter Type Options">
              {!isMobile && <SelectValue />}
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  aria-label={option.label}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Combobox */}
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                aria-label={`Search ${getSelectedFilterLabel()}`}
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="flex justify-between md:w-[300px]"
              >
                {globalFilter
                  ? comboboxOptions.find(
                      (option) => option.value === globalFilter,
                    )?.label || globalFilter
                  : `Search ${getSelectedFilterLabel()}...`}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 md:ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 md:w-[300px]">
              <Command>
                <CommandInput
                  placeholder={`Search ${getSelectedFilterLabel()}...`}
                  className="h-9"
                  value={globalFilter}
                  onValueChange={setGlobalFilter}
                />
                <CommandList>
                  <CommandEmpty>
                    No {getSelectedFilterLabel().toLowerCase()} found.
                  </CommandEmpty>
                  <CommandGroup>
                    {comboboxOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          setGlobalFilter(
                            currentValue === globalFilter ? '' : currentValue,
                          );
                          setComboboxOpen(false);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            globalFilter === option.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <div className="flex items-center justify-end py-2 md:space-x-2 md:py-4">
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
                      column.id && (
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
                      )
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
