import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { ApiError } from "@/lib/api/client"

/**
 * Maps API errors onto form fields: zod details (`body.email`) go to their field,
 * a 409 duplicate goes to the field named in the message, anything else to `root`.
 */
export function applyServerErrors<T extends FieldValues>(form: UseFormReturn<T>, error: unknown) {
  if (error instanceof ApiError) {
    const fields = Object.keys(form.getValues())
    let matched = false

    for (const detail of error.details ?? []) {
      const field = detail.path.replace(/^body\./, "")
      if (fields.includes(field)) {
        form.setError(field as Path<T>, { message: detail.message })
        matched = true
      }
    }

    if (error.status === 409) {
      const field = fields.find((name) => error.message.includes(name))
      if (field) {
        form.setError(field as Path<T>, { message: error.message })
        matched = true
      }
    }

    if (matched) return
  }
  form.setError("root" as Path<T>, { message: error instanceof Error ? error.message : "Something went wrong" })
}
