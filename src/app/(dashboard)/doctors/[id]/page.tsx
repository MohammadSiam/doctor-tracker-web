import type { Metadata } from "next"
import { Suspense } from "react"
import { DoctorDetailView } from "@/components/doctors/doctor-detail-view"
import { TablePageSkeleton } from "@/components/shared/page-skeletons"

export const metadata: Metadata = { title: "Doctor details" }

export default function DoctorDetailPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <DoctorDetailView />
    </Suspense>
  )
}
