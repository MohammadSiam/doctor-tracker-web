/**
 * All requests go to same-origin `/api/*`, which next.config.ts rewrites to the Express API.
 * Because the browser only ever talks to the frontend's domain, the httpOnly auth cookie is
 * first-party: no CORS preflights, no third-party-cookie blocking, and proxy.ts can see it.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: { path: string; message: string }[],
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type Query = Record<string, string | number | boolean | null | undefined>

interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: Query
  body?: unknown
}

export function buildQueryString(query?: Query) {
  if (!query) return ""
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

let redirectingToLogin = false

async function handleUnauthorized() {
  if (redirectingToLogin || typeof window === "undefined") return
  redirectingToLogin = true
  // Clear the stale cookie first, otherwise proxy.ts would bounce /login straight back here.
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined)
  const from = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.replace(`/login?from=${from}&expired=1`)
}

export async function api<T>(path: string, { query, body, headers, ...init }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`/api${path}${buildQueryString(query)}`, {
    ...init,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  })

  if (response.status === 204) return undefined as T

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/")) await handleUnauthorized()
    throw new ApiError(
      response.status,
      payload?.message ?? (response.status >= 500 ? "Server error, please try again" : "Request failed"),
      payload?.details,
    )
  }

  return payload as T
}

export interface ApiResponse<T> {
  success: true
  data: T
}
