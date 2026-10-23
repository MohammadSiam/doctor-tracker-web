import { Badge } from "@/components/ui/badge"
import type { Condition } from "@/lib/types"
import { cn } from "@/lib/utils"

export const CONDITION_STYLES: Record<Condition, { badge: string; dot: string }> = {
  Stable: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  Recovering: { badge: "bg-sky-500/10 text-sky-700 dark:text-sky-400", dot: "bg-sky-500" },
  Critical: { badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400", dot: "bg-rose-500" },
  Discharged: { badge: "bg-slate-500/10 text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
}

export function ConditionBadge({ condition }: { condition: Condition }) {
  const style = CONDITION_STYLES[condition]
  return (
    <Badge variant="outline" className={cn("gap-1.5 border-transparent font-medium", style.badge)}>
      <span className={cn("size-1.5 rounded-full", style.dot, condition === "Critical" && "animate-pulse")} />
      {condition}
    </Badge>
  )
}
