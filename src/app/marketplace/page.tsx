"use client";

import { useRealtimeCollection } from "@/hooks/useRealtime";
import { MarketplaceItem } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useState } from "react";

// In a real app, these would be separate files as per spec. 
// For this turn, I am aggregating them to ensure functionality quickly before splitting if needed, 
// or I will write them to their specific files now. 
// Let's write the main board logic first.

export default function MarketplaceBoardPage() {
    const [filter, setFilter] = useState<'all' | 'available' | 'reserved' | 'completed'>('all');

    // Query construction
    const constraints = [orderBy('createdAt', 'desc')];
    // Note: Client-side filtering is often easier for small datasets vs complex composite indexes for every combination

    const { data: items, loading, error } = useRealtimeCollection<MarketplaceItem>(
        'marketplace_items',
        constraints
    );

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    if (loading) return <div className="p-8 text-center text-slate-500">Loading marketplace...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading items</div>;

    return (
        <div className="flex flex-col gap-4 pb-20 p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">나눔 장터</h1>
                {/* Filter UI */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border rounded p-1 text-sm"
                >
                    <option value="all">전체</option>
                    <option value="available">나눔중</option>
                    <option value="reserved">예약중</option>
                    <option value="completed">완료</option>
                </select>
            </div>

            <div className="grid gap-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg">
                        등록된 물건이 없습니다.
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <p className="text-xs text-slate-400">
                                        {item.authorDongHo || item.authorName} • {item.createdAt?.toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge status={item.status} />
                            </div>

                            <p className="text-slate-600 line-clamp-2 text-sm">{item.description}</p>

                            <div className="mt-2 text-xs text-slate-400 flex justify-between items-center">
                                <span>조회 {item.viewCount || 0}</span>
                                {/* No Delete Button Here! */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function Badge({ status }: { status: string }) {
    const styles = {
        available: "bg-green-100 text-green-700",
        reserved: "bg-yellow-100 text-yellow-700",
        completed: "bg-slate-100 text-slate-700",
    };
    const labels = {
        available: "나눔중",
        reserved: "예약중",
        completed: "완료",
    };

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels] || status}
        </span>
    );
}
