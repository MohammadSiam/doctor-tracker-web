import type { Metadata } from "next"
import { Suspense } from "react"
import { DoctorsView } from "@/components/doctors/doctors-view"
import { TablePageSkeleton } from "@/components/shared/page-skeletons"

export const metadata: Metadata = { title: "Doctors" }

export default function DoctorsPage() {
  // The view reads filters from the URL, so it renders inside a Suspense boundary.
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <DoctorsView />
    </Suspense>
  )
}
