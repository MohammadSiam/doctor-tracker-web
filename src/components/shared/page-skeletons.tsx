import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TablePageSkeleton() {
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <Card className="gap-0 py-0">
        <div className="flex gap-2 border-b p-4">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-8 w-44" />
        </div>
        <div className="space-y-4 p-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </Card>
    </>
  )
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </>
  )
}
