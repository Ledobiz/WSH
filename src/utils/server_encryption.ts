'use client'

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const KEY = Buffer.from(process.env.APP_KEY!, "hex");

if (KEY.length !== 32) {
    throw new Error("APP_KEY must be 32 bytes (64 hex characters)");
}

export function encrypt<T>(data: T): string {
    const iv = crypto.randomBytes(16); // AES GCM uses 12–16 byte IV

    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    const json = JSON.stringify(data);
    const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);

    const authTag = cipher.getAuthTag();

    // Return Base64 encoded string: iv.encrypted.authTag
    return Buffer.concat([iv, encrypted, authTag]).toString("base64");
}

export function decrypt<T>(encryptedBase64: string): T {
    const buffer = Buffer.from(encryptedBase64, "base64");

    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(buffer.length - 16);
    const encrypted = buffer.subarray(16, buffer.length - 16);

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return JSON.parse(decrypted.toString("utf8"));
}