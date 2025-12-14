'use server';

import cloudinary from "@/src/lib/cloudinary";

export const fileToBuffer = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string
): Promise<{ url: string, publicId: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error || !result) {
                    reject(error);
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        stream.end(buffer);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    await cloudinary.uploader.destroy(publicId);
};