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
    fileName: z.file().nullable().optional(),
    isPrerequisite: z.boolean(),
    isFree: z.boolean(),
    duration: z.number().nullable().optional(),
});