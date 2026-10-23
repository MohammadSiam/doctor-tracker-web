import type { CONDITIONS, GENDERS, SPECIALIZATIONS } from "./constants"

export type Specialization = (typeof SPECIALIZATIONS)[number]
export type Condition = (typeof CONDITIONS)[number]
export type Gender = (typeof GENDERS)[number]

export interface User {
  id: string
  name: string
  email: string
  role: "admin"
}

export interface Doctor {
  _id: string
  name: string
  specialization: Specialization
  hospital: string
  phone: string
  email: string
  patientCount: number
  createdAt: string
  updatedAt: string
}

export type DoctorSummary = Pick<Doctor, "_id" | "name" | "specialization" | "hospital">

export interface Patient {
  _id: string
  name: string
  age: number
  gender: Gender
  phone: string
  email?: string
  condition: Condition
  diagnosis: string
  notes?: string
  admittedAt: string
  doctor: DoctorSummary | null
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

export interface NamedValue {
  name: string
  value: number
}

export interface StatsOverview {
  totals: {
    doctors: number
    patients: number
    critical: number
    avgPatientsPerDoctor: number
    patientsThisMonth: number
    patientsGrowth: number
    doctorsThisMonth: number
  }
  conditions: NamedValue[]
  genders: NamedValue[]
  ageGroups: NamedValue[]
  specializations: { name: string; doctors: number; patients: number }[]
  topDoctors: Pick<Doctor, "_id" | "name" | "specialization" | "patientCount">[]
}

export type TimeseriesRange = "7d" | "30d" | "90d" | "12m"

export interface TimeseriesPoint {
  date: string
  patients: number
  critical: number
  doctors: number
}
