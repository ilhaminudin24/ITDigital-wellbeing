import { createClient } from '@/lib/supabase/client'
import type { Activity, ActivityInsert, ActivityUpdate } from '@/lib/supabase/types'

/**
 * Activity Service
 * Handles activity CRUD operations and statistics
 */
export const activityService = {
    /**
     * Get all activities for a user
     */
    async getActivities(userId: string): Promise<Activity[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('user_id', userId)
            .order('activity_date', { ascending: false })

        if (error) throw error
        return data ?? []
    },

    /**
     * Get a single activity by ID
     */
    async getActivityById(id: string): Promise<Activity | null> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return null
            }
            throw error
        }
        return data
    },

    /**
     * Get activities for a specific month
     */
    async getActivitiesByMonth(userId: string, month: number, year: number): Promise<Activity[]> {
        const supabase = createClient()
        const startDate = new Date(year, month, 1).toISOString().split('T')[0]
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('user_id', userId)
            .gte('activity_date', startDate)
            .lte('activity_date', endDate)
            .order('activity_date', { ascending: false })

        if (error) throw error
        return data ?? []
    },

    /**
     * Get activities for a specific year
     */
    async getActivitiesByYear(userId: string, year: number): Promise<Activity[]> {
        const supabase = createClient()
        const startDate = `${year}-01-01`
        const endDate = `${year}-12-31`

        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('user_id', userId)
            .gte('activity_date', startDate)
            .lte('activity_date', endDate)
            .order('activity_date', { ascending: false })

        if (error) throw error
        return data ?? []
    },

    /**
     * Create a new activity
     */
    async createActivity(activity: ActivityInsert): Promise<Activity> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .insert(activity)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Update an existing activity
     */
    async updateActivity(id: string, updates: ActivityUpdate): Promise<Activity> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Delete an activity
     */
    async deleteActivity(id: string): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    /**
     * Get monthly statistics for a year (calories burned per month)
     */
    async getMonthlyStats(userId: string, year: number): Promise<number[]> {
        const activities = await this.getActivitiesByYear(userId, year)
        const stats: number[] = new Array(12).fill(0)

        activities.forEach(activity => {
            const month = new Date(activity.activity_date).getMonth()
            stats[month] += Number(activity.calories)
        })

        return stats
    },

    /**
     * Get total calories burned for a user
     */
    async getTotalCalories(userId: string): Promise<number> {
        const activities = await this.getActivities(userId)
        return activities.reduce((sum, activity) => sum + Number(activity.calories), 0)
    },

    /**
     * Get total calories for current year
     */
    async getYearlyCalories(userId: string, year: number): Promise<number> {
        const activities = await this.getActivitiesByYear(userId, year)
        return activities.reduce((sum, activity) => sum + Number(activity.calories), 0)
    },

    /**
     * Get recent activities (limit to last N)
     */
    async getRecentActivities(userId: string, limit: number = 5): Promise<Activity[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('user_id', userId)
            .order('activity_date', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data ?? []
    }
}
