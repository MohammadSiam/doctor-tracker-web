"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { parseISO } from "date-fns"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { FormRootError } from "@/components/shared/form-root-error"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAddDoctorPatient } from "@/hooks/use-doctors"
import { useSavePatient } from "@/hooks/use-patients"
import { CONDITIONS, GENDERS } from "@/lib/constants"
import { applyServerErrors } from "@/lib/form-errors"
import { toAdmittedAt, toIsoDate } from "@/lib/format"
import { patientSchema, type PatientFormValues } from "@/lib/schemas"
import type { DoctorSummary, Patient } from "@/lib/types"
import { DoctorCombobox } from "./doctor-combobox"

interface PatientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pass a patient to edit; omit to create. */
  patient?: Patient | null
  /** When set, the patient is created under this doctor and the doctor picker is hidden. */
  fixedDoctor?: DoctorSummary
}

const emptyValues = (doctor = ""): PatientFormValues => ({
  name: "",
  age: undefined as never,
  gender: undefined as never,
  phone: "",
  email: "",
  condition: "Stable",
  diagnosis: "",
  notes: "",
  admittedAt: toIsoDate(new Date()),
  doctor,
})

const omitDoctor = ({ doctor, ...rest }: PatientFormValues) => (void doctor, rest)

export function PatientFormDialog({ open, onOpenChange, patient, fixedDoctor }: PatientFormDialogProps) {
  const save = useSavePatient()
  const addToDoctor = useAddDoctorPatient(fixedDoctor?._id ?? "")
  const pending = save.isPending || addToDoctor.isPending

  const form = useForm<PatientFormValues>({ resolver: zodResolver(patientSchema), defaultValues: emptyValues(fixedDoctor?._id) })

  useEffect(() => {
    if (!open) return
    form.reset(
      patient
        ? {
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email ?? "",
            condition: patient.condition,
            diagnosis: patient.diagnosis,
            notes: patient.notes ?? "",
            admittedAt: toIsoDate(parseISO(patient.admittedAt)),
            doctor: patient.doctor?._id ?? "",
          }
        : emptyValues(fixedDoctor?._id),
    )
  }, [open, patient, fixedDoctor, form])

  const onSubmit = form.handleSubmit((formValues) => {
    const values = { ...formValues, admittedAt: toAdmittedAt(formValues.admittedAt, patient?.admittedAt) }
    const callbacks = { onSuccess: () => onOpenChange(false), onError: (error: Error) => applyServerErrors(form, error) }
    if (fixedDoctor && !patient) {
      addToDoctor.mutate(omitDoctor(values), callbacks)
    } else {
      save.mutate({ id: patient?._id, values }, callbacks)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit patient" : "Add a new patient"}</DialogTitle>
          <DialogDescription>
            {fixedDoctor && !patient ? (
              <>
                This patient will be assigned to <span className="font-medium text-foreground">{fixedDoctor.name}</span>.
              </>
            ) : patient ? (
              "Update the patient's details, condition or assigned doctor."
            ) : (
              "Record a new patient and assign them to a doctor."
            )}
          </DialogDescription>
        </DialogHeader>

        <form id="patient-form" onSubmit={onSubmit} noValidate className="space-y-4">
          <FormRootError message={form.formState.errors.root?.message} />
          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_6rem_8rem]">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-name">Full name</FieldLabel>
                    <Input {...field} id="patient-name" placeholder="Rahim Uddin" aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="age"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-age">Age</FieldLabel>
                    <Input
                      id="patient-age"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={130}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-gender">Gender</FieldLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger id="patient-gender" className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-phone">Phone</FieldLabel>
                    <Input {...field} id="patient-phone" type="tel" inputMode="tel" placeholder="+8801712345678" aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-email">
                      Email <span className="font-normal text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Input {...field} id="patient-email" type="email" placeholder="patient@example.com" aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="diagnosis"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-diagnosis">Diagnosis</FieldLabel>
                    <Input {...field} id="patient-diagnosis" placeholder="Hypertension" aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="condition"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-condition">Condition</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="patient-condition" className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="admittedAt"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="patient-admitted">Admission date</FieldLabel>
                    <Input {...field} id="patient-admitted" type="date" max={toIsoDate(new Date())} aria-invalid={fieldState.invalid} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              {!(fixedDoctor && !patient) && (
                <Controller
                  control={form.control}
                  name="doctor"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="patient-doctor">Assigned doctor</FieldLabel>
                      <DoctorCombobox
                        id="patient-doctor"
                        value={field.value}
                        onChange={field.onChange}
                        initialDoctor={patient?.doctor ?? fixedDoctor}
                        invalid={fieldState.invalid}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              )}
            </div>

            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="patient-notes">
                    Notes <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Textarea {...field} id="patient-notes" rows={3} placeholder="Allergies, follow-up plan…" aria-invalid={fieldState.invalid} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="patient-form" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {patient ? "Save changes" : "Add patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
