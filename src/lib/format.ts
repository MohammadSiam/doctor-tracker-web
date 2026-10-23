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

/**
 * The form picks a calendar day; the API stores an instant. Sending a bare `yyyy-MM-dd` would store
 * midnight UTC, so a patient admitted "today" would sort below everyone admitted earlier today.
 * Keep the original timestamp when the day is unchanged, otherwise use that day at the current time.
 */
export const toAdmittedAt = (day: string, original?: string) => {
  if (original && toIsoDate(parseISO(original)) === day) return original
  const now = new Date()
  const date = parseISO(day)
  date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
  return date.toISOString()
}
