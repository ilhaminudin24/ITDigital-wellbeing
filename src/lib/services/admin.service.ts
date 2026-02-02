import { createClient } from '@/lib/supabase/client'
import type { Activity, NotificationInsert, ActivitySnapshot, Json } from '@/lib/supabase/types'
import { storageService } from './storage.service'
import { profileService } from './profile.service'

/**
 * Admin Activity - Activity with user info for admin review
 */
export interface AdminActivity extends Activity {
    user_name: string
    user_avatar: string | null
}

/**
 * Admin Statistics
 */
export interface AdminStats {
    totalActivities: number
    activitiesToday: number
    totalUsers: number
}

/**
 * Admin Service
 * Handles admin operations for activity validation
 */
export const adminService = {
    /**
     * Check if current user is admin
     * @param userId - User ID to check
     */
    async isAdmin(userId: string): Promise<boolean> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('user_profiles')
            .select('is_admin')
            .eq('user_id', userId)
            .single()

        if (error) {
            console.error('Error checking admin status:', error)
            return false
        }

        return data?.is_admin === true
    },

    /**
     * Get all activities for admin review (with user info)
     * @param limit - Maximum number of activities to return
     */
    async getAllActivities(limit: number = 50): Promise<AdminActivity[]> {
        const supabase = createClient()

        // First get all activities
        const { data: activities, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (activitiesError) throw activitiesError
        if (!activities || activities.length === 0) return []

        // Get unique user IDs
        const userIds = [...new Set(activities.map(a => a.user_id))]

        // Fetch user profiles for these users
        const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('user_id, name, avatar_url')
            .in('user_id', userIds)

        if (profilesError) throw profilesError

        // Create a map for quick lookup
        const profileMap = new Map(
            (profiles || []).map(p => [p.user_id, { name: p.name, avatar_url: p.avatar_url }])
        )

        // Combine activities with user info
        return activities.map(activity => ({
            ...activity,
            user_name: profileMap.get(activity.user_id)?.name || 'Unknown User',
            user_avatar: profileMap.get(activity.user_id)?.avatar_url || null
        }))
    },

    /**
     * Get activities for a specific date (for daily review)
     * @param date - Date in YYYY-MM-DD format
     */
    async getActivitiesByDate(date: string): Promise<AdminActivity[]> {
        const supabase = createClient()

        const { data: activities, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .eq('activity_date', date)
            .order('created_at', { ascending: false })

        if (activitiesError) throw activitiesError
        if (!activities || activities.length === 0) return []

        // Get unique user IDs
        const userIds = [...new Set(activities.map(a => a.user_id))]

        // Fetch user profiles
        const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('user_id, name, avatar_url')
            .in('user_id', userIds)

        if (profilesError) throw profilesError

        const profileMap = new Map(
            (profiles || []).map(p => [p.user_id, { name: p.name, avatar_url: p.avatar_url }])
        )

        return activities.map(activity => ({
            ...activity,
            user_name: profileMap.get(activity.user_id)?.name || 'Unknown User',
            user_avatar: profileMap.get(activity.user_id)?.avatar_url || null
        }))
    },

    /**
     * Reject and delete an activity
     * This will:
     * 1. Create a notification for the user with activity snapshot
     * 2. Update user's total_calories (subtract the calories)
     * 3. Delete the photo from storage
     * 4. Delete the activity record
     * 
     * @param activityId - ID of the activity to reject
     * @param adminUserId - ID of the admin performing the rejection
     * @param reason - Reason for rejection
     */
    async rejectActivity(
        activityId: string,
        adminUserId: string,
        reason: string
    ): Promise<void> {
        const supabase = createClient()

        // Step 1: Get the activity details first
        const { data: activity, error: fetchError } = await supabase
            .from('activities')
            .select('*')
            .eq('id', activityId)
            .single()

        if (fetchError) throw new Error(`Failed to fetch activity: ${fetchError.message}`)
        if (!activity) throw new Error('Activity not found')

        // Step 2: Create activity snapshot for notification
        const activitySnapshot: ActivitySnapshot = {
            activity_date: activity.activity_date,
            activity_type: activity.activity_type,
            location: activity.location,
            distance: activity.distance,
            calories: activity.calories,
            photo_url: activity.photo_url
        }

        // Step 3: Create notification for the user
        const notification: NotificationInsert = {
            user_id: activity.user_id,
            title: 'Activity Rejected',
            message: reason,
            type: 'activity_rejected',
            activity_snapshot: activitySnapshot as unknown as Json,
            is_read: false
        }

        const { error: notificationError } = await supabase
            .from('notifications')
            .insert(notification)

        if (notificationError) {
            throw new Error(`Failed to create notification: ${notificationError.message}`)
        }

        // Step 4: Update user's total_calories (subtract the rejected activity's calories)
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('total_calories')
            .eq('user_id', activity.user_id)
            .single()

        if (profileError) {
            console.error('Failed to fetch user profile:', profileError)
        } else if (profile) {
            const newTotalCalories = Math.max(0, Number(profile.total_calories) - Number(activity.calories))

            await supabase
                .from('user_profiles')
                .update({ total_calories: newTotalCalories })
                .eq('user_id', activity.user_id)
        }

        // Step 5: Delete photo from storage if exists
        if (activity.photo_url) {
            try {
                await storageService.deletePhoto(activity.photo_url)
            } catch (photoError) {
                console.error('Failed to delete photo:', photoError)
                // Continue with deletion even if photo deletion fails
            }
        }

        // Step 6: Delete the activity record
        const { error: deleteError } = await supabase
            .from('activities')
            .delete()
            .eq('id', activityId)

        if (deleteError) {
            throw new Error(`Failed to delete activity: ${deleteError.message}`)
        }
    },

    /**
     * Get admin dashboard statistics
     */
    async getAdminStats(): Promise<AdminStats> {
        const supabase = createClient()

        // Get total activities count
        const { count: totalActivities } = await supabase
            .from('activities')
            .select('*', { count: 'exact', head: true })

        // Get today's activities count
        const today = new Date().toISOString().split('T')[0]
        const { count: activitiesToday } = await supabase
            .from('activities')
            .select('*', { count: 'exact', head: true })
            .eq('activity_date', today)

        // Get total users count
        const { count: totalUsers } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('profile_completed', true)

        return {
            totalActivities: totalActivities || 0,
            activitiesToday: activitiesToday || 0,
            totalUsers: totalUsers || 0
        }
    }
}
