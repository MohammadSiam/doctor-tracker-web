"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Suspense } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NAV_ITEMS } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

function Breadcrumbs() {
  const pathname = usePathname()
  const section = NAV_ITEMS.find((item) => pathname.startsWith(item.href))
  const isDetail = section && pathname !== section.href

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      {section &&
        (isDetail ? (
          <>
            <Link href={section.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {section.title}
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="truncate font-medium">Details</span>
          </>
        ) : (
          <span className="font-medium">{section.title}</span>
        ))}
    </nav>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
      {/* The pathname is request data on dynamic routes, so it streams in behind its own boundary. */}
      <Suspense fallback={null}>
        <Breadcrumbs />
      </Suspense>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  )
}
