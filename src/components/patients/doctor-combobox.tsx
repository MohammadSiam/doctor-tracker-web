"use client"

import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useDoctorLookup } from "@/hooks/use-doctors"
import type { DoctorSummary } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DoctorComboboxProps {
  value: string
  onChange: (id: string) => void
  /** The currently assigned doctor, so its name shows before any search runs. */
  initialDoctor?: DoctorSummary | null
  invalid?: boolean
  id?: string
  placeholder?: string
  className?: string
}

/** Server-side search: only the first 20 matches are fetched, so it scales to any number of doctors. */
export function DoctorCombobox({ value, onChange, initialDoctor, invalid, id, placeholder = "Select a doctor", className }: DoctorComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debounced = useDebouncedValue(search, 250)
  const { data: doctors = [], isFetching } = useDoctorLookup(debounced, open)
  const [selected, setSelected] = useState<DoctorSummary | null>(initialDoctor ?? null)

  const label = selected && selected._id === value ? selected.name : initialDoctor?._id === value ? initialDoctor.name : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn("w-full justify-between font-normal aria-invalid:border-destructive", !label && "text-muted-foreground", className)}
        >
          <span className="truncate">{label ?? placeholder}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search doctors…" value={search} onValueChange={setSearch} />
          <CommandList>
            {isFetching && doctors.length === 0 ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CommandEmpty>No doctors found.</CommandEmpty>
            )}
            <CommandGroup>
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor._id}
                  value={doctor._id}
                  onSelect={() => {
                    setSelected(doctor)
                    onChange(doctor._id)
                    setOpen(false)
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{doctor.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doctor.specialization} · {doctor.hospital}
                    </p>
                  </div>
                  <Check className={cn("ml-auto", value === doctor._id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
