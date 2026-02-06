import { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/src/components/website/PageLoader";
import CourseStudentsPage from "@/src/components/admin/pages/CourseStudentsPage";

export const metadata: Metadata = {
    title: "Course Students - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const CourseStudents = async ({params}: {params: Promise<{courseId: string}>}) => {
    const { courseId } = await params;

    return (
        <Suspense fallback={<PageLoader />}>
            <CourseStudentsPage courseId={courseId} />
        </Suspense>
    )
}
export default CourseStudents
