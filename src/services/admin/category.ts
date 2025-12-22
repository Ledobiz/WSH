'use server'

import * as z from "zod";
import prisma from "@/src/lib/prisma";
import { sluggify } from "@/src/utils/client_functions";

export const createCategory = async (name: string) => {
    try {
        const alreadyExists = await prisma.category.findFirst({
            where: {
                name: name,
                deletedAt: null,
            },
        });

        if (alreadyExists) {
            return {
                success: false,
                errors: 'Category name already exists. Kindly use another'
            }
        }

        const category = await prisma.category.create({
            data: {
                name: name,
                slug: sluggify(name),
                updatedAt: new Date(),
            }
        });

        if (category == null) {
            return {
                success: false,
                errors: 'Something went wrong. Please try',
            }
        }

        return {
            success: true,
            errors: null,
            message: 'Category has been created successfully',
            category,
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            errors: 'Something went wrong. Please try again.'
        }
    }
}

export const editCategory = async (id: string, name: string) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        if (!category) {
            return {
                success: false,
                errors: 'Invalid request, the category cannot be found.'
            }
        }

        // Check for uniqueness
        const alreadyExisting = await prisma.category.findFirst({
            where: {
                name: name,
                deletedAt: null,
                NOT: {
                    id: id
                }
            }
        });

        if (alreadyExisting) {
            return {
                success: false,
                errors: 'Category name already exists, please choose another.',
            }
        }

        const editCategory = await prisma.category.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                slug: sluggify(name),
                updatedAt: new Date(),
            }
        });

        if (editCategory == null) {
            return {
                success: false,
                errors: 'Something went wrong. Please try',
            }
        }

        return {
            success: true,
            errors: null,
            message: 'Category has been updated successfully',
            category: editCategory,
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            errors: 'Something went wrong. Please try again.'
        }
    }
}

export const fetchAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            message: 'Success',
            categories,
        }
    } catch (error) {
        return {
            success: false,
            message: 'Something went wrong',
            categories: []
        }
    }
}

export const deleteCategory = async (id: string) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                id: id,
                deletedAt: null,
            }
        });

        if (!category) {
            return {
                success: false,
                message: 'Category not found',
            }
        }

        const deleted = await prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            }
        })

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