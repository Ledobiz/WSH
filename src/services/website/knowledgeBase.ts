'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";

/** Course descriptions are stored as rich-text HTML; the widget wants clean plain text. */
const stripHtml = (html: string | null): string | null => {
    if (!html) return html;
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;|&rsquo;|&apos;/g, "'")
        .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
        .replace(/\s+/g, " ")
        .trim() || null;
};

export interface KnowledgeBaseCourse {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    whoIsCourseFor: string | null;
    originalFee: number;
    discountedFee: number;
    isFree: boolean;
    thumbnail: string | null;
    categoryName: string | null;
    categorySlug: string | null;
    studentsCount: number;
    createdAt: string; // ISO — used for "Newest"
}

export interface KnowledgeBaseCategory {
    name: string;
    slug: string;
    count: number;
}

/**
 * Live course data for the support knowledge base. Everything the widget needs to
 * answer course questions (price, summary, who it's for) and to power the rule-based
 * recommender (category, popularity, recency) — pulled straight from the DB so the
 * answers are always current and never invented.
 *
 * This is also the retrieval corpus a future AI layer would read from — deterministic
 * facts (prices, counts) stay here so the AI never has to guess them.
 */
export const getKnowledgeBaseCourses = async () => {
    try {
        const [courses, categories] = await Promise.all([
            prisma.course.findMany({
                where: { isActive: true, deletedAt: null },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    whoIsCourseFor: true,
                    originalFee: true,
                    discountedFee: true,
                    isFree: true,
                    thumbnail: true,
                    createdAt: true,
                    category: { select: { name: true, slug: true } },
                    _count: { select: { students: { where: { deletedAt: null } } } },
                },
            }),
            prisma.category.findMany({
                where: {
                    deletedAt: null,
                    courses: { some: { isActive: true, deletedAt: null } },
                },
                select: {
                    name: true,
                    slug: true,
                    _count: { select: { courses: { where: { isActive: true, deletedAt: null } } } },
                },
                orderBy: { name: "asc" },
            }),
        ]);

        const mappedCourses: KnowledgeBaseCourse[] = courses.map((c: any) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            description: stripHtml(c.description),
            whoIsCourseFor: stripHtml(c.whoIsCourseFor),
            originalFee: c.originalFee,
            discountedFee: c.discountedFee,
            isFree: c.isFree,
            thumbnail: c.thumbnail,
            categoryName: c.category?.name ?? null,
            categorySlug: c.category?.slug ?? null,
            studentsCount: c._count?.students ?? 0,
            createdAt: c.createdAt.toISOString(),
        }));

        const mappedCategories: KnowledgeBaseCategory[] = categories.map((cat: any) => ({
            name: cat.name,
            slug: cat.slug,
            count: cat._count?.courses ?? 0,
        }));

        return {
            success: true,
            message: "Success",
            courses: mappedCourses,
            categories: mappedCategories,
        };
    } catch (error) {
        console.log("Error loading knowledge base courses:", error);
        return {
            success: false,
            message: "Failed to load course information",
            courses: [] as KnowledgeBaseCourse[],
            categories: [] as KnowledgeBaseCategory[],
        };
    }
};
