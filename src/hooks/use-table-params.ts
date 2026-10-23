"use client"

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs"
import { CONDITIONS, GENDERS, SPECIALIZATIONS } from "@/lib/constants"

/**
 * List state (page, filters, sort) lives in the URL, so it survives refreshes,
 * can be shared as a link, and works with the browser back button.
 * `clearOnDefault` keeps URLs short (`/doctors` rather than `/doctors?page=1&limit=10`).
 */
const common = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
  from: parseAsString,
  to: parseAsString,
}

export const doctorParsers = {
  ...common,
  specialization: parseAsStringLiteral(SPECIALIZATIONS),
  hospital: parseAsString,
  sort: parseAsString.withDefault("-createdAt"),
}

export const patientParsers = {
  ...common,
  condition: parseAsStringLiteral(CONDITIONS),
  gender: parseAsStringLiteral(GENDERS),
  doctor: parseAsString,
  sort: parseAsString.withDefault("-admittedAt"),
}

const options = { clearOnDefault: true, history: "replace" } as const

export const useDoctorTableParams = () => useQueryStates(doctorParsers, options)
export const usePatientTableParams = () => useQueryStates(patientParsers, options)
