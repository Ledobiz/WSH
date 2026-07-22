'use client'

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import SocialSignIn from "@/src/components/website/SocialSignIn";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import LoadingButton from "@/src/components/website/LoadingButton";
import Link from "next/link";
import { loginUrl } from "@/src/utils/url";
import SignupForm from "@/src/components/website/SignupForm";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    const searchParams = useSearchParams();
    const returnUrl = searchParams?.get('return');

    let redirectBack = '';
    if (returnUrl) {
        redirectBack = '?return=' + decodeURIComponent(returnUrl);
    }

    return (
        <section className="py-16 md:py-24">
            <div className="container max-w-md">
                <motion.div
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-6"
                >
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
                        <p className="text-muted-foreground mt-1">Start your learning journey today</p>
                    </div>

                    <SocialSignIn />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>

                    <SignupForm />

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href={loginUrl+redirectBack} className="text-primary font-medium hover:underline">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
export default SignupPage