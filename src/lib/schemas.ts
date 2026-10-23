import { z } from "zod"
import { CONDITIONS, GENDERS, SPECIALIZATIONS } from "./constants"

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number")

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const doctorSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  specialization: z.enum(SPECIALIZATIONS, "Select a specialization"),
  hospital: z.string().trim().min(2, "Hospital is required").max(150),
  phone,
  email: z.email("Enter a valid email address"),
})

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  age: z.number("Age is required").int("Age must be a whole number").min(0).max(130),
  gender: z.enum(GENDERS, "Select a gender"),
  phone,
  email: z.union([z.email("Enter a valid email address"), z.literal("")]).optional(),
  condition: z.enum(CONDITIONS, "Select a condition"),
  diagnosis: z.string().trim().min(2, "Diagnosis is required").max(200),
  notes: z.string().trim().max(1000).optional(),
  admittedAt: z.string().min(1, "Admission date is required"),
  doctor: z.string().min(1, "Select a doctor"),
})

export type LoginValues = z.infer<typeof loginSchema>
export type DoctorFormValues = z.infer<typeof doctorSchema>
export type PatientFormValues = z.infer<typeof patientSchema>
