import { adminDashboardUrl } from "@/src/utils/url"
import Link from "next/link"

interface NavBreadcrumbProps {
    page: string;
    back?: string;
}

const NavBreadcrumb = ({page, back}: NavBreadcrumbProps) => {
    return (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                <nav aria-label="breadcrumb" className="d-flex justify-content-between align-center">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href={adminDashboardUrl}>Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {page}
                        </li>
                    </ol>

                    {back && (
                        <Link href={back}><i className="bi bi-arrow-left" /> Back</Link>
                    )}
                </nav>
            </div>
        </div>
    )
}
export default NavBreadcrumb