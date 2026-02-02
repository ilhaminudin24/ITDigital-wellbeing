'use client'

import { useState } from 'react'
import clsx from 'clsx'

export type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'custom'
export type GroupBy = 'none' | 'date' | 'user' | 'activity'

export interface FilterState {
    dateFilter: DateFilter
    customDate: string
    userFilter: string
    activityType: string
    searchQuery: string
    groupBy: GroupBy
}

interface AdminFiltersProps {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    uniqueUsers: { id: string; name: string }[]
    uniqueActivityTypes: string[]
}

export default function AdminFilters({
    filters,
    onFiltersChange,
    uniqueUsers,
    uniqueActivityTypes
}: AdminFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    const clearFilters = () => {
        onFiltersChange({
            dateFilter: 'all',
            customDate: '',
            userFilter: '',
            activityType: '',
            searchQuery: '',
            groupBy: 'date'
        })
    }

    const hasActiveFilters =
        filters.dateFilter !== 'all' ||
        filters.userFilter !== '' ||
        filters.activityType !== '' ||
        filters.searchQuery !== ''

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            {/* Search Bar - Always Visible */}
            <div className="p-4 flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name, location, or activity type..."
                        value={filters.searchQuery}
                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                    {filters.searchQuery && (
                        <button
                            onClick={() => updateFilter('searchQuery', '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                        >
                            <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
                        </button>
                    )}
                </div>

                {/* Quick Date Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {(['all', 'today', 'yesterday', 'week'] as DateFilter[]).map((dateOption) => (
                        <button
                            key={dateOption}
                            onClick={() => updateFilter('dateFilter', dateOption)}
                            className={clsx(
                                "px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                                filters.dateFilter === dateOption
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                            )}
                        >
                            {dateOption === 'all' && 'All Dates'}
                            {dateOption === 'today' && 'Today'}
                            {dateOption === 'yesterday' && 'Yesterday'}
                            {dateOption === 'week' && 'This Week'}
                        </button>
                    ))}
                </div>

                {/* Toggle More Filters */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isExpanded || hasActiveFilters
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                    )}
                >
                    <span className="material-symbols-outlined text-lg">tune</span>
                    <span className="hidden sm:inline">Filters</span>
                    {hasActiveFilters && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                </button>
            </div>

            {/* Expanded Filters */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Custom Date */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Specific Date
                            </label>
                            <input
                                type="date"
                                value={filters.customDate}
                                onChange={(e) => {
                                    updateFilter('customDate', e.target.value)
                                    if (e.target.value) {
                                        updateFilter('dateFilter', 'custom')
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                            />
                        </div>

                        {/* User Filter */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Filter by User
                            </label>
                            <select
                                value={filters.userFilter}
                                onChange={(e) => updateFilter('userFilter', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                            >
                                <option value="">All Users</option>
                                {uniqueUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Activity Type Filter */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Activity Type
                            </label>
                            <select
                                value={filters.activityType}
                                onChange={(e) => updateFilter('activityType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                            >
                                <option value="">All Types</option>
                                {uniqueActivityTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Group By */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Group By
                            </label>
                            <select
                                value={filters.groupBy}
                                onChange={(e) => updateFilter('groupBy', e.target.value as GroupBy)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                            >
                                <option value="date">By Date</option>
                                <option value="user">By User</option>
                                <option value="activity">By Activity Type</option>
                                <option value="none">No Grouping</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">clear_all</span>
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Filter Tags */}
            {hasActiveFilters && !isExpanded && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                    {filters.dateFilter !== 'all' && (
                        <FilterTag
                            label={filters.dateFilter === 'custom' ? filters.customDate : filters.dateFilter}
                            onRemove={() => {
                                updateFilter('dateFilter', 'all')
                                updateFilter('customDate', '')
                            }}
                        />
                    )}
                    {filters.userFilter && (
                        <FilterTag
                            label={uniqueUsers.find(u => u.id === filters.userFilter)?.name || 'User'}
                            onRemove={() => updateFilter('userFilter', '')}
                        />
                    )}
                    {filters.activityType && (
                        <FilterTag
                            label={filters.activityType}
                            onRemove={() => updateFilter('activityType', '')}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

interface FilterTagProps {
    label: string
    onRemove: () => void
}

function FilterTag({ label, onRemove }: FilterTagProps) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {label}
            <button
                onClick={onRemove}
                className="hover:bg-primary/20 rounded-full p-0.5"
            >
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </span>
    )
}
