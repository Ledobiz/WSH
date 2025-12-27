'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthProvider';
import { decrypt, encrypt } from '../utils/encryption';
import { toast } from 'react-toastify';
import { addToCartServer, mergeCartWithServer, myCart, removeFromCartServer } from '@/src/services/website/cart';

interface CartContextInterface {
    cartCourses: any[];
    totalFees: number;
    addToCart: (course: any) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    clearCart: () => void;
    isLoaded: boolean;
    loadingId: string | null;
}

interface cartItemInterface {
    id: string;
    title: string;
    thumbnail: string | null;
    discountedFee: number;
    originalFee: number;
}

const CartContext = createContext<CartContextInterface | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useContext must be used within a CartProvider');
    }

    return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCourses, setCartCourses] = useState<cartItemInterface[]>([]);
    const [totalFees, setTotalFees] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false); // Prevents hydration flicker
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { user } = useAuth();

    // Helper to calculate total
    const calculateTotal = (items: any[]) => {
        const total = items.reduce((sum, item) => sum + (item.discountedFee || item.originalFee || 0), 0);
        setTotalFees(total);
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
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

