"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PAGE_SIZES } from "@/lib/constants"
import { formatNumber } from "@/lib/format"
import type { PaginationMeta } from "@/lib/types"

interface TablePaginationProps {
  meta: PaginationMeta | undefined
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…" as const, p] : [p]))
}

export function TablePagination({ meta, onPageChange, onLimitChange }: TablePaginationProps) {
  if (!meta) return null
  const { page, limit, total, totalPages } = meta
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          {formatNumber(start)}–{formatNumber(end)} of <span className="font-medium text-foreground">{formatNumber(total)}</span>
        </span>
        <div className="hidden items-center gap-2 sm:flex">
          <span>Rows</span>
          <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
            <SelectTrigger size="sm" className="w-18" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" disabled={page <= 1} onClick={() => onPageChange(1)} aria-label="First page">
          <ChevronsLeft />
        </Button>
        <Button variant="ghost" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        {pageWindow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1.5 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "outline" : "ghost"}
              size="icon-sm"
              className="tabular-nums"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}
        <Button variant="ghost" size="icon-sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)} aria-label="Last page">
          <ChevronsRight />
        </Button>
      </nav>
    </div>
  )
}
