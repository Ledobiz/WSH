import { Category } from "@prisma/client";

export type UserRole = 'student' | 'admin';

export interface User {
    id: string;
    name?: string | null | undefined;
    email: string;
    image?: string | null | undefined,
    phone?: string | null | undefined;
    uid?: string | null | undefined;
    role: UserRole;
    isActive: boolean;
    createdAt: string | Date | null | undefined;
    updatedAt: string | Date | null | undefined;
    expiresAt: string | Date | null | undefined;
}

export interface NewUser {
    name?: string | null;
    email: string;
    image?: string | null,
    phone?: string | null;
    uid?: string | null;
}

export interface CategoryInterface {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseCreationInterface {
    title: string;
    categoryId: string;
    description: string;
    originalFee: number;
    discountedFee: number;
    thumbnail: File | null;
    banner: File | null;
    previewVideo?: string | null;
    isFree: boolean;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    isActive: boolean;
    whoIsCourseFor?: string | null;
}

export interface CourseInterface {
    id: string;
    title: string;
    slug: string;
    categoryId: string;
    description: string | null;
    originalFee: number;
    discountedFee: number;
    thumbnail: string | null;
    banner: string | null;
    previewVideo?: string | null;
    isFree: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    isActive: boolean | null;
    whoIsCourseFor?: string | null;
    createdAt: Date;
    updatedAt: Date;

    category?: Category;
}

export interface CreateModuleInterface {
    name: string;
    description: string | null;
    totalDuration: number | null;
}

export interface CreateModuleComponentInterface {
    name: string;
    description: string;
    type: string;
    vimeoVideoUrl: string;
    fileName: File | null;
    filePreviewUrl: string | null;
    isPrerequisite: boolean;
    isFree: boolean;
    duration: number;
    isActive: boolean | null;
}