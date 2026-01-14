import { Metadata } from "next";
import StudentListPage from "@/src/components/admin/pages/StudentListPage";
import { Suspense } from "react";
import PageLoader from "@/src/components/website/PageLoader";

export const metadata: Metadata = {
    title: "Student - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Students = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <StudentListPage />
        </Suspense>
    )
}
export default Students