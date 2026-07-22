import MyCourses from "@/src/pages/learners/MyCourses";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Courses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <MyCourses />
    )
}
export default page