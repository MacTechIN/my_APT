export type PostType = 'notice' | 'marketplace';

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: any;
}

export interface Post {
    id: string;
    type: PostType;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    images?: string[];
    status?: 'available' | 'completed';
    createdAt: any;
    updatedAt: any;
    commentCount: number;
}
