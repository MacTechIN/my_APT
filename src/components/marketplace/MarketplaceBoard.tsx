"use client";

import { useState } from "react";
import { useFirestore, useRealtimeCollection } from "@/hooks/useFirestore";
import { useAuthStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, CheckCircle2, Circle } from "lucide-react";
import { orderBy } from "firebase/firestore";

export default function MarketplaceBoard() {
    const [isPosting, setIsPosting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { user } = useAuthStore();
    const { addDocument, updateDocument } = useFirestore();

    const { data: posts, loading } = useRealtimeCollection("marketplace_items", [
        orderBy("createdAt", "desc")
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) return;

        setIsPosting(true);
        try {
            // Storage upload logic removed
            await addDocument("marketplace_items", {
                title,
                description,
                images: [], // No images for now
                status: "available",
                authorId: user?.uid || "anonymous",
                authorName: user?.displayName || "주민",
                isEdited: false,
            });

            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Post error:", error);
            alert("글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsPosting(false);
        }
    };

    const toggleStatus = async (postId: string, currentStatus: string) => {
        const newStatus = currentStatus === "available" ? "completed" : "available";
        try {
            await updateDocument("marketplace_items", postId, { status: newStatus });
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">알뜰 나눔 글쓰기</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <Input
                            placeholder="나눌 물건"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Textarea
                            placeholder="상세 설명 (가격, 나눔 위치 등)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <Button type="submit" disabled={isPosting} className="w-full bg-green-600">
                            {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "등록하기"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4 pb-20">
                <h3 className="font-semibold text-slate-700">실시간 나눔 현황</h3>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : posts.length === 0 ? (
                    <p className="text-center py-8 text-slate-500">등록된 아이템이 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant={post.status === 'available' ? 'default' : 'secondary'} className={post.status === 'available' ? 'bg-green-100 text-green-700 border-none' : ''}>
                                        {post.status === 'available' ? '나눔중' : '완료'}
                                    </Badge>
                                    <span className="text-xs text-slate-400">
                                        {post.createdAt?.toDate().toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 line-clamp-2">{post.description}</p>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 border-t py-3 flex justify-between gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleStatus(post.id, post.status)}
                                    className="text-slate-500"
                                >
                                    {post.status === 'available' ? (
                                        <><CheckCircle2 className="h-4 w-4 mr-1" /> 완료로 변경</>
                                    ) : (
                                        <><Circle className="h-4 w-4 mr-1" /> 다시 나눔</>
                                    )}
                                </Button>
                                <div className="flex items-center text-sm text-slate-400">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    댓글 {post.commentCount || 0}
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
