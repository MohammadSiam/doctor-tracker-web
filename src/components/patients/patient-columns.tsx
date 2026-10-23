"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Column } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/format"
import type { Patient } from "@/lib/types"
import { ConditionBadge } from "./condition-badge"

interface Options {
  showDoctor: boolean
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
  deleteLabel?: string
}

/** Shared by the Patients page and the doctor detail page. Build it inside useMemo. */
export function buildPatientColumns({ showDoctor, onEdit, onDelete, deleteLabel = "Delete" }: Options): Column<Patient>[] {
  return [
    {
      id: "name",
      header: "Patient",
      sortKey: "name",
      cell: (p) => (
        <div className="min-w-40">
          <p className="font-medium">{p.name}</p>
          <p className="text-xs text-muted-foreground">
            {p.age} yrs · {p.gender}
          </p>
        </div>
      ),
    },
    {
      id: "condition",
      header: "Condition",
      cell: (p) => <ConditionBadge condition={p.condition} />,
    },
    {
      id: "diagnosis",
      header: "Diagnosis",
      className: "hidden md:table-cell",
      cell: (p) => <span className="text-muted-foreground">{p.diagnosis}</span>,
    },
    ...(showDoctor
      ? [
          {
            id: "doctor",
            header: "Doctor",
            className: "hidden lg:table-cell",
            cell: (p: Patient) =>
              p.doctor ? (
                <Link href={`/doctors/${p.doctor._id}`} className="block min-w-36 hover:text-primary hover:underline">
                  <span className="block truncate">{p.doctor.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.doctor.specialization}</span>
                </Link>
              ) : (
                <span className="text-muted-foreground">—</span>
              ),
          },
        ]
      : []),
    {
      id: "phone",
      header: "Phone",
      className: "hidden xl:table-cell",
      cell: (p) => <span className="font-mono text-xs text-muted-foreground">{p.phone}</span>,
    },
    {
      id: "admitted",
      header: "Admitted",
      sortKey: "admittedAt",
      className: "hidden sm:table-cell",
      cell: (p) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(p.admittedAt)}</span>,
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-12",
      cell: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${p.name}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(p)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(p)}>
              <Trash2 /> {deleteLabel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
