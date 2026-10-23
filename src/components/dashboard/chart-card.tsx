import type { ReactNode } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  description?: string
  action?: ReactNode
  loading?: boolean
  className?: string
  children: ReactNode
}

export function ChartCard({ title, description, action, loading, className, children }: ChartCardProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle className="font-heading">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex-1">{loading ? <Skeleton className="h-64 w-full" /> : children}</CardContent>
    </Card>
  )
}
