import * as z from "zod";

export const CreateCourseValidation = z.object({
    title: z.string(),
    categoryId: z.string(),
    description: z.string(),
    originalFee: z.number(),
    discountedFee: z.number(),
    thumbnail: z.file().nullable().optional(),
    banner: z.file().nullable().optional(),
    previewVideo: z.string().nullable().optional(),
    isFree: z.boolean(),
    isActive: z.boolean(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    seoKeywords: z.string(),
    whoIsCourseFor: z.string().nullable().optional(),
});