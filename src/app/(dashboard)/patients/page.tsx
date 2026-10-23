import type { Metadata } from "next"
import { Suspense } from "react"
import { PatientsView } from "@/components/patients/patients-view"
import { TablePageSkeleton } from "@/components/shared/page-skeletons"

export const metadata: Metadata = { title: "Patients" }

export default function PatientsPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <PatientsView />
    </Suspense>
  )
}
