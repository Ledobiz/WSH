import { adminDashboardUrl } from "@/src/utils/url"
import Link from "next/link"

interface NavBreadcrumbProps {
    page: string;
}

const NavBreadcrumb = ({page}: NavBreadcrumbProps) => {
    return (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href={adminDashboardUrl}>Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {page}
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    )
}
export default NavBreadcrumb