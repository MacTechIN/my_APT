import Link from "next/link";
import { Bell, ShoppingBag, User } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm">
                <h1 className="text-xl font-bold tracking-tight text-primary">my_APT</h1>
                <div className="flex gap-4">
                    <Bell className="h-6 w-6 text-slate-600" />
                    <User className="h-6 w-6 text-slate-600" />
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center bg-white px-6 py-12 text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    우리 아파트의 더 나은 일상
                </h2>
                <p className="mt-4 text-slate-600">
                    관리소 공지사항부터 이웃과의 따뜻한 나눔까지 한곳에서 확인하세요.
                </p>
            </section>

            {/* Main Navigation Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 px-4 pb-20 sm:grid-cols-2">
                <Link
                    href="/announcements"
                    className="group relative flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md"
                >
                    <div className="mb-4 rounded-full bg-blue-50 p-4 transition-colors group-hover:bg-blue-100">
                        <Bell className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="text-lg font-semibold text-slate-900">관리실 공지사항</span>
                    <span className="mt-1 text-sm text-slate-500 text-center">중요한 소식을 놓치지 마세요</span>
                </Link>

                <Link
                    href="/marketplace"
                    className="group relative flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md"
                >
                    <div className="mb-4 rounded-full bg-green-50 p-4 transition-colors group-hover:bg-green-100">
                        <ShoppingBag className="h-8 w-8 text-green-600" />
                    </div>
                    <span className="text-lg font-semibold text-slate-900">알뜰 나눔 장터</span>
                    <span className="mt-1 text-sm text-slate-500 text-center">이웃과 자원을 공유해보세요</span>
                </Link>
            </div>

            {/* Bottom Navigation (Mobile Only Mobile-First) */}
            <nav className="fixed bottom-0 flex h-16 w-full items-center justify-around border-t bg-white px-4 sm:hidden">
                <div className="flex flex-col items-center text-blue-600">
                    <User className="h-6 w-6" />
                    <span className="text-xs">홈</span>
                </div>
                <Link href="/announcements" className="flex flex-col items-center text-slate-400">
                    <Bell className="h-6 w-6" />
                    <span className="text-xs">공지</span>
                </Link>
                <Link href="/marketplace" className="flex flex-col items-center text-slate-400">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="text-xs">장터</span>
                </Link>
            </nav>
        </main>
    );
}
