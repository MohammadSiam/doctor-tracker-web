import { HeartPulse } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <HeartPulse className="size-4.5" />
      </div>
      {showText && (
        <div className="grid leading-tight">
          <span className="font-heading text-sm font-semibold">Doctor Tracker</span>
          <span className="text-xs text-muted-foreground">Admin Portal</span>
        </div>
      )}
    </div>
  )
}
