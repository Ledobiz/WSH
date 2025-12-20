import CourseModulePage from "@/src/components/admin/pages/CourseModulePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Course Modules - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const CourseModules = async ({params}: {params: Promise<{id: string}>}) => {
    const { id } = await params;

    return (
        <CourseModulePage courseId={id} />
    )
}
export default CourseModules