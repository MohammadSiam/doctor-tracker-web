"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { patientsApi, type PatientListParams } from "@/lib/api/endpoints"
import { keepPreviousPage } from "@/lib/api/placeholder"
import { queryKeys } from "@/lib/api/query-keys"
import type { PatientFormValues } from "@/lib/schemas"
import { useInvalidateAll } from "./use-doctors"

export function usePatients(params: PatientListParams) {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.patients.list(params)
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => patientsApi.list(params, signal),
    placeholderData: keepPreviousPage(queryKey),
  })

  const totalPages = query.data?.meta.totalPages ?? 0
  useEffect(() => {
    if (params.page < totalPages) {
      const next = { ...params, page: params.page + 1 }
      queryClient.prefetchQuery({
        queryKey: queryKeys.patients.list(next),
        queryFn: ({ signal }) => patientsApi.list(next, signal),
      })
    }
  }, [params, totalPages, queryClient])

  return query
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
