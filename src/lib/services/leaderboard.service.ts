import { createClient } from '@/lib/supabase/client'

/**
 * Leaderboard Entry - Safe fields only for privacy
 */
export interface LeaderboardEntry {
    user_id: string
    name: string
    avatar_url: string | null
    total_calories: number
    target_calories: number
    rank: number
    isCurrentUser: boolean
}

/**
 * Leaderboard Data structure
 */
export interface LeaderboardData {
    topThree: LeaderboardEntry[]
    restOfList: LeaderboardEntry[]
    currentUserEntry: LeaderboardEntry | null
    totalParticipants: number
    nextRankEntry: LeaderboardEntry | null // User above current user
}

/**
 * Leaderboard Service
 * Handles fetching and ranking coworker calorie data
 * 
 * Privacy: Only queries safe fields (user_id, name, avatar_url, total_calories, target_calories)
 * Sensitive fields (weight, height, age, email, nik) are NEVER queried
 */
export const leaderboardService = {
    /**
     * Get full leaderboard with rankings
     * @param currentUserId - Current user's ID for highlighting
     * @param limit - Maximum number of entries to return (default: 10)
     */
    async getLeaderboard(currentUserId: string, limit: number = 10): Promise<LeaderboardData> {
        const supabase = createClient()

        // Fetch leaderboard data - ONLY safe fields
        const { data, error } = await supabase
            .from('user_profiles')
            .select('user_id, name, avatar_url, total_calories, target_calories')
            .eq('profile_completed', true)
            .order('total_calories', { ascending: false })
            .limit(limit)

        if (error) throw error

        // Add rankings and current user flag
        const rankedData: LeaderboardEntry[] = (data || []).map((entry, index) => ({
            user_id: entry.user_id,
            name: entry.name,
            avatar_url: entry.avatar_url,
            total_calories: Number(entry.total_calories) || 0,
            target_calories: Number(entry.target_calories) || 0,
            rank: index + 1,
            isCurrentUser: entry.user_id === currentUserId,
        }))

        // Get total count of participants
        const { count } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('profile_completed', true)

        // Check if current user is in the fetched list
        let currentUserEntry = rankedData.find(e => e.isCurrentUser) || null

        // If current user not in top list, fetch their rank separately
        if (!currentUserEntry && currentUserId) {
            currentUserEntry = await this.getUserRank(currentUserId)
        }

        // Find the user above current user (for motivation message)
        let nextRankEntry: LeaderboardEntry | null = null
        if (currentUserEntry && currentUserEntry.rank > 1) {
            nextRankEntry = await this.getEntryByRank(currentUserEntry.rank - 1)
        }

        return {
            topThree: rankedData.slice(0, 3),
            restOfList: rankedData.slice(3),
            currentUserEntry,
            totalParticipants: count || 0,
            nextRankEntry,
        }
    },

    /**
     * Get specific user's rank and data
     * @param userId - User ID to lookup
     */
    async getUserRank(userId: string): Promise<LeaderboardEntry | null> {
        const supabase = createClient()

        // Get user's profile data
        const { data: userProfile, error } = await supabase
            .from('user_profiles')
            .select('user_id, name, avatar_url, total_calories, target_calories')
            .eq('user_id', userId)
            .eq('profile_completed', true)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned - user not found or profile not completed
                return null
            }
            throw error
        }

        if (!userProfile) return null

        // Count how many users have more calories (to determine rank)
        const { count } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('profile_completed', true)
            .gt('total_calories', userProfile.total_calories)

        return {
            user_id: userProfile.user_id,
            name: userProfile.name,
            avatar_url: userProfile.avatar_url,
            total_calories: Number(userProfile.total_calories) || 0,
            target_calories: Number(userProfile.target_calories) || 0,
            rank: (count || 0) + 1,
            isCurrentUser: true,
        }
    },

    /**
     * Get entry by specific rank position
     * @param rank - Rank position (1-indexed)
     */
    async getEntryByRank(rank: number): Promise<LeaderboardEntry | null> {
        const supabase = createClient()

        // Fetch user at specific rank position
        const { data, error } = await supabase
            .from('user_profiles')
            .select('user_id, name, avatar_url, total_calories, target_calories')
            .eq('profile_completed', true)
            .order('total_calories', { ascending: false })
            .range(rank - 1, rank - 1) // 0-indexed range

        if (error) throw error

        if (!data || data.length === 0) return null

        const entry = data[0]
        return {
            user_id: entry.user_id,
            name: entry.name,
            avatar_url: entry.avatar_url,
            total_calories: Number(entry.total_calories) || 0,
            target_calories: Number(entry.target_calories) || 0,
            rank: rank,
            isCurrentUser: false,
        }
    },

    /**
     * Check if minimum participants threshold is met
     * @param minimum - Minimum number of participants required (default: 3)
     */
    async hasMinimumParticipants(minimum: number = 3): Promise<boolean> {
        const supabase = createClient()

        const { count, error } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('profile_completed', true)

        if (error) throw error

        return (count || 0) >= minimum
    },

    /**
     * Get calories needed to catch the next rank
     * @param currentCalories - Current user's total calories
     * @param nextRankCalories - Next rank user's total calories
     */
    getCaloriesToNextRank(currentCalories: number, nextRankCalories: number): number {
        const diff = nextRankCalories - currentCalories
        return diff > 0 ? Math.ceil(diff) + 1 : 0 // +1 to actually overtake
    },

    /**
     * Format calories for display (e.g., 1500 -> "1.5K", 500 -> "500")
     */
    formatCalories(calories: number): string {
        if (calories >= 1000) {
            return `${(calories / 1000).toFixed(1)}K`
        }
        return calories.toLocaleString()
    },
}
