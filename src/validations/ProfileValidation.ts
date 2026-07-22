import * as z from "zod";

export const ProfileValidation = z.object({
    name: z.string(),
    phone: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    gender: z.string(),
    avatar: z.file().nullable().optional(),
});

export const PasswordChangeValidation = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
});