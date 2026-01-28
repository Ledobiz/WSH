'use client';

import { changePassword } from "@/src/services/auth";
import { loginUrl } from "@/src/utils/url";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    const router = useRouter();

    if (!token || !email) {
        return notFound();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim() || !confirmPassword.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password.trim() !== confirmPassword.trim()) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await changePassword(email, token, password.trim());
            
            if (response.success) {
                toast.success("Password changed successfully. You can now log in with your new password.");
                setPassword('');
                setConfirmPassword('');

                router.push(loginUrl);
            } 
            else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("An error occurred. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <div className="position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <div className="position-relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <span className="position-absolute top-50 end-0 translate-middle-y me-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{cursor: 'pointer'}}
                        >
                            <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} text-muted`} />
                        </span>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <button disabled={loading} type="submit" className="btn btn-main w-100">
                        {loading ? 'Processing, please wait...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default ChangePasswordForm