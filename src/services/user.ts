'use server';
import prisma from "../lib/prisma"
import { NewUser } from "../types";

const getUserByUid = async (uid: string) => {
    try {
        return await prisma.user.findFirst({
            where: {
                uid: uid,
            },
        });
    }
    catch (error) {
        console.log("Could not get user by uid:", error);
        return null;
    }
}

const getUserByEmail = async (email: string) => {
    try {
        return await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
    }
    catch (error) {
        console.log("Could not get user by email:", error);
        return null;
    }
}

const createNewStudent = async (user: NewUser) => {
    try {
        return await prisma.user.create({
            data: {
                ...user,
                role: 'student',
                isActive: true,
            }
        })
    } catch (error) {
        console.log("Could not create new user:", error);
        return null;
    }
}

const updateUserGoogleUid = async (userId: string, googleUid: string) => {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: { uid: googleUid },
        })
    } catch (error) {
        console.log("Update failed while update Google Uid:", error);
        return null;
    }
}


export { getUserByUid, getUserByEmail, createNewStudent, updateUserGoogleUid };