import ProfilePage from "@/src/views/learners/ProfilePage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Profile Settings - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <Suspense fallback={null}>
            <ProfilePage />
        </Suspense>
    )
}
export default page