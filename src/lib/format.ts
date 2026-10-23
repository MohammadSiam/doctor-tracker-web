import { format, formatDistanceToNowStrict, parseISO } from "date-fns"

export const formatDate = (iso: string) => format(parseISO(iso), "MMM d, yyyy")

export const formatRelative = (iso: string) => `${formatDistanceToNowStrict(parseISO(iso))} ago`

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value)

export const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

/** `2026-10-23` -> `2026-10-23`, Date -> `yyyy-MM-dd` (the API accepts plain dates). */
export const toIsoDate = (date: Date) => format(date, "yyyy-MM-dd")
