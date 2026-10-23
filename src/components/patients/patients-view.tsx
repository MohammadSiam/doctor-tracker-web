"use client"

import { Plus, Users, X } from "lucide-react"
import { useMemo, useState } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { DateRangeFilter } from "@/components/data-table/date-range-filter"
import { FilterSelect } from "@/components/data-table/filter-select"
import { SearchInput } from "@/components/data-table/search-input"
import { TablePagination } from "@/components/data-table/table-pagination"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDeletePatient, usePatients } from "@/hooks/use-patients"
import { usePatientTableParams } from "@/hooks/use-table-params"
import { CONDITIONS, GENDERS } from "@/lib/constants"
import type { Patient } from "@/lib/types"
import { DoctorCombobox } from "./doctor-combobox"
import { buildPatientColumns } from "./patient-columns"
import { PatientFormDialog } from "./patient-form-dialog"

export function PatientsView() {
  const [params, setParams] = usePatientTableParams()
  const { data, isLoading, isFetching, isError, error, refetch } = usePatients(params)
  const deletePatient = useDeletePatient()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [deleting, setDeleting] = useState<Patient | null>(null)

  const hasFilters = Boolean(params.search || params.condition || params.gender || params.doctor || params.from || params.to)
  const setFilter = (patch: Partial<typeof params>) => setParams({ ...patch, page: 1 })

  const columns = useMemo(
    () =>
      buildPatientColumns({
        showDoctor: true,
        onEdit: (patient) => {
          setEditing(patient)
          setFormOpen(true)
        },
        onDelete: setDeleting,
      }),
    [],
  )

  return (
    <>
      <PageHeader
        title="Patients"
        description="Every patient across all doctors. Search, filter and update records."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus /> Add patient
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchInput value={params.search} onChange={(search) => setFilter({ search })} placeholder="Search name, phone, diagnosis…" />
          <FilterSelect value={params.condition} onChange={(condition) => setFilter({ condition })} options={CONDITIONS} placeholder="All conditions" className="sm:w-40" />
          <FilterSelect value={params.gender} onChange={(gender) => setFilter({ gender })} options={GENDERS} placeholder="All genders" className="sm:w-36" />
          <div className="flex w-full gap-1 sm:w-56">
            <DoctorCombobox
              value={params.doctor ?? ""}
              onChange={(doctor) => setFilter({ doctor })}
              placeholder="All doctors"
              className={params.doctor ? "border-primary/40 bg-accent/40" : undefined}
            />
            {params.doctor && (
              <Button variant="ghost" size="icon" onClick={() => setFilter({ doctor: null })} aria-label="Clear doctor filter">
                <X />
              </Button>
            )}
          </div>
          <DateRangeFilter from={params.from} to={params.to} onChange={(range) => setFilter(range)} label="Admission date" />
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="sm:ml-auto"
              onClick={() => setParams({ search: "", condition: null, gender: null, doctor: null, from: null, to: null, page: 1 })}
            >
              Clear filters
            </Button>
          )}
        </div>

        {isError ? (
          <ErrorState message={error.message} onRetry={() => refetch()} />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data?.data}
              getRowId={(p) => p._id}
              isLoading={isLoading}
              isFetching={isFetching}
              sort={params.sort}
              onSortChange={(sort) => setParams({ sort, page: 1 })}
              skeletonRows={params.limit}
              empty={
                <EmptyState
                  icon={Users}
                  title={hasFilters ? "No patients match your filters" : "No patients yet"}
                  description={hasFilters ? "Try a different search term or clear the filters." : "Patients you add will appear here."}
                />
              }
            />
            <TablePagination meta={data?.meta} onPageChange={(page) => setParams({ page })} onLimitChange={(limit) => setParams({ limit, page: 1 })} />
          </>
        )}
      </Card>

      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} patient={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete patient?"
        description={
          <>
            The record for <span className="font-medium text-foreground">{deleting?.name}</span> will be permanently deleted.
          </>
        }
        pending={deletePatient.isPending}
        onConfirm={() => deletePatient.mutate(deleting!._id, { onSuccess: () => setDeleting(null) })}
      />
    </>
  )
}
