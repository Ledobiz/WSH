'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./Logout";
import { useAuth } from "@/src/providers/AuthProvider";
import { formatDate } from "@/src/utils/client_functions";
import { useProgressCounts } from "@/src/providers/StudentSidebarProvider";

const links = [
    {
        uri: "/learners/dashboard",
        label: "Dashboard",
        icon: "bi-ui-radios-grid"
    },
    {
        uri: "/learners/my-courses",
        label: "My Courses",
        icon: "bi-play-circle"
    },
    {
        uri: "/learners/profile",
        label: "Profile",
        icon: "bi-person"
    },
    {
        uri: "/learners/wishlist",
        label: "Wishlist",
        icon: "bi-wallet2"
    },
    {
        uri: "/learners/payment-details",
        label: "Payment Details",
        icon: "bi-star-half"
    },
    {
        uri: "/learners/support",
        label: "Help & Support",
        icon: "bi-question-octagon"
    },
];

const Sidebar = () => {
    const { user } = useAuth();
    const { lecturesDone, coursesEnrolled } = useProgressCounts();
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
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                        
                    </h5>
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
                                <div className="square--120 circle shadow-sm border border-3 position-relative">
                                    <img
                                        src={ user?.image ? user?.image : `${appUrl}/assets/img/female-avatar.webp`}
                                        className="img-fluid circle"
                                        alt="Avatar"
                                    />
                                    <span className="badge bg-green text-light rounded-pill position-absolute top-100 start-50 translate-middle">
                                        Student
                                    </span>
                                </div>
                            </div>
                            <div className="author-caps text-center mb-4">
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <h5 className="fw-semibold m-0">{ user?.name }</h5>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                        <span className="text-mid text-muted-2">
                                            Date Joined: { formatDate(user?.createdAt) }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <div className="d-flex flex-column justify-content-center align-items-center gap-1">
                                    <h6 className="text-dark lh-1 fw-semibold m-0">{ coursesEnrolled }</h6>
                                    <span className="text-muted-2 m-0">Courses Enrolled</span>
                                </div>
                                <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                    <h6 className="text-dark lh-1 fw-semibold m-0">{ lecturesDone }</h6>
                                    <span className="text-muted-2 m-0">Lessons Completed</span>
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