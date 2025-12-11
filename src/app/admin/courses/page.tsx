import { Metadata } from "next";
import CoursesPage from "@/src/components/admin/pages/CoursesPage";

export const metadata: Metadata = {
    title: "All Courses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Courses = () => {
    return (
        <CoursesPage />
    )
}
export default Courses