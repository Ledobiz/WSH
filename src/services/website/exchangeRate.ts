/* eslint-disable @typescript-eslint/no-explicit-any */

import { encrypt, decrypt } from '@/src/utils/encryption';

export interface ExchangeRatesPayload {
    date: string;
    base: string;
    conversion_rates: Record<string, number>;
}

const LOCAL_STORAGE_KEY = 'wsh_exchange_rates';

const isBrowser = () => typeof window !== 'undefined';

export const getTodayKey = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
};

export const loadLocalRates = async (): Promise<ExchangeRatesPayload | null> => {
    if (!isBrowser()) return null;

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = await decrypt<ExchangeRatesPayload>(raw);

        if (!parsed || parsed.base !== 'NGN') return null;
        if (parsed.date !== getTodayKey()) return null;

        return parsed;
    } catch (error) {
        console.error('Failed to decrypt local exchange rates', error);
        return null;
    }
};

export const saveLocalRates = async (payload: ExchangeRatesPayload): Promise<void> => {
    if (!isBrowser()) return;

    try {
        const encrypted = await encrypt(payload);
        localStorage.setItem(LOCAL_STORAGE_KEY, encrypted);
    } catch (error) {
        console.error('Failed to save local exchange rates', error);
    }
};

const BACKEND_TODAY_URL = '/api/exchange-rate/today';
const BACKEND_URL = '/api/exchange-rate';
const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY!;

export const fetchRatesFromBackend = async (): Promise<ExchangeRatesPayload | null> => {
    try {
        const res = await fetch(BACKEND_TODAY_URL, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (!data || !data.conversion_rates) return null;

        return {
            date: data.date ?? getTodayKey(),
            base: data.base ?? 'NGN',
            conversion_rates: data.conversion_rates as Record<string, number>,
        };
    } catch (error) {
        console.error('Failed to fetch exchange rates from backend', error);
        return null;
    }
};

export const saveRatesToBackend = async (payload: ExchangeRatesPayload): Promise<void> => {
    try {
        await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Failed to save exchange rates to backend', error);
    }
};

export const fetchRatesFromExternal = async (): Promise<ExchangeRatesPayload> => {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/NGN`);

    if (!res.ok) {
        throw new Error('Failed to fetch exchange rates from external API');
    }

    const data = await res.json();

    if (!data || !data.conversion_rates) {
        throw new Error('Invalid exchange rate response');
    }

    const todayKey = getTodayKey();

    return {
        date: todayKey,
        base: 'NGN',
        conversion_rates: data.conversion_rates as Record<string, number>,
    };
};

export const getTodayRates = async (): Promise<ExchangeRatesPayload> => {
    // 1. Try localStorage
    const local = await loadLocalRates();
    if (local) {
        return local;
    }

    // 2. Try backend (database)
    const backendRates = await fetchRatesFromBackend();
    if (backendRates && backendRates.date === getTodayKey()) {
        await saveLocalRates(backendRates);
        return backendRates;
    }

    // 3. Fallback to external API, then persist to backend + localStorage
    const externalRates = await fetchRatesFromExternal();
    await saveLocalRates(externalRates);
    await saveRatesToBackend(externalRates);

    return externalRates;
};

