'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/auth-guard";
import { fileToBuffer, uploadToCloudinary } from "@/src/utils/server_functions";

const uploadReviewImages = async (files: File[]): Promise<string[]> => {
    const uploaded: string[] = [];

    for (const file of files) {
        const buffer = await fileToBuffer(file);
        const result = await uploadToCloudinary(buffer, 'reviews');
        uploaded.push(result.url);
    }

    return uploaded;
};

// Enrolled courses + the user's reviews, used to drive the reviews page.
export const getReviewData = async (userId: string) => {
    try {
        const user = await requireUser();
        if (user.id !== userId) throw new Error('Not allowed');

        const [students, reviews] = await Promise.all([
            prisma.student.findMany({
                where: {
                    userId,
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            thumbnail: true,
                        }
                    }
                }
            }),
            prisma.studentReview.findMany({
                where: {
                    userId,
                },
                orderBy: {
                    updatedAt: 'desc',
                },
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            thumbnail: true,
                        }
                    }
                }
            }),
        ]);

        const enrolledCourses = students.map((student) => ({
            studentId: student.id,
            courseId: student.course.id,
            title: student.course.title,
            thumbnail: student.course.thumbnail,
            completed: student.lecturesCompleted,
        }));

        return {
            success: true,
            message: 'Success',
            enrolledCourses,
            reviews,
        };
    } catch (error) {
        console.log('Error fetching review data:', error);
        return {
            success: false,
            message: 'Failed to fetch reviews.',
            enrolledCourses: [],
            reviews: [],
        };
    }
}

export const createReview = async (
    userId: string,
    courseId: string,
    data: { rating: number; comment: string; anonymous: boolean; images: File[] }
) => {
    try {
        // Only for the signed-in student; never trust a userId from the browser.
        const user = await requireUser();
        if (user.id !== userId) {
            return { success: false, message: 'You are not allowed to do that.', review: null };
        }

        const rating = Math.round(Number(data.rating));
        const comment = typeof data.comment === 'string' ? data.comment.trim() : '';
        if (!(rating >= 1 && rating <= 5)) {
            return { success: false, message: 'Please select a rating between 1 and 5.', review: null };
        }
        if (!comment) {
            return { success: false, message: 'Please write a review.', review: null };
        }
        if (comment.length > 2000) {
            return { success: false, message: 'Your review is too long (2000 characters max).', review: null };
        }

        const student = await prisma.student.findFirst({
            where: {
                userId,
                courseId,
                deletedAt: null,
            }
        });

        if (!student) {
            return {
                success: false,
                message: 'You are not enrolled in this course.',
                review: null,
            };
        }

        // Prevent duplicate reviews for the same course
        const existing = await prisma.studentReview.findFirst({
            where: { userId, courseId }
        });

        if (existing) {
            return {
                success: false,
                message: 'You have already reviewed this course. You can edit your existing review.',
                review: null,
            };
        }

        const imageUrls = data.images.length ? await uploadReviewImages(data.images) : [];

        const review = await prisma.studentReview.create({
            data: {
                userId,
                studentId: student.id,
                courseId,
                rating,
                comment,
                images: imageUrls,
                isAnonymous: data.anonymous,
            },
            include: {
                course: {
                    select: { id: true, title: true, thumbnail: true }
                }
            }
        });

        await prisma.student.update({
            where: { id: student.id },
            data: { submittedReview: true },
        });

        return {
            success: true,
            message: 'Review submitted! Thank you for your feedback.',
            review,
        };
    } catch (error) {
        console.log('Error creating review:', error);
        return {
            success: false,
            message: 'Failed to submit review. Please try again.',
            review: null,
        };
    }
}

export const updateReview = async (
    reviewId: string,
    data: { rating: number; comment: string; anonymous: boolean; existingImages: string[]; newImages: File[] }
) => {
    try {
        const user = await requireUser();
        const owned = await prisma.studentReview.findFirst({ where: { id: reviewId, userId: user.id }, select: { id: true } });
        if (!owned) {
            return { success: false, message: 'Review not found.', review: null };
        }

        const uploaded = data.newImages.length ? await uploadReviewImages(data.newImages) : [];
        const images = [...data.existingImages, ...uploaded];

        const review = await prisma.studentReview.update({
            where: { id: reviewId },
            data: {
                rating: data.rating,
                comment: data.comment,
                images,
                isAnonymous: data.anonymous,
            },
            include: {
                course: {
                    select: { id: true, title: true, thumbnail: true }
                }
            }
        });

        return {
            success: true,
            message: 'Review updated!',
            review,
        };
    } catch (error) {
        console.log('Error updating review:', error);
        return {
            success: false,
            message: 'Failed to update review. Please try again.',
            review: null,
        };
    }
}

export const deleteReview = async (reviewId: string) => {
    try {
        const user = await requireUser();
        const review = await prisma.studentReview.findFirst({
            where: { id: reviewId, userId: user.id }
        });

        if (!review) {
            return {
                success: false,
                message: 'Review not found.',
            };
        }

        // Published reviews are part of the public course page and can't be removed.
        if (review.isApproved) {
            return {
                success: false,
                message: 'This review has been published and can no longer be deleted.',
            };
        }

        await prisma.$transaction(async (tx) => {
            // Re-check inside the transaction in case it was approved meanwhile.
            const { count } = await tx.studentReview.deleteMany({ where: { id: reviewId, userId: user.id, isApproved: false } });
            if (count === 0) throw new Error('REVIEW_PUBLISHED');
            await tx.student.updateMany({
                where: { userId: review.userId, courseId: review.courseId },
                data: { submittedReview: false },
            });
        });

        return {
            success: true,
            message: 'Review deleted successfully.',
        };
    } catch (error) {
        if ((error as Error)?.message === 'REVIEW_PUBLISHED') {
            return { success: false, message: 'This review has been published and can no longer be deleted.' };
        }
        console.log('Error deleting review:', error);
        return {
            success: false,
            message: 'Failed to delete review. Please try again.',
        };
    }
}
