'use server'

import * as z from "zod";
import prisma from "@/src/lib/prisma";
import { CreateModuleValidation } from "@/src/validations/CourseValidation";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";

export const fetchAllModules = async (courseId: string) => {
    try {
        const modules = await prisma.courseModule.findMany({
            where: {
                courseId,
                deletedAt: null,
            },
            orderBy: {
                sorting: 'desc',
                createdAt: 'desc',
            },
            include: {
                moduleComponents: true,
            }
        });

        return {
            success: true,
            message: 'Success',
            modules,
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Something went wrong',
            modules: [],
        }
    }
}

export const fetchActiveModules = async (courseId: string) => {
    try {
        const modules = await prisma.courseModule.findMany({
            where: {
                courseId,
                isActive: true,
                deletedAt: null,
            },
            orderBy: {
                sorting: 'desc',
                createdAt: 'desc',
            },
            include: {
                moduleComponents: true,
            }
        });

        return {
            success: true,
            message: 'Success',
            modules,
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: 'Something went wrong',
            modules: [],
        }
    }
}

export const addModule = async (unsafeData: z.infer<typeof CreateModuleValidation>) => {
    const { success, data, error } = CreateModuleValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    try {
        const courseModule = await prisma.courseModule.create({
            data: {
                courseId: data.courseId,
                name: data.name,
                description: data.description,
                isActive: data.isActive,
                sorting: 500,
            }
        });

        if (courseModule == null) {
            return {
                success: false,
                message: 'Something went wrong. Please try',
            }
        }

        return {
            success: true,
            message: 'Module has been created successfully.',
            module: courseModule,
        }
    }
    catch (error) {
        console.log(error);

        return {
            success: false,
            message: 'Something went wrong, we could not create the module. Please try again.'
        }
    }
}

export const updateModule = async () => {

}

export const deleteModule = async (id: string) => {
    try {
        const courseModule = await prisma.courseModule.findFirst({
            where: {
                id,
                deletedAt: null,
            }
        });

        if (!courseModule) {
            return {
                success: false,
                message: 'Module not found',
            }
        }

        // Please note that there's a cascade on delete constraint on the module component
        // i.e. The components attached to the module will get deleted once a module is deleted.
        const deleted = await prisma.$transaction([
            prisma.courseModule.update({
                where: { id },
                data: { deletedAt: new Date() },
            }),
            prisma.moduleComponent.updateMany({
                where: { courseModuleId: id },
                data: { deletedAt: new Date() },
            }),
        ]);

        if (!deleted) {
            return {
                success: false,
                message: 'Category not deleted, please try again later.',
            }
        }

        return {
            success: true,
            message: 'Category was deleted successfully',
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            errors: 'Something went wrong. Please try again.'
        }
    }
}