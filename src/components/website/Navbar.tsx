'use client';

import { useAuth } from "@/src/providers/AuthProvider";
import { loginUrl, registerUrl, studentDashboardUrl } from "@/src/utils/url";
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
    },
    {
        uri: "/wishlist",
        label: "Wishlist"
    },*/
    {
        uri: "/cart",
        label: "Cart"
    },
];

const Navbar = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const pathName = usePathname();
    const { user } = useAuth();

    return (  
        <>
            <div className="header header-light">
                <div className="container">
                    <nav id="navigation" className="navigation navigation-landscape">
                        <div className="nav-header">
                            <Link className="nav-brand" href="/">
                                <img 
                                    src={`${appUrl}/assets/img/wsh-logo-light.jpeg`}
                                    className="logo"
                                    alt="Women Skills Hub logo"
                                    style={{width: '60px', height: '100%'}}
                                />
                            </Link>
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
                                {user && user.role === 'student' ? (
                                    <li className="join-btn">
                                        <Link href={studentDashboardUrl}>
                                            <i className="bi bi-box-arrow-in-right" />
                                            My Portal
                                        </Link>
                                    </li>
                                ) : (
                                    <>
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
                                    </>
                                )}
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