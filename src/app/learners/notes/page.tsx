import NotesPage from "@/src/views/learners/NotesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Notes - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <NotesPage />
    )
}
export default page
