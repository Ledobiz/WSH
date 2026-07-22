'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { signInWithGoogle } from "@/src/services/auth";
import { encrypt } from "@/src/utils/encryption";
import { adminDashboardUrl, studentDashboardUrl, studentProfileUrl } from "@/src/utils/url";

declare global {
    interface Window {
        google?: any;
    }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const SocialSignIn = () => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams?.get("return") ?? null;
    const [processing, setProcessing] = useState(false);

    // Keep the latest returnUrl available to the (once-initialized) Google callback.
    const returnUrlRef = useRef<string | null>(returnUrl);
    returnUrlRef.current = returnUrl;

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;

        const handleCredential = async (response: { credential?: string }) => {
            if (!response?.credential) return;
            setProcessing(true);
            try {
                const result = await signInWithGoogle(response.credential);

                if (!result.success || !result.user) {
                    toast.error(result.errors || "Google sign-in failed. Please try again.");
                    return;
                }

                const storageData = { ...result.user, expiresAt: result.expiresAt };
                const encrypted = await encrypt(storageData);
                const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY!;
                localStorage.setItem(storageKey, encrypted);
                window.dispatchEvent(
                    new CustomEvent("localStorageChange", { detail: { key: storageKey, value: encrypted } })
                );

                toast.success("You are signed in successfully.");

                const rUrl = returnUrlRef.current;
                let destination: string;
                if (result.user.role === "admin") {
                    destination = rUrl ? decodeURIComponent(rUrl) : adminDashboardUrl;
                } else {
                    const hasCompleteProfile = !!(result.user.phone && result.user.country);
                    destination = rUrl
                        ? decodeURIComponent(rUrl)
                        : hasCompleteProfile
                            ? studentDashboardUrl
                            : studentProfileUrl;
                }
                router.push(destination);
            } catch (error) {
                console.log("Google sign-in error:", error);
                toast.error("Something went wrong with Google sign-in.");
            } finally {
                setProcessing(false);
            }
        };

        let cancelled = false;

        const render = (): boolean => {
            if (cancelled) return false;
            if (!window.google?.accounts?.id || !buttonRef.current) return false;

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredential,
            });
            // Clear first so we never stack duplicate buttons on re-render.
            buttonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(buttonRef.current, {
                theme: "outline",
                size: "large",
                type: "standard",
                text: "continue_with",
                shape: "pill",
                logo_alignment: "center",
                width: buttonRef.current.offsetWidth || 320,
            });
            return true;
        };

        // Make sure the Google Identity Services script is on the page.
        if (!document.getElementById("google-gsi-script")) {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.id = "google-gsi-script";
            document.head.appendChild(script);
        }

        // Render as soon as the library is available. Polling avoids missed
        // `load` events and re-mount races that can leave the button blank.
        if (render()) return () => { cancelled = true; };

        const interval = setInterval(() => {
            if (render()) clearInterval(interval);
        }, 200);
        const timeout = setTimeout(() => clearInterval(interval), 10000);

        return () => {
            cancelled = true;
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [router]);

    // Nothing to show until a Google client id is configured.
    if (!GOOGLE_CLIENT_ID) return null;

    return (
        <div className={`w-full flex justify-center min-h-[44px] ${processing ? "opacity-60 pointer-events-none" : ""}`}>
            <div ref={buttonRef} className="w-full flex justify-center" />
        </div>
    );
};

export default SocialSignIn;
