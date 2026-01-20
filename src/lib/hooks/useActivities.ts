'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { activityService } from '@/lib/services/activity.service'
import type { Activity, ActivityInsert } from '@/lib/supabase/types'
import { useAuth } from './useAuth'

interface ActivitiesState {
    activities: Activity[]
    isLoading: boolean
    error: string | null
    selectedMonth: number // 0-11
    selectedYear: number
}

interface UseActivitiesReturn extends ActivitiesState {
    fetchActivities: () => Promise<void>
    addActivity: (activity: Omit<ActivityInsert, 'user_id'>) => Promise<boolean>
    deleteActivity: (id: string) => Promise<boolean>
    setSelectedMonth: (month: number) => void
    setSelectedYear: (year: number) => void
    filterByMonth: (month: number, year: number) => void
    monthlyStats: number[]
    filteredActivities: Activity[]
    totalCalories: number
    yearlyCalories: number
}

/**
 * useActivities Hook
 * Provides activities state and actions with filtering
 */
export function useActivities(): UseActivitiesReturn {
    const { user } = useAuth()
    const currentDate = new Date()

    const [state, setState] = useState<ActivitiesState>({
        activities: [],
        isLoading: true,
        error: null,
        selectedMonth: currentDate.getMonth(),
        selectedYear: currentDate.getFullYear(),
    })

    // Fetch all activities for current year
    const fetchActivities = useCallback(async () => {
        if (!user) {
            setState(prev => ({ ...prev, activities: [], isLoading: false, error: null }))
            return
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const activities = await activityService.getActivitiesByYear(user.id, state.selectedYear)
            setState(prev => ({ ...prev, activities, isLoading: false, error: null }))
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Gagal memuat aktivitas. Silakan coba lagi.',
            }))
        }
    }, [user, state.selectedYear])

    // Fetch activities when user or year changes
    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])

    // Add new activity
    const addActivity = useCallback(async (
        activityData: Omit<ActivityInsert, 'user_id'>
    ): Promise<boolean> => {
        if (!user) return false

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const newActivity = await activityService.createActivity({
                ...activityData,
                user_id: user.id,
            })

            setState(prev => ({
                ...prev,
                activities: [newActivity, ...prev.activities],
                isLoading: false,
                error: null,
            }))
            return true
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Gagal menambah aktivitas. Silakan coba lagi.',
            }))
            return false
        }
    }, [user])

    // Delete activity
    const deleteActivity = useCallback(async (id: string): Promise<boolean> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            await activityService.deleteActivity(id)

            setState(prev => ({
                ...prev,
                activities: prev.activities.filter(a => a.id !== id),
                isLoading: false,
                error: null,
            }))
            return true
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Gagal menghapus aktivitas. Silakan coba lagi.',
            }))
            return false
        }
    }, [])

    // Set selected month
    const setSelectedMonth = useCallback((month: number) => {
        setState(prev => ({ ...prev, selectedMonth: month }))
    }, [])

    // Set selected year
    const setSelectedYear = useCallback((year: number) => {
        setState(prev => ({ ...prev, selectedYear: year }))
    }, [])

    // Filter by month and year
    const filterByMonth = useCallback((month: number, year: number) => {
        setState(prev => ({ ...prev, selectedMonth: month, selectedYear: year }))
    }, [])

    // Calculate monthly stats (calories per month)
    const monthlyStats = useMemo(() => {
        const stats: number[] = new Array(12).fill(0)
        state.activities.forEach(activity => {
            const month = new Date(activity.activity_date).getMonth()
            stats[month] += Number(activity.calories)
        })
        return stats
    }, [state.activities])

    // Filter activities by selected month
    const filteredActivities = useMemo(() => {
        return state.activities.filter(activity => {
            const date = new Date(activity.activity_date)
            return date.getMonth() === state.selectedMonth &&
                date.getFullYear() === state.selectedYear
        })
    }, [state.activities, state.selectedMonth, state.selectedYear])

    // Calculate total calories (all time for current year)
    const totalCalories = useMemo(() => {
        return state.activities.reduce((sum, activity) => sum + Number(activity.calories), 0)
    }, [state.activities])

    // Calculate yearly calories
    const yearlyCalories = useMemo(() => {
        return state.activities
            .filter(a => new Date(a.activity_date).getFullYear() === state.selectedYear)
            .reduce((sum, activity) => sum + Number(activity.calories), 0)
    }, [state.activities, state.selectedYear])

    return {
        ...state,
        fetchActivities,
        addActivity,
        deleteActivity,
        setSelectedMonth,
        setSelectedYear,
        filterByMonth,
        monthlyStats,
        filteredActivities,
        totalCalories,
        yearlyCalories,
    }
}
