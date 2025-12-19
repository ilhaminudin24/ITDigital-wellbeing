"use client";

import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

interface Activity {
    date: { day: number; month: string };
    title: string;
    duration: string;
    distance: string;
    startPoint: string;
    endPoint: string;
}

interface ActivityDetailModalProps {
    activity: Activity | null;
    onClose: () => void;
}

export default function ActivityDetailModal({ activity, onClose }: ActivityDetailModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startY = useRef<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus Management & Scroll Lock
    useEffect(() => {
        if (activity) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
            // Focus trap
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
        } else {
            setIsVisible(false);
            setDragOffset(0);
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [activity]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    // Swipe Logic
    const handleTouchStart = (e: React.TouchEvent) => {
        // Only allow dragging from the header area or top 50px
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
            setDragOffset(0); // Reset position
        }
    };

    if (!activity && !isVisible) return null;

    return (
        <div className={clsx(
            "fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none",
            activity ? "pointer-events-auto" : ""
        )}>
            {/* Backdrop - Click to Close */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className={clsx(
                    "relative w-full max-w-lg bg-white h-[92dvh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
                    isVisible ? "translate-y-0" : "translate-y-full"
                )}
                style={{
                    transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                    transform: isDragging ? `translateY(${dragOffset}px)` : isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: isDragging ? "none" : undefined
                }}
                onClick={(e) => e.stopPropagation()} // Stop bubbling to backdrop
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag Handle Indicator */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full z-30 opacity-50 sm:hidden"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
                    <h2 className="text-lg font-bold text-slate-900">Activity Details</h2>
                    <button
                        ref={closeButtonRef}
                        onClick={handleClose}
                        className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                        aria-label="Close details"
                    >
                        <span className="material-symbols-outlined !text-xl">close</span>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-8 bg-white">
                    {/* Hero Map */}
                    <div className="h-64 w-full bg-slate-100 relative">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-80"
                            style={{
                                backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=-6.229728,106.664705&zoom=15&size=600x400&maptype=roadmap&style=feature:poi|visibility:off&key=YOUR_API_KEY_HERE')`
                            }}
                        />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/map-light.png')] opacity-50"></div>
                        <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm text-slate-600">
                            View Full Map
                        </div>
                    </div>

                    <div className="px-6 -mt-6 relative z-10">
                        {/* Meta Card */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-900">
                                <span className="material-symbols-outlined !text-lg text-primary">calendar_today</span>
                                <span className="font-bold">Thursday, {activity?.date.day} {activity?.date.month} 2024</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm ml-7">
                                <span>08:30 AM</span>
                                <span>•</span>
                                <span>{activity?.title || "Walk"}</span>
                            </div>
                        </div>

                        {/* Photo Evidence */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide opacity-80">Activity Photo</h3>
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 rotate-1 hover:rotate-0 transition-transform duration-300">
                                <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl overflow-hidden relative">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2670&auto=format&fit=crop')` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Route Timeline */}
                        <div className="mb-8 relative">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide opacity-80">Route</h3>
                            <div className="flex flex-col gap-0 pl-2">
                                {/* Start Point */}
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full border-[3px] border-emerald-500 bg-white z-10"></div>
                                        <div className="w-0.5 h-full bg-gray-200 absolute top-4 bottom-[-20px]"></div>
                                    </div>
                                    <div className="pb-8">
                                        <div className="text-sm font-bold text-slate-900">{activity?.startPoint || "Start Point"}</div>
                                        <div className="text-xs text-slate-500">Start Point • 08:30 AM</div>
                                    </div>
                                </div>

                                {/* End Point */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm z-10"></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{activity?.endPoint || "End Point"}</div>
                                        <div className="text-xs text-slate-500">Destination • 09:15 AM</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{activity?.distance}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distance</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{activity?.duration}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                            </div>
                        </div>

                    </div>
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
}
