import { redirect } from "next/navigation";
import { adminDashboardUrl } from "@/src/utils/url";

const page = () => {
    redirect(adminDashboardUrl);
}
export default page
