'use server'

import * as z from "zod";
import prisma from "@/src/lib/prisma";
import { deleteFromCloudinary, fileToBuffer, uploadToCloudinary } from "@/src/utils/server_functions";
import { getFirstErrorFromFieldSubmission, sluggify } from "@/src/utils/client_functions";
import { CreateCourseValidation } from "@/src/validations/CourseValidation";

export const fetchAllCourses = async () => {
    try {
        const courses = await prisma.course.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            message: 'Success',
            courses,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong',
            courses: []
        }
    }
}

export const fetchActiveCourses = async () => {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            message: 'Success',
            courses,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong',
            courses: []
        }
    }
}

export const createCourse = async (unsafeData: z.infer<typeof CreateCourseValidation>) => {
    const { success, data, error } = CreateCourseValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    // Convert files to buffers
    if (!data.thumbnail || !data.banner) {
        throw new Error('Thumbnail and banner images are required.');
    }

    const thumbnailBuffer = await fileToBuffer(data.thumbnail);
    const bannerBuffer = await fileToBuffer(data.banner);

    // Upload to Cloudinary
    const [thumbnailUpload, bannerUpload] = await Promise.all([
        uploadToCloudinary(thumbnailBuffer, 'courses/thumbnails'),
        uploadToCloudinary(bannerBuffer, 'courses/banners'),
    ]);

    try {
        const course = await prisma.course.create({
            data: {
                title: data.title,
                slug: sluggify(data.title),
                description: data.description,
                isActive: data.isActive,
                categoryId: data.categoryId,
                originalFee: data.originalFee,
                discountedFee: data.discountedFee,
                thumbnail: thumbnailUpload.url,
                thumbnailPublicId: thumbnailUpload.publicId,
                banner: bannerUpload.url,
                bannerPublicId: bannerUpload.publicId,
                previewVideo: data.previewVideo,
                isFree: data.isFree,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                seoKeywords: data.seoKeywords,
                whoIsCourseFor: data.whoIsCourseFor
            }
        });

        if (course == null) {
            return {
                success: false,
                message: 'Something went wrong. Please try',
            }
        }

        return {
            success: true,
            message: 'Course has been created successfully.',
            course,
        }
    }
    catch (error) {
        console.log(error);

        if (thumbnailUpload) await deleteFromCloudinary(thumbnailUpload.publicId);
        if (bannerUpload) await deleteFromCloudinary(bannerUpload.publicId);

        return {
            success: false,
            message: 'Something went wrong, we could not create the course. Please try again.'
        }
    }
}

export const editCourse = async (id: string, unsafeData: z.infer<typeof CreateCourseValidation>) => {
    const { success, data, error } = CreateCourseValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    let newThumbnail: { url: string; publicId: string } | null = null;
    let newBanner: { url: string; publicId: string } | null = null;

    try {
        const course = await prisma.course.findFirst({
            where: {
                id: id,
            },
        });

        if (!course) {
            return {
                success: false,
                message: 'Invalid request, the category cannot be found.'
            }
        }

        // Check for uniqueness
        const alreadyExisting = await prisma.course.findFirst({
            where: {
                slug: sluggify(data.title),
                NOT: {
                    id: id
                }
            }
        });

        if (alreadyExisting) {
            return {
                success: false,
                message: 'Course name already exists, please choose another.',
            }
        }

        if (data.thumbnail) {
            newThumbnail = await uploadToCloudinary(
                await fileToBuffer(data.thumbnail),
                'courses/thumbnails'
            );
        }

        if (data.banner) {
            newBanner = await uploadToCloudinary(
                await fileToBuffer(data.banner),
                'courses/banners'
            );
        }

        const editCourse = await prisma.course.update({
            where: {
                id: id,
            },
            data: {
                title: data.title,
                slug: sluggify(data.title),
                description: data.description,
                isActive: data.isActive,
                categoryId: data.categoryId,
                originalFee: data.originalFee,
                discountedFee: data.discountedFee,
                thumbnail: newThumbnail ? newThumbnail.url : course.thumbnail,
                thumbnailPublicId: newThumbnail ? newThumbnail.publicId : course.thumbnailPublicId,
                banner: newBanner ? newBanner.url : course.banner,
                bannerPublicId: newBanner ? newBanner.publicId : course.bannerPublicId,
                previewVideo: data.previewVideo,
                isFree: data.isFree,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                seoKeywords: data.seoKeywords,
                whoIsCourseFor: data.whoIsCourseFor
            }
        });

        if (editCourse == null) {
            return {
                success: false,
                message: 'Something went wrong. Please try',
            }
        }

        // Delete old images AFTER successful DB update
        if (newThumbnail && course.thumbnailPublicId) {
            await deleteFromCloudinary(course.thumbnailPublicId);
        }

        if (newBanner && course.bannerPublicId) {
            await deleteFromCloudinary(course.bannerPublicId);
        }

        return {
            success: true,
            message: 'Course has been updated successfully',
            course: editCourse,
        }
    }
    catch (error) {
        console.log(error);

        // Rollback uploaded images if DB update fails
        if (newThumbnail) await deleteFromCloudinary(newThumbnail.publicId);
        if (newBanner) await deleteFromCloudinary(newBanner.publicId);

        return {
            success: false,
            message: 'Something went wrong. Please try again.'
        }
    }
}

export const deleteCourse = async (id: string) => {
    try {
        const course = await prisma.course.findFirst({
            where: {
                id: id,
            }
        });

        if (!course) {
            return {
                success: false,
                message: 'Course not found',
            }
        }

        const deleted = await prisma.course.delete({
            where: {
                id: id,
            }
        })

        if (!deleted) {
            return {
                success: false,
                message: 'Course not deleted, please try again later.',
            }
        }

        return {
            success: true,
            message: 'Course was deleted successfully',
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            errors: 'Something went wrong. Please try again.'
        }
    }
}