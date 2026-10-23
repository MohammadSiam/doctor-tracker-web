"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { patientsApi, type PatientListParams } from "@/lib/api/endpoints"
import { keepPreviousPage } from "@/lib/api/placeholder"
import { queryKeys } from "@/lib/api/query-keys"
import type { PatientFormValues } from "@/lib/schemas"
import { useInvalidateAll } from "./use-doctors"

export function usePatients(params: PatientListParams) {
  const queryKey = queryKeys.patients.list(params)
  return useQuery({
    queryKey,
    queryFn: ({ signal }) => patientsApi.list(params, signal),
    placeholderData: keepPreviousPage(queryKey),
  })
}

export function useSavePatient() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: PatientFormValues }) =>
      id ? patientsApi.update(id, values) : patientsApi.create(values),
    onSuccess: (patient, { id }) => {
      toast.success(id ? "Patient updated" : "Patient added", { description: patient.name })
      return invalidate()
    },
  })
}

export function useDeletePatient() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: patientsApi.remove,
    onSuccess: () => {
      toast.success("Patient deleted")
      return invalidate()
    },
    onError: (error) => toast.error(error.message),
  })
}
