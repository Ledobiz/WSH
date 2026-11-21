import AdminCertificates from "@/src/views/admin/AdminCertificates";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Certificate Requests - Admin - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    return (
        <AdminCertificates />
    )
}
export default page
