import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

/**
 * Create a Supabase client for middleware usage
 * Handles session refresh and cookie management in middleware
 */
export function createMiddlewareClient(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient<Database>(
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

    return { supabase, response: supabaseResponse }
}

/**
 * Update the response with new cookies after Supabase operations
 */
export function updateResponseWithCookies(
    request: NextRequest,
    response: NextResponse,
    cookiesToSet: Array<{ name: string; value: string; options?: object }>
) {
    cookiesToSet.forEach(({ name, value }) =>
        request.cookies.set(name, value)
    )

    const newResponse = NextResponse.next({ request })

    cookiesToSet.forEach(({ name, value, options }) =>
        newResponse.cookies.set(name, value, options as object)
    )

    return newResponse
}
