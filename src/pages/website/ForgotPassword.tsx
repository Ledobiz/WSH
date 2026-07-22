'use client'

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowRight, ArrowLeft, Mail } from "lucide-react";

import LoadingButton from "@/src/components/website/LoadingButton";
import { loginUrl } from "@/src/utils/url";
import { resetPassword } from "@/src/services/auth";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
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
        <section className="py-16 md:py-24">
            <div className="container max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-6"
                >
                    {sent ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
                                <Mail className="h-8 w-8 text-success" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
                            <p className="text-muted-foreground text-sm">
                                We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>. 
                                Click the link in the email to reset your password.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Didn't receive it? Check your spam folder or{" "}
                                <button onClick={() => setSent(false)} className="text-primary font-medium hover:underline cursor-pointer">
                                    try again
                                </button>
                            </p>
                            <Link href={loginUrl} className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline mt-2">
                                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Enter your email and we'll send you a link to reset your password.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                    />
                                </div>
                                <LoadingButton variant="hero" size="lg" className="w-full h-12 cursor-pointer" loading={loading} type="submit">
                                    Send Reset Link <ArrowRight className="h-4 w-4" />
                                </LoadingButton>
                            </form>
                            <p className="text-center text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link href={loginUrl} className="text-primary font-medium hover:underline">Sign in</Link>
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
export default ForgotPassword