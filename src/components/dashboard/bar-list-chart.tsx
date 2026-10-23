"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface BarListChartProps<T> {
  data: T[]
  categoryKey: Extract<keyof T, string>
  valueKey: Extract<keyof T, string>
  valueLabel: string
  height?: number
  onBarClick?: (row: T) => void
}

/** Horizontal bars for ranked categories: one series, one color, values at the bar end. */
export function BarListChart<T extends object>({ data, categoryKey, valueKey, valueLabel, height = 320, onBarClick }: BarListChartProps<T>) {
  const config = { [valueKey]: { label: valueLabel, color: "var(--series-1)" } } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={data as Record<string, unknown>[]} layout="vertical" margin={{ left: 0, right: 40 }} barCategoryGap={4}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey={categoryKey as string}
          tickLine={false}
          axisLine={false}
          width={132}
          tickFormatter={(value: string) => (value.length > 18 ? `${value.slice(0, 17)}…` : value)}
        />
        <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent />} />
        <Bar
          dataKey={valueKey as string}
          minPointSize={2}
          fill={`var(--color-${valueKey})`}
          radius={[0, 4, 4, 0]}
          className={onBarClick ? "cursor-pointer" : undefined}
          onClick={onBarClick ? (entry) => onBarClick(entry.payload as unknown as T) : undefined}
        >
          <LabelList dataKey={valueKey as string} position="right" offset={8} className="fill-foreground text-xs tabular-nums" />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
