"use client";

import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

interface Activity {
    id?: string;
    date: { day: number; month: string };
    title: string;
    activity_type?: string;
    calories: number;
    distance: number;
    photo?: string;
    location: string;
}

interface ActivityDetailModalProps {
    activity: Activity | null;
    onClose: () => void;
    onDelete?: (id: string) => Promise<void>;
    isDeleting?: boolean;
}

const getActivityIcon = (type?: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('run') || t.includes('lari')) return 'directions_run';
    if (t.includes('cycl') || t.includes('sepeda')) return 'directions_bike';
    if (t.includes('swim') || t.includes('renang')) return 'pool';
    if (t.includes('yoga')) return 'self_improvement';
    if (t.includes('gym') || t.includes('fitness')) return 'fitness_center';
    if (t.includes('football') || t.includes('soccer') || t.includes('bola') || t.includes('futsal')) return 'sports_soccer';
    if (t.includes('basket')) return 'sports_basketball';
    if (t.includes('badminton') || t.includes('bulu')) return 'sports_tennis';
    if (t.includes('padel')) return 'sports_tennis';
    if (t.includes('tennis') && !t.includes('table')) return 'sports_tennis';
    return 'directions_walk'; // Default
};

export default function ActivityDetailModal({ activity, onClose, onDelete, isDeleting = false }: ActivityDetailModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startY = useRef<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Handle delete with confirmation
    const handleDelete = async () => {
        if (!activity?.id || !onDelete) return;

        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus aktivitas ini?');
        if (!confirmed) return;

        await onDelete(activity.id);
    };

    // Focus Management & Scroll Lock & BottomNav visibility
    useEffect(() => {
        if (activity) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
            // Dispatch event to hide BottomNav
            window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: true } }));
            // Focus trap
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
        } else {
            setIsVisible(false);
            setDragOffset(0);
            document.body.style.overflow = "";
            // Dispatch event to show BottomNav
            window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
        }

        return () => {
            document.body.style.overflow = "";
            window.dispatchEvent(new CustomEvent('modal-state-change', { detail: { isOpen: false } }));
        };
    }, [activity]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    // Swipe Logic
    const handleTouchStart = (e: React.TouchEvent) => {
        const touchscreenY = e.touches[0].clientY;
        const modalTop = modalRef.current?.getBoundingClientRect().top || 0;

        if (touchscreenY < modalTop + 60) {
            startY.current = touchscreenY;
            setIsDragging(true);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || startY.current === null) return;
        const currentY = e.touches[0].clientY;
        const delta = currentY - startY.current;
        if (delta > 0) {
            setDragOffset(delta);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        startY.current = null;

        if (dragOffset > 150) {
            handleClose();
        } else {
            setDragOffset(0);
        }
    };

    if (!activity && !isVisible) return null;

    // Show delete button whenever onDelete is provided - handleDelete validates id
    const showDeleteButton = !!onDelete;

    return (
        <div className={clsx(
            "fixed inset-0 z-[60] flex items-end sm:items-center justify-center",
            activity ? "pointer-events-auto" : "pointer-events-none"
        )}>
            {/* Backdrop */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal Container - Optimized height for mobile */}
            <div
                ref={modalRef}
                className={clsx(
                    "relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col transition-transform duration-500",
                    // Reduced height on mobile to account for bottom nav bar
                    "max-h-[75dvh] sm:max-h-[80vh]",
                    isVisible ? "translate-y-0" : "translate-y-full"
                )}
                style={{
                    transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                    transform: isDragging ? `translateY(${dragOffset}px)` : isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: isDragging ? "none" : undefined,
                    // Safe area for iPhone notch/home indicator
                    paddingBottom: "env(safe-area-inset-bottom, 0px)"
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag Handle - More visible */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-400 rounded-full z-30 sm:hidden" />

                {/* Header - Compact */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-white sticky top-0 z-20 shrink-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Activity Details</h2>
                    <button
                        ref={closeButtonRef}
                        onClick={handleClose}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                        aria-label="Close details"
                    >
                        <span className="material-symbols-outlined !text-xl">close</span>
                    </button>
                </div>

                {/* Scrollable Content - min-h-0 is critical for flex scroll! */}
                <div
                    className="flex-1 min-h-0 overflow-y-auto bg-white"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {/* Hero Section with Photo - Reduced height on mobile */}
                    {/* Hero Section with Photo - Adaptive height */}
                    <div className="w-full bg-slate-900 relative shrink-0 flex items-center justify-center overflow-hidden min-h-[250px] sm:min-h-[300px]">
                        {activity?.photo ? (
                            <>
                                {/* Blurred Background Layer for localized ambience */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-60 scale-110"
                                    style={{ backgroundImage: `url('${activity.photo}')` }}
                                />

                                {/* Gradient Overlay to ensure text readability if needed, and depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                {/* Main Image - Contain to show FULL image */}
                                <img
                                    src={activity.photo}
                                    alt="Activity proof"
                                    className="relative z-10 w-full h-auto max-h-[50vh] object-contain shadow-lg"
                                    style={{ maxHeight: 'min(50vh, 500px)' }}
                                />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20 bg-slate-100">
                                <span className="material-symbols-outlined text-5xl sm:text-6xl text-primary/30">
                                    {getActivityIcon(activity?.activity_type)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="px-4 sm:px-6 -mt-4 sm:-mt-6 relative z-10 pb-4">
                        {/* Meta Card - Compact */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 mb-4 sm:mb-6 flex flex-col gap-0.5">
                            <div className="flex items-center gap-2 text-slate-900">
                                <span className="material-symbols-outlined !text-base sm:!text-lg text-primary">calendar_today</span>
                                <span className="font-bold text-sm sm:text-base">{activity?.date.day} {activity?.date.month} 2026</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm ml-6 sm:ml-7">
                                <span>{activity?.title || "Walk"}</span>
                            </div>
                        </div>

                        {/* Calories Card - Compact */}
                        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-primary/5 to-accent/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-wider mb-0.5 sm:mb-1">Calories Burned</p>
                                    <p className="text-3xl sm:text-4xl font-black text-primary">
                                        {activity?.calories || 0}
                                        <span className="text-base sm:text-lg font-bold text-primary/70 ml-1">cal</span>
                                    </p>
                                </div>
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">local_fire_department</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Info - Compact */}
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 sm:mb-4 uppercase tracking-wide opacity-80">Activity Info</h3>
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {/* Type */}
                                <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary !text-lg sm:!text-xl">
                                            {getActivityIcon(activity?.activity_type)}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Activity Type</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                            {activity?.activity_type || "Walking"}
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary !text-lg sm:!text-xl">location_on</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Exercise Location</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{activity?.location || "Location"}</div>
                                    </div>
                                </div>

                                {/* Distance */}
                                <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary !text-lg sm:!text-xl">straighten</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Jarak (Distance)</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900">{activity?.distance || 0} km</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Delete Button Footer - ALWAYS VISIBLE */}
                {showDeleteButton && (
                    <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Menghapus...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined !text-lg sm:!text-xl">delete</span>
                                    <span>Hapus Aktivitas</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
