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
}

export interface NewUser {
    name?: string | null;
    email: string;
    image?: string | null,
    phone?: string | null;
    uid?: string | null;
}