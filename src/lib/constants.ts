// Mirrors the enums in the API models.
export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Medicine",
  "Gynecology",
  "Nephrology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Urology",
] as const

export const CONDITIONS = ["Stable", "Recovering", "Critical", "Discharged"] as const

export const GENDERS = ["Male", "Female", "Other"] as const

export const PAGE_SIZES = [10, 20, 50] as const
