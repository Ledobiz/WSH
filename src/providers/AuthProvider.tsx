'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { decrypt } from "../utils/encryption"
import { User } from "../types"

interface AuthInterface {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    updateUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthInterface>({
    user: null,
    loading: true,
    logout: async () => {},
    updateUser: () => {},
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY;
                if (typeof window === 'undefined' || !storageKey) {
                    setLoading(false);
                    return;
                }

                const encrypted = localStorage.getItem(storageKey);
                if (!encrypted) {
                    setLoading(false);
                    setUser(null);
                    return;
                }

                const storedUser = await decrypt<User>(encrypted);
                setUser(storedUser);
            } catch (error) {
                console.error('AuthProvider - Failed to load user from storage:', error);
                // If decryption fails, clear the corrupted entry
                const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY;
                if (storageKey) {
                    localStorage.removeItem(storageKey);
                }
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        // Listen for storage changes (e.g., when user logs in from another tab or component)
        const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY;
        if (typeof window !== 'undefined' && storageKey) {
            const handleStorageChange = async (e: StorageEvent) => {
                if (e.key === storageKey) {
                    if (e.newValue) {
                        try {
                            const storedUser = await decrypt<User>(e.newValue);
                            setUser(storedUser);
                        } catch (error) {
                            console.error('AuthProvider - Failed to decrypt user from storage event:', error);
                            setUser(null);
                        }
                    } else {
                        setUser(null);
                    }
                }
            };

            window.addEventListener('storage', handleStorageChange);

            // Also listen for custom events (for same-tab updates)
            const handleCustomStorageChange = (e: Event) => {
                const customEvent = e as CustomEvent<{ key: string; value: string | null }>;
                if (customEvent.detail?.key === storageKey) {
                    if (customEvent.detail?.value) {
                        decrypt<User>(customEvent.detail.value)
                            .then(storedUser => setUser(storedUser))
                            .catch(error => {
                                console.error('AuthProvider - Failed to decrypt user from custom event:', error);
                                setUser(null);
                            });
                    } else {
                        setUser(null);
                    }
                }
            };

            window.addEventListener('localStorageChange', handleCustomStorageChange);

            return () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('localStorageChange', handleCustomStorageChange);
            };
        }
    }, []);

    const logout = async () => {        
        try {        
            setUser(null);
            const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY;
            if (storageKey) {
                localStorage.removeItem(storageKey);
                // Dispatch custom event to notify other components
                window.dispatchEvent(new CustomEvent('localStorageChange', {
                    detail: { key: storageKey, value: null }
                }));
            }
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const updateUser = (user: User | null) => {
        setUser(user);
    }

    const value = {
        user,
        loading,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};