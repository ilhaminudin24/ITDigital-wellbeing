'use client'

import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { useNotifications } from '@/lib/hooks/useNotifications'
import NotificationPanel from './NotificationPanel'

interface NotificationBellProps {
    className?: string
}

export default function NotificationBell({ className }: NotificationBellProps) {
    const { unreadCount, notifications, isLoading, markAsRead, markAllAsRead, formatRelativeTime } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Close panel when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                panelRef.current &&
                buttonRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Close on escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    const handleNotificationClick = async (notificationId: string) => {
        await markAsRead(notificationId)
    }

    return (
        <div className={clsx("relative", className)}>
            {/* Bell Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "relative p-2 rounded-full transition-colors",
                    isOpen
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-gray-100"
                )}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
                <span className="material-symbols-outlined text-2xl">
                    {unreadCount > 0 ? 'notifications_active' : 'notifications'}
                </span>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div
                    ref={panelRef}
                    className="absolute right-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <NotificationPanel
                        notifications={notifications}
                        isLoading={isLoading}
                        onNotificationClick={handleNotificationClick}
                        onMarkAllAsRead={markAllAsRead}
                        formatRelativeTime={formatRelativeTime}
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}
        </div>
    )
}
