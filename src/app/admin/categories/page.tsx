import CategoriesPage from "@/src/components/admin/pages/CategoriesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const Categories = () => {
    return (
        <CategoriesPage />
    )
}
export default Categories