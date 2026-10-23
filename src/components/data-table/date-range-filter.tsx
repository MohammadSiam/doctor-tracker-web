"use client"

import { endOfYear, format, parseISO, startOfYear, subDays } from "date-fns"
import { CalendarDays, X } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toIsoDate } from "@/lib/format"
import { cn } from "@/lib/utils"

interface DateRangeFilterProps {
  from: string | null
  to: string | null
  onChange: (range: { from: string | null; to: string | null }) => void
  label?: string
}

const PRESETS = [
  { label: "Last 7 days", range: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "Last 30 days", range: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "Last 90 days", range: () => ({ from: subDays(new Date(), 89), to: new Date() }) },
  { label: "This year", range: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
]

export function DateRangeFilter({ from, to, onChange, label = "Date range" }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const selected: DateRange | undefined = from ? { from: parseISO(from), to: to ? parseISO(to) : undefined } : undefined

  const apply = (range: DateRange | undefined) => {
    onChange({ from: range?.from ? toIsoDate(range.from) : null, to: range?.to ? toIsoDate(range.to) : null })
  }

  const text = selected?.from
    ? selected.to
      ? `${format(selected.from, "MMM d, yy")} – ${format(selected.to, "MMM d, yy")}`
      : `From ${format(selected.from, "MMM d, yyyy")}`
    : label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full sm:w-auto">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start font-normal sm:w-60",
              !selected && "text-muted-foreground",
              selected && "border-primary/40 bg-accent/40 pr-9",
            )}
          >
            <CalendarDays />
            <span className="truncate">{text}</span>
          </Button>
        </PopoverTrigger>
        {selected && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
            onClick={() => apply(undefined)}
            aria-label="Clear date range"
          >
            <X />
          </Button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:border-r sm:border-b-0">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  apply(preset.range())
                  setOpen(false)
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={selected}
            onSelect={apply}
            defaultMonth={selected?.from}
            disabled={{ after: new Date() }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
