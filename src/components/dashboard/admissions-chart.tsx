"use client"

import { format, parseISO } from "date-fns"
import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTimeseries } from "@/hooks/use-stats"
import { formatNumber } from "@/lib/format"
import type { TimeseriesRange } from "@/lib/types"
import { ChartCard } from "./chart-card"

const config = {
  patients: { label: "Admissions", color: "var(--series-1)" },
  critical: { label: "Critical", color: "var(--series-2)" },
} satisfies ChartConfig

const RANGES: { value: TimeseriesRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "12m", label: "12M" },
]

export function AdmissionsChart() {
  const [range, setRange] = useState<TimeseriesRange>("30d")
  const { data, isLoading } = useTimeseries(range)
  const monthly = range === "12m"
  const total = data?.reduce((sum, point) => sum + point.patients, 0) ?? 0

  const tickFormat = (value: string) => format(parseISO(value), monthly ? "MMM" : "MMM d")

  return (
    <ChartCard
      title="Patient admissions"
      description={data ? `${formatNumber(total)} admissions in the selected period` : "Admissions over time"}
      loading={isLoading}
      className="lg:col-span-2"
      action={
        <Tabs value={range} onValueChange={(value) => setRange(value as TimeseriesRange)}>
          <TabsList>
            {RANGES.map((r) => (
              <TabsTrigger key={r.value} value={r.value} className="px-2.5 text-xs">
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    >
      <ChartContainer config={config} className="aspect-auto h-72 w-full">
        <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fill-patients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-patients)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-patients)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={tickFormat} />
          <YAxis tickLine={false} axisLine={false} width={44} allowDecimals={false} />
          <ChartTooltip
            cursor={{ strokeDasharray: "4 4" }}
            content={<ChartTooltipContent indicator="line" labelFormatter={(value) => format(parseISO(String(value)), monthly ? "MMMM yyyy" : "EEE, MMM d, yyyy")} />}
          />
          <Area dataKey="patients" type="monotone" stroke="var(--color-patients)" strokeWidth={2} fill="url(#fill-patients)" activeDot={{ r: 4 }} />
          <Area dataKey="critical" type="monotone" stroke="var(--color-critical)" strokeWidth={2} fill="transparent" activeDot={{ r: 4 }} />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}
