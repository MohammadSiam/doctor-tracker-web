"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { useLogin } from "@/hooks/use-auth"
import { loginSchema, type LoginValues } from "@/lib/schemas"

const DEMO = { email: "admin@doctortracker.com", password: "Admin@123" }

/** Only allow same-site relative paths, so `?from=` can't be used as an open redirect. */
function safeRedirect(from: string | null) {
  return from && from.startsWith("/") && !from.startsWith("//") ? from : "/dashboard"
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const expired = searchParams.get("expired") === "1"

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = form.handleSubmit((values) =>
    login.mutate(values, { onSuccess: () => router.replace(safeRedirect(searchParams.get("from"))) }),
  )

  const fillDemo = () => {
    form.setValue("email", DEMO.email, { shouldValidate: true })
    form.setValue("password", DEMO.password, { shouldValidate: true })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {(login.error || expired) && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{login.error?.message ?? "Your session has expired. Please sign in again."}</span>
        </div>
      )}

      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@hospital.com"
                className="h-10"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupInput
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" size="lg" className="h-10 w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="animate-spin" />}
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>

      <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium">Demo account</p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {DEMO.email} · {DEMO.password}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={fillDemo}>
            <Sparkles /> Use
          </Button>
        </div>
      </div>
    </form>
  )
}
