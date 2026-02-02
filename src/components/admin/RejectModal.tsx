'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { AdminActivity } from '@/lib/services/admin.service'

interface RejectModalProps {
    isOpen: boolean
    activity: AdminActivity | null
    isLoading: boolean
    onConfirm: (reason: string) => void
    onCancel: () => void
}

const PREDEFINED_REASONS = [
    'Foto tidak menunjukkan aktivitas yang dilakukan',
    'Foto blur atau tidak jelas',
    'Data kalori tidak sesuai dengan jenis aktivitas',
    'Data jarak tidak masuk akal',
    'Lokasi tidak valid atau tidak sesuai',
    'Foto duplikat atau sudah pernah digunakan',
    'Lainnya'
]

export default function RejectModal({
    isOpen,
    activity,
    isLoading,
    onConfirm,
    onCancel
}: RejectModalProps) {
    const [selectedReason, setSelectedReason] = useState('')
    const [customReason, setCustomReason] = useState('')

    if (!isOpen || !activity) return null

    const finalReason = selectedReason === 'Lainnya'
        ? customReason
        : selectedReason

    const canSubmit = finalReason.trim().length > 0

    const handleConfirm = () => {
        if (canSubmit) {
            onConfirm(finalReason)
            // Reset form
            setSelectedReason('')
            setCustomReason('')
        }
    }

    const handleCancel = () => {
        setSelectedReason('')
        setCustomReason('')
        onCancel()
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600">warning</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Reject Activity</h2>
                        <p className="text-sm text-slate-500">Activity akan dihapus permanen</p>
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        {activity.user_avatar ? (
                            <img
                                src={activity.user_avatar}
                                alt={activity.user_name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
                                    {activity.user_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-slate-900">{activity.user_name}</p>
                            <p className="text-sm text-slate-500">{formatDate(activity.activity_date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">directions_run</span>
                            {activity.activity_type}
                        </span>
                        <span>{activity.distance} km</span>
                        <span className="text-orange-600 font-medium">{activity.calories} cal</span>
                    </div>
                </div>

                {/* Rejection Reason */}
                <div className="px-6 py-4">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Pilih alasan rejection:
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {PREDEFINED_REASONS.map((reason) => (
                            <label
                                key={reason}
                                className={clsx(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                    selectedReason === reason
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={() => setSelectedReason(reason)}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-slate-700">{reason}</span>
                            </label>
                        ))}
                    </div>

                    {/* Custom Reason Input */}
                    {selectedReason === 'Lainnya' && (
                        <div className="mt-3">
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Tulis alasan rejection..."
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                rows={3}
                            />
                        </div>
                    )}
                </div>

                {/* Warning */}
                <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="material-symbols-outlined text-base mt-0.5">info</span>
                        <span>
                            Activity akan dihapus permanen dan kalori akan dikurangi dari total user.
                            User akan menerima notifikasi tentang rejection ini.
                        </span>
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!canSubmit || isLoading}
                        className={clsx(
                            "flex-1 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2",
                            canSubmit && !isLoading
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Rejecting...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">delete</span>
                                Reject & Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
