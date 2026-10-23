"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { doctorsApi, type DoctorListParams, type PatientListParams } from "@/lib/api/endpoints"
import { keepPreviousPage } from "@/lib/api/placeholder"
import { queryKeys } from "@/lib/api/query-keys"
import type { DoctorFormValues, PatientFormValues } from "@/lib/schemas"

export function useDoctors(params: DoctorListParams) {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.doctors.list(params)
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => doctorsApi.list(params, signal),
    placeholderData: keepPreviousPage(queryKey), // keep the current page visible while the next one loads
  })

  // Prefetch the next page so "Next" feels instant.
  const totalPages = query.data?.meta.totalPages ?? 0
  useEffect(() => {
    if (params.page < totalPages) {
      const next = { ...params, page: params.page + 1 }
      queryClient.prefetchQuery({
        queryKey: queryKeys.doctors.list(next),
        queryFn: ({ signal }) => doctorsApi.list(next, signal),
      })
    }
  }, [params, totalPages, queryClient])

  return query
}

export function useDoctor(id: string) {
  return useQuery({ queryKey: queryKeys.doctors.detail(id), queryFn: () => doctorsApi.get(id) })
}

export function useDoctorFilters() {
  return useQuery({ queryKey: queryKeys.doctors.filters, queryFn: doctorsApi.filters, staleTime: 5 * 60_000 })
}

export function useDoctorLookup(search: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.doctors.lookup(search),
    queryFn: ({ signal }) => doctorsApi.lookup(search, signal),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useDoctorPatients(id: string, params: Omit<PatientListParams, "doctor">) {
  const queryKey = queryKeys.doctors.patients(id, params)
  return useQuery({
    queryKey,
    queryFn: ({ signal }) => doctorsApi.patients(id, params, signal),
    placeholderData: keepPreviousPage(queryKey),
  })
}

/** Doctors, patients and stats are all affected by doctor/patient writes. */
function useInvalidateAll() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all }),
    ])
}

export function useSaveDoctor() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: DoctorFormValues }) =>
      id ? doctorsApi.update(id, values) : doctorsApi.create(values),
    onSuccess: (doctor, { id }) => {
      toast.success(id ? "Doctor updated" : "Doctor added", { description: doctor.name })
      return invalidate()
    },
  })
}

export function useDeleteDoctor() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: doctorsApi.remove,
    onSuccess: () => {
      toast.success("Doctor deleted")
      return invalidate()
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useAddDoctorPatient(doctorId: string) {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: (values: Omit<PatientFormValues, "doctor">) => doctorsApi.addPatient(doctorId, values),
    onSuccess: (patient) => {
      toast.success("Patient added", { description: patient.name })
      return invalidate()
    },
  })
}

export function useRemoveDoctorPatient(doctorId: string) {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: (patientId: string) => doctorsApi.removePatient(doctorId, patientId),
    onSuccess: () => {
      toast.success("Patient removed")
      return invalidate()
    },
    onError: (error) => toast.error(error.message),
  })
}

export { useInvalidateAll }
