"use client"

import { Activity, HeartPulse, Stethoscope, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { Card } from "@/components/ui/card"
import { useStatsOverview } from "@/hooks/use-stats"
import { formatNumber } from "@/lib/format"
import { AdmissionsChart } from "./admissions-chart"
import { AgeChart } from "./age-chart"
import { BarListChart } from "./bar-list-chart"
import { ChartCard } from "./chart-card"
import { ConditionChart } from "./condition-chart"
import { StatCard } from "./stat-card"

export function DashboardView() {
  const router = useRouter()
  const { data, isLoading, isError, error, refetch } = useStatsOverview()
  const totals = data?.totals

  if (isError) {
    return (
      <Card>
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader title="Dashboard" description="A live overview of doctors, patients and admissions." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total doctors" icon={Stethoscope} value={totals && formatNumber(totals.doctors)} hint={totals && `+${totals.doctorsThisMonth} joined this month`} />
        <StatCard
          label="Total patients"
          icon={Users}
          value={totals && formatNumber(totals.patients)}
          trend={totals?.patientsGrowth}
          hint={totals && `${formatNumber(totals.patientsThisMonth)} admitted this month`}
        />
        <StatCard
          label="Critical patients"
          icon={HeartPulse}
          tone="critical"
          value={totals && formatNumber(totals.critical)}
          hint={totals && `${totals.patients ? ((totals.critical / totals.patients) * 100).toFixed(1) : 0}% of all patients`}
        />
        <StatCard label="Avg. patients / doctor" icon={Activity} value={totals && String(totals.avgPatientsPerDoctor)} hint="Across all doctors" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdmissionsChart />
        <ConditionChart data={data?.conditions} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Patients per doctor" description="Top 10 doctors by patient count. Click a bar to open the doctor." loading={isLoading}>
          <BarListChart
            data={data?.topDoctors ?? []}
            categoryKey="name"
            valueKey="patientCount"
            valueLabel="Patients"
            onBarClick={(doctor) => router.push(`/doctors/${doctor._id}`)}
          />
        </ChartCard>
        <ChartCard title="Patients by specialization" description="Total patients handled by each specialty" loading={isLoading}>
          <BarListChart data={data?.specializations ?? []} categoryKey="name" valueKey="patients" valueLabel="Patients" height={420} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AgeChart data={data?.ageGroups} loading={isLoading} />
        <ChartCard title="Gender split" description="Patients by gender" loading={isLoading} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            {(data?.genders ?? []).map((g) => {
              const share = totals?.patients ? (g.value / totals.patients) * 100 : 0
              return (
                <div key={g.name} className="space-y-2 rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">{g.name}</p>
                  <p className="font-heading text-2xl font-semibold tabular-nums">{formatNumber(g.value)}</p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${share.toFixed(1)}%`}>
                    <div className="h-full rounded-full bg-(--series-1)" style={{ width: `${share}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground tabular-nums">{share.toFixed(1)}% of patients</p>
                </div>
              )
            })}
          </div>
        </ChartCard>
      </div>
    </>
  )
}
