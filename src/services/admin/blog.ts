'use server'

import * as z from "zod";
import prisma from "@/src/lib/prisma";
import { deleteFromCloudinary, fileToBuffer, uploadToCloudinary } from "@/src/utils/server_functions";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { CreateBlogValidation } from "@/src/validations/BlogValidation";
import { paginate } from "@/src/utils/pagination";
import { BlogPost } from "@prisma/client";

// URL-safe slug: lowercase, strip anything that isn't alphanumeric, collapse to single hyphens.
const toSlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// Ensure the slug is unique, appending -2, -3, ... when a collision exists.
const generateUniqueSlug = async (title: string, ignoreId?: string) => {
    const base = toSlug(title) || "post";
    let slug = base;
    let counter = 2;

    while (true) {
        const existing = await prisma.blogPost.findFirst({
            where: {
                slug,
                ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
            },
            select: { id: true },
        });

        if (!existing) return slug;
        slug = `${base}-${counter}`;
        counter += 1;
    }
};

// Estimate reading time from the post body (~200 words per minute).
const estimateReadTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").length : 0;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
};

export const fetchAllBlogPosts = async (page: number = 1, pageSize: number = 20, searchTerm?: string) => {
    return paginate<BlogPost>(prisma.blogPost, {
        page,
        pageSize,
        search: searchTerm,
        searchFields: ['title', 'category'],
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
    });
}

export const fetchBlogPostById = async (id: string) => {
    try {
        const post = await prisma.blogPost.findFirst({
            where: { id, deletedAt: null },
        });

        if (!post) {
            return { success: false, message: 'Blog post not found', post: null };
        }

        return { success: true, message: 'Success', post };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Something went wrong', post: null };
    }
}

export const createBlogPost = async (unsafeData: z.infer<typeof CreateBlogValidation>) => {
    const { success, data, error } = CreateBlogValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    if (!data.image) {
        return { success: false, message: 'A featured image is required.' };
    }

    const buffer = await fileToBuffer(data.image);
    const upload = await uploadToCloudinary(buffer, 'blog');

    try {
        const slug = await generateUniqueSlug(data.title);

        const post = await prisma.blogPost.create({
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                author: data.author?.trim() || 'Women Skills Hub',
                readTime: estimateReadTime(data.content),
                image: upload.url,
                imagePublicId: upload.publicId,
                status: data.status,
                publishedAt: data.status === 'published' ? new Date() : null,
                updatedAt: new Date(),
            }
        });

        return {
            success: true,
            message: 'Blog post has been created successfully.',
            post,
        }
    } catch (error) {
        console.log(error);
        if (upload) await deleteFromCloudinary(upload.publicId);
        return {
            success: false,
            message: 'Something went wrong, we could not create the post. Please try again.'
        }
    }
}

export const updateBlogPost = async (id: string, unsafeData: z.infer<typeof CreateBlogValidation>) => {
    const { success, data, error } = CreateBlogValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    const existing = await prisma.blogPost.findFirst({ where: { id, deletedAt: null } });

    if (!existing) {
        return { success: false, message: 'Invalid request, the post cannot be found.' };
    }

    // Only replace the image when a new file is supplied.
    let imageUrl = existing.image;
    let imagePublicId = existing.imagePublicId;
    let newUpload: { url: string; publicId: string } | null = null;

    if (data.image) {
        const buffer = await fileToBuffer(data.image);
        newUpload = await uploadToCloudinary(buffer, 'blog');
        imageUrl = newUpload.url;
        imagePublicId = newUpload.publicId;
    }

    try {
        const slug = await generateUniqueSlug(data.title, id);

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                author: data.author?.trim() || 'Women Skills Hub',
                readTime: estimateReadTime(data.content),
                image: imageUrl,
                imagePublicId,
                status: data.status,
                // Preserve the original publish date; set it the first time it goes live.
                publishedAt: data.status === 'published' ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
                updatedAt: new Date(),
            }
        });

        // Remove the old image only after a successful update with a new one.
        if (newUpload && existing.imagePublicId) {
            await deleteFromCloudinary(existing.imagePublicId);
        }

        return {
            success: true,
            message: 'Blog post has been updated successfully.',
            post,
        }
    } catch (error) {
        console.log(error);
        if (newUpload) await deleteFromCloudinary(newUpload.publicId);
        return {
            success: false,
            message: 'Something went wrong, we could not update the post. Please try again.'
        }
    }
}

export const deleteBlogPost = async (id: string) => {
    try {
        const existing = await prisma.blogPost.findFirst({ where: { id, deletedAt: null } });

        if (!existing) {
            return { success: false, message: 'Invalid request, the post cannot be found.' };
        }

        await prisma.blogPost.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { success: true, message: 'Blog post has been deleted successfully.' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Something went wrong, we could not delete the post.' };
    }
}
