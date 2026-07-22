'use client'

import { useAuth } from "@/src/providers/AuthProvider";
import { studentProfileUrl } from "@/src/utils/url";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
}

const RequireCompleteProfile = ({ children }: Props) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        // Only enforce for authenticated students
        if (!user || user.role !== 'student') return;

        const hasCompleteProfile = !!(user.phone && user.country);
        if (!hasCompleteProfile) {
            const intended = pathname || '/learners/dashboard';
            router.replace(`${studentProfileUrl}?return=${encodeURIComponent(intended)}`);
        }
    }, [user, loading, pathname, router]);

    return <>{children}</>;
};

export default RequireCompleteProfile;