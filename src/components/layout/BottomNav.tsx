"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function BottomNav() {
    const pathname = usePathname();
    const [isHidden, setIsHidden] = useState(false);

    // Listen for modal state changes to hide/show nav
    useEffect(() => {
        const handleModalStateChange = (event: CustomEvent<{ isOpen: boolean }>) => {
            setIsHidden(event.detail.isOpen);
        };

        window.addEventListener('modal-state-change', handleModalStateChange as EventListener);
        return () => {
            window.removeEventListener('modal-state-change', handleModalStateChange as EventListener);
        };
    }, []);

    if (pathname === "/" || pathname === "/login") return null;

    const navItems = [
        { name: "Home", href: "/dashboard", icon: "home", filled: true },
        { name: "Record", href: "/record", icon: "radio_button_checked" },
        { name: "History", href: "/history", icon: "history" },
        { name: "Report", href: "/report", icon: "bar_chart" },
        { name: "Rank", href: "/leaderboard", icon: "leaderboard" },
    ];

    return (
        <nav
            className={clsx(
                "fixed bottom-0 left-0 w-full z-50 bg-nav-bg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-transform duration-300",
                isHidden ? "translate-y-full" : "translate-y-0"
            )}
        >
            <div className="max-w-lg mx-auto w-full px-2 pb-6 pt-3">
                <ul className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name} className="flex-1">
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "flex flex-col items-center gap-1 p-2 transition-colors group",
                                        isActive ? "text-primary" : "text-text-muted hover:text-primary"
                                    )}
                                >
                                    <div className="relative">
                                        <div className={clsx("p-1 rounded-full transition-colors", isActive ? "group-hover:bg-primary/5" : "group-hover:bg-gray-100")}>
                                            <span className={clsx("material-symbols-outlined", (isActive || item.filled) && "filled", isActive && "animate-pulse")}>
                                                {item.icon}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

