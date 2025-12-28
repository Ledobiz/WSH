'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { signIn } from "@/src/services/auth"
import { encrypt } from "@/src/utils/encryption"
import { adminDashboardUrl, forgotPasswordUrl, studentDashboardUrl } from "@/src/utils/url"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const returnUrl = searchParams.get('return');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const user = await signIn(formData);

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

                toast.success('You are signed in successfully.');
                setLoading(false);

                let destinationUrl = '';

                if (user?.user?.role == 'admin') {
                    destinationUrl = returnUrl ? decodeURIComponent(returnUrl) : adminDashboardUrl;
                }
                else {
                    destinationUrl = returnUrl ? decodeURIComponent(returnUrl) : studentDashboardUrl;
                }

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
        <form onSubmit={handleSignIn}>
            <div className="form-group mb-4">
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
            <div className="form-group mb-4">
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
                    <span className="position-absolute top-50 end-0 translate-middle-y me-3"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{cursor: 'pointer'}}
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-muted`} />
                    </span>
                </div>
            </div>
            <div className="form-group mb-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="form-check">
                        <input
                            id="saveinfo"
                            className="form-check-input"
                            name="saveinfo"
                            type="checkbox"
                        />
                        <label htmlFor="saveinfo" className="form-check-label">
                            Remember me
                        </label>
                    </div>
                    <div className="forget-password">
                        <Link href={forgotPasswordUrl} className="text-decoration-underline">
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
            <div className="form-group mb-3">
                <button type="submit" className="btn btn-main w-100" disabled={loading}>
                    {loading ? "Processing..." : "Sign In"}
                </button>
            </div>
        </form>
    )
}
export default LoginForm    