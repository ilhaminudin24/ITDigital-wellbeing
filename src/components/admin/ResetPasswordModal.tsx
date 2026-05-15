'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { AdminUser } from '@/lib/services/admin.service'

interface ResetPasswordModalProps {
    isOpen: boolean
    user: AdminUser | null
    isLoading: boolean
    onConfirm: (newPassword: string) => void
    onCancel: () => void
}

export default function ResetPasswordModal({
    isOpen,
    user,
    isLoading,
    onConfirm,
    onCancel
}: ResetPasswordModalProps) {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    if (!isOpen || !user) return null

    const passwordValid = newPassword.length >= 6
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0
    const canSubmit = passwordValid && passwordsMatch

    const handleConfirm = () => {
        if (canSubmit) {
            onConfirm(newPassword)
            // Reset form
            setNewPassword('')
            setConfirmPassword('')
            setShowPassword(false)
        }
    }

    const handleCancel = () => {
        setNewPassword('')
        setConfirmPassword('')
        setShowPassword(false)
        onCancel()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-600">lock_reset</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Reset Password</h2>
                        <p className="text-sm text-slate-500">Set password baru untuk user</p>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {user.nik && <span>NIK: {user.nik}</span>}
                                {user.nik && user.email && <span>•</span>}
                                {user.email && <span>{user.email}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Form */}
                <div className="px-6 py-4 flex flex-col gap-4">
                    {/* New Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Password Baru</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimal 6 karakter"
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password baru"
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Validation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <ul className="text-xs text-blue-700 space-y-1.5">
                            <li className="flex items-center gap-2">
                                <span className={`material-symbols-outlined text-[14px] ${passwordValid ? 'text-green-600' : 'text-blue-400'}`}>
                                    {passwordValid ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                Minimal 6 karakter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={`material-symbols-outlined text-[14px] ${passwordsMatch ? 'text-green-600' : 'text-blue-400'}`}>
                                    {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                Password cocok
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Warning */}
                <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="material-symbols-outlined text-base mt-0.5">info</span>
                        <span>
                            User akan diminta untuk mengubah password saat login berikutnya.
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
                                ? "bg-primary hover:bg-[#004f93] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">lock_reset</span>
                                Reset Password
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
