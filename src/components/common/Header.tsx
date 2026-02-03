"use client";

import { Bell, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm">
            <Link href="/">
                <h1 className="text-xl font-bold tracking-tight text-primary">my_APT</h1>
            </Link>
            <div className="flex gap-4">
                <Bell className="h-6 w-6 text-slate-600" />
                <User className="h-6 w-6 text-slate-600" />
            </div>
        </header>
    );
}
