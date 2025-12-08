'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { User } from "../types"


interface AuthInterface {
    user: User | null;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthInterface>({
    user: null,
    logout: async () => {},
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

    useEffect(() => {
        console.log("Inside the provider");
    }, []);

    const logout = async () => {
        // Check if there's no user and return early
        
        try {        
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const value = {
        user,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};