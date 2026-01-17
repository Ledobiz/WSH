import { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/src/components/website/PageLoader";
import StudentCoursePage from "@/src/components/admin/pages/StudentCoursePage";

export const metadata: Metadata = {
    title: "Student Course - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const StudentCourse = async ({params}: {params: Promise<{id: string}>}) => {
    const { id } = await params;

    return (
        <Suspense fallback={<PageLoader />}>
            <StudentCoursePage userId={id} />
        </Suspense>
    )
}
export default StudentCourse