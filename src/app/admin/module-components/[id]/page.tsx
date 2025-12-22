import ModuleComponentsPage from "@/src/components/admin/pages/ModuleComponentsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Module Components - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = async ({params}: {params: Promise<{id: string}>}) => {
    const { id } = await params;

    return (
        <ModuleComponentsPage moduleId={id} />
    )
}
export default page