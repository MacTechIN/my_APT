"use client";

import { Bell, ShoppingBag, User, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "홈", icon: Home },
        { href: "/announcements", label: "공지", icon: Bell },
        { href: "/marketplace", label: "장터", icon: ShoppingBag },
    ];

    return (
        <nav className="fixed bottom-0 flex h-16 w-full items-center justify-around border-t bg-white px-4 sm:hidden">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1",
                            isActive ? "text-blue-600" : "text-slate-400"
                        )}
                    >
                        <Icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
