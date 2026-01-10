'use server'

import prisma from "@/src/lib/prisma";
import { getFirstErrorFromFieldSubmission } from "@/src/utils/client_functions";
import { ProfileValidation } from "@/src/validations/ProfileValidation";
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

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: data.name,
                email: data.email,
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

        return {
            success: false,
            message: 'Something went wrong, we could not update your profile. Please try again.'
        }
    }
}