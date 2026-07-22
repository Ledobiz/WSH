'use server'

import prisma from "@/src/lib/prisma";

export const fetchPublishedPosts = async () => {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                status: 'published',
                deletedAt: null,
            },
            orderBy: { publishedAt: 'desc' },
        });

        return { success: true, message: 'Success', posts };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Something went wrong', posts: [] };
    }
}

export const fetchPublishedPostBySlug = async (slug: string) => {
    try {
        const post = await prisma.blogPost.findFirst({
            where: {
                slug,
                status: 'published',
                deletedAt: null,
            },
        });

        if (!post) {
            return { success: false, message: 'Post not found', post: null };
        }

        return { success: true, message: 'Success', post };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Something went wrong', post: null };
    }
}
