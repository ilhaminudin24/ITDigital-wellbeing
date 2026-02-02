'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { AdminActivity } from '@/lib/services/admin.service'

interface AdminActivityCardProps {
    activity: AdminActivity
    onReject: () => void
}

export default function AdminActivityCard({ activity, onReject }: AdminActivityCardProps) {
    const [isPhotoExpanded, setIsPhotoExpanded] = useState(false)

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const isToday = date.toDateString() === today.toDateString()

        if (isToday) {
            return 'Today'
        }

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        })
    }

    // Get activity type icon
    const getActivityIcon = (type: string) => {
        const icons: Record<string, string> = {
            'Walking': 'directions_walk',
            'Running': 'directions_run',
            'Cycling': 'directions_bike',
            'Swimming': 'pool',
            'Gym': 'fitness_center',
            'Yoga': 'self_improvement',
            'Futsal': 'sports_soccer',
            'Football': 'sports_soccer',
            'Badminton': 'sports_tennis',
            'Basketball': 'sports_basketball'
        }
        return icons[type] || 'directions_run'
    }

    const isToday = new Date(activity.activity_date).toDateString() === new Date().toDateString()

    return (
        <>
            <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                        {activity.user_avatar ? (
                            <img
                                src={activity.user_avatar}
                                alt={activity.user_name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-bold text-primary">
                                    {activity.user_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 truncate">
                                {activity.user_name}
                            </h3>
                            <span className={clsx(
                                "px-2 py-0.5 text-xs font-medium rounded-full",
                                isToday
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                            )}>
                                {formatDate(activity.activity_date)}
                            </span>
                        </div>

                        {/* Activity Details */}
                        <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">
                                    {getActivityIcon(activity.activity_type)}
                                </span>
                                {activity.activity_type}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">straighten</span>
                                {activity.distance} km
                            </span>
                            <span className="flex items-center gap-1 text-orange-600">
                                <span className="material-symbols-outlined text-base filled">local_fire_department</span>
                                {activity.calories} cal
                            </span>
                        </div>

                        {/* Location */}
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {activity.location}
                        </p>
                    </div>

                    {/* Photo Thumbnail */}
                    {activity.photo_url && (
                        <div
                            className="flex-shrink-0 cursor-pointer"
                            onClick={() => setIsPhotoExpanded(true)}
                        >
                            <img
                                src={activity.photo_url}
                                alt="Activity photo"
                                className="w-20 h-20 rounded-lg object-cover hover:opacity-80 transition-opacity"
                            />
                        </div>
                    )}

                    {/* Reject Button */}
                    <div className="flex-shrink-0 self-center">
                        <button
                            onClick={onReject}
                            className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                            Reject
                        </button>
                    </div>
                </div>
            </div>

            {/* Photo Expanded Modal */}
            {isPhotoExpanded && activity.photo_url && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setIsPhotoExpanded(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img
                            src={activity.photo_url}
                            alt="Activity photo"
                            className="max-w-full max-h-[90vh] rounded-lg object-contain"
                        />
                        <button
                            onClick={() => setIsPhotoExpanded(false)}
                            className="absolute top-2 right-2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {/* Activity Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                            <p className="text-white font-semibold">{activity.user_name}</p>
                            <p className="text-white/80 text-sm">
                                {activity.activity_type} • {activity.distance} km • {activity.calories} cal
                            </p>
                            <p className="text-white/60 text-sm">{activity.location}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
