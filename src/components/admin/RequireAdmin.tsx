'use client'

import { useAuth } from "@/src/providers/AuthProvider";
import { loginUrl } from "@/src/utils/url";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Props {
    children: React.ReactNode;
}

const RequireAdmin = ({ children }: Props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== 'admin') {
            router.replace(loginUrl);
        }
    }, [user, loading, router]);

    // While auth is resolving, or when the user is not an admin (pending redirect),
    // avoid flashing admin content.
    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
};

export default RequireAdmin;
