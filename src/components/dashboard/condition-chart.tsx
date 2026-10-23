"use client"

import { Cell, Label, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { CONDITIONS } from "@/lib/constants"
import { formatNumber } from "@/lib/format"
import type { NamedValue } from "@/lib/types"
import { ChartCard } from "./chart-card"

// Conditions are states, so they use the status colors (also used by the badges), not series colors.
const config = {
  Stable: { label: "Stable", color: "var(--status-stable)" },
  Recovering: { label: "Recovering", color: "var(--status-recovering)" },
  Critical: { label: "Critical", color: "var(--status-critical)" },
  Discharged: { label: "Discharged", color: "var(--status-discharged)" },
} satisfies ChartConfig

export function ConditionChart({ data, loading }: { data?: NamedValue[]; loading: boolean }) {
  // Fixed order so each condition keeps its position and color regardless of counts.
  const rows = CONDITIONS.map((name) => ({ name, value: data?.find((d) => d.name === name)?.value ?? 0 }))
  const total = rows.reduce((sum, row) => sum + row.value, 0)

  return (
    <ChartCard title="Patient conditions" description="Current condition of all patients" loading={loading}>
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
        <ChartContainer config={config} className="aspect-square h-52 shrink-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie data={rows} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
              {rows.map((row) => (
                <Cell key={row.name} fill={`var(--color-${row.name})`} />
              ))}
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-semibold">
                        {formatNumber(total)}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                        patients
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="grid w-full flex-1 gap-2.5">
          {rows.map((row) => (
            <li key={row.name} className="flex items-center gap-2.5 text-sm">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: config[row.name].color }} />
              <span className="flex-1 text-muted-foreground">{row.name}</span>
              <span className="font-medium tabular-nums">{formatNumber(row.value)}</span>
              <span className="w-11 text-right text-xs text-muted-foreground tabular-nums">
                {total ? Math.round((row.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}
