import CertificatesPage from "@/src/pages/learners/CertificatesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Certificates - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <CertificatesPage />
    )
}
export default page
