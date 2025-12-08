'use client'

import { useAuth } from "@/src/providers/AuthProvider";
import { logOut } from "@/src/services/auth"
import { loginUrl } from "@/src/utils/url";
import { useRouter } from "next/navigation";

type LogoutProps = {
    style?: React.CSSProperties;
};

const Logout = ({style}: LogoutProps) => {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
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
        <button onClick={handleLogout} style={style} className="text-danger logout">
            <i className="bi bi-power me-2" />
            Logout
        </button>
    )
}
export default Logout