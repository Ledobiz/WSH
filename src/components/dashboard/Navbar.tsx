'use client';

import { studentDashboardUrl } from "@/src/utils/url";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    /*{
        uri: "/learners/resume-course",
        label: "Resume Course",
        icon: "bi-patch-plus"
    },*/
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

const Navbar = () => {
    const pathName = usePathname();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (  
        <>
            <div className="header header-light">
                <div className="container">
                    <nav id="navigation" className="navigation navigation-landscape">
                        <div className="nav-header">
                            <Link className="nav-brand" href={studentDashboardUrl}>
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
                                                <img src={`${appUrl}/assets/img/avatar-1.jpg`} className="avater-img" alt="" />
                                            </button>
                                            <div className="dropdown-menu pull-right animated flipInX box-shadow-sm">
                                                <div className="dropdown-header py-3 border-bottom">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="avatar-flex">
                                                            <div className="square--50 circle">
                                                                <img
                                                                    src={`${appUrl}/assets/img/avatar-1.jpg`}
                                                                    className="img-fluid circle"
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="caps d-flex flex-column gap-1">
                                                            <h6 className="fw-semibold m-0">Ryan Mitchell</h6>
                                                            <span className="text-mid text-muted-2">
                                                                Date Joined: 15 Dec 2025
                                                            </span>
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
                                                            <a href="#" className="text-danger">
                                                                <i className="bi bi-power me-2" />
                                                                Logout
                                                            </a>
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
                                            <img src={`${appUrl}/assets/img/avatar-1.jpg`} className="avater-img" alt="" />
                                        </button>
                                        <div className="dropdown-menu pull-right animated flipInX box-shadow-sm">
                                            <div className="dropdown-header py-3 border-bottom">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar-flex">
                                                        <div className="square--50 circle">
                                                            <img
                                                                src={`${appUrl}/assets/img/avatar-1.jpg`}
                                                                className="img-fluid circle"
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="caps d-flex flex-column gap-1">
                                                        <h6 className="fw-semibold m-0">Ryan Mitchell</h6>
                                                        <span className="text-mid text-muted-2">
                                                            Platinum - Exp. 15 Dec 2025
                                                        </span>
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
                                                        <a href="#" className="text-danger">
                                                            <i className="bi bi-power me-2" />
                                                            Logout
                                                        </a>
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