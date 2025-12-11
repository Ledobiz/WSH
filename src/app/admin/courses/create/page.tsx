import { Metadata } from "next";
import CreateCoursePage from "@/src/components/admin/pages/CreateCoursePage";

export const metadata: Metadata = {
    title: "Create Course - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const CreateCourse = () => {
    return (
        <CreateCoursePage />
    )
}
export default CreateCourse