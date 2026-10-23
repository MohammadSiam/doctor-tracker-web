"use client"

import { Eye, MoreHorizontal, Pencil, Plus, Stethoscope, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { DataTable, type Column } from "@/components/data-table/data-table"
import { DateRangeFilter } from "@/components/data-table/date-range-filter"
import { FilterSelect } from "@/components/data-table/filter-select"
import { SearchInput } from "@/components/data-table/search-input"
import { TablePagination } from "@/components/data-table/table-pagination"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteDoctor, useDoctorFilters, useDoctors } from "@/hooks/use-doctors"
import { useDoctorTableParams } from "@/hooks/use-table-params"
import { SPECIALIZATIONS } from "@/lib/constants"
import { formatDate, formatNumber, initials } from "@/lib/format"
import type { Doctor } from "@/lib/types"
import { DoctorFormDialog } from "./doctor-form-dialog"

export function DoctorsView() {
  const router = useRouter()
  const [params, setParams] = useDoctorTableParams()
  const { data, isLoading, isFetching, isError, error, refetch } = useDoctors(params)
  const { data: filterOptions } = useDoctorFilters()
  const deleteDoctor = useDeleteDoctor()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Doctor | null>(null)
  const [deleting, setDeleting] = useState<Doctor | null>(null)

  const hasFilters = Boolean(params.search || params.specialization || params.hospital || params.from || params.to)
  // Any filter change resets to page 1, otherwise you can land on an empty page.
  const setFilter = (patch: Partial<typeof params>) => setParams({ ...patch, page: 1 })

  const columns = useMemo<Column<Doctor>[]>(
    () => [
      {
        id: "name",
        header: "Doctor",
        sortKey: "name",
        cell: (doctor) => (
          <div className="flex min-w-0 items-center gap-3 sm:min-w-48">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{initials(doctor.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Link
                href={`/doctors/${doctor._id}`}
                onClick={(e) => e.stopPropagation()}
                className="block truncate font-medium hover:text-primary hover:underline"
              >
                {doctor.name}
              </Link>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">{doctor.email}</p>
              <p className="truncate text-xs text-muted-foreground sm:hidden">{doctor.specialization}</p>
            </div>
          </div>
        ),
      },
      {
        id: "specialization",
        header: "Specialization",
        className: "hidden sm:table-cell",
        cell: (doctor) => <Badge variant="secondary">{doctor.specialization}</Badge>,
      },
      {
        id: "hospital",
        header: "Hospital",
        className: "hidden lg:table-cell",
        cell: (doctor) => <span className="text-muted-foreground">{doctor.hospital}</span>,
      },
      {
        id: "phone",
        header: "Phone",
        className: "hidden xl:table-cell",
        cell: (doctor) => <span className="font-mono text-xs text-muted-foreground">{doctor.phone}</span>,
      },
      {
        id: "patients",
        header: "Patients",
        sortKey: "patientCount",
        className: "text-right",
        cell: (doctor) => <span className="font-medium tabular-nums">{formatNumber(doctor.patientCount)}</span>,
      },
      {
        id: "joined",
        header: "Joined",
        sortKey: "createdAt",
        className: "hidden md:table-cell",
        cell: (doctor) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(doctor.createdAt)}</span>,
      },
      {
        id: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "w-12",
        cell: (doctor) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${doctor.name}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <Link href={`/doctors/${doctor._id}`}>
                  <Eye /> View patients
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setEditing(doctor)
                  setFormOpen(true)
                }}
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(doctor)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Manage doctor profiles and see each doctor's patient load."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus /> Add doctor
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchInput
            value={params.search}
            onChange={(search) => setFilter({ search })}
            placeholder="Search name, email, hospital…"
          />
          <FilterSelect
            value={params.specialization}
            onChange={(specialization) => setFilter({ specialization })}
            options={SPECIALIZATIONS}
            placeholder="All specializations"
          />
          <FilterSelect
            value={params.hospital}
            onChange={(hospital) => setFilter({ hospital })}
            options={filterOptions?.hospitals ?? []}
            placeholder="All hospitals"
            className="sm:w-56"
          />
          <DateRangeFilter from={params.from} to={params.to} onChange={(range) => setFilter(range)} label="Joined date" />
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="sm:ml-auto"
              onClick={() => setParams({ search: "", specialization: null, hospital: null, from: null, to: null, page: 1 })}
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
              getRowId={(doctor) => doctor._id}
              isLoading={isLoading}
              isFetching={isFetching}
              sort={params.sort}
              onSortChange={(sort) => setParams({ sort, page: 1 })}
              onRowClick={(doctor) => router.push(`/doctors/${doctor._id}`)}
              skeletonRows={params.limit}
              empty={
                hasFilters ? (
                  <EmptyState icon={Stethoscope} title="No doctors match your filters" description="Try a different search term or clear the filters." />
                ) : (
                  <EmptyState
                    icon={Stethoscope}
                    title="No doctors yet"
                    description="Add your first doctor to start tracking patients."
                    action={
                      <Button size="sm" onClick={() => setFormOpen(true)}>
                        <Plus /> Add doctor
                      </Button>
                    }
                  />
                )
              }
            />
            <TablePagination
              meta={data?.meta}
              onPageChange={(page) => setParams({ page })}
              onLimitChange={(limit) => setParams({ limit, page: 1 })}
            />
          </>
        )}
      </Card>

      <DoctorFormDialog open={formOpen} onOpenChange={setFormOpen} doctor={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete doctor?"
        description={
          <>
            <span className="font-medium text-foreground">{deleting?.name}</span> and their{" "}
            <span className="font-medium text-foreground">{deleting?.patientCount ?? 0} patient record(s)</span> will be permanently
            deleted. This can&apos;t be undone.
          </>
        }
        pending={deleteDoctor.isPending}
        onConfirm={() => deleteDoctor.mutate(deleting!._id, { onSuccess: () => setDeleting(null) })}
      />
    </>
  )
}
