'use client';

import { loginUrl, registerUrl } from "@/src/utils/url";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        uri: "/",
        label: "Home"
    },
    {
        uri: "/courses",
        label: "Courses"
    },
    /*{
        uri: "/trainings",
        label: "Trainings"
    },*/
    {
        uri: "/wishlist",
        label: "Wishlist"
    },
    {
        uri: "/cart",
        label: "Cart"
    },
];

const Navbar = () => {
    const pathName = usePathname();

    return (  
        <>
            <div className="header header-light">
                <div className="container">
                    <nav id="navigation" className="navigation navigation-landscape">
                        <div className="nav-header">
                            <a className="nav-brand" href="#">
                                {/* <img src="assets/img/logo.svg" className="logo" alt="Logo" /> */}
                                <h1>WSH</h1>
                            </a>
                            <div className="nav-toggle" />
                        </div>
                        <div className="nav-menus-wrapper">
                            <ul className="nav-menu">
                                {
                                    links.map((link) => (
                                        <li key={link.label} className={pathName === link.uri ? 'active' : ''}>
                                            <Link href={ link.uri }>{ link.label }</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                            <ul className="nav-menu nav-menu-social align-to-right">
                                <li className="become-tutor">
                                    <Link href={registerUrl}>
                                        <i className="bi bi-person-circle" />
                                        Register
                                    </Link>
                                </li>
                                <li className="join-btn">
                                    <Link href={loginUrl}>
                                        <i className="bi bi-box-arrow-in-right" />
                                        Sign In
                                    </Link>
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