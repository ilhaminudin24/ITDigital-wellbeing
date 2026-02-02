'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import Logo from '@/components/ui/Logo'
import { useAdmin } from '@/lib/hooks/useAdmin'
import { useAuth } from '@/lib/hooks/useAuth'
import AdminActivityCard from '@/components/admin/AdminActivityCard'
import RejectModal from '@/components/admin/RejectModal'
import AdminFilters, { FilterState, GroupBy } from '@/components/admin/AdminFilters'
import type { AdminActivity } from '@/lib/services/admin.service'

export default function AdminPage() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const {
        isAdmin,
        isLoading: adminLoading,
        activities,
        stats,
        error,
        rejectActivity,
        refetchActivities
    } = useAdmin()

    const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        dateFilter: 'all',
        customDate: '',
        userFilter: '',
        activityType: '',
        searchQuery: '',
        groupBy: 'date'
    })

    // Get unique users and activity types for filter dropdowns
    const uniqueUsers = useMemo(() => {
        const users = new Map<string, { id: string; name: string }>()
        activities.forEach(a => {
            if (!users.has(a.user_id)) {
                users.set(a.user_id, { id: a.user_id, name: a.user_name })
            }
        })
        return Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name))
    }, [activities])

    const uniqueActivityTypes = useMemo(() => {
        const types = new Set(activities.map(a => a.activity_type))
        return Array.from(types).sort()
    }, [activities])

    // Apply filters
    const filteredActivities = useMemo(() => {
        let result = [...activities]

        // Date filter
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (filters.dateFilter === 'today') {
            const todayStr = today.toISOString().split('T')[0]
            result = result.filter(a => a.activity_date === todayStr)
        } else if (filters.dateFilter === 'yesterday') {
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]
            result = result.filter(a => a.activity_date === yesterdayStr)
        } else if (filters.dateFilter === 'week') {
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            result = result.filter(a => new Date(a.activity_date) >= weekAgo)
        } else if (filters.dateFilter === 'custom' && filters.customDate) {
            result = result.filter(a => a.activity_date === filters.customDate)
        }

        // User filter
        if (filters.userFilter) {
            result = result.filter(a => a.user_id === filters.userFilter)
        }

        // Activity type filter
        if (filters.activityType) {
            result = result.filter(a => a.activity_type === filters.activityType)
        }

        // Search query
        if (filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase()
            result = result.filter(a =>
                a.user_name.toLowerCase().includes(query) ||
                a.location.toLowerCase().includes(query) ||
                a.activity_type.toLowerCase().includes(query)
            )
        }

        return result
    }, [activities, filters])

    // Group activities
    const groupedActivities = useMemo(() => {
        if (filters.groupBy === 'none') {
            return { 'All Activities': filteredActivities }
        }

        const groups: Record<string, AdminActivity[]> = {}

        filteredActivities.forEach(activity => {
            let groupKey: string

            if (filters.groupBy === 'date') {
                const date = new Date(activity.activity_date)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const activityDate = new Date(activity.activity_date)
                activityDate.setHours(0, 0, 0, 0)

                if (activityDate.getTime() === today.getTime()) {
                    groupKey = 'Today'
                } else if (activityDate.getTime() === today.getTime() - 86400000) {
                    groupKey = 'Yesterday'
                } else {
                    groupKey = date.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })
                }
            } else if (filters.groupBy === 'user') {
                groupKey = activity.user_name
            } else if (filters.groupBy === 'activity') {
                groupKey = activity.activity_type
            } else {
                groupKey = 'All'
            }

            if (!groups[groupKey]) {
                groups[groupKey] = []
            }
            groups[groupKey].push(activity)
        })

        // Sort groups (Today first, then Yesterday, then by date descending)
        const sortedGroups: Record<string, AdminActivity[]> = {}
        const keys = Object.keys(groups)

        if (filters.groupBy === 'date') {
            const order = ['Today', 'Yesterday']
            const ordered = keys.sort((a, b) => {
                const aIdx = order.indexOf(a)
                const bIdx = order.indexOf(b)
                if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
                if (aIdx !== -1) return -1
                if (bIdx !== -1) return 1
                return b.localeCompare(a) // Reverse for dates
            })
            ordered.forEach(key => { sortedGroups[key] = groups[key] })
        } else {
            keys.sort().forEach(key => { sortedGroups[key] = groups[key] })
        }

        return sortedGroups
    }, [filteredActivities, filters.groupBy])

    // Handle reject button click
    const handleRejectClick = (activity: AdminActivity) => {
        setSelectedActivity(activity)
        setIsRejectModalOpen(true)
    }

    // Handle reject confirmation
    const handleRejectConfirm = async (reason: string) => {
        if (!selectedActivity) return

        setIsRejecting(true)
        const success = await rejectActivity(selectedActivity.id, reason)
        setIsRejecting(false)

        if (success) {
            setIsRejectModalOpen(false)
            setSelectedActivity(null)
            setSuccessMessage(`Activity dari ${selectedActivity.user_name} berhasil di-reject`)
            setTimeout(() => setSuccessMessage(null), 3000)
        }
    }

    // Loading state
    if (authLoading || adminLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background-light gap-4">
                <div className="animate-pulse">
                    <Logo size="xl" />
                </div>
                <p className="text-sm text-slate-500 animate-pulse">Loading admin panel...</p>
            </div>
        )
    }

    // Not authenticated
    if (!user) {
        router.push('/login')
        return null
    }

    // Not admin
    if (!isAdmin) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background-light gap-4">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">block</span>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
                    <p className="text-slate-500 mb-6">You don&apos;t have admin privileges</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo size="md" />
                        <div>
                            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
                            <p className="text-sm text-slate-500">Activity Validation</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-slate-700"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600">directions_run</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.totalActivities}</p>
                                    <p className="text-xs text-slate-500">Total Activities</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600">today</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.activitiesToday}</p>
                                    <p className="text-xs text-slate-500">Today</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-purple-600">group</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                                    <p className="text-xs text-slate-500">Total Users</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-orange-600">filter_list</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{filteredActivities.length}</p>
                                    <p className="text-xs text-slate-500">Filtered</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <AdminFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    uniqueUsers={uniqueUsers}
                    uniqueActivityTypes={uniqueActivityTypes}
                />

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-600 filled">check_circle</span>
                        <p className="text-green-800">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-600 filled">error</span>
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={refetchActivities}
                            className="ml-auto text-red-600 hover:text-red-800 underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Activities List */}
                <div className="space-y-4">
                    {filteredActivities.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">search_off</span>
                            <p className="text-slate-500 mb-2">No activities found</p>
                            <p className="text-sm text-slate-400">Try adjusting your filters</p>
                            <button
                                onClick={() => setFilters({
                                    dateFilter: 'all',
                                    customDate: '',
                                    userFilter: '',
                                    activityType: '',
                                    searchQuery: '',
                                    groupBy: 'date'
                                })}
                                className="mt-4 px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors text-sm"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        Object.entries(groupedActivities).map(([groupName, groupActivities]) => (
                            <div key={groupName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Group Header */}
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h2 className="font-semibold text-slate-900">{groupName}</h2>
                                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">
                                            {groupActivities.length} activities
                                        </span>
                                    </div>
                                    <button
                                        onClick={refetchActivities}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        title="Refresh"
                                    >
                                        <span className="material-symbols-outlined text-slate-500 text-xl">refresh</span>
                                    </button>
                                </div>

                                {/* Activities in Group */}
                                <div className="divide-y divide-gray-100">
                                    {groupActivities.map((activity) => (
                                        <AdminActivityCard
                                            key={activity.id}
                                            activity={activity}
                                            onReject={() => handleRejectClick(activity)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Reject Modal */}
            <RejectModal
                isOpen={isRejectModalOpen}
                activity={selectedActivity}
                isLoading={isRejecting}
                onConfirm={handleRejectConfirm}
                onCancel={() => {
                    setIsRejectModalOpen(false)
                    setSelectedActivity(null)
                }}
            />
        </div>
    )
}
