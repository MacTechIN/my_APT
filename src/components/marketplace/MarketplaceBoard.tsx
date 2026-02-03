"use client";

import { useState } from "react";
import { useFirestore, useRealtimeCollection } from "@/hooks/useFirestore";
import { useStorage } from "@/hooks/useStorage";
import { useAuthStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, MessageSquare, Loader2, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { where, orderBy } from "firebase/firestore";

export default function MarketplaceBoard() {
    const [isPosting, setIsPosting] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const { user } = useAuthStore();
    const { addDocument, updateDocument, deleteDocument } = useFirestore();
    const { uploadImage } = useStorage();

    const { data: posts, loading } = useRealtimeCollection("posts", [
        where("type", "==", "marketplace"),
        orderBy("createdAt", "desc")
    ]);

    const isAdmin = user?.email === "admin" || user?.uid === "admin";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsPosting(true);
        try {
            const imageUrls = [];
            for (const image of images) {
                const url = await uploadImage("marketplace", image);
                imageUrls.push(url);
            }

            await addDocument("posts", {
                type: "marketplace",
                title,
                content,
                authorId: user?.uid || "user_test",
                authorName: user?.displayName || "주민",
                images: imageUrls,
                status: "available",
                commentCount: 0
            });

            setTitle("");
            setContent("");
            setImages([]);
        } catch (error) {
            console.error("Post error:", error);
        } finally {
            setIsPosting(false);
        }
    };

    const toggleStatus = async (postId: string, currentStatus: string) => {
        const newStatus = currentStatus === "available" ? "completed" : "available";
        try {
            await updateDocument("posts", postId, { status: newStatus });
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async (postId: string) => {
        if (confirm("정말로 이 게시물을 삭제하시겠습니까? 관리자만 이 작업을 수행할 수 있습니다.")) {
            try {
                await deleteDocument("posts", postId);
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
            {/* Create Post */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">나눔/장터 글쓰기</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <Input
                            placeholder="물건 이름을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Textarea
                            placeholder="상세 내용을 입력하세요 (가격, 장소 등)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex items-center gap-2">
                            <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                                <ImagePlus className="mr-2 h-5 w-5" />
                                <span>{images.length > 0 ? `${images.length}개 선택됨` : "사진 추가"}</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                        <Button type="submit" disabled={isPosting} className="w-full bg-green-600 hover:bg-green-700">
                            {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "나눔 등록"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Marketplace List */}
            <div className="flex flex-col gap-4 pb-20">
                <h3 className="font-semibold text-slate-700">나눔 장터</h3>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : posts.length === 0 ? (
                    <p className="text-center py-8 text-slate-500">등록된 물건이 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden border-none shadow-md">
                            {post.images && post.images.length > 0 && (
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={post.images[0]}
                                        alt={post.title}
                                        className={`h-full w-full object-cover transition-opacity ${post.status === 'completed' ? 'opacity-50' : 'opacity-100'}`}
                                    />
                                    {post.status === 'completed' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Badge className="bg-white text-black text-lg py-1 px-4">나눔 완료</Badge>
                                        </div>
                                    )}
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant={post.status === 'available' ? 'default' : 'secondary'} className={post.status === 'available' ? 'bg-green-100 text-green-700 border-green-200' : ''}>
                                        {post.status === 'available' ? '나눔중' : '완료'}
                                    </Badge>
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
                                <p className="text-slate-600 line-clamp-3">{post.content}</p>
                            </CardContent>
                            <CardFooter className="bg-white border-t py-3 flex justify-between gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleStatus(post.id, post.status)}
                                    className="flex-1"
                                >
                                    {post.status === 'available' ? (
                                        <><CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> 완료로 변경</>
                                    ) : (
                                        <><Circle className="h-4 w-4 mr-1 text-slate-400" /> 나눔중으로 변경</>
                                    )}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 text-slate-600">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    댓글 {post.commentCount || 0}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
