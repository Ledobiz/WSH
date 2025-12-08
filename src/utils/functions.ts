import { exec } from "node:child_process";

export const formatAmount = (price: number) => {
    const value = Number(price);

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const sluggify = (value: string) => {
    return value.replace(/\s+/g, "-").toLowerCase();
}

export const getFirstErrorFromFieldSubmission = (fieldErrors: Record<string, string[]>): string => {
    for (const field in fieldErrors) {
        if (fieldErrors[field] && fieldErrors[field].length > 0) {
            return fieldErrors[field][0];
        }
    }
    return "Validation failed please check all fields properly and make sure you submit the right data";
}

export function formatDate(
    date: string | Date | null | undefined,
    options: {
        month?: "numeric" | "2-digit" | "short" | "long" | "narrow";
        day?: "numeric" | "2-digit";
        year?: "numeric" | "2-digit";
    } = {}
): string {
    if (!date) {
        return '- - - -';
    }

    const d = new Date(date);

    return d.toLocaleDateString("en-US", {
        month: options.month ?? "short",
        day: options.day ?? "numeric",
        year: options.year ?? "numeric",
    });
}