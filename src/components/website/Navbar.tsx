'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/src/components/ui/button";
import CurrencySwitch from "@/src/components/website/CurrencySwitch";
import { fetchNavbarCategories } from "@/src/services/website/course";
import { aboutUsUrl, blogUrl, cartUrl, contactUsUrl, coursesUrl, loginUrl, registerUrl, studentDashboardUrl } from "@/src/utils/url";
import { usePathname } from "next/navigation";
import { useCart } from "@/src/providers/CartProvider";
import { useAuth } from "@/src/providers/AuthProvider";

const navLinksBeforeCategory = [
    { label: "Home", path: "/" },
    { label: "About Us", path: aboutUsUrl },
    { label: "Courses", path: coursesUrl },
];
const navLinksAfterCategory = [
    { label: "Blog", path: blogUrl },
    { label: "Contact", path: contactUsUrl },
];

type NavCategory = { name: string; slug: string; count: number };

const Navbar = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [mobileCatOpen, setMobileCatOpen] = useState(false);
    const [categories, setCategories] = useState<NavCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const catRef = useRef<HTMLDivElement>(null);

    const { cartCourses } = useCart();
    const { user } = useAuth();

    let tokenExpired = false;

    const now = new Date();
    const ttlUntil = user?.expiresAt as number | string | Date | undefined;
    const msRemaining = ttlUntil ? new Date(ttlUntil).getTime() - now.getTime() : 0;

    if (msRemaining <= 0) {
        tokenExpired = true;
    }

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const res = await fetchNavbarCategories();
            if (!cancelled) {
                setCategories(res.categories);
                setCategoriesLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container flex items-center justify-between h-16 md:h-18">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img src={`${appUrl}/images/wsh-logo-light.jpeg`} alt="Women Skills Hub" className="h-13 w-12 rounded-full object-cover" loading="eager" />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinksBeforeCategory.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                pathname === link.path
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Categories dropdown */}
                    <div ref={catRef} className="relative">
                        <button
                            onClick={() => setCatOpen(!catOpen)}
                            className='px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-muted'
                        >
                            Categories <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {catOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 mt-1 w-56 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50"
                                >
                                    {categoriesLoading ? (
                                        <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
                                    ) : categories.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-muted-foreground">No categories yet</div>
                                    ) : (
                                        categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`${coursesUrl}?category=${cat.slug}`}
                                                onClick={() => setCatOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                            >
                                                {cat.name}
                                                <span className="text-muted-foreground ml-1 text-xs">({cat.count})</span>
                                            </Link>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {navLinksAfterCategory.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                pathname === link.path
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <CurrencySwitch />

                    <Link href={cartUrl}>
                        <Button variant="ghost" size="icon" className="relative cursor-pointer">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1 shadow-sm">
                                { cartCourses.length }
                            </span>
                        </Button>
                    </Link>

                    { user && user.role === 'student' && !tokenExpired ? (
                        <Link href={studentDashboardUrl} className="hidden md:block">
                            <Button className="cursor-pointer" variant="hero" size="sm">Dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href={loginUrl} className="hidden md:block">
                                <Button variant="ghost" size="sm" className="cursor-pointer">Sign In</Button>
                            </Link>
                            <Link href={registerUrl} className="hidden md:block">
                                <Button variant="hero" size="sm" className="cursor-pointer">Get Started</Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden cursor-pointer"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden border-t border-border bg-background"
                    >
                        <nav className="container py-4 flex flex-col gap-1">
                            {navLinksBeforeCategory.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        pathname === link.path
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Mobile categories */}
                            <button
                                onClick={() => setMobileCatOpen(!mobileCatOpen)}
                                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-between cursor-pointer"
                            >
                                Categories <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {mobileCatOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        {categoriesLoading ? (
                                            <div className="pl-8 pr-4 py-2.5 text-sm text-muted-foreground">Loading…</div>
                                        ) : categories.length === 0 ? (
                                            <div className="pl-8 pr-4 py-2.5 text-sm text-muted-foreground">No categories yet</div>
                                        ) : (
                                            categories.map((cat) => (
                                                <Link
                                                    key={cat.slug}
                                                    href={`${coursesUrl}?category=${cat.slug}`}
                                                    onClick={() => { setMobileOpen(false); setMobileCatOpen(false); }}
                                                    className="block pl-8 pr-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                >
                                                    {cat.name}
                                                    <span className="text-muted-foreground/80 ml-1 text-xs">({cat.count})</span>
                                                </Link>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {navLinksAfterCategory.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        pathname === link.path
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="flex gap-2 mt-3 px-4">
                                { user && user.role === 'student' && !tokenExpired ? (
                                    <Link href={studentDashboardUrl} className="flex-1" onClick={() => setMobileOpen(false)}>
                                        <Button variant="hero" className="w-full cursor-pointer">Dashboard</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={loginUrl} className="flex-1" onClick={() => setMobileOpen(false)}>
                                            <Button variant="outline" className="w-full cursor-pointer">Sign In</Button>
                                        </Link>
                                        <Link href={registerUrl} className="flex-1" onClick={() => setMobileOpen(false)}>
                                            <Button variant="hero" className="w-full cursor-pointer">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
