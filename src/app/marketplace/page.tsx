import MarketplaceBoard from "@/components/marketplace/MarketplaceBoard";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MarketplacePage() {
    return (
        <main className="flex min-h-screen flex-col bg-slate-50 pb-10">
            <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-white px-4 shadow-sm">
                <Link href="/" className="mr-4 text-slate-600">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">알뜰 나눔 장터</h1>
            </header>

            <div className="mt-4">
                <MarketplaceBoard />
            </div>
        </main>
    );
}
