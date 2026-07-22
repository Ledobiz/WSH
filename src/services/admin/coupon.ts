'use server'

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";
import prisma from "@/src/lib/prisma";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { CreateCouponValidation } from "@/src/validations/CourseValidation";

export const fetchAllCoupons = async () => {
    try {
        const coupons = await prisma.coupon.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: {
                course: {
                    select: { id: true, title: true },
                },
            },
        });

        return {
            success: true,
            message: 'Success',
            coupons,
        };
    } catch (error) {
        console.log("Error fetching coupons:", error);
        return {
            success: false,
            message: 'Something went wrong',
            coupons: [],
        };
    }
}

export const createCoupon = async (unsafeData: z.infer<typeof CreateCouponValidation>) => {
    const { success, data, error } = CreateCouponValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        };
    }

    try {
        const existing = await prisma.coupon.findFirst({
            where: {
                code: { equals: data.code.trim(), mode: 'insensitive' },
                deletedAt: null,
            },
        });

        if (existing) {
            return {
                success: false,
                message: 'A coupon with this code already exists.',
            };
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: data.code.trim(),
                name: data.name || null,
                description: data.description || null,
                isFixedAmount: data.isFixedAmount,
                discountAmount: data.discountAmount,
                courseId: data.courseId || null,
                maxUse: data.maxUse,
                totalUsed: 0,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                isActive: data.isActive,
                updatedAt: new Date(),
            },
        });

        return {
            success: true,
            message: 'Coupon created successfully.',
            coupon,
        };
    } catch (error) {
        console.log("Error creating coupon:", error);
        return {
            success: false,
            message: 'Something went wrong. Please try again.',
        };
    }
}

export const updateCoupon = async (id: string, unsafeData: z.infer<typeof CreateCouponValidation>) => {
    const { success, data, error } = CreateCouponValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        };
    }

    try {
        const existing = await prisma.coupon.findFirst({
            where: {
                code: { equals: data.code.trim(), mode: 'insensitive' },
                deletedAt: null,
                NOT: { id },
            },
        });

        if (existing) {
            return {
                success: false,
                message: 'Another coupon with this code already exists.',
            };
        }

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: data.code.trim(),
                name: data.name || null,
                description: data.description || null,
                isFixedAmount: data.isFixedAmount,
                discountAmount: data.discountAmount,
                courseId: data.courseId || null,
                maxUse: data.maxUse,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                isActive: data.isActive,
                updatedAt: new Date(),
            },
        });

        return {
            success: true,
            message: 'Coupon updated successfully.',
            coupon,
        };
    } catch (error) {
        console.log("Error updating coupon:", error);
        return {
            success: false,
            message: 'Something went wrong. Please try again.',
        };
    }
}

export const deleteCoupon = async (id: string) => {
    try {
        const coupon = await prisma.coupon.findFirst({ where: { id, deletedAt: null } });
        if (!coupon) {
            return { success: false, message: 'Coupon not found.' };
        }

        await prisma.coupon.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { success: true, message: 'Coupon deleted successfully.' };
    } catch (error) {
        console.log("Error deleting coupon:", error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}
