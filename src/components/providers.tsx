"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { useState, type ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ApiError } from "@/lib/api/client"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Always revalidate when a view mounts: cached rows show instantly, dimmed with a progress
        // bar, and are replaced by the server's answer. Admin data must never silently be old.
        staleTime: 0,
        refetchOnWindowFocus: false,
        // Retrying a 4xx (bad id, expired session) only delays the error.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status < 500) && failureCount < 2,
      },
    },
  })
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </NuqsAdapter>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools buttonPosition="bottom-right" />}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
