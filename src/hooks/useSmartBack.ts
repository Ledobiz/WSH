'use client';

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Returns a handler that goes back to the page the user actually came from.
 *
 * Detail pages (e.g. a student's course content) can be reached from more than one
 * place, so a hardcoded "back" destination is often wrong. When there is in-app
 * history we use the browser's back navigation (returning the user exactly where they
 * were); otherwise — e.g. the page was opened directly or via a post-login redirect —
 * we fall back to a sensible parent route.
 */
export function useSmartBack(fallbackUrl: string) {
    const router = useRouter();

    return useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackUrl);
        }
    }, [router, fallbackUrl]);
}
