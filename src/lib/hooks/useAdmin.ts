'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService, AdminActivity, AdminStats, AdminUser } from '@/lib/services/admin.service'
import { useAuth } from './useAuth'

interface AdminState {
    isAdmin: boolean
    isLoading: boolean
    activities: AdminActivity[]
    users: AdminUser[]
    stats: AdminStats | null
    error: string | null
}

interface UseAdminReturn extends AdminState {
    refetchActivities: () => Promise<void>
    refetchStats: () => Promise<void>
    fetchUsers: () => Promise<void>
    rejectActivity: (activityId: string, reason: string) => Promise<boolean>
    resetUserPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

/**
 * useAdmin Hook
 * Provides admin state and actions for activity validation
 */
export function useAdmin(): UseAdminReturn {
    const { user } = useAuth()
    const [state, setState] = useState<AdminState>({
        isAdmin: false,
        isLoading: true,
        activities: [],
        users: [],
        stats: null,
        error: null
    })

    // Check admin status
    useEffect(() => {
        async function checkAdmin() {
            if (!user) {
                setState(prev => ({ ...prev, isAdmin: false, isLoading: false }))
                return
            }

            try {
                const isAdmin = await adminService.isAdmin(user.id)
                setState(prev => ({ ...prev, isAdmin, isLoading: false }))
            } catch (error) {
                console.error('Error checking admin status:', error)
                setState(prev => ({ ...prev, isAdmin: false, isLoading: false }))
            }
        }

        checkAdmin()
    }, [user])

    // Fetch activities
    const fetchActivities = useCallback(async () => {
        if (!user || !state.isAdmin) return

        setState(prev => ({ ...prev, error: null }))

        try {
            const activities = await adminService.getAllActivities()
            setState(prev => ({ ...prev, activities }))
        } catch (error) {
            console.error('Error fetching activities:', error)
            setState(prev => ({
                ...prev,
                error: 'Gagal memuat aktivitas. Silakan coba lagi.'
            }))
        }
    }, [user, state.isAdmin])

    // Fetch stats
    const fetchStats = useCallback(async () => {
        if (!user || !state.isAdmin) return

        try {
            const stats = await adminService.getAdminStats()
            setState(prev => ({ ...prev, stats }))
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }, [user, state.isAdmin])

    // Fetch data when admin status is confirmed
    useEffect(() => {
        if (state.isAdmin && !state.isLoading) {
            fetchActivities()
            fetchStats()
            fetchUsers()
        }
    }, [state.isAdmin, state.isLoading, fetchActivities, fetchStats])

    // Fetch users
    const fetchUsers = useCallback(async () => {
        if (!user || !state.isAdmin) return

        try {
            const users = await adminService.getAllUsers()
            setState(prev => ({ ...prev, users }))
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }, [user, state.isAdmin])

    // Reject activity
    const rejectActivity = useCallback(async (activityId: string, reason: string): Promise<boolean> => {
        if (!user) return false

        try {
            await adminService.rejectActivity(activityId, user.id, reason)

            // Remove activity from local state
            setState(prev => ({
                ...prev,
                activities: prev.activities.filter(a => a.id !== activityId),
                stats: prev.stats ? {
                    ...prev.stats,
                    totalActivities: prev.stats.totalActivities - 1
                } : null
            }))

            return true
        } catch (error) {
            console.error('Error rejecting activity:', error)
            setState(prev => ({
                ...prev,
                error: 'Gagal menolak aktivitas. Silakan coba lagi.'
            }))
            return false
        }
    }, [user])

    // Reset user password (admin action)
    const resetUserPassword = useCallback(async (
        userId: string,
        newPassword: string
    ): Promise<{ success: boolean; error?: string }> => {
        if (!user) return { success: false, error: 'Not authenticated' }

        const result = await adminService.resetUserPassword(userId, newPassword)

        if (result.success) {
            // Refresh user list to update password_changed status
            await fetchUsers()
        }

        return result
    }, [user, fetchUsers])

    return {
        ...state,
        refetchActivities: fetchActivities,
        refetchStats: fetchStats,
        fetchUsers,
        rejectActivity,
        resetUserPassword
    }
}
