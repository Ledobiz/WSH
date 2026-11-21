'use server';

// Public, read-only data for testimonials, the /reviews page and course pages.
// Everything returned here is shown to anonymous visitors, so it goes through
// the safe shapes in src/lib/public-showcase.ts.

import { Prisma } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import {
    PUBLIC_REVIEW_SELECT,
    PUBLISHED_REVIEW_WHERE,
    PublicPractical,
    PublicReview,
    publicDisplayName,
    toPublicReview,
} from "@/src/lib/public-showcase";

const clampPage = (page?: number) => Math.max(1, Math.floor(Number(page) || 1));
const clampSize = (size: number | undefined, fallback: number, max = 48) =>
    Math.max(1, Math.min(Math.floor(Number(size) || fallback), max));

/** Top-rated published reviews for the testimonial carousel. */
export const getTopReviews = async (limit = 10): Promise<PublicReview[]> => {
    try {
        const rows = await prisma.studentReview.findMany({
            where: PUBLISHED_REVIEW_WHERE,
            orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
            take: clampSize(limit, 10, 20),
            select: PUBLIC_REVIEW_SELECT,
        });
        return rows.map(toPublicReview);
    } catch (error) {
        console.log("Error fetching top reviews:", error);
        return [];
    }
};

export const getPublicReviews = async (options: { courseSlug?: string; page?: number; pageSize?: number } = {}) => {
    const page = clampPage(options.page);
    const pageSize = clampSize(options.pageSize, 12);
    try {
        const where: Prisma.StudentReviewWhereInput = {
            ...PUBLISHED_REVIEW_WHERE,
            ...(options.courseSlug ? { course: { slug: options.courseSlug } } : {}),
        };
        const [rows, total] = await Promise.all([
            prisma.studentReview.findMany({
                where,
                orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
                skip: (page - 1) * pageSize,
                take: pageSize,
                select: PUBLIC_REVIEW_SELECT,
            }),
            prisma.studentReview.count({ where }),
        ]);
        return { success: true, reviews: rows.map(toPublicReview), total, hasMore: page * pageSize < total };
    } catch (error) {
        console.log("Error fetching public reviews:", error);
        return { success: false, reviews: [] as PublicReview[], total: 0, hasMore: false };
    }
};

// Practicals from APPROVED certificate requests, limited to the submission that
// was approved (earlier, rejected attempts are never shown).
const practicalsFilter = (courseSlug?: string) => Prisma.sql`
    FROM "CertificateRequestFile" f
    JOIN "CertificateRequest" r ON r.id = f."requestId"
    JOIN "Course" c ON c.id = r."courseId"
    JOIN "User" u ON u.id = r."userId"
    WHERE r.status = 'approved'
      AND f.attempt = r.attempt
      AND f."resourceType" IN ('image', 'video')
      AND c."deletedAt" IS NULL
      ${courseSlug ? Prisma.sql`AND c.slug = ${courseSlug}` : Prisma.empty}`;

export const getPublicPracticals = async (options: { courseSlug?: string; page?: number; pageSize?: number } = {}) => {
    const page = clampPage(options.page);
    const pageSize = clampSize(options.pageSize, 12);
    try {
        const [rows, countRows] = await Promise.all([
            prisma.$queryRaw<{ id: string; url: string; type: string; createdAt: Date; name: string | null; title: string; slug: string }[]>(Prisma.sql`
                SELECT f.id, f.url, f."resourceType" AS type, f."createdAt", u.name, c.title, c.slug
                ${practicalsFilter(options.courseSlug)}
                ORDER BY r."approvedAt" DESC NULLS LAST, f."createdAt" ASC
                LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`),
            prisma.$queryRaw<{ total: number }[]>(Prisma.sql`SELECT count(*)::int AS total ${practicalsFilter(options.courseSlug)}`),
        ]);
        const total = countRows[0]?.total ?? 0;
        const practicals: PublicPractical[] = rows.map((row) => ({
            id: row.id,
            url: row.url,
            type: row.type === "video" ? "video" : "image",
            createdAt: new Date(row.createdAt).toISOString(),
            studentName: publicDisplayName(row.name),
            course: { title: row.title, slug: row.slug },
        }));
        return { success: true, practicals, total, hasMore: page * pageSize < total };
    } catch (error) {
        console.log("Error fetching public practicals:", error);
        return { success: false, practicals: [] as PublicPractical[], total: 0, hasMore: false };
    }
};

/** Headline numbers and the course filter list for the /reviews page. */
export const getShowcaseSummary = async () => {
    try {
        const [agg, practicalCount, reviewCourses, practicalCourses] = await Promise.all([
            prisma.studentReview.aggregate({ where: PUBLISHED_REVIEW_WHERE, _avg: { rating: true }, _count: { _all: true } }),
            prisma.$queryRaw<{ total: number }[]>(Prisma.sql`SELECT count(*)::int AS total ${practicalsFilter()}`),
            prisma.course.findMany({
                where: { deletedAt: null, studentReviews: { some: PUBLISHED_REVIEW_WHERE } },
                select: { title: true, slug: true },
            }),
            prisma.$queryRaw<{ title: string; slug: string }[]>(Prisma.sql`SELECT DISTINCT c.title, c.slug ${practicalsFilter()}`),
        ]);

        const courses = new Map<string, string>();
        [...reviewCourses, ...practicalCourses].forEach((c) => courses.set(c.slug, c.title));

        return {
            averageRating: agg._avg.rating ?? 0,
            reviewCount: agg._count._all,
            practicalCount: practicalCount[0]?.total ?? 0,
            courses: [...courses].map(([slug, title]) => ({ slug, title })).sort((a, b) => a.title.localeCompare(b.title)),
        };
    } catch (error) {
        console.log("Error fetching showcase summary:", error);
        return { averageRating: 0, reviewCount: 0, practicalCount: 0, courses: [] as { slug: string; title: string }[] };
    }
};
