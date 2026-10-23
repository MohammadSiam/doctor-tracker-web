import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | undefined
  icon: LucideIcon
  hint?: string
  trend?: number
  tone?: "default" | "critical"
}

export function StatCard({ label, value, icon: Icon, hint, trend, tone = "default" }: StatCardProps) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            tone === "critical" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </div>
      {value === undefined ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {trend !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
              trend >= 0 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
            )}
          >
            {trend >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
        {hint && <span>{hint}</span>}
      </div>
    </Card>
  )
}
