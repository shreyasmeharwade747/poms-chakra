import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export default auth((req: NextRequest & { auth: any }) => {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  console.log('Middleware - Path:', pathname, 'Session:', session ? 'exists' : 'null', 'Role:', session?.user?.role)

  // Allow access to login and API routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!session?.user) {
    console.log('No session, redirecting to /login')
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const userRole = session.user.role
  console.log('User role:', userRole)

  // Admin routes - only SUPER_ADMIN can access
  if (pathname.startsWith("/admin") || pathname.startsWith("/user-management")) {
    if (userRole !== "SUPER_ADMIN") {
      console.log('Non-admin trying to access admin route, redirecting')
      // Redirect USER to their dashboard, others to login
      const redirectUrl = userRole === "USER" ? "/dashboard" : "/login"
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
    return NextResponse.next()
  }

  // Frontend routes - USER and SUPER_ADMIN can access
  if (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/companies") ||
      pathname.startsWith("/company/") ||
      pathname.startsWith("/orders") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/settings")) {
    if (userRole !== "USER" && userRole !== "SUPER_ADMIN") {
      console.log('Unauthorized role for frontend route, redirecting to /login')
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }

  // Default: allow access to other routes
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
