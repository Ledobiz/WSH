import { Suspense } from "react";
import Loading from "@/src/components/website/loading";
import ProfileClient from "@/src/components/learners/ProfileClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

export default function ProfilePage() {
    return (
        <Suspense fallback={<Loading />}>   
            <ProfileClient />
        </Suspense>
    );
}