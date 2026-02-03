export type PostStatus = 'available' | 'reserved' | 'completed';

export interface User {
    uid: string;
    displayName: string;
    BldNo?: string;           // 동 (예: 101동)
    roomNo?: string;            // 호 (예: 1201호)
    phoneNumber?: string;
    isAdmin: boolean;
    createdAt: Date;
    lastLoginAt: Date;
}

export interface ManagementNotice {
    id: string;
    title: string;
    content: string;
    images: string[];        // Storage URL 배열
    authorId: string;        // 관리사무소 직원 ID
    authorName: string;      // "관리사무소" 또는 직원명
    createdAt: any;          // Firestore Timestamp
    updatedAt?: any;
    isPinned: boolean;       // 상단 고정 여부
    viewCount: number;
    category: 'general' | 'maintenance' | 'safety' | 'event';
}

export interface ManagementComment {
    id: string;
    noticeId: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: any;
    updatedAt?: any;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    images: string[];        // Storage URL 배열 (최대 5장)
    status: PostStatus;
    authorId: string;
    authorName: string;
    authorDongHo?: string;   // "101동 1201호" 형식
    createdAt: any;
    updatedAt?: any;
    isEdited: boolean;       // 수정 여부 표시
    viewCount: number;
    price?: number;          // 0이면 "무료나눔"
}

export interface MarketplaceComment {
    id: string;
    itemId: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: any;
}
