import type {
  Doctor,
  DoctorSummary,
  Paginated,
  Patient,
  StatsOverview,
  TimeseriesPoint,
  TimeseriesRange,
  User,
} from "@/lib/types"
import { api, type ApiResponse } from "./client"
import type { DoctorFormValues, PatientFormValues } from "@/lib/schemas"

export interface DoctorListParams {
  page: number
  limit: number
  search?: string
  specialization?: string | null
  hospital?: string | null
  from?: string | null
  to?: string | null
  sort?: string
}

export interface PatientListParams {
  page: number
  limit: number
  search?: string
  condition?: string | null
  gender?: string | null
  doctor?: string | null
  from?: string | null
  to?: string | null
  sort?: string
}

const unwrap = <T,>(promise: Promise<ApiResponse<T>>) => promise.then((res) => res.data)

export const authApi = {
  login: (body: { email: string; password: string }) =>
    unwrap(api<ApiResponse<User>>("/auth/login", { method: "POST", body })),
  logout: () => api<void>("/auth/logout", { method: "POST" }),
  me: () => unwrap(api<ApiResponse<User>>("/auth/me")),
}

export const doctorsApi = {
  list: (params: DoctorListParams, signal?: AbortSignal) =>
    api<Paginated<Doctor>>("/doctors", { query: { ...params }, signal }),
  get: (id: string) => unwrap(api<ApiResponse<Doctor>>(`/doctors/${id}`)),
  create: (body: DoctorFormValues) => unwrap(api<ApiResponse<Doctor>>("/doctors", { method: "POST", body })),
  update: (id: string, body: Partial<DoctorFormValues>) =>
    unwrap(api<ApiResponse<Doctor>>(`/doctors/${id}`, { method: "PATCH", body })),
  remove: (id: string) => api<void>(`/doctors/${id}`, { method: "DELETE" }),
  filters: () => unwrap(api<ApiResponse<{ specializations: string[]; hospitals: string[] }>>("/doctors/filters")),
  lookup: (search: string, signal?: AbortSignal) =>
    unwrap(api<ApiResponse<DoctorSummary[]>>("/doctors/lookup", { query: { search }, signal })),
  patients: (id: string, params: Omit<PatientListParams, "doctor">, signal?: AbortSignal) =>
    api<Paginated<Patient>>(`/doctors/${id}/patients`, { query: { ...params }, signal }),
  addPatient: (id: string, body: Omit<PatientFormValues, "doctor">) =>
    unwrap(api<ApiResponse<Patient>>(`/doctors/${id}/patients`, { method: "POST", body })),
  removePatient: (id: string, patientId: string) =>
    api<void>(`/doctors/${id}/patients/${patientId}`, { method: "DELETE" }),
}

export const patientsApi = {
  list: (params: PatientListParams, signal?: AbortSignal) =>
    api<Paginated<Patient>>("/patients", { query: { ...params }, signal }),
  create: (body: PatientFormValues) => unwrap(api<ApiResponse<Patient>>("/patients", { method: "POST", body })),
  update: (id: string, body: Partial<PatientFormValues>) =>
    unwrap(api<ApiResponse<Patient>>(`/patients/${id}`, { method: "PATCH", body })),
  remove: (id: string) => api<void>(`/patients/${id}`, { method: "DELETE" }),
}

export const statsApi = {
  overview: () => unwrap(api<ApiResponse<StatsOverview>>("/stats/overview")),
  timeseries: (range: TimeseriesRange) =>
    unwrap(api<ApiResponse<TimeseriesPoint[]>>("/stats/timeseries", { query: { range } })),
}
