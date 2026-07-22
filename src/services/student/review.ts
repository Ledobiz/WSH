'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/src/lib/prisma";
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
                rating: data.rating,
                comment: data.comment,
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
        const review = await prisma.studentReview.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return {
                success: false,
                message: 'Review not found.',
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.studentReview.delete({ where: { id: reviewId } });
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
        console.log('Error deleting review:', error);
        return {
            success: false,
            message: 'Failed to delete review. Please try again.',
        };
    }
}
