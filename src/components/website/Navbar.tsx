'use client';

import { loginUrl, registerUrl } from "@/src/utils/url";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import CurrencySwitcher from "./CurrencySwitcher";

/** Clear body scroll lock and stray nav overlay (safe on unmount; does not call the nav plugin). */
function releaseBodyNavOverlayLock() {
    if (typeof window === "undefined" || !window.jQuery) return;
    const $ = window.jQuery;
    $("body").removeClass("no-scroll").css({ overflow: "", height: "" });
    $(".nav-overlay-panel").stop(true, true).remove();
}

/** Undo jQuery navigation mobile lock (body.no-scroll + overlay) — required for Next.js client navigations. */
function resetMobileNavScrollLock() {
    if (typeof window === "undefined" || !window.jQuery) return;
    const $ = window.jQuery;
    const $nav = $("#navigation");
    const api = $nav.data("navigation") as { hideOffcanvas?: () => void } | undefined;
    if (api && typeof api.hideOffcanvas === "function") {
        api.hideOffcanvas();
    } else {
        $nav.find(".nav-menus-wrapper").removeClass("nav-menus-wrapper-open");
        $(".nav-overlay-panel").stop(true, true).remove();
    }
    releaseBodyNavOverlayLock();
}

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
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined" || !window.jQuery) return;
        const $ = window.jQuery;

        if ($.fn.navigation) {
            const $nav = $("#navigation");
            if (!$nav.data("navigation")) {
                $nav.navigation();
            }
        }

        const onNavLinkClick = () => resetMobileNavScrollLock();
        $(document).on("click.wshMobileNav", ".nav-menus-wrapper a", onNavLinkClick);

        return () => {
            $(document).off("click.wshMobileNav", ".nav-menus-wrapper a");
        };
    }, []);

    useEffect(() => {
        resetMobileNavScrollLock();
    }, [pathname]);

    useEffect(() => {
        return () => {
            releaseBodyNavOverlayLock();
        };
    }, []);

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