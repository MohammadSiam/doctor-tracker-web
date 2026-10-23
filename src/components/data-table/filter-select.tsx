"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const ALL = "__all__"

interface FilterSelectProps<T extends string> {
  value: T | null
  onChange: (value: T | null) => void
  options: readonly T[] | readonly { value: T; label: string }[]
  placeholder: string
  className?: string
}

export function FilterSelect<T extends string>({ value, onChange, options, placeholder, className }: FilterSelectProps<T>) {
  const items = options.map((option) => (typeof option === "string" ? { value: option, label: option } : option))

  return (
    <Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? null : (next as T))}>
      <SelectTrigger className={cn("w-full sm:w-44", value && "border-primary/40 bg-accent/40", className)} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{placeholder}</SelectItem>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
