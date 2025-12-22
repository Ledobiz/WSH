import { Metadata } from "next";
import ComponentPreviewPage from "@/src/components/admin/pages/ComponentPreviewPage"

export const metadata: Metadata = {
    title: "Preview Component - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = async ({params}: {params: Promise<{id: string}>}) => {
    const { id } = await params;

    return (
        <ComponentPreviewPage componentId={id} />
    )
}
export default page