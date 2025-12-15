'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminCourseCategoryUrl, adminCoursesUrl, adminDashboardUrl, adminReviewssUrl, adminStudentsUrl, earningsUrl } from "@/src/utils/url";
import { useAuth } from "@/src/providers/AuthProvider";
import Logout from "../dashboard/Logout";

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
    /*{
        uri: createCourseUrl,
        label: "Create Course",
        icon: "bi-patch-plus"
    },*/
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

const Navbar = () => {
    const pathName = usePathname();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const { user } = useAuth();

    return (  
        <>
            <div className="header header-light">
                <div className="container">
                    <nav id="navigation" className="navigation navigation-landscape">
                        <div className="nav-header">
                            <Link className="nav-brand" href={adminDashboardUrl}>
                                {/* <img src="assets/img/logo.svg" className="logo" alt="Logo" /> */}
                                <h1>WSH</h1>
                            </Link>
                            {/* <a className="nav-toggle" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button"
                                aria-controls="offcanvasExample" 
                            /> */}

                            <div className="mobile_nav">
                                <ul>
                                    <li>
                                        <div className="btn-group account-drop">
                                            <button
                                                type="button"
                                                className="btn btn-order-by-filt border-0"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <img src={ user?.image ? user?.image : `${appUrl}/assets/img/female-avatar.webp`} className="avater-img" alt="" />
                                            </button>
                                            <div className="dropdown-menu pull-right animated flipInX box-shadow-sm">
                                                <div className="dropdown-header py-3 border-bottom">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="avatar-flex">
                                                            <div className="square--50 circle">
                                                                <img
                                                                    src={ user?.image ? user?.image : `${appUrl}/assets/img/female-avatar.webp`}
                                                                    className="img-fluid circle"
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="caps d-flex flex-column gap-1">
                                                            <h6 className="fw-semibold m-0">{ user?.name }</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dropdown-body">
                                                    <ul>
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
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="nav-menus-wrapper" style={{transitionProperty: 'none'}}>
                            <ul className="nav-menu nav-menu-social align-to-right">
                                <li>
                                    <div className="btn-group account-drop">
                                        <button
                                            type="button"
                                            className="btn btn-order-by-filt border-0"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <img src={ user?.image ? user?.image : `${appUrl}/assets/img/female-avatar.webp`} className="avater-img" alt="" />
                                        </button>
                                        <div className="dropdown-menu pull-right animated flipInX box-shadow-sm">
                                            <div className="dropdown-header py-3 border-bottom">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar-flex">
                                                        <div className="square--50 circle">
                                                            <img
                                                                src={ user?.image ? user?.image : `${appUrl}/assets/img/female-avatar.webp`}
                                                                className="img-fluid circle"
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="caps d-flex flex-column gap-1">
                                                        <h6 className="fw-semibold m-0">{ user?.name }</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="dropdown-body">
                                                <ul>
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
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="clearfix" />
        </>
    )
}
export default Navbar