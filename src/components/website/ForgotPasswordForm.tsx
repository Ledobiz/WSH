'use client';

import { loginUrl } from "@/src/utils/url";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "@/src/services/auth";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        
        setLoading(true);

        try {
            const response = await resetPassword(email);
            if (response.success) {
                toast.success(response.message || "Password reset link sent to your email.");
            } 
            else {
                toast.error(response.message || "Failed to send password reset link.");
            }
        } 
        catch (error) {
            console.error("Error submitting forgot password form:", error);
            toast.error("An error occurred. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email.."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <button disabled={loading} type="submit" className="btn btn-main w-100">
                        {loading ? 'Processing, please wait...' : 'Reset Password'}
                    </button>
                </div>
                
                <div className="form-group">
                    <div className="text-center text-muted">
                        I have remembered my password{" "}
                        <Link href={loginUrl}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default ForgotPasswordForm