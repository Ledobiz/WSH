'use client'

import "../globals.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider } from "@/src/providers/AuthProvider";
import ScrollToTop from "@/src/components/website/ScrollToTop";

import { LayoutDashboard, Users, BookOpen, DollarSign, MessageSquare, BarChart3, Tag, Ticket, Menu, X, ChevronLeft, Shield } from "lucide-react";
import {
    adminAnalyticsUrl, adminCouponsUrl, adminCourseCategoryUrl, adminCoursesUrl, adminDashboardUrl,
    adminReviewssUrl, adminStudentsUrl, earningsUrl,
} from "@/src/utils/url";
import Link from "next/link";
import Logout from "@/src/components/learners/Logout";
import RequireAdmin from "@/src/components/admin/RequireAdmin";

const navItems = [
    { label: "Dashboard", path: adminDashboardUrl, icon: LayoutDashboard },
    { label: "Students", path: adminStudentsUrl, icon: Users },
    { label: "Courses", path: adminCoursesUrl, icon: BookOpen },
    { label: "Categories", path: adminCourseCategoryUrl, icon: Tag },
    { label: "Coupons", path: adminCouponsUrl, icon: Ticket },
    { label: "Finances", path: earningsUrl, icon: DollarSign },
    { label: "Reviews", path: adminReviewssUrl, icon: MessageSquare },
    { label: "Analytics", path: adminAnalyticsUrl, icon: BarChart3 },
];

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === adminDashboardUrl) return pathname === adminDashboardUrl;
        return pathname?.startsWith(path);
    };

    return (
        <html lang="en">
            <head>
                <meta name="author" content="www.womenskillshub.com" />
                <title>Admin Panel - Women Skills Hub</title>
            </head>
            <body>
                <AuthProvider>
                    <RequireAdmin>
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
                                        <Link href={adminDashboardUrl} className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <span className="font-display font-bold text-sm text-foreground">Admin Panel</span>
                                        </Link>
                                        <Link href="/">
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
                                                        <Shield className="h-8 w-8 text-primary" />
                                                        <div>
                                                            <p className="font-display font-bold text-sm text-foreground">Admin Panel</p>
                                                            <p className="text-xs text-muted-foreground">Women Skills Hub</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setSidebarOpen(false)}>
                                                        <X className="h-5 w-5 text-muted-foreground" />
                                                    </button>
                                                </div>
                                                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                                                <div className="p-3 border-t border-border space-y-1">
                                                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                                        <ChevronLeft className="h-5 w-5" />
                                                        Back to Website
                                                    </Link>
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
                                            <Shield className="h-9 w-9 text-primary" />
                                            <div>
                                                <p className="font-display font-bold text-sm text-foreground">Admin Panel</p>
                                                <p className="text-xs text-muted-foreground">Women Skills Hub</p>
                                            </div>
                                        </div>
                                        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

                            <ScrollToTop />
                        </TooltipProvider>
                    </RequireAdmin>
                </AuthProvider>
            </body>
        </html>
    );
}
