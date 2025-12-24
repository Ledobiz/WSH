import { Metadata } from "next";
import { Suspense } from "react";
import CoursesPage from "@/src/components/admin/pages/CoursesPage";
import PageLoader from "@/src/components/website/PageLoader";

export const metadata: Metadata = {
    title: "All Courses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Courses = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <CoursesPage />
        </Suspense>
    )
}
export default Courses