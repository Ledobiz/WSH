'use client';

import { signUp } from '@/src/services/auth'
import { encrypt } from '@/src/utils/encryption'
import { studentDashboardUrl } from '@/src/utils/url'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import LoadingButton from './LoadingButton';

const SignupForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const returnUrl = searchParams?.get('return');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const user = await signUp(formData);

            if (user.success) {
                const storageData = {
                    ...user.user, expiresAt: user.expiresAt
                }

                const encryptedUser = await encrypt(storageData);
                const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY!;
                localStorage.setItem(storageKey, encryptedUser);
                
                // Dispatch custom event to notify AuthProvider
                window.dispatchEvent(new CustomEvent('localStorageChange', {
                    detail: { key: storageKey, value: encryptedUser }
                }));

                toast.success('Congratulations! Your registration was successful.');
                setLoading(false);

                const destinationUrl = returnUrl ? decodeURIComponent(returnUrl) : studentDashboardUrl;
                router.push(destinationUrl);
            }
            else {
                setLoading(false);
                toast.error(user.errors || 'Validation error');    
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    }

    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            disabled={loading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>

            <LoadingButton 
                variant="hero" 
                size="lg" 
                className="w-full h-12 cursor-pointer" 
                loading={loading} 
                type="submit"
                onClick={handleRegistration}
            >
                Create Account <ArrowRight className="h-4 w-4" />
            </LoadingButton>
        </>
    )
}
export default SignupForm