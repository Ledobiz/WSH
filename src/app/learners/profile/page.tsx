import ProfilePage from "@/src/pages/learners/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile Settings - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <ProfilePage />
    )
}
export default page