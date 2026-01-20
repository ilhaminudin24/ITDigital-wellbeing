'use client'

import { useState, useEffect, useCallback } from 'react'
import { profileService } from '@/lib/services/profile.service'
import { storageService } from '@/lib/services/storage.service'
import type { UserProfile, UserProfileUpdate } from '@/lib/supabase/types'
import { useAuth } from './useAuth'

interface ProfileState {
    profile: UserProfile | null
    isLoading: boolean
    error: string | null
}

interface UseProfileReturn extends ProfileState {
    fetchProfile: () => Promise<void>
    updateProfile: (updates: UserProfileUpdate) => Promise<boolean>
    uploadAvatar: (file: File) => Promise<boolean>
    refreshProfile: () => Promise<void>
    targets: {
        bmr: number
        weeklyTarget: number
        monthlyTarget: number
        yearlyTarget: number
    } | null
}

/**
 * useProfile Hook
 * Provides user profile state and actions
 */
export function useProfile(): UseProfileReturn {
    const { user } = useAuth()
    const [state, setState] = useState<ProfileState>({
        profile: null,
        isLoading: true,
        error: null,
    })

    // Fetch profile on mount and when user changes
    const fetchProfile = useCallback(async () => {
        if (!user) {
            setState({ profile: null, isLoading: false, error: null })
            return
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const profile = await profileService.getProfile(user.id)
            setState({ profile, isLoading: false, error: null })
        } catch (error) {
            setState({
                profile: null,
                isLoading: false,
                error: 'Gagal memuat profil. Silakan coba lagi.',
            })
        }
    }, [user])

    // Fetch profile when user changes
    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    // Update profile
    const updateProfile = useCallback(async (updates: UserProfileUpdate): Promise<boolean> => {
        if (!user) return false

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const updatedProfile = await profileService.updateProfile(user.id, updates)
            setState({ profile: updatedProfile, isLoading: false, error: null })
            return true
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Gagal memperbarui profil. Silakan coba lagi.',
            }))
            return false
        }
    }, [user])

    // Refresh profile (alias for fetchProfile)
    const refreshProfile = useCallback(async () => {
        await fetchProfile()
    }, [fetchProfile])

    // Upload avatar
    const uploadAvatar = useCallback(async (file: File): Promise<boolean> => {
        if (!user) return false

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            // Delete old avatar if exists
            if (state.profile?.avatar_url) {
                await storageService.deleteAvatar(state.profile.avatar_url)
            }

            // Upload new avatar
            const { url, error: uploadError } = await storageService.uploadAvatar(user.id, file)
            if (uploadError || !url) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: uploadError || 'Gagal mengupload avatar',
                }))
                return false
            }

            // Update profile with new avatar URL
            const updatedProfile = await profileService.updateProfile(user.id, { avatar_url: url })
            setState({ profile: updatedProfile, isLoading: false, error: null })
            return true
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Gagal mengupload avatar. Silakan coba lagi.',
            }))
            return false
        }
    }, [user, state.profile?.avatar_url])

    // Calculate targets from profile data
    const targets = state.profile ? profileService.calculateAllTargets(
        state.profile.weight,
        state.profile.height,
        state.profile.age,
        state.profile.gender as 'male' | 'female'
    ) : null

    return {
        ...state,
        fetchProfile,
        updateProfile,
        uploadAvatar,
        refreshProfile,
        targets,
    }
}
