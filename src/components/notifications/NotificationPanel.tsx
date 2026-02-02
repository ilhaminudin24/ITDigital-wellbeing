'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { ParsedNotification } from '@/lib/services/notification.service'
import type { ActivitySnapshot } from '@/lib/supabase/types'

interface NotificationPanelProps {
    notifications: ParsedNotification[]
    isLoading: boolean
    onNotificationClick: (notificationId: string) => void
    onMarkAllAsRead: () => void
    formatRelativeTime: (dateString: string) => string
    onClose: () => void
}

export default function NotificationPanel({
    notifications,
    isLoading,
    onNotificationClick,
    onMarkAllAsRead,
    formatRelativeTime,
    onClose
}: NotificationPanelProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const hasUnread = notifications.some(n => !n.is_read)

    const handleNotificationClick = (notification: ParsedNotification) => {
        if (!notification.is_read) {
            onNotificationClick(notification.id)
        }

        // Toggle expand
        if (expandedId === notification.id) {
            setExpandedId(null)
        } else {
            setExpandedId(notification.id)
        }
    }

    return (
        <div className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-slate-900">Notifikasi</h3>
                <div className="flex items-center gap-2">
                    {hasUnread && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                            Tandai semua dibaca
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg text-slate-500">close</span>
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="p-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && notifications.length === 0 && (
                <div className="p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">notifications_off</span>
                    <p className="text-slate-500 text-sm">Belum ada notifikasi</p>
                </div>
            )}

            {/* Notifications List */}
            {!isLoading && notifications.length > 0 && (
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            isExpanded={expandedId === notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            formatRelativeTime={formatRelativeTime}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface NotificationItemProps {
    notification: ParsedNotification
    isExpanded: boolean
    onClick: () => void
    formatRelativeTime: (dateString: string) => string
}

function NotificationItem({
    notification,
    isExpanded,
    onClick,
    formatRelativeTime
}: NotificationItemProps) {
    const isRejection = notification.type === 'activity_rejected'
    const snapshot = notification.activity_snapshot as ActivitySnapshot | null

    // Get icon based on type
    const getIcon = () => {
        if (isRejection) return 'cancel'
        return 'notifications'
    }

    // Get icon color
    const getIconColor = () => {
        if (isRejection) return 'text-red-500 bg-red-100'
        return 'text-blue-500 bg-blue-100'
    }

    return (
        <div
            onClick={onClick}
            className={clsx(
                "p-4 cursor-pointer transition-colors",
                notification.is_read ? "bg-white" : "bg-blue-50/50",
                "hover:bg-gray-50"
            )}
        >
            <div className="flex gap-3">
                {/* Icon */}
                <div className={clsx(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    getIconColor()
                )}>
                    <span className="material-symbols-outlined text-xl filled">{getIcon()}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title & Time */}
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={clsx(
                            "text-sm truncate",
                            notification.is_read ? "font-medium text-slate-700" : "font-semibold text-slate-900"
                        )}>
                            {notification.title}
                        </h4>
                        {!notification.is_read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                    </div>

                    {/* Message */}
                    <p className="text-sm text-slate-600 line-clamp-2 mb-1">
                        {notification.message}
                    </p>

                    {/* Time */}
                    <p className="text-xs text-slate-400">
                        {formatRelativeTime(notification.created_at || new Date().toISOString())}
                    </p>

                    {/* Expanded Activity Details */}
                    {isExpanded && snapshot && (
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg text-sm">
                            <p className="font-medium text-slate-700 mb-2">Detail Aktivitas:</p>
                            <div className="space-y-1 text-slate-600">
                                <p className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">directions_run</span>
                                    {snapshot.activity_type}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">event</span>
                                    {new Date(snapshot.activity_date).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">location_on</span>
                                    {snapshot.location}
                                </p>
                                <div className="flex gap-4">
                                    <p className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">straighten</span>
                                        {snapshot.distance} km
                                    </p>
                                    <p className="flex items-center gap-2 text-orange-600">
                                        <span className="material-symbols-outlined text-base filled">local_fire_department</span>
                                        {snapshot.calories} cal
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Expand indicator */}
                    {snapshot && (
                        <button className="mt-2 text-xs text-primary hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                                {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                            {isExpanded ? 'Sembunyikan detail' : 'Lihat detail'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
