'use client'

const ALGORITHM = 'AES-GCM';
const KEY_HEX = process.env.NEXT_PUBLIC_APP_KEY;

let cachedKey: CryptoKey | null = null;

function hexToBytes(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) {
        throw new Error('NEXT_PUBLIC_APP_KEY must be even-length hex');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

async function getKey(): Promise<CryptoKey> {
    if (cachedKey) return cachedKey;
    if (!KEY_HEX) {
        throw new Error('Missing NEXT_PUBLIC_APP_KEY env variable');
    }

    const keyBytes = hexToBytes(KEY_HEX);
    if (keyBytes.length !== 32) {
        throw new Error('NEXT_PUBLIC_APP_KEY must be 32 bytes (64 hex chars)');
    }

    // Create a new ArrayBuffer to ensure proper type compatibility
    const keyBuffer = new Uint8Array(keyBytes).buffer;

    cachedKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: ALGORITHM },
        false,
        ['encrypt', 'decrypt']
    );
    return cachedKey;
}

function toBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export async function encrypt<T>(data: T): Promise<string> {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM prefers 12-byte IV
    const encoded = new TextEncoder().encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        encoded
    );

    const encryptedBytes = new Uint8Array(encrypted);
    const payload = new Uint8Array(iv.length + encryptedBytes.length);
    payload.set(iv, 0);
    payload.set(encryptedBytes, iv.length);

    return toBase64(payload);
}

export async function decrypt<T>(encryptedBase64: string): Promise<T> {
    const key = await getKey();
    const payload = fromBase64(encryptedBase64);

    const iv = payload.slice(0, 12);
    const cipherBytes = payload.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        key,
        cipherBytes
    );

    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
}