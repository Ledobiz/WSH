'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthProvider';
import { decrypt, encrypt } from '../utils/encryption';
import { toast } from 'react-toastify';
import { addToCartServer, mergeCartWithServer, myCart, removeFromCartServer } from '@/src/services/website/cart';
import { ExchangeRatesPayload, getTodayRates } from '@/src/services/website/exchangeRate';

interface cartItemInterface {
    id: string;
    title: string;
    thumbnail: string | null;
    discountedFee: number;
    originalFee: number;
}

export type CurrencyCode = "NGN" | "GHS" | "KES" | "UGX" | "XAF" | "XOF" |  "ZAR" | "ZMW" | "ZWL" | "USD" | "GBP" | "EUR" | "CAD";

interface CurrencyInfo {
    code: CurrencyCode;
    symbol: string;
    flag: string;
    name: string; // rate relative to NGN (1 NGN = rate)
}

const flagUrl = (countryCode: string) => `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;

export const allCurrencyCodes: CurrencyCode[] = ["NGN", "GHS", "KES", "UGX", "XAF", "XOF", "ZAR", "ZMW", "ZWL", "USD", "GBP", "EUR", "CAD"];

export const currencies: Record<CurrencyCode, CurrencyInfo> = {
    NGN: { code: "NGN", symbol: "₦", flag: flagUrl('NG'), name: "Nigerian Naira" },
    GHS: { code: "GHS", symbol: "₵", flag: flagUrl('GH'), name: "Ghanaian Cedi" },
    KES: { code: "KES", symbol: "KSh", flag: flagUrl('KE'), name: "Kenyan Shilling" },
    UGX: { code: "UGX", symbol: "USh", flag: flagUrl('UG'), name: "Ugandan Shilling" },
    XAF: { code: "XAF", symbol: "FCFA", flag: flagUrl('CM'), name: "Central African CFA" },
    XOF: { code: "XOF", symbol: "CFA", flag: flagUrl('SN'), name: "West African CFA" },
    ZAR: { code: "ZAR", symbol: "R", flag: flagUrl('ZA'), name: "South African Rand" },
    ZMW: { code: "ZMW", symbol: "K", flag: flagUrl('ZM'), name: "Zambian Kwacha" },
    ZWL: { code: "ZWL", symbol: "Z$", flag: flagUrl('ZW'), name: "Zimbabwean Dollar" },
    USD: { code: "USD", symbol: "$", flag: flagUrl('US'), name: "US Dollar" },
    GBP: { code: "GBP", symbol: "£", flag: flagUrl('GB'), name: "British Pound" },
    EUR: { code: "EUR", symbol: "€", flag: flagUrl('EU'), name: "Euro" },
    CAD: { code: "CAD", symbol: "C$", flag: flagUrl('CA'), name: "Canadian Dollar" }
};

interface CartContextInterface {
    cartCourses: any[];
    totalFees: number;
    addToCart: (course: any) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    clearCart: () => void;
    isLoaded: boolean;
    loadingId: string | null;
    currency: string;
    changeCurrency: (newCurrency: CurrencyCode) => Promise<void>;
    exchangeRates: Record<string, number> | null;
    convertAmount: (amount: number, targetCurrency?: string) => number;
    allCurrencies: CurrencyCode[];
    formatPrice: (ngnPrice: number) => string;
    currencyInfo: CurrencyInfo;
}

const CartContext = createContext<CartContextInterface | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCourses, setCartCourses] = useState<cartItemInterface[]>([]);
    const [totalFees, setTotalFees] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false); // Prevents hydration flicker
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [currency, setCurrency] = useState<CurrencyCode>('NGN');
    const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
    const { user } = useAuth();

    const currencyInfo = currencies[currency];

    // Helper to calculate total
    const calculateTotal = (items: any[]) => {
        const total = items.reduce((sum, item) => sum + (item.discountedFee || item.originalFee || 0), 0);
        setTotalFees(total);
    };

    const formatPrice = (ngnPrice: number): string => {
        const convertedAmount = convertAmount(ngnPrice);

        /*new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN',
            minimumFractionDigits: currency === 'NGN' ? 0 : 2,
            maximumFractionDigits: currency === 'NGN' ? 0 : 2,
        }).format(convertedAmount);*/
        
        if (currency === "NGN") {
            return `${currencyInfo.symbol}${convertedAmount.toLocaleString("en-NG")}`;
        }

        return `${currencyInfo.symbol}${convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Helper: Save to Storage (Encrypted)
    const persistCart = async (updatedCart: any[]) => {        
        const encryptedCart = await encrypt(updatedCart);
        localStorage.setItem('wsh_cart', encryptedCart);
    };

    // Load cart on mount
    useEffect(() => {
        const syncCart = async () => {
            const savedCartStr = localStorage.getItem('wsh_cart');
            let localItems: any[] = [];

            if (savedCartStr) {
                try {
                    localItems = await decrypt<any[]>(savedCartStr);
                } catch (e) { console.error("Decryption failed", e); }
            }

            if (user && user.role === 'student') {
                // IF GUEST ITEMS EXIST: Send them to the server first
                if (localItems.length > 0) {
                    await mergeCartWithServer(user.id, localItems);
                    localStorage.removeItem('wsh_cart'); // Clear guest storage
                }

                // NOW: Get the final combined cart from the database
                const cartResult = await myCart(user.id);
                
                if (cartResult.success) {
                    setCartCourses(cartResult.cart);
                    calculateTotal(cartResult.cart);
                }
            } 
            else if (localItems.length > 0) {
                // GUEST MODE: Just load local items
                setCartCourses(localItems);
                calculateTotal(localItems);
            }
            
            setIsLoaded(true);
        }

        syncCart();
    }, [user]);

    // Load currency & today's exchange rates on mount
    useEffect(() => {
        const initCurrencyAndRates = async () => {
            if (typeof window === 'undefined') return;

            const storedCurrency = localStorage.getItem('wsh_currency');
            if (storedCurrency && allCurrencyCodes.includes(storedCurrency as CurrencyCode)) {
                setCurrency(storedCurrency as CurrencyCode);
            }

            try {
                const payload: ExchangeRatesPayload = await getTodayRates();
                setExchangeRates(payload.conversion_rates);
            } catch (error) {
                console.error("Failed to initialize exchange rates", error);
                // Keep NGN as the active currency on failure
            }
        };

        initCurrencyAndRates();
    }, []);

    const changeCurrency = async (newCurrency: CurrencyCode) => {
        setCurrency(newCurrency);

        if (typeof window !== 'undefined') {
            localStorage.setItem('wsh_currency', newCurrency);
        }

        try {
            // Ensure we have rates available; fetch if missing
            if (!exchangeRates) {
                const payload: ExchangeRatesPayload = await getTodayRates();
                setExchangeRates(payload.conversion_rates);
            } else if (!exchangeRates[newCurrency]) {
                toast.error("Selected currency is not supported for today's rates. Falling back to NGN.");
                setCurrency('NGN');
                if (typeof window !== 'undefined') {
                    localStorage.setItem('wsh_currency', 'NGN');
                }
            }
        } catch (error) {
            console.error("Failed to change currency", error);
            toast.error("Unable to update currency at this time.");
            setCurrency('NGN');
            if (typeof window !== 'undefined') {
                localStorage.setItem('wsh_currency', 'NGN');
            }
        }
    };

    const convertAmount = (amount: number, targetCurrency?: string): number => {
        const activeCurrency = targetCurrency || currency;

        if (!exchangeRates || activeCurrency === 'NGN') {
            return amount;
        }

        const rate = exchangeRates[activeCurrency];

        if (!rate) {
            return amount;
        }

        return amount * rate;
    };

    const addToCart = async (course: any) => {
        if (cartCourses.some(c => c.id === course.id)) {
            toast.error("This course is already in your cart");
            return;
        }

        setLoadingId(course.id);

        try {
            const newCartItem: cartItemInterface = {
                id: course.id,
                title: course.title,
                thumbnail: course.thumbnail,
                discountedFee: course.discountedFee,
                originalFee: course.originalFee
            };
            
            const updatedCart = [...cartCourses, newCartItem];

            setCartCourses(updatedCart);
            calculateTotal(updatedCart);

            if (user && user.role === 'student') {
                const result = await addToCartServer(user.id, course.id);
                if (!result.success) {
                    toast.error("Failed to add to cart, please try again.");
                }
            } else {
                await persistCart(updatedCart);
            }

            toast.success(`${course.title} was added to cart successfully!`);
        } catch (err) {
            console.error("Add to cart failed", err);
            toast.error("Something went wrong");
        } finally {
            setLoadingId(null);
        }
    };

    const removeFromCart = async (id: string) => {
        const courseToRemove = cartCourses.find(c => c.id === id);
        const updatedCart = cartCourses.filter(c => c.id !== id);
        
        setCartCourses(updatedCart);
        calculateTotal(updatedCart);
        setLoadingId(id);

        try {
            if (user && user.role === 'student') {
                await removeFromCartServer(user.id, id);
                
            } else {                
                await persistCart(updatedCart);
            }
        } 
        catch (err) {
            console.error("Removal failed", err);
        }
        finally {
            setLoadingId(null);
        }

        if (courseToRemove) {
            toast.success("Course was removed from cart successfully.");
        }
    };

    // Inside your CartProvider function
    const clearCart = useCallback(() => {
        setCartCourses([]);
        setTotalFees(0);
        localStorage.removeItem('wsh_cart');
        // toast.success("Cart cleared");
    }, []);

    const value = {
        cartCourses,
        totalFees,
        addToCart,
        removeFromCart,
        clearCart,
        isLoaded,
        loadingId,
        currency,
        changeCurrency,
        exchangeRates,
        convertAmount,
        allCurrencies: allCurrencyCodes,
        formatPrice,
        currencyInfo
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

