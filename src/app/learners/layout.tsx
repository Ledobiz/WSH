'use client'

import "../globals.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider } from "@/src/providers/AuthProvider";
import { SidebarProvider } from "@/src/providers/StudentSidebarProvider";
import FacebookPixel from "@/src/components/Metadata/FacebookPixel";
import TiktokPixel from "@/src/components/Metadata/TiktokPixel";
import ScrollToTop from "@/src/components/website/ScrollToTop";

import { LayoutDashboard, BookOpen, Award, Settings, Menu, X, ChevronLeft, StickyNote, MessageSquare, Receipt } from "lucide-react";
import { myCoursesUrl, studentCertificatesUrl, studentDashboardUrl, studentNotesUrl, studentPaymentsUrl, studentProfileUrl, studentReviewsUrl } from "@/src/utils/url";
import Link from "next/link";
import Logout from "@/src/components/learners/Logout";
import { CartProvider } from "@/src/providers/CartProvider";


const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
const wshLogo = `${appUrl}/assets/img/wsh-logo-light.jpeg`;

const navItems = [
    { label: "Dashboard", path: studentDashboardUrl, icon: LayoutDashboard },
    { label: "My Courses", path: myCoursesUrl, icon: BookOpen },
    { label: "My Notes", path: studentNotesUrl, icon: StickyNote },
    { label: "My Reviews", path: studentReviewsUrl, icon: MessageSquare },
    { label: "Certificates", path: studentCertificatesUrl, icon: Award },
    { label: "Payments", path: studentPaymentsUrl, icon: Receipt },
    { label: "Profile", path: studentProfileUrl, icon: Settings },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const isActive = (path: string) => {
        if (path === "/learners/dashboard") return pathname === "/learners/dashboard";
        return pathname?.startsWith(path);
    };

    return (
        <html lang="en">
            <head>
                <meta name="author" content="www.womenskillshub.com" />
                <link rel="icon" type="image/svg+xml" href={wshLogo}></link>
                
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@WSH" />
                <meta name="twitter:image" content={wshLogo} />
                <meta property="og:title" content="Dashboard" />
                <meta name="twitter:title" content="Dashboard" />
                <meta property="og:description" content="Empowering women with practical, income-generating skills. Learn baking, mixology, paper crafts and more at your own pace." />
                <meta name="twitter:description" content="Empowering women with practical, income-generating skills. Learn baking, mixology, paper crafts and more at your own pace." />
                <meta property="og:image" content={wshLogo} />
            </head>
            <body>
                <AuthProvider>
                    <CartProvider>
                        <SidebarProvider>
                            <TooltipProvider>
                                <Toaster />
                                <Sonner />
                                <div className="min-h-screen bg-secondary">
                                    {/* Mobile header */}
                                    <header className="sticky top-0 z-50 bg-background border-b border-border md:hidden">
                                        <div className="flex items-center justify-between px-4 h-14">
                                            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                                                <Menu className="h-5 w-5 text-foreground" />
                                            </button>
                                            <Link href={studentDashboardUrl} className="flex items-center gap-2">
                                                <img src={wshLogo} alt="WSH" className="h-8 w-8 rounded-full object-cover" />
                                                <span className="font-display font-bold text-sm text-foreground">Student Portal</span>
                                            </Link>
                                            <Link href={studentDashboardUrl}>
                                                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                                            </Link>
                                        </div>
                                    </header>

                                    {/* Mobile overlay */}
                                    <AnimatePresence>
                                        {sidebarOpen && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className="fixed inset-0 bg-foreground/50 z-50 md:hidden"
                                                />
                                                <motion.aside
                                                    initial={{ x: -280 }}
                                                    animate={{ x: 0 }}
                                                    exit={{ x: -280 }}
                                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                                    className="fixed left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border z-50 md:hidden flex flex-col"
                                                >
                                                <div className="flex items-center justify-between p-4 border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <img src={wshLogo} alt="WSH" className="h-9 w-9 rounded-full object-cover" />
                                                        <div>
                                                            <p className="font-display font-bold text-sm text-foreground">Student Portal</p>
                                                            <p className="text-xs text-muted-foreground">Women Skills Hub</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setSidebarOpen(false)}>
                                                        <X className="h-5 w-5 text-muted-foreground" />
                                                    </button>
                                                </div>
                                                <nav className="flex-1 p-3 space-y-1">
                                                    {navItems.map((item) => (
                                                        <Link
                                                            key={item.path}
                                                            href={item.path}
                                                            onClick={() => setSidebarOpen(false)}
                                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                                            isActive(item.path)
                                                                ? "bg-primary text-primary-foreground"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                            }`}
                                                        >
                                                            <item.icon className="h-5 w-5" />
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </nav>
                                                <div className="p-3 border-t border-border">
                                                    <Logout />
                                                </div>
                                                </motion.aside>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex">
                                        {/* Desktop sidebar */}
                                        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r border-border">
                                            <div className="flex items-center gap-2 p-5 border-b border-border">
                                                <img src={wshLogo} alt="WSH" className="h-10 w-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-display font-bold text-sm text-foreground">Student Portal</p>
                                                    <p className="text-xs text-muted-foreground">Women Skills Hub</p>
                                                </div>
                                            </div>
                                            <nav className="flex-1 p-3 space-y-1">
                                                {navItems.map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        href={item.path}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                                        isActive(item.path)
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                        }`}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </nav>
                                            <div className="p-3 border-t border-border space-y-1">
                                                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                                    <ChevronLeft className="h-5 w-5" />
                                                    Back to Website
                                                </Link>
                                                <Logout />
                                            </div>
                                        </aside>

                                        {/* Main content */}
                                        <main className="flex-1 md:ml-64">
                                            {children}
                                        </main>
                                    </div>
                                </div>

                                {/* SupportWidget is rendered once globally in the root layout */}
                                <ScrollToTop />
                            </TooltipProvider>
                        </SidebarProvider>
                    </CartProvider>
                </AuthProvider>

                <FacebookPixel />
                <TiktokPixel />
            </body>
        </html>
    );
}
