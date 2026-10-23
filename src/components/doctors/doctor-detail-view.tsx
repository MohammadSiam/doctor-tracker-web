"use client"

import { ArrowLeft, Building2, CalendarDays, Mail, Pencil, Phone, Plus, UserRoundX, Users } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { DateRangeFilter } from "@/components/data-table/date-range-filter"
import { FilterSelect } from "@/components/data-table/filter-select"
import { SearchInput } from "@/components/data-table/search-input"
import { TablePagination } from "@/components/data-table/table-pagination"
import { buildPatientColumns } from "@/components/patients/patient-columns"
import { PatientFormDialog } from "@/components/patients/patient-form-dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDoctor, useDoctorPatients, useRemoveDoctorPatient } from "@/hooks/use-doctors"
import { usePatientTableParams } from "@/hooks/use-table-params"
import { ApiError } from "@/lib/api/client"
import { CONDITIONS } from "@/lib/constants"
import { formatDate, formatNumber, initials } from "@/lib/format"
import type { Patient } from "@/lib/types"
import { DoctorFormDialog } from "./doctor-form-dialog"

function InfoItem({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="truncate text-sm font-medium">{children}</div>
      </div>
    </div>
  )
}

export function DoctorDetailView() {
  const { id } = useParams<{ id: string }>()
  const doctorQuery = useDoctor(id)
  const doctor = doctorQuery.data

  const [params, setParams] = usePatientTableParams()
  // The doctor comes from the route; the gender filter isn't offered on this page.
  const { page, limit, search, condition, from, to, sort } = params
  const listParams = { page, limit, search, condition, from, to, sort }
  const patientsQuery = useDoctorPatients(id, listParams)
  const removePatient = useRemoveDoctorPatient(id)

  const [editDoctorOpen, setEditDoctorOpen] = useState(false)
  const [patientFormOpen, setPatientFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [removing, setRemoving] = useState<Patient | null>(null)

  const hasFilters = Boolean(params.search || params.condition || params.from || params.to)
  const setFilter = (patch: Partial<typeof params>) => setParams({ ...patch, page: 1 })

  const columns = useMemo(
    () =>
      buildPatientColumns({
        showDoctor: false,
        deleteLabel: "Remove from list",
        onEdit: (patient) => {
          setEditingPatient(patient)
          setPatientFormOpen(true)
        },
        onDelete: setRemoving,
      }),
    [],
  )

  if (doctorQuery.error instanceof ApiError && doctorQuery.error.status === 404) {
    return (
      <Card>
        <EmptyState
          icon={UserRoundX}
          title="Doctor not found"
          description="This doctor may have been deleted."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/doctors">
                <ArrowLeft /> Back to doctors
              </Link>
            </Button>
          }
        />
      </Card>
    )
  }

  if (doctorQuery.isError) return <ErrorState message={doctorQuery.error.message} onRetry={() => doctorQuery.refetch()} />

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
        <Link href="/doctors">
          <ArrowLeft /> All doctors
        </Link>
      </Button>

      <Card className="overflow-hidden py-0">
        <div className="h-20 bg-linear-to-r from-primary/80 via-primary/60 to-chart-2/60" />
        <CardContent className="-mt-10 space-y-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-20 border-4 border-card shadow-sm">
                <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                  {doctor ? initials(doctor.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5 pb-1">
                {doctor ? (
                  <>
                    <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">{doctor.name}</h1>
                    <Badge variant="secondary">{doctor.specialization}</Badge>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-5 w-24" />
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDoctorOpen(true)} disabled={!doctor}>
                <Pencil /> Edit
              </Button>
              <Button
                onClick={() => {
                  setEditingPatient(null)
                  setPatientFormOpen(true)
                }}
                disabled={!doctor}
              >
                <Plus /> Add patient
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doctor ? (
              <>
                <InfoItem icon={Building2} label="Hospital">
                  {doctor.hospital}
                </InfoItem>
                <InfoItem icon={Phone} label="Phone">
                  <a href={`tel:${doctor.phone}`} className="hover:text-primary">
                    {doctor.phone}
                  </a>
                </InfoItem>
                <InfoItem icon={Mail} label="Email">
                  <a href={`mailto:${doctor.email}`} className="hover:text-primary">
                    {doctor.email}
                  </a>
                </InfoItem>
                <InfoItem icon={CalendarDays} label="Joined">
                  {formatDate(doctor.createdAt)}
                </InfoItem>
              </>
            ) : (
              Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-10" />)
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex items-center justify-between gap-3 border-b px-4 pt-4 pb-3">
          <div>
            <h2 className="font-heading font-semibold">Patients</h2>
            <p className="text-sm text-muted-foreground">
              {doctor ? `${formatNumber(doctor.patientCount)} patient(s) under this doctor` : "Loading…"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchInput value={params.search} onChange={(search) => setFilter({ search })} placeholder="Search patients…" />
          <FilterSelect value={params.condition} onChange={(condition) => setFilter({ condition })} options={CONDITIONS} placeholder="All conditions" className="sm:w-40" />
          <DateRangeFilter from={params.from} to={params.to} onChange={(range) => setFilter(range)} label="Admission date" />
          {hasFilters && (
            <Button variant="ghost" size="sm" className="sm:ml-auto" onClick={() => setParams({ search: "", condition: null, from: null, to: null, page: 1 })}>
              Clear filters
            </Button>
          )}
        </div>
        {patientsQuery.isError ? (
          <ErrorState message={patientsQuery.error.message} onRetry={() => patientsQuery.refetch()} />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={patientsQuery.data?.data}
              getRowId={(p) => p._id}
              isLoading={patientsQuery.isLoading}
              isFetching={patientsQuery.isFetching}
              sort={params.sort}
              onSortChange={(sort) => setParams({ sort, page: 1 })}
              skeletonRows={5}
              empty={
                <EmptyState
                  icon={Users}
                  title={hasFilters ? "No patients match your filters" : "No patients yet"}
                  description={hasFilters ? "Try a different search or clear the filters." : "Add the first patient for this doctor."}
                  action={
                    !hasFilters && doctor ? (
                      <Button size="sm" onClick={() => setPatientFormOpen(true)}>
                        <Plus /> Add patient
                      </Button>
                    ) : undefined
                  }
                />
              }
            />
            <TablePagination
              meta={patientsQuery.data?.meta}
              onPageChange={(page) => setParams({ page })}
              onLimitChange={(limit) => setParams({ limit, page: 1 })}
            />
          </>
        )}
      </Card>

      <DoctorFormDialog open={editDoctorOpen} onOpenChange={setEditDoctorOpen} doctor={doctor} />
      {doctor && (
        <PatientFormDialog
          open={patientFormOpen}
          onOpenChange={setPatientFormOpen}
          patient={editingPatient}
          fixedDoctor={{ _id: doctor._id, name: doctor.name, specialization: doctor.specialization, hospital: doctor.hospital }}
        />
      )}
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove patient?"
        description={
          <>
            <span className="font-medium text-foreground">{removing?.name}</span> will be removed from {doctor?.name}&apos;s patient list and
            their record deleted.
          </>
        }
        confirmLabel="Remove"
        pending={removePatient.isPending}
        onConfirm={() => removePatient.mutate(removing!._id, { onSuccess: () => setRemoving(null) })}
      />
    </>
  )
}
