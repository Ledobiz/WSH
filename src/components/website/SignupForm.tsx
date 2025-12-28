'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { signUp } from '@/src/services/auth'
import { encrypt } from '@/src/utils/encryption'
import { studentDashboardUrl } from '@/src/utils/url'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

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

    const returnUrl = searchParams.get('return');

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
        <form onSubmit={handleRegistration}>
            <div className="form-group mb-3">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-control"
                    placeholder="Enter your name"
                    disabled={loading}
                />
            </div>
            <div className="form-group mb-3">
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="form-group mb-3">
                <div className="position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={loading}
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{cursor: 'pointer'}}
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`} />
                    </span>
                </div>
            </div>
            <div className="form-group mb-3">
                <button type="submit" className="btn btn-main w-100" disabled={loading}>
                    {loading ? "Processing..." : "Sign Up"}
                </button>
            </div>
        </form>
    )
}
export default SignupForm