import type { TimeseriesRange } from "@/lib/types"
import type { DoctorListParams, PatientListParams } from "./endpoints"

/**
 * Hierarchical keys so one invalidation clears everything below it,
 * e.g. invalidating `doctors.all` refreshes lists, details and per-doctor patient lists.
 */
export const queryKeys = {
  me: ["me"] as const,
  doctors: {
    all: ["doctors"] as const,
    list: (params: DoctorListParams) => ["doctors", "list", params] as const,
    detail: (id: string) => ["doctors", "detail", id] as const,
    patients: (id: string, params: Omit<PatientListParams, "doctor">) => ["doctors", "detail", id, "patients", params] as const,
    filters: ["doctors", "filters"] as const,
    lookup: (search: string) => ["doctors", "lookup", search] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (params: PatientListParams) => ["patients", "list", params] as const,
  },
  stats: {
    all: ["stats"] as const,
    overview: ["stats", "overview"] as const,
    timeseries: (range: TimeseriesRange) => ["stats", "timeseries", range] as const,
  },
}
