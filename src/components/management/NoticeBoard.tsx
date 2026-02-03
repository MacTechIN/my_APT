"use client";

import { useState } from "react";
import { useFirestore, useRealtimeCollection } from "@/hooks/useFirestore";
import { useAuthStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, Trash2 } from "lucide-react";
import { where, orderBy } from "firebase/firestore";

export default function NoticeBoard() {
    const [isPosting, setIsPosting] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { user } = useAuthStore();
    const { addDocument, deleteDocument } = useFirestore();

    const { data: posts, loading } = useRealtimeCollection("posts", [
        where("type", "==", "notice"),
        orderBy("createdAt", "desc")
    ]);

    const isAdmin = user?.email === "admin" || user?.uid === "admin"; // Basic admin check

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsPosting(true);
        try {
            await addDocument("posts", {
                type: "notice",
                title,
                content,
                authorId: user?.uid || "admin",
                authorName: user?.displayName || "관리소",
                commentCount: 0
            });
            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Post error:", error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (confirm("정말로 이 공지사항을 삭제하시겠습니까? 관리자만 이 작업을 수행할 수 있습니다.")) {
            try {
                await deleteDocument("posts", postId);
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
            {/* Create Post (Admin only ideally) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">공지사항 작성</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <Input
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Textarea
                            placeholder="내용을 입력하세요"
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

            {/* Post List */}
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-slate-700">최신 공지</h3>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : posts.length === 0 ? (
                    <p className="text-center py-8 text-slate-500">등록된 공지가 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100">공지</Badge>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">
                                            {post.createdAt?.toDate().toLocaleDateString('ko-KR')}
                                        </span>
                                        {isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-400 hover:text-red-600"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 whitespace-pre-wrap">{post.content}</p>
                            </CardContent>
                            <CardFooter className="bg-slate-50 border-t py-3 flex justify-between">
                                <div className="flex items-center text-sm text-slate-500">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    댓글 {post.commentCount || 0}
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600">더보기</Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
