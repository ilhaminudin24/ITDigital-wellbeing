'use client'

import { useState, useEffect, useCallback } from 'react'
import { leaderboardService, LeaderboardData, LeaderboardEntry } from '@/lib/services/leaderboard.service'
import { useAuth } from './useAuth'

interface LeaderboardState {
    leaderboard: LeaderboardData | null
    isLoading: boolean
    error: string | null
    hasMinimumParticipants: boolean
}

interface UseLeaderboardReturn extends LeaderboardState {
    refetch: () => Promise<void>
    getCaloriesToCatch: () => { calories: number; targetName: string } | null
}

/**
 * useLeaderboard Hook
 * Provides leaderboard state and actions for ranking display
 */
export function useLeaderboard(): UseLeaderboardReturn {
    const { user } = useAuth()
    const [state, setState] = useState<LeaderboardState>({
        leaderboard: null,
        isLoading: true,
        error: null,
        hasMinimumParticipants: true,
    })

    // Fetch leaderboard data
    const fetchLeaderboard = useCallback(async () => {
        if (!user) {
            setState({
                leaderboard: null,
                isLoading: false,
                error: null,
                hasMinimumParticipants: false,
            })
            return
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            // Check minimum participants first
            const hasMinimum = await leaderboardService.hasMinimumParticipants(3)

            if (!hasMinimum) {
                setState({
                    leaderboard: null,
                    isLoading: false,
                    error: null,
                    hasMinimumParticipants: false,
                })
                return
            }

            // Fetch full leaderboard
            const leaderboard = await leaderboardService.getLeaderboard(user.id, 10)

            setState({
                leaderboard,
                isLoading: false,
                error: null,
                hasMinimumParticipants: true,
            })
        } catch (error) {
            console.error('Leaderboard fetch error:', error)
            setState({
                leaderboard: null,
                isLoading: false,
                error: 'Gagal memuat leaderboard. Silakan coba lagi.',
                hasMinimumParticipants: true,
            })
        }
    }, [user])

    // Fetch on mount and when user changes
    useEffect(() => {
        fetchLeaderboard()
    }, [fetchLeaderboard])

    // Helper to get calories needed to catch next rank
    const getCaloriesToCatch = useCallback((): { calories: number; targetName: string } | null => {
        const { leaderboard } = state
        if (!leaderboard?.currentUserEntry || !leaderboard?.nextRankEntry) {
            return null
        }

        const calories = leaderboardService.getCaloriesToNextRank(
            leaderboard.currentUserEntry.total_calories,
            leaderboard.nextRankEntry.total_calories
        )

        return {
            calories,
            targetName: leaderboard.nextRankEntry.name,
        }
    }, [state])

    return {
        ...state,
        refetch: fetchLeaderboard,
        getCaloriesToCatch,
    }
}
