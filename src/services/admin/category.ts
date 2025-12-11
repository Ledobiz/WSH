'use server'

import * as z from "zod";
import prisma from "../../lib/prisma";
import { sluggify } from "@/src/utils/functions";

export const createCategory = async (name: string) => {
    try {
        const alreadyExists = await prisma.category.findFirst({
            where: {
                name: name,
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
            }
        });

        console.log('Saved category: ', category);

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
        return {
            success: false,
            errors: 'Something went wrong. Please try again.'
        }
    }
}

export const fetchAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany({
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