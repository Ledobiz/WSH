'use client'

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import SocialSignIn from "@/src/components/website/SocialSignIn";
import Link from "next/link";
import LoginForm from "@/src/components/website/LoginForm";
import { registerUrl } from "@/src/utils/url";

const LoginPage = () => {
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 space-y-6"
                >
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                        <p className="text-muted-foreground mt-1">Sign in to continue learning</p>
                    </div>

                    <SocialSignIn />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with email</span></div>
                    </div>

                    <LoginForm />

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href={registerUrl+redirectBack} className="text-primary font-medium hover:underline">Create one</Link>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
export default LoginPage