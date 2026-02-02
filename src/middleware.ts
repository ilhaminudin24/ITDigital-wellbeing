import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js Middleware for Authentication
 * Handles session validation, protected routes, and auth redirects
 */
export async function middleware(request: NextRequest) {
    // Define protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/record', '/history', '/report', '/profile', '/admin']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Define auth routes (login, signup, etc.)
    const authRoutes = ['/login', '/auth']
    const isAuthRoute = authRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // OPTIMIZATION: Skip Supabase call for auth routes (login page handles its own auth)
    // This prevents slow loading on login page
    if (isAuthRoute) {
        return NextResponse.next({ request })
    }

    // OPTIMIZATION: Only check auth for protected routes and root
    if (!isProtectedRoute && request.nextUrl.pathname !== '/') {
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({ request })

    // Create Supabase client with cookie handling
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Use getSession() instead of getUser()
    // getSession() reads from cookies locally (fast, no network call)
    // getUser() makes API call to Supabase (slow, can timeout in Edge Runtime)
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user ?? null

    // Redirect unauthenticated users from protected routes to login
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        // Store the original URL to redirect back after login
        url.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Redirect root to dashboard if authenticated, otherwise to login
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = user ? '/dashboard' : '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

/**
 * Matcher configuration
 * Excludes static files, images, and Next.js internal routes
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Public images and assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}
