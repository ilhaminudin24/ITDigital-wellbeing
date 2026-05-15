import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/supabase/types'

/**
 * Auth Service
 * Handles authentication operations with NIK and Email support
 */
export const authService = {
    /**
     * Check if the identifier is a NIK (numeric) or Email (contains @)
     */
    isNIK(identifier: string): boolean {
        return /^\d+$/.test(identifier.trim())
    },

    /**
     * Lookup email by NIK from user_profiles table
     * Note: This requires a separate lookup since Supabase Auth uses email
     */
    async lookupEmailByNIK(nik: string): Promise<string | null> {
        const supabase = createClient()

        // First, find the user_id associated with this NIK
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('user_id')
            .eq('nik', nik.trim())
            .single()

        if (error || !profile) {
            return null
        }

        // Note: We can't directly get email from auth.users via client
        // This would need a server-side function or we store email in profile
        return null
    },

    /**
     * Sign in with NIK or Email + Password
     */
    async signIn(identifier: string, password: string): Promise<{
        user: any | null
        error: { message: string } | null
    }> {
        const supabase = createClient()

        let email = identifier

        // If identifier is NIK, we need to lookup the email
        if (this.isNIK(identifier)) {
            // For NIK login, we would need server-side function
            // For now, return an error asking to use email
            return {
                user: null,
                error: { message: 'Login dengan NIK belum tersedia. Silakan gunakan email Anda.' }
            }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            let message = error.message
            if (error.message.includes('Invalid login credentials')) {
                message = 'Email atau password salah'
            } else if (error.message.includes('Email not confirmed')) {
                message = 'Email belum dikonfirmasi. Cek inbox Anda.'
            }
            return { user: null, error: { message } }
        }

        return { user: data.user, error: null }
    },

    /**
     * Update user's password
     */
    async updatePassword(newPassword: string): Promise<{
        success: boolean
        error: { message: string } | null
    }> {
        const supabase = createClient()

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        })

        if (error) {
            return { success: false, error: { message: error.message } }
        }

        return { success: true, error: null }
    },

    /**
     * Mark password as changed in user_profiles
     */
    async markPasswordChanged(userId: string): Promise<{
        success: boolean
        error: { message: string } | null
    }> {
        const supabase = createClient()

        const { error } = await supabase
            .from('user_profiles')
            .update({ password_changed: true })
            .eq('user_id', userId)

        if (error) {
            return { success: false, error: { message: error.message } }
        }

        return { success: true, error: null }
    },

    /**
     * Change password with current password verification
     * Unlike updatePassword(), this verifies the old password first
     */
    async changePassword(
        email: string,
        currentPassword: string,
        newPassword: string
    ): Promise<{
        success: boolean
        error: { message: string; code?: string } | null
    }> {
        const supabase = createClient()

        // Step 1: Verify current password by re-authenticating
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword,
        })

        if (verifyError) {
            return {
                success: false,
                error: { message: 'Password lama salah', code: 'INVALID_CURRENT_PASSWORD' }
            }
        }

        // Step 2: Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        })

        if (updateError) {
            if (updateError.message.includes('same_password') || updateError.message.includes('should be different')) {
                return {
                    success: false,
                    error: { message: 'Password baru tidak boleh sama dengan password lama', code: 'SAME_PASSWORD' }
                }
            }
            return {
                success: false,
                error: { message: 'Gagal mengubah password: ' + updateError.message }
            }
        }

        return { success: true, error: null }
    },

    /**
     * Sign out current user
     */
    async signOut(): Promise<void> {
        const supabase = createClient()
        await supabase.auth.signOut()
    },

    /**
     * Get current session
     */
    async getSession() {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        return session
    },

    /**
     * Get current user
     */
    async getUser() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChange(callback: (event: string, session: any) => void) {
        const supabase = createClient()
        return supabase.auth.onAuthStateChange(callback)
    }
}
