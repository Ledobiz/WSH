'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "../dashboard/Logout";
import { useAuth } from "@/src/providers/AuthProvider";
import { adminCourseCategoryUrl, adminCoursesUrl, adminDashboardUrl, adminReviewssUrl, adminStudentsUrl, createCourseUrl, earningsUrl } from "@/src/utils/url";

const links = [
    {
        uri: adminDashboardUrl,
        label: "Dashboard",
        icon: "bi-ui-radios-grid"
    },
    {
        uri: adminCoursesUrl,
        label: "Courses",
        icon: "bi-basket2"
    },
    {
        uri: createCourseUrl,
        label: "Create Course",
        icon: "bi-patch-plus"
    },
    {
        uri: adminCourseCategoryUrl,
        label: "Course Categories",
        icon: "bi-list-columns"
    },
    {
        uri: earningsUrl,
        label: "Earnings",
        icon: "bi-coin"
    },
    {
        uri: adminStudentsUrl,
        label: "Students",
        icon: "bi-people"
    },
    {
        uri: adminReviewssUrl,
        label: "Reviews",
        icon: "bi-star-half"
    },
];

const Sidebar = () => {
    const { user } = useAuth();
    const pathName = usePathname();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <div className="col-lg-3">
            <div
                className="offcanvas offcanvas-start offcanvas-collapse side-filter"
                tabIndex={-1}
                id="offcanvasExample"
                aria-labelledby="offcanvasExampleLabel"
            >
                <div className="offcanvas-header d-lg-none border-bottom">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel"></h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    />
                </div>
                <div className="offcanvas-body pt-4 pt-lg-0 p-lg-0 overlio">
                    <div className="dashboard-navbar card p-3 pt-4 border">
                        <div className="author-info-wwrap">
                            <div className="avatar-box d-flex justify-content-center mb-4">
                                <div className="square--120 circle shadow-sm border border-3">
                                    <img
                                        src={ user?.image ? user?.image : `${appUrl}/assets/img/female-avatar.webp`}
                                        className="img-fluid circle"
                                        alt="Avatar"
                                    />
                                </div>
                            </div>
                            <div className="author-caps text-center mb-4">
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <h5 className="fw-semibold m-0">{ user?.name }</h5>
                                        <span className="verified text-green ms-2">
                                            <i className="bi bi-patch-check-fill" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <div className="d-flex flex-column gap-1">
                                    <h6 className="text-dark lh-1 fw-semibold m-0">12</h6>
                                    <span className="text-muted-2 m-0">Students</span>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <h6 className="text-dark lh-1 fw-semibold m-0">156</h6>
                                    <span className="text-muted-2 m-0">Courses</span>
                                </div>
                            </div>
                        </div>
                        <div className="d-navigation">
                            <ul id="side-menu">
                                {links.map((link) => (
                                    <li key={link.uri}>
                                        <Link href={link.uri} className={link.uri === pathName ? 'active' : ''}>
                                            <i className={`bi ${link.icon} me-2`} />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Logout />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar