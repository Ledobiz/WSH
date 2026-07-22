'use client';

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import LoadingButton from "@/src/components/website/LoadingButton";
import { changePassword } from "@/src/services/auth";
import { forgotPasswordUrl, loginUrl } from "@/src/utils/url";

const ChangePassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") || "";
    const email = searchParams?.get("email") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const passwordsMatch = password.length > 0 && password === confirm;
    const isStrong = password.length >= 8;
    const validLink = Boolean(token && email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch || !isStrong) return;
        if (!validLink) {
            toast.error("This reset link is invalid or incomplete.");
            return;
        }

        setLoading(true);
        try {
            const response = await changePassword(email, token, password);
            if (response.success) {
                setDone(true);
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 md:py-24">
            <div className="container max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-6"
                >
                    {!validLink ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Invalid Reset Link</h1>
                            <p className="text-muted-foreground text-sm">
                                This password reset link is invalid or has expired. Please request a new one.
                            </p>
                            <Link href={forgotPasswordUrl}>
                                <LoadingButton variant="hero" size="lg" className="w-full h-12 mt-2">
                                    Request New Link <ArrowRight className="h-4 w-4" />
                                </LoadingButton>
                            </Link>
                        </div>
                    ) : done ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8 text-success" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Password Updated!</h1>
                            <p className="text-muted-foreground text-sm">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>
                            <Link href={loginUrl}>
                                <LoadingButton variant="hero" size="lg" className="w-full h-12 mt-2">
                                    Sign In <ArrowRight className="h-4 w-4" />
                                </LoadingButton>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
                                    <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Create a strong password for your account.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {password.length > 0 && (
                                        <p className={`text-xs mt-1.5 ${isStrong ? "text-success" : "text-destructive"}`}>
                                            {isStrong ? "✓ Strong password" : "Password must be at least 8 characters"}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            required
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            placeholder="Re-enter your password"
                                            className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {confirm.length > 0 && (
                                        <p className={`text-xs mt-1.5 ${passwordsMatch ? "text-success" : "text-destructive"}`}>
                                            {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                                        </p>
                                    )}
                                </div>
                                <LoadingButton
                                    variant="hero"
                                    size="lg"
                                    className="w-full h-12"
                                    loading={loading}
                                    type="submit"
                                    disabled={!passwordsMatch || !isStrong}
                                >
                                    Reset Password <ArrowRight className="h-4 w-4" />
                                </LoadingButton>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default ChangePassword;
