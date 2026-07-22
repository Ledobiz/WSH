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
    telegramLink: z.string().nullable().optional(),
});

export const CreateCouponValidation = z.object({
    code: z.string().min(1),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    isFixedAmount: z.boolean(),
    discountAmount: z.number(),
    courseId: z.string().nullable().optional(), // null/empty = applies to the entire cart
    maxUse: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    isActive: z.boolean(),
});

export const CreateModuleValidation = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    totalDuration: z.number().nullable().optional(),
});

export const CreateComponentValidation = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    isActive: z.boolean(),
    type: z.string(),
    vimeoVideoUrl: z.string().nullable().optional(),
    bunnyLibraryId: z.string().nullable().optional(),
    fileName: z.file().nullable().optional(),
    isPrerequisite: z.boolean(),
    isFree: z.boolean(),
    duration: z.number().nullable().optional(),
});