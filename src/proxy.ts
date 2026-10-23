import { NextResponse, type NextRequest } from "next/server"

const AUTH_COOKIE = "dt_token"
const PUBLIC_ROUTES = ["/login"]

/**
 * Optimistic route protection: redirect based on whether the session cookie exists.
 * The cookie is httpOnly and verified by the API on every request, so this check only
 * decides which page to show; it never grants access to data.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const hasSession = request.cookies.has(AUTH_COOKIE)
  const isPublic = PUBLIC_ROUTES.includes(pathname)

  if (!hasSession && !isPublic) {
    const url = new URL("/login", request.url)
    if (pathname !== "/") url.searchParams.set("from", pathname + search)
    return NextResponse.redirect(url)
  }

  if (hasSession && (isPublic || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Everything except the API proxy, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"],
}
