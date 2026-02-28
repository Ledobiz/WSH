'use client';

import { loginUrl, registerUrl } from "@/src/utils/url";
import Link from "next/link";
import { useEffect } from "react";
import CurrencySwitcher from "./CurrencySwitcher";

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
        // This function re-initializes the template's JS menu
        // Ensure the script is loaded in your _document.js or _app.js
        if (typeof window !== 'undefined' && window.jQuery) {
            const $ = window.jQuery;
            
            // 1. Initialize the plugin
            if ($.fn.navigation) {
                $('#navigation').navigation();
            }

            // 2. Add this click handler to fix the scroll issue
            $('.nav-menus-wrapper a').on('click', function() {
                // Re-enable scrolling on the body
                $('body').css('overflow', 'auto');
                // If the menu has a class to close it, add that here too
                $('.nav-menus-wrapper').removeClass('nav-menus-wrapper-open');
            });
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

                            <div className="nav-header-right">
                                <CurrencySwitcher className="d-block d-lg-none" />
                                <div className="nav-toggle"></div>
                            </div>
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
                                <li>
                                    <CurrencySwitcher className="d-none d-lg-block" />
                                </li>
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