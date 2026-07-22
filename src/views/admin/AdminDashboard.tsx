'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Users, BookOpen, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { getDashboardData, getSalesData } from "@/src/services/admin/dashboard";
import { getAllStudents } from "@/src/services/admin/student";

const formatNaira = (amount: number) => `₦${amount.toLocaleString()}`;

const statusBadgeClass = (status: string) => {
    if (status === "success") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<any>(null);
    const [sales, setSales] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [dashboardData, salesData, studentsData] = await Promise.all([
                    getDashboardData(),
                    getSalesData(1, 5),
                    getAllStudents(1, 5),
                ]);
                setDashboard(dashboardData);
                setSales(salesData);
                setStudents((studentsData as any).data || []);
            } catch (error) {
                console.log("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = [
        { label: "Enrolled Students", value: (dashboard?.enrolledStudents ?? 0).toLocaleString(), icon: Users, color: "bg-primary/10 text-primary" },
        { label: "Total Revenue", value: formatNaira(sales?.totalSalesAmount ?? 0), icon: DollarSign, color: "bg-accent/10 text-accent-foreground" },
        { label: "Active Courses", value: (dashboard?.totalCourses ?? 0).toString(), icon: BookOpen, color: "bg-primary/10 text-primary" },
        { label: "Transactions", value: (sales?.salesInNumber ?? 0).toLocaleString(), icon: TrendingUp, color: "bg-accent/10 text-accent-foreground" },
    ];

    const chartData = (dashboard?.topSalesCourses ?? []).map((c: any) => ({
        name: c.title.length > 14 ? `${c.title.slice(0, 14)}…` : c.title,
        revenue: c.totalSalePrice,
    }));

    const recentTransactions = sales?.transactionHistory?.data ?? [];

    return (
        <>
            <AdminHeader title="Dashboard" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Dashboard</h1>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-background rounded-2xl p-4 border border-border">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-xl ${stat.color}`}>
                                            <stat.icon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <p className="text-lg md:text-2xl font-bold text-foreground break-words">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Top Selling Courses Chart */}
                        <div className="bg-background rounded-2xl p-4 md:p-6 border border-border mb-6">
                            <h2 className="text-lg font-display font-bold text-foreground mb-4">Top Selling Courses</h2>
                            {chartData.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={0} angle={-20} textAnchor="end" height={60} />
                                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip
                                                formatter={(value: number) => [formatNaira(value), "Revenue"]}
                                                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
                                            />
                                            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground py-10 text-center">No sales data yet.</p>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Recent Transactions */}
                            <div className="bg-background rounded-2xl p-4 md:p-6 border border-border">
                                <h2 className="text-lg font-display font-bold text-foreground mb-4">Recent Transactions</h2>
                                <div className="space-y-3">
                                    {recentTransactions.length === 0 && (
                                        <p className="text-sm text-muted-foreground py-4">No transactions yet.</p>
                                    )}
                                    {recentTransactions.map((tx: any) => {
                                        const firstCourse = tx.carts?.[0]?.cartItems?.[0]?.course?.title;
                                        return (
                                            <div key={tx.id} className="flex items-center justify-between py-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-foreground truncate">{tx.name || tx.email || "Unknown"}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{firstCourse || "—"}</p>
                                                </div>
                                                <div className="text-right ml-3">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {tx.currency === "NGN" ? "₦" : `${tx.currency} `}{tx.amount.toLocaleString()}
                                                    </p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadgeClass(tx.status)}`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recent Students */}
                            <div className="bg-background rounded-2xl p-4 md:p-6 border border-border">
                                <h2 className="text-lg font-display font-bold text-foreground mb-4">Recent Students</h2>
                                <div className="space-y-3">
                                    {students.length === 0 && (
                                        <p className="text-sm text-muted-foreground py-4">No students yet.</p>
                                    )}
                                    {students.map((student: any) => (
                                        <div key={student.id} className="flex items-center justify-between py-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground truncate">{student.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ml-3 ${student.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {student.isActive ? "active" : "inactive"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;
