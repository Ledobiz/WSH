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