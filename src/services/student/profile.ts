'use server'

import prisma from "@/src/lib/prisma";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { deleteFromCloudinary, fileToBuffer, hashPassword, uploadToCloudinary, verifyPassword } from "@/src/utils/server_functions";
import { ProfileValidation, PasswordChangeValidation } from "@/src/validations/ProfileValidation";
import * as z from "zod";

// Define or import UserGender type
type UserGender = "male" | "female";

export const updateProfile = async (userId: string, unsafeData: z.infer<typeof ProfileValidation>) => {
    const { success, data, error } = ProfileValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    const currentData = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });

    let currentImage = currentData?.image;
    let avatarUpload = null;

    try {
        if (data.avatar) {
            const avatarBuffer = await fileToBuffer(data.avatar);

            // Upload to Cloudinary
            avatarUpload = await uploadToCloudinary(avatarBuffer, 'avatars');
            currentImage = avatarUpload?.url;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: data.name,
                image: currentImage,
                phone: data.phone,
                city: data.city,
                state: data.state,
                country: data.country,
                gender: data.gender as UserGender,
            },
        });

        return {
            success: true,
            message: 'Profile has been updated successfully.',
            user: updatedUser,
        };
    } catch (error) {
        console.log(error);

        if (data.avatar && avatarUpload) await deleteFromCloudinary(avatarUpload.publicId);

        return {
            success: false,
            message: 'Something went wrong, we could not update your profile. Please try again.'
        }
    }
}

export const changePassword = async (userId: string, unsafeData: z.infer<typeof PasswordChangeValidation>) => {
    const { success, data, error } = PasswordChangeValidation.safeParse(unsafeData);

    if (!success) {
        return {
            success: false,
            message: getFirstErrorFromFieldSubmission(error.flatten().fieldErrors),
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });

    if (user == null || !user.password) {
        return {
            success: false,
            message: 'Invalid current password',
        }
    }

    const passwordIsCorrect = await verifyPassword(data.currentPassword, user.password!);

    if (!passwordIsCorrect) {
        return {
            success: false,
            message: 'Invalid current password',
        }
    }

    try {
        const hashedPassword = await hashPassword(data.newPassword);

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword
            },
        });

        return {
            success: true,
            message: 'Your password has been updated successfully.'
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: 'Something went wrong, we could not change your password. Please try again.'
        }
    }
}