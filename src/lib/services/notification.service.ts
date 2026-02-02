import { createClient } from '@/lib/supabase/client'
import type { Notification, ActivitySnapshot } from '@/lib/supabase/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Parsed Notification with typed activity snapshot
 */
export interface ParsedNotification extends Omit<Notification, 'activity_snapshot'> {
    activity_snapshot: ActivitySnapshot | null
}

/**
 * Notification Service
 * Handles notification CRUD and real-time subscriptions
 */
export const notificationService = {
    /**
     * Get user's notifications (newest first)
     * @param userId - User ID
     * @param limit - Maximum number of notifications to return
     */
    async getNotifications(userId: string, limit: number = 20): Promise<ParsedNotification[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error

        // Parse activity_snapshot from JSON
        return (data || []).map(notification => ({
            ...notification,
            is_read: notification.is_read ?? false,
            created_at: notification.created_at ?? new Date().toISOString(),
            activity_snapshot: notification.activity_snapshot
                ? (notification.activity_snapshot as unknown as ActivitySnapshot)
                : null
        }))
    },

    /**
     * Get unread notification count
     * @param userId - User ID
     */
    async getUnreadCount(userId: string): Promise<number> {
        const supabase = createClient()

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false)

        if (error) {
            console.error('Error getting unread count:', error)
            return 0
        }

        return count || 0
    },

    /**
     * Mark single notification as read
     * @param notificationId - Notification ID
     */
    async markAsRead(notificationId: string): Promise<void> {
        const supabase = createClient()

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)

        if (error) throw error
    },

    /**
     * Mark all notifications as read for a user
     * @param userId - User ID
     */
    async markAllAsRead(userId: string): Promise<void> {
        const supabase = createClient()

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false)

        if (error) throw error
    },

    /**
     * Subscribe to real-time notifications for a user
     * @param userId - User ID
     * @param callback - Function to call when new notification arrives
     * @returns RealtimeChannel for cleanup
     */
    subscribeToNotifications(
        userId: string,
        callback: (notification: ParsedNotification) => void
    ): RealtimeChannel {
        const supabase = createClient()

        const channel = supabase
            .channel(`notifications:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const notification = payload.new as Notification
                    callback({
                        ...notification,
                        is_read: notification.is_read ?? false,
                        created_at: notification.created_at ?? new Date().toISOString(),
                        activity_snapshot: notification.activity_snapshot
                            ? (notification.activity_snapshot as unknown as ActivitySnapshot)
                            : null
                    })
                }
            )
            .subscribe()

        return channel
    },

    /**
     * Unsubscribe from notifications
     * @param channel - RealtimeChannel to unsubscribe
     */
    async unsubscribe(channel: RealtimeChannel): Promise<void> {
        const supabase = createClient()
        await supabase.removeChannel(channel)
    },

    /**
     * Delete a notification
     * @param notificationId - Notification ID
     */
    async deleteNotification(notificationId: string): Promise<void> {
        const supabase = createClient()

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId)

        if (error) throw error
    },

    /**
     * Format relative time for display
     * @param dateString - ISO date string
     */
    formatRelativeTime(dateString: string): string {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} menit yang lalu`
        if (diffHours < 24) return `${diffHours} jam yang lalu`
        if (diffDays === 1) return 'Kemarin'
        if (diffDays < 7) return `${diffDays} hari yang lalu`

        // Format as date
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
    }
}
