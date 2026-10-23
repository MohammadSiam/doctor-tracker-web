"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { NamedValue } from "@/lib/types"
import { ChartCard } from "./chart-card"

const config = { value: { label: "Patients", color: "var(--series-1)" } } satisfies ChartConfig

export function AgeChart({ data, loading }: { data?: NamedValue[]; loading: boolean }) {
  return (
    <ChartCard title="Age distribution" description="Patients by age group" loading={loading}>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <BarChart data={data} margin={{ left: -16, top: 8 }} barCategoryGap="20%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
