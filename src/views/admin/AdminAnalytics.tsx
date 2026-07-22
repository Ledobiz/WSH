'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, BookOpen, DollarSign, Loader2 } from "lucide-react";
import AdminHeader from "@/src/components/admin/AdminHeader";
import { getDashboardData, getSalesData } from "@/src/services/admin/dashboard";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

const StatCard = ({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) => (
    <div className="bg-background rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground break-words">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
);

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<any>(null);
    const [sales, setSales] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [d, s] = await Promise.all([getDashboardData(), getSalesData(1, 1)]);
                setDashboard(d);
                setSales(s);
            } catch (error) {
                console.log("Error loading analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const topCourses = dashboard?.topSalesCourses ?? [];
    const barData = topCourses.map((c: any) => ({
        name: c.title.length > 14 ? `${c.title.slice(0, 14)}…` : c.title,
        revenue: c.totalSalePrice,
    }));
    const pieData = topCourses.filter((c: any) => c.totalSalePrice > 0).map((c: any) => ({
        category: c.title.length > 18 ? `${c.title.slice(0, 18)}…` : c.title,
        revenue: c.totalSalePrice,
    }));

    return (
        <>
            <AdminHeader title="Analytics" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Analytics</h1>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Quick stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                            <StatCard icon={Users} label="Enrolled Students" value={(dashboard?.enrolledStudents ?? 0).toLocaleString()} />
                            <StatCard icon={DollarSign} label="Total Revenue" value={`₦${(sales?.totalSalesAmount ?? 0).toLocaleString()}`} sub={`₦${(sales?.salesThisMonth ?? 0).toLocaleString()} this month`} />
                            <StatCard icon={BookOpen} label="Active Courses" value={(dashboard?.totalCourses ?? 0).toString()} />
                            <StatCard icon={TrendingUp} label="Transactions" value={(sales?.salesInNumber ?? 0).toLocaleString()} />
                        </div>

                        {topCourses.length === 0 ? (
                            <div className="bg-background rounded-2xl border border-border p-10 text-center text-muted-foreground">
                                No sales data to analyze yet.
                            </div>
                        ) : (
                            <>
                                {/* Top selling courses (revenue) */}
                                <div className="bg-background rounded-2xl border border-border p-4 sm:p-6 mb-6">
                                    <h2 className="font-semibold text-foreground mb-4">Top Selling Courses (Revenue)</h2>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                                                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
                                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Revenue share pie */}
                                    <div className="bg-background rounded-2xl border border-border p-4 sm:p-6">
                                        <h2 className="font-semibold text-foreground mb-4">Revenue Share by Course</h2>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="revenue" nameKey="category">
                                                        {pieData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }} formatter={(v: number) => `₦${v.toLocaleString()}`} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Top courses table */}
                                    <div className="bg-background rounded-2xl border border-border p-4 sm:p-6">
                                        <h2 className="font-semibold text-foreground mb-4">Top Courses by Sales</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-border text-left">
                                                        <th className="pb-2 font-medium text-muted-foreground">Course</th>
                                                        <th className="pb-2 font-medium text-muted-foreground text-center">Students</th>
                                                        <th className="pb-2 font-medium text-muted-foreground text-right">Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topCourses.map((c: any) => (
                                                        <tr key={c.id} className="border-b border-border last:border-0">
                                                            <td className="py-3 text-foreground max-w-[160px] truncate">{c.title}</td>
                                                            <td className="py-3 text-center text-muted-foreground">{c._count?.students ?? 0}</td>
                                                            <td className="py-3 text-right font-medium text-foreground">₦{c.totalSalePrice.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminAnalytics;
