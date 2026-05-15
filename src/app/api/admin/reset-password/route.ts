import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/reset-password
 * 
 * Admin-only endpoint to reset a user's password.
 * Uses service_role key (server-side only) to call auth.admin.updateUserById().
 * Sets password_changed=false so user is forced to reset on next login.
 * 
 * Body: { userId: string, newPassword: string }
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { userId, newPassword } = await request.json()

        if (!userId || !newPassword) {
            return NextResponse.json(
                { error: 'userId and newPassword are required' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password minimal 6 karakter' },
                { status: 400 }
            )
        }

        // Step 1: Verify the caller is an authenticated admin
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Server Component context - can be ignored
                        }
                    },
                },
            }
        )

        const { data: { user: callerUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !callerUser) {
            return NextResponse.json(
                { error: 'Unauthorized - not authenticated' },
                { status: 401 }
            )
        }

        // Check if caller is admin
        const { data: callerProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('is_admin')
            .eq('user_id', callerUser.id)
            .single()

        if (profileError || !callerProfile?.is_admin) {
            return NextResponse.json(
                { error: 'Forbidden - admin access required' },
                { status: 403 }
            )
        }

        // Step 2: Use service_role key to reset user's password
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!serviceRoleKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        const { error: resetError } = await adminSupabase.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        )

        if (resetError) {
            console.error('Password reset error:', resetError)
            return NextResponse.json(
                { error: 'Gagal reset password: ' + resetError.message },
                { status: 500 }
            )
        }

        // Step 3: Set password_changed=false to force user to change on next login
        const { error: updateError } = await adminSupabase
            .from('user_profiles')
            .update({ password_changed: false })
            .eq('user_id', userId)

        if (updateError) {
            console.error('Profile update error:', updateError)
            // Password was already reset, so we still return success
            // but log the error for debugging
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Admin reset password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
