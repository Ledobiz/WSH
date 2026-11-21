// Shapes for reviews and practicals shown on the PUBLIC website.
// Only fields that are safe to publish ever leave the server: no emails, phone
// numbers, user ids or full surnames. Not a "use server" module (it exports
// constants), so it cannot be called from the browser.

import { Prisma } from "@prisma/client";

export const PUBLIC_REVIEW_SELECT = {
    id: true,
    rating: true,
    comment: true,
    images: true,
    isAnonymous: true,
    reply: true,
    createdAt: true,
    user: { select: { name: true, image: true } },
    course: { select: { title: true, slug: true } },
} satisfies Prisma.StudentReviewSelect;

type ReviewRow = Prisma.StudentReviewGetPayload<{ select: typeof PUBLIC_REVIEW_SELECT }>;

export interface PublicReview {
    id: string;
    rating: number;
    comment: string;
    images: string[];
    reply: string | null;
    createdAt: string;
    author: { name: string; image: string | null; anonymous: boolean };
    course: { title: string; slug: string } | null;
}

/** "Amina Okafor" -> "Amina O."; single names are kept as they are. */
export const publicDisplayName = (fullName?: string | null, fallback = "Student") => {
    const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return fallback;
    const first = parts[0][0].toUpperCase() + parts[0].slice(1);
    return parts.length > 1 ? `${first} ${parts[parts.length - 1][0].toUpperCase()}.` : first;
};

export const toPublicReview = (row: ReviewRow): PublicReview => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    images: row.images ?? [],
    reply: row.reply ?? null,
    createdAt: row.createdAt.toISOString(),
    author: row.isAnonymous
        ? { name: "Anonymous student", image: null, anonymous: true }
        : { name: publicDisplayName(row.user?.name), image: row.user?.image ?? null, anonymous: false },
    course: row.course ? { title: row.course.title, slug: row.course.slug } : null,
});

/** Approved, admin-reviewed reviews are the only ones shown publicly. */
export const PUBLISHED_REVIEW_WHERE = { isApproved: true, isReviewed: true } satisfies Prisma.StudentReviewWhereInput;

export interface PublicPractical {
    id: string;
    url: string;
    type: "image" | "video";
    createdAt: string;
    studentName: string;
    course: { title: string; slug: string };
}
