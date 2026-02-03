"use client";

import { useState } from "react";
import { useFirestore, useRealtimeCollection } from "@/hooks/useFirestore";
import { useAuthStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, Pin } from "lucide-react";
import { orderBy } from "firebase/firestore";

export default function NoticeBoard() {
    const [isPosting, setIsPosting] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { user } = useAuthStore();
    const { addDocument } = useFirestore();

    // Updated collection name
    const { data: posts, loading } = useRealtimeCollection("management_notices", [
        orderBy("createdAt", "desc")
    ]);

    const isAdmin = user?.email === "admin" || user?.uid === "admin";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsPosting(true);
        try {
            await addDocument("management_notices", {
                title,
                content,
                authorId: user?.uid || "admin",
                authorName: user?.displayName || "관리소",
                isPinned: false, // Added as per new rules
                commentCount: 0
            });
            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Post error:", error);
            alert("공지 등록 중 오류가 발생했습니다. 권한을 확인해 주세요.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
            {isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">공지사항 작성 (관리자)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <Input
                                placeholder="공지 제목"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Textarea
                                placeholder="내용"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <Button type="submit" disabled={isPosting} className="w-full">
                                {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "공지 등록"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-slate-700">관리실 공식 공지</h3>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : posts.length === 0 ? (
                    <p className="text-center py-8 text-slate-500">등록된 공지가 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100 uppercase">Notice</Badge>
                                    <span className="text-xs text-slate-400">
                                        {post.createdAt?.toDate().toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                <CardTitle className="text-lg mt-2 flex items-center gap-2">
                                    {post.isPinned && <Pin className="h-4 w-4 text-blue-500 rotate-45" />}
                                    {post.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 whitespace-pre-wrap">{post.content}</p>
                            </CardContent>
                            <CardFooter className="bg-slate-50 border-t py-3 flex justify-between">
                                <div className="flex items-center text-sm text-slate-500">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    댓글 {post.commentCount || 0}
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600">상세보기</Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
