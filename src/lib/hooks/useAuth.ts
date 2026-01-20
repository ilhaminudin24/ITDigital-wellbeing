'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/services/auth.service'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: Session | null
    isLoading: boolean
    error: string | null
}

interface UseAuthReturn extends AuthState {
    signIn: (identifier: string, password: string) => Promise<boolean>
    updatePassword: (newPassword: string) => Promise<boolean>
    signOut: () => Promise<void>
    clearError: () => void
}

/**
 * useAuth Hook
 * Provides authentication state and actions
 */
export function useAuth(): UseAuthReturn {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        error: null,
    })

    const supabase = createClient()

    // Initialize auth state and subscribe to changes
    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setState(prev => ({
                    ...prev,
                    user: session?.user ?? null,
                    session,
                    isLoading: false,
                }))
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to initialize auth',
                }))
            }
        }

        initAuth()

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setState(prev => ({
                    ...prev,
                    user: session?.user ?? null,
                    session,
                    isLoading: false,
                }))
            }
        )

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe()
        }
    }, [supabase.auth])

    // Sign in with identifier (NIK or Email) and password
    const signIn = useCallback(async (identifier: string, password: string): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const { user, error } = await authService.signIn(identifier, password)

        if (error) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }))
            return false
        }

        setState(prev => ({ ...prev, isLoading: false }))
        return true
    }, [])

    // Update password (for first-time login reset)
    const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const { success, error } = await authService.updatePassword(newPassword)

        if (error) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }))
            return false
        }

        setState(prev => ({ ...prev, isLoading: false }))
        return success
    }, [])

    // Sign out
    const signOut = useCallback(async (): Promise<void> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            await authService.signOut()
            setState(prev => ({
                ...prev,
                user: null,
                session: null,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to sign out',
            }))
        }
    }, [])

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }))
    }, [])

    return {
        ...state,
        signIn,
        updatePassword,
        signOut,
        clearError,
    }
}
