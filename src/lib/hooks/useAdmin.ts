'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService, AdminActivity, AdminStats } from '@/lib/services/admin.service'
import { useAuth } from './useAuth'

interface AdminState {
    isAdmin: boolean
    isLoading: boolean
    activities: AdminActivity[]
    stats: AdminStats | null
    error: string | null
}

interface UseAdminReturn extends AdminState {
    refetchActivities: () => Promise<void>
    refetchStats: () => Promise<void>
    rejectActivity: (activityId: string, reason: string) => Promise<boolean>
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
        }
    }, [state.isAdmin, state.isLoading, fetchActivities, fetchStats])

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

    return {
        ...state,
        refetchActivities: fetchActivities,
        refetchStats: fetchStats,
        rejectActivity
    }
}
