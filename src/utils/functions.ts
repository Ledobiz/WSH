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