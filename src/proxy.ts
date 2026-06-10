import { auth } from "@/lib/auth"

export async function proxy(request: Request) {
  const session = await auth()
  const { pathname } = new URL(request.url)

  const protectedPaths = [
    "/recipes",
    "/chat",
    "/favorites",
    "/profile",
  ]

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/chat") ||
    pathname.startsWith("/api/favorites") ||
    pathname.startsWith("/api/preferences")

  if (isProtected && !session) {
    return Response.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/(main)/:path*", "/api/chat/:path*", "/api/favorites/:path*", "/api/preferences/:path*"],
}
