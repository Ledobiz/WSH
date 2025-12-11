import { Metadata } from "next";
import StudentListPage from "@/src/components/admin/pages/StudentListPage";

export const metadata: Metadata = {
    title: "Student - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Students = () => {
    return (
        <StudentListPage />
    )
}
export default Students