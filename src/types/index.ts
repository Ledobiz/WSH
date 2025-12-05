export type UserRole = 'student' | 'admin';

export interface User {
    id: string;
    name?: string|null; 
    email: string; 
    image?: string|null, 
    phone?: string|null; 
    uid?: string|null;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface NewUser {
    name?: string|null; 
    email: string; 
    image?: string|null, 
    phone?: string|null; 
    uid?: string|null;
}