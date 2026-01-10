import * as z from "zod";

export const ProfileValidation = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    gender: z.string(),
});