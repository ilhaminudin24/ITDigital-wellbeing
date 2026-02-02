'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { notificationService, ParsedNotification } from '@/lib/services/notification.service'
import { useAuth } from './useAuth'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface NotificationState {
    notifications: ParsedNotification[]
    unreadCount: number
    isLoading: boolean
    error: string | null
}

interface UseNotificationsReturn extends NotificationState {
    refetch: () => Promise<void>
    markAsRead: (notificationId: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    formatRelativeTime: (dateString: string) => string
}

/**
 * useNotifications Hook
 * Provides notification state and actions with real-time updates
 */
export function useNotifications(): UseNotificationsReturn {
    const { user } = useAuth()
    const [state, setState] = useState<NotificationState>({
        notifications: [],
        unreadCount: 0,
        isLoading: true,
        error: null
    })
    const channelRef = useRef<RealtimeChannel | null>(null)

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setState({ notifications: [], unreadCount: 0, isLoading: false, error: null })
            return
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const [notifications, unreadCount] = await Promise.all([
                notificationService.getNotifications(user.id),
                notificationService.getUnreadCount(user.id)
            ])

            setState({
                notifications,
                unreadCount,
                isLoading: false,
                error: null
            })
        } catch (error) {
            console.error('Error fetching notifications:', error)
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Gagal memuat notifikasi'
            }))
        }
    }, [user])

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!user) return

        // Initial fetch
        fetchNotifications()

        // Subscribe to real-time updates
        channelRef.current = notificationService.subscribeToNotifications(
            user.id,
            (newNotification) => {
                setState(prev => ({
                    ...prev,
                    notifications: [newNotification, ...prev.notifications],
                    unreadCount: prev.unreadCount + 1
                }))
            }
        )

        // Cleanup subscription on unmount
        return () => {
            if (channelRef.current) {
                notificationService.unsubscribe(channelRef.current)
            }
        }
    }, [user, fetchNotifications])

    // Mark single notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId)

            setState(prev => ({
                ...prev,
                notifications: prev.notifications.map(n =>
                    n.id === notificationId ? { ...n, is_read: true } : n
                ),
                unreadCount: Math.max(0, prev.unreadCount - 1)
            }))
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }, [])

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        if (!user) return

        try {
            await notificationService.markAllAsRead(user.id)

            setState(prev => ({
                ...prev,
                notifications: prev.notifications.map(n => ({ ...n, is_read: true })),
                unreadCount: 0
            }))
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }, [user])

    return {
        ...state,
        refetch: fetchNotifications,
        markAsRead,
        markAllAsRead,
        formatRelativeTime: notificationService.formatRelativeTime
    }
}
