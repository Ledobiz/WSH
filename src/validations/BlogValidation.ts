import * as z from "zod";

export const CreateBlogValidation = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    content: z.string().min(1),
    category: z.string().min(1),
    author: z.string().nullable().optional(),
    status: z.enum(["draft", "published"]),
    image: z.file().nullable().optional(),
});
