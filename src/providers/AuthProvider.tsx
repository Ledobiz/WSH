'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { NewUser, User } from "../types"
import { auth } from "../lib/firebase";
import { createNewStudent, getUserByEmail, getUserByUid, updateUserGoogleUid } from "../services/user";


interface AuthInterface {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthInterface>({
    user: null,
    loading: true,
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Inside the provider");
        
        // Check if auth is available before setting up listener
        if (!auth) {
            console.warn('Firebase Auth not initialized');
            return;
        }

        const unsubscribe = onAuthStateChanged(
            auth, 
            async (firebaseUser: FirebaseUser | null) => {
                console.log('AuthProvider - Auth state changed:', firebaseUser?.uid);

                if (firebaseUser) {
                    if (firebaseUser.isAnonymous) {
                        console.log('AuthProvider - Blocking anonymous user from student portal');
                        setUser(null);
                        setLoading(false);
                        return;
                    }

                    if (!firebaseUser.email) {
                        console.log('AuthProvider - Blocking user without email from student portal');
                        setUser(null);
                        setLoading(false);
                        return;
                    }

                    // Try to load user data from database, fallback to email-based creation
                    try {
                        let userData = await getUserByUid(firebaseUser.uid);

                        if (!userData) {
                            // Try finding the user by email
                            userData = await getUserByEmail(firebaseUser.email);

                            if (!userData) {
                                // Create the user if it does not exist
                                const newUserData: NewUser = {
                                    name: firebaseUser.displayName,
                                    email: firebaseUser.email,
                                    image: firebaseUser.photoURL,
                                    phone: firebaseUser.phoneNumber || undefined,
                                    uid: firebaseUser.uid,
                                };

                                userData = await createNewStudent(newUserData);
                            } else if (!userData.uid) {
                                // If the user exists but has no UID recorded, update it
                                await updateUserGoogleUid(userData.id, firebaseUser.uid);
                                // Reload the user record (optional) to include the updated uid
                                userData = await getUserByUid(firebaseUser.uid) || userData;
                            }
                        }

                        if (userData) {
                            console.log('AuthProvider - User data loaded successfully:', userData);
                            setUser(userData);

                            return;
                        }
                    }
                    catch (error) {
                        console.error('AuthProvider - Error loading from database, using email-based defaults:', error);
                    }


                    // Sign out the user since they don't have proper access
                    if (auth) {
                        await signOut(auth);
                    }
                    setUser(null);
                    setLoading(false);

                    // Show error to user
                    if (typeof window !== 'undefined') {
                        toast.error('Your account is not properly configured. Please contact the administrator.');
                    }
                }
                else {
                    console.log('AuthProvider - No Firebase user, clearing state');
                    setUser(null);
                    setLoading(false);
                }
            },
            (error) => {
                console.error('❌ Firebase Auth error:', error);
                setUser(null);
                setLoading(false);
            }
        )

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        if (!auth) return;
        
        try {        
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};