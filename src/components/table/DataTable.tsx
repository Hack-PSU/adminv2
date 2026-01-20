"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  FilterFn,
  Row,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Trash2,
  Save,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// EditableCell component for mobile support
const EditableCell: React.FC<{
  display: React.ReactNode;
  control: React.ReactNode;
}> = ({ display, control }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className="relative min-h-[2rem]"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="flex h-full items-center px-2 py-1 text-sm text-zinc-900 cursor-pointer hover:bg-zinc-50">
        {display}
      </div>
      {isEditing && (
        <div 
          className="absolute inset-0"
          onBlur={(e) => {
            // Only close if we're not clicking within the control
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsEditing(false);
            }
          }}
        >
          {control}
        </div>
      )}
    </div>
  );
};
export interface DataTableColumn<TData> {
  accessorKey: keyof TData;
  header: string;
  editable?: boolean;
  type?: "text" | "number" | "select";
  options?: Array<{ label: string; value: string | number }>;
  cell?: (
    value: any,
    row: TData,
    onChange?: (value: any) => void,
  ) => React.ReactNode;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  onSave?: (data: TData[]) => void | Promise<void>;
  onDelete?: (ids: Array<string | number>) => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  idField?: keyof TData;
  enableRowSelection?: boolean;
  className?: string;
}

// Custom filter function that searches from the beginning of the string
const startsWithFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (value == null) return false;
  const stringValue = String(value).toLowerCase();
  const searchValue = String(filterValue).toLowerCase();
  return stringValue.startsWith(searchValue);
};

export function DataTable<TData extends Record<string, any>>({
  data: initialData,
  columns,
  onSave,
  onDelete,
  onRefresh,
  idField = "id" as keyof TData,
  enableRowSelection = true,
  className,
}: DataTableProps<TData>) {
  const [data, setData] = useState<TData[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Handle cell value changes
  const handleCellChange = (
    rowIndex: number,
    columnId: keyof TData,
    value: any,
  ) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };

  // Toggle row selection
  const toggleRowSelection = (id: string | number) => {
    if (!enableRowSelection) return;
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Toggle all rows selection
  const toggleAllRowsSelection = () => {
    if (!enableRowSelection) return;
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row) => row[idField])));
    }
  };

  // Create table columns
  const tableColumns = useMemo<ColumnDef<TData>[]>(() => {
    const renderHoverEditable = (
      display: React.ReactNode,
      control: React.ReactNode,
    ) => {
      return <EditableCell display={display} control={control} />;
    };

    const cols: ColumnDef<TData>[] = [];

    if (enableRowSelection) {
      cols.push({
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={selectedRows.size === data.length && data.length > 0}
            onChange={toggleAllRowsSelection}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.has(row.original[idField])}
            onChange={() => toggleRowSelection(row.original[idField])}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      });
    }

    columns.forEach((column) => {
      cols.push({
        accessorKey: column.accessorKey as string,
        header: column.header,
        cell: ({ row, getValue }) => {
          const value = getValue();
          const rowIndex = data.findIndex(
            (d) => d[idField] === row.original[idField],
          );

          // If custom cell renderer provided
          if (column.cell) {
            return column.cell(
              value,
              row.original,
              column.editable
                ? (newValue: any) =>
                    handleCellChange(rowIndex, column.accessorKey, newValue)
                : undefined,
            );
          }

          // If not editable, just display the value
          if (!column.editable) {
            return <div className="px-2 py-1">{String(value ?? "")}</div>;
          }

          // Editable cells
          if (column.type === "select" && column.options) {
            return (
              renderHoverEditable(
                column.options?.find(
                  (opt) => String(opt.value) === String(value),
                )?.label ?? String(value ?? ""),
                <select
                  autoFocus
                  value={value != null ? String(value) : ""}
                  onChange={(e) => {
                    const newValue =
                      column.options?.find(
                        (opt) => String(opt.value) === e.target.value,
                      )?.value ?? e.target.value;
                    handleCellChange(rowIndex, column.accessorKey, newValue);
                  }}
                  className="h-full w-full rounded bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  {column.options.map((option) => (
                    <option
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>,
              )
            );
          }

          if (column.type === "number") {
            return (
              renderHoverEditable(
                String(value ?? ""),
                <input
                  autoFocus
                  type="number"
                  value={value != null ? String(value) : ""}
                  onChange={(e) =>
                    handleCellChange(
                      rowIndex,
                      column.accessorKey,
                      Number(e.target.value),
                    )
                  }
                  className="h-full w-full rounded bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                />,
              )
            );
          }

          // Default: text input
          return (
            renderHoverEditable(
              String(value ?? ""),
              <input
                autoFocus
                type="text"
                value={value != null ? String(value) : ""}
                onChange={(e) =>
                  handleCellChange(rowIndex, column.accessorKey, e.target.value)
                }
                className="h-full w-full rounded bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              />,
            )
          );
        },
        filterFn: startsWithFilter,
      });
    });

    return cols;
  }, [columns, data, selectedRows, idField, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      }
    },
    globalFilterFn: (row, columnId, filterValue) => {
      // Search across all columns
      return columns.some((column) => {
        const value = row.getValue(String(column.accessorKey));
        if (value == null) return false;
        const stringValue = String(value).toLowerCase();
        const searchValue = String(filterValue).toLowerCase();
        return stringValue.startsWith(searchValue);
      });
    },
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: false,
  });

  // Handle save
  const handleSave = async () => {
    if (!onSave) return;
    setIsLoading(true);
    try {
      await onSave(data);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete || selectedRows.size === 0) return;
    setIsLoading(true);
    try {
      await onDelete(Array.from(selectedRows));
      // Clear selection after delete attempt
      setSelectedRows(new Set());
      // Refresh the data if onRefresh is provided
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsLoading(true);
    try {
      await onRefresh();
      setSelectedRows(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-md border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="default"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
          )}
          {onSave && (
            <Button onClick={handleSave} disabled={isLoading} variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
          {onDelete && enableRowSelection && (
            <Button
              onClick={handleDelete}
              disabled={isLoading || selectedRows.size === 0}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedRows.size})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4 text-blue-600" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4 text-blue-600" />
                            ) : (
                              <div className="flex flex-col opacity-30">
                                <ArrowUp className="h-3 w-3 -mb-1" />
                                <ArrowDown className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="px-4 py-8 text-center text-sm text-zinc-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200 hover:bg-zinc-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-sm text-zinc-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-700">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              table.setPageSize(newSize);
            }}
            className="rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page info and navigation */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-700">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
