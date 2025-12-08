"use client";

export async function getClientCryptoKey(): Promise<CryptoKey> {
    const base64Key = process.env.NEXT_PUBLIC_APP_KEY!;
    const rawKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

    return crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

// Convert ArrayBuffer -> Base64
function bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    return btoa(binary);
}

// Convert Base64 -> ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function encryptClient<T>(data: T): Promise<string> {
    const key = await getClientCryptoKey();

    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recommended IV size

    const encoded = new TextEncoder().encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );

    // Combine iv + encrypted data into one Base64 string
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return bufferToBase64(combined.buffer);
}

export async function decryptClient<T>(encryptedBase64: string): Promise<T> {
    const key = await getClientCryptoKey();

    const combined = new Uint8Array(base64ToBuffer(encryptedBase64));

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted
    );

    const decoded = new TextDecoder().decode(decrypted);

    return JSON.parse(decoded);
}