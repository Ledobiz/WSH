'use client'

import { useAuth } from "@/src/providers/AuthProvider";
import { logOut } from "@/src/services/auth"
import { loginUrl } from "@/src/utils/url";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutProps = {
    style?: React.CSSProperties;
};

const Logout = ({style}: LogoutProps) => {
    const { logout } = useAuth();
    const router = useRouter();

    const [signingOut, setSigningOut] = useState(false);

    const handleLogout = async () => {
        if (signingOut) return;
        setSigningOut(true); // stays on until the redirect replaces the page
        try {
            // Clear the user state and localStorage (this sets user to null)
            await logout();
            
            // Clear the server session (ignore redirect from server action)
            try {
                await logOut();
            } catch (err) {
                // Server action redirect might fail, but that's okay
                console.log('Server logout completed (redirect ignored)');
            }

            // Redirect to login page on client side
            router.push(loginUrl);
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if there's an error, clear state and redirect to login
            await logout();
            router.push(loginUrl);
        }
    }

    return (
        <button onClick={handleLogout} disabled={signingOut} aria-busy={signingOut} style={style} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70">
            {signingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            {signingOut ? "Signing out..." : "Sign Out"}
        </button>
    )
}
export default Logout