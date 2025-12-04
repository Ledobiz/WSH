export type UserRole = 'student' | 'admin';

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    uid?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}