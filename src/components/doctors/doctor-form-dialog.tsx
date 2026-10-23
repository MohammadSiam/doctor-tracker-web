"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { FormRootError } from "@/components/shared/form-root-error"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSaveDoctor } from "@/hooks/use-doctors"
import { SPECIALIZATIONS } from "@/lib/constants"
import { applyServerErrors } from "@/lib/form-errors"
import { doctorSchema, type DoctorFormValues } from "@/lib/schemas"
import type { Doctor } from "@/lib/types"

interface DoctorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pass a doctor to edit; omit to create. */
  doctor?: Doctor | null
}

const EMPTY: DoctorFormValues = { name: "", specialization: undefined as never, hospital: "", phone: "", email: "" }

export function DoctorFormDialog({ open, onOpenChange, doctor }: DoctorFormDialogProps) {
  const save = useSaveDoctor()
  const form = useForm<DoctorFormValues>({ resolver: zodResolver(doctorSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) {
      form.reset(
        doctor
          ? { name: doctor.name, specialization: doctor.specialization, hospital: doctor.hospital, phone: doctor.phone, email: doctor.email }
          : EMPTY,
      )
    }
  }, [open, doctor, form])

  const onSubmit = form.handleSubmit((values) =>
    save.mutate(
      { id: doctor?._id, values },
      { onSuccess: () => onOpenChange(false), onError: (error) => applyServerErrors(form, error) },
    ),
  )

  const text = (name: "name" | "hospital" | "phone" | "email", label: string, props: React.ComponentProps<"input"> = {}) => (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`doctor-${name}`}>{label}</FieldLabel>
          <Input {...field} {...props} id={`doctor-${name}`} aria-invalid={fieldState.invalid} />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit doctor" : "Add a new doctor"}</DialogTitle>
          <DialogDescription>
            {doctor ? "Update the doctor's profile and contact details." : "Doctors can be assigned patients once they're added."}
          </DialogDescription>
        </DialogHeader>
        <form id="doctor-form" onSubmit={onSubmit} noValidate className="space-y-4">
          <FormRootError message={form.formState.errors.root?.message} />
          <FieldGroup>
            {text("name", "Full name", { placeholder: "Dr. Ayesha Rahman", autoComplete: "off" })}
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="specialization"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="doctor-specialization">Specialization</FieldLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger id="doctor-specialization" className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              {text("hospital", "Hospital", { placeholder: "Square Hospital" })}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("phone", "Phone", { placeholder: "+8801712345678", type: "tel", inputMode: "tel" })}
              {text("email", "Email", { placeholder: "doctor@hospital.com", type: "email" })}
            </div>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={save.isPending}>
            Cancel
          </Button>
          <Button type="submit" form="doctor-form" disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />}
            {doctor ? "Save changes" : "Add doctor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
