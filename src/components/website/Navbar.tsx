'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { loginUrl, registerUrl } from "@/src/utils/url";
import Link from "next/link";
import { useEffect } from "react";

const links = [
    {
        uri: "/",
        label: "Home"
    },
    {
        uri: "/about-us",
        label: "About Us"
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
    {
        uri: loginUrl,
        label: "Login"
    },
    {
        uri: registerUrl,
        label: "Register"
    },
];

const Navbar = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    useEffect(() => {
        const win = window as any;
  
        if (typeof window !== 'undefined' && win.jQuery) {
            const $ = win.jQuery;
            
            // Re-initialize the menu plugin
            if ($.fn && $.fn.navigation) {
                $('#navigation').navigation();
            }
        }
    }, []); // Runs every time the URL changes

    return (  
        <>
            <div className="header header-transparent">
                <div className="container">
                    <nav id="navigation" className="navigation navigation-landscape">
                        <div className="nav-header">
                            <Link className="nav-brand fixed-logo" href="/">
                                <img 
                                    src={`${appUrl}/assets/img/wsh-logo-light.jpeg`}
                                    className="logo"
                                    alt="Women Skills Hub logo"
                                    style={{width: '60px', height: '100%'}}
                                />
                            </Link>
                            <div className="nav-toggle"></div>
                        </div>
                        <div className="nav-menus-wrapper">
                            <ul className="nav-menu">
                                {
                                    links.map((link) => (
                                        <li key={link.label}>
                                            <Link href={ link.uri }
                                                className={[loginUrl, registerUrl].includes(link.uri) ? 'd-inline-block d-lg-none' : ''}
                                            >{ link.label }</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                            <ul className="nav-menu nav-menu-social align-to-right d-none d-lg-block">
                                <li className="become-tutor light">
                                    <Link href={registerUrl}>
                                        <i className="bi bi-person-circle" />
                                        Register
                                    </Link>
                                </li>
                                <li className="join-btn light">
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
            <div className="clearfix"></div>
        </>
    )
}
export default Navbar