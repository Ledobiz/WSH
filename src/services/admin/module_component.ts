'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";
import { ComponentType } from "@prisma/client";
import prisma from "@/src/lib/prisma";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { CreateComponentValidation } from "@/src/validations/CourseValidation";
import { deleteFromCloudinary, fileToBuffer, uploadToCloudinary } from "@/src/utils/server_functions";

export const fetchAllComponents = async (moduleId: string) => {
    try {
        const components = await prisma.moduleComponent.findMany({
            where: {
                courseModuleId: moduleId,
                deletedAt: null,
            },
            orderBy: [
                { sorting: 'desc' },
                { createdAt: 'asc' },
            ],
        });

        return {
            success: true,
            message: 'Success',
            components,
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Something went wrong',
            components: [],
        }
    }
}

export const fetchActiveComponents = async (moduleId: string) => {
    try {
        const components = await prisma.moduleComponent.findMany({
            where: {
                courseModuleId: moduleId,
                isActive: true,
                deletedAt: null,
            },
            orderBy: [
                { sorting: 'desc' },
                { createdAt: 'asc' },
            ]
        });

        return {
            success: true,
            message: 'Success',
            components,
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Something went wrong',
            components: [],
        }
    }
}

export const fetchComponentById = async (id: string) => {
    try {
        const component = await prisma.moduleComponent.findUnique({
            where: { id },
            include: {
                courseModule: {
                    include: {
                        course: true
                    }
                },
            }
        });

        return {
            success: true,
            message: 'Success',
            component,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong. Failed to fetch component, please try again',
            component: null,
        }
    }
}

export const addComponent = async (moduleId: string, unsafeData: z.infer<typeof CreateComponentValidation>) => {
    const { success, data, error } = CreateComponentValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    let uploadedFile = null;
    let fileNamePublicId = null;

    try {
        if ((data.type == 'file') && data.fileName) {
            const fileUpload = await uploadToCloudinary(
                await fileToBuffer(data.fileName),
                'courses/components',
                'raw'
            );

            uploadedFile = fileUpload.url;
            fileNamePublicId = fileUpload.publicId;
        }

        const component = await prisma.moduleComponent.create({
            data: {
                courseModuleId: moduleId,
                name: data.name,
                description: data.description,
                isActive: true,
                type: data.type as unknown as ComponentType,
                vimeoVideoUrl: data.type == 'video' ? data.vimeoVideoUrl : null,
                fileName: uploadedFile,
                ...(fileNamePublicId && { fileNamePublicId }),
                isFree: data.isFree,
                duration: data.duration,
                isPrerequisite: data.isPrerequisite ?? true,
                updatedAt: new Date(),
            }
        });

        return {
            success: true,
            message: 'Component has been added successfully',
            component,
        }
    } catch (error) {
        console.log(error);
        if (uploadedFile && fileNamePublicId) await deleteFromCloudinary(fileNamePublicId);

        return {
            success: false,
            message: 'Something went wrong. Please try again.'
        }
    }
}

export const updateComponent = async (id: string, unsafeData: z.infer<typeof CreateComponentValidation>) => {
    const { success, data, error } = CreateComponentValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    let fileUploaded: { url: string; publicId: string } | null = null;

    try {
        const component = await prisma.moduleComponent.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        if (!component) {
            return {
                success: false,
                message: 'Invalid request, the component cannot be found.'
            }
        }

        if (data.fileName) {
            fileUploaded = await uploadToCloudinary(
                await fileToBuffer(data.fileName),
                'courses/components',
                'raw'
            );
        }

        const oldPublicId = (component as any).fileNamePublicId as string | null;

        const editComponent = await prisma.moduleComponent.update({
            where: {
                id: id,
            },
            data: {
                name: data.name,
                description: data.description,
                isActive: true,
                type: data.type as unknown as ComponentType,
                vimeoVideoUrl: data.vimeoVideoUrl ?? null,
                fileName: fileUploaded ? fileUploaded.url : component.fileName,
                ...(fileUploaded ? { fileNamePublicId: fileUploaded.publicId } : (oldPublicId ? { fileNamePublicId: oldPublicId } : {})),
                isFree: data.isFree,
                duration: data.duration,
                isPrerequisite: data.isPrerequisite ?? true,
                updatedAt: new Date(),
            } as any,
        });

        // Delete old file from Cloudinary if a new file was uploaded
        if (fileUploaded && oldPublicId) {
            await deleteFromCloudinary(oldPublicId);
        }

        return {
            success: true,
            message: 'Component has been updated successfully',
            component: editComponent,
        }
    } catch (error) {
        console.log('Something went wrong while creating component', error);
        // Delete newly uploaded file if update fails
        if (fileUploaded) {
            await deleteFromCloudinary(fileUploaded.publicId);
        }

        return {
            success: false,
            message: 'Something went wrong. Please try again.'
        }
    }
}

export const deleteComponent = async (id: string) => {
    try {
        const component = await prisma.moduleComponent.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!component) {
            return {
                success: false,
                message: 'Component not found',
            }
        }

        const deleted = await prisma.moduleComponent.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        if (!deleted) {
            return {
                success: false,
                message: 'Component not deleted, please try again later.',
            }
        }

        return {
            success: true,
            message: 'The component has been deleted successfully.',
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            errors: 'Something went wrong. Please try again.'
        }
    }
}