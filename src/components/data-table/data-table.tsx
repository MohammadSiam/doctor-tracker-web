"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  /** Field name the API can sort by; makes the header clickable. */
  sortKey?: string
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[] | undefined
  getRowId: (row: T) => string
  isLoading?: boolean
  /** True while a new page/filter is loading behind the current rows. */
  isFetching?: boolean
  sort?: string
  onSortChange?: (sort: string) => void
  onRowClick?: (row: T) => void
  empty?: ReactNode
  skeletonRows?: number
}

function SortIcon({ active, desc }: { active: boolean; desc: boolean }) {
  if (!active) return <ArrowUpDown className="size-3.5 opacity-40" />
  return desc ? <ArrowDown className="size-3.5" /> : <ArrowUp className="size-3.5" />
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  isFetching,
  sort,
  onSortChange,
  onRowClick,
  empty,
  skeletonRows = 8,
}: DataTableProps<T>) {
  const activeField = sort?.replace(/^-/, "")
  const isDesc = sort?.startsWith("-") ?? false

  const toggleSort = (key: string) => {
    // New column starts ascending; clicking the active column flips direction.
    onSortChange?.(activeField === key && !isDesc ? `-${key}` : key)
  }

  return (
    <div className="relative">
      {/* Thin progress bar instead of replacing rows with skeletons on every page change. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden transition-opacity",
          isFetching && !isLoading ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="h-full w-1/3 animate-[progress_1s_ease-in-out_infinite] bg-primary" />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.id} className={cn("h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground", column.className)}>
                {column.sortKey && onSortChange ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2.5 h-8 gap-1.5 px-2.5 text-xs font-medium uppercase tracking-wide"
                    onClick={() => toggleSort(column.sortKey!)}
                    aria-label={`Sort by ${String(column.header)}`}
                  >
                    {column.header}
                    <SortIcon active={activeField === column.sortKey} desc={isDesc} />
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}>
          {isLoading ? (
            Array.from({ length: skeletonRows }, (_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableCell key={column.id} className={cn("py-3.5", column.className)}>
                    <Skeleton className="h-4 w-full max-w-36" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data && data.length > 0 ? (
            data.map((row) => (
              <TableRow
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} className={cn("py-3", column.className)}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
