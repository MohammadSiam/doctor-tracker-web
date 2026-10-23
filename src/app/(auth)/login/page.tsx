import type { Metadata } from "next"
import { Suspense } from "react"
import { Activity, BarChart3, ShieldCheck } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = { title: "Sign in" }

const FEATURES = [
  { icon: Activity, title: "Track every patient", text: "See each doctor's caseload and patient condition at a glance." },
  { icon: BarChart3, title: "Live analytics", text: "Admissions trends, condition mix and workload per doctor." },
  { icon: ShieldCheck, title: "Secure by default", text: "Encrypted, httpOnly sessions and protected routes." },
]

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_20%,oklch(1_0_0/0.18),transparent_45%),radial-gradient(circle_at_80%_70%,oklch(1_0_0/0.12),transparent_40%)]"
        />
        <div aria-hidden className="absolute inset-0 [background-image:linear-gradient(oklch(1_0_0/0.06)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15 backdrop-blur">
            <Activity className="size-5" />
          </div>
          <span className="font-heading text-lg font-semibold">Doctor Tracker</span>
        </div>
        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <h2 className="font-heading text-4xl leading-tight font-semibold tracking-tight">Care coordination, simplified.</h2>
            <p className="text-primary-foreground/80">One place to manage doctors, their patients and the numbers that matter.</p>
          </div>
          <ul className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/12">
                  <Icon className="size-4.5" />
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-primary-foreground/75">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-primary-foreground/60">Doctor Tracker · Admin Portal</p>
      </aside>

      <main className="relative flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm space-y-8">
          <Logo className="lg:hidden" />
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to the admin portal to continue.</p>
          </div>
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
