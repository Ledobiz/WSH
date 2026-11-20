'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import {
    ComposedChart, Bar, Line, PieChart, Pie, Cell, Legend,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, BookOpen, DollarSign, Loader2, Info } from "lucide-react";
import AdminHeader from "@/src/components/admin/AdminHeader";
import { getDashboardData, getMonthlyRevenue, getRevenueSummary } from "@/src/services/admin/dashboard";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];
const PAYMENTS_COLOR = "#f59e0b";

const naira = (v: number) => `₦${Math.round(v).toLocaleString()}`;

const compactNaira = (v: number) => {
    if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`;
    if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}k`;
    return `₦${v}`;
};

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

const MiniStat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl bg-muted/40 px-3 py-2">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-foreground">{value}</p>
    </div>
);

const MonthTooltip = ({ active, payload, year }: any) => {
    if (!active || !payload?.length) return null;
    const m = payload[0].payload;
    return (
        <div className="rounded-xl border border-border bg-background px-3 py-2 text-xs shadow-sm">
            <p className="font-semibold text-foreground mb-1">{m.label} {year}</p>
            <p className="text-foreground"><span className="inline-block h-2 w-2 rounded-sm mr-1.5 bg-primary" />Revenue: <strong>{naira(m.revenue)}</strong></p>
            <p className="text-foreground"><span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ background: PAYMENTS_COLOR }} />Payments: <strong>{m.payments.toLocaleString()}</strong></p>
            <p className="text-muted-foreground mt-0.5">Courses sold: {m.courses.toLocaleString()}</p>
        </div>
    );
};

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);

    const [year, setYear] = useState<number | undefined>(undefined);
    const [monthly, setMonthly] = useState<any>(null);
    const [chartLoading, setChartLoading] = useState(false);
    const requestId = useRef(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [d, s] = await Promise.all([getDashboardData(), getRevenueSummary()]);
                setDashboard(d);
                setSummary(s);
            } catch (error) {
                console.log("Error loading analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const id = ++requestId.current;
        const load = async () => {
            setChartLoading(true);
            try {
                const result = await getMonthlyRevenue(year);
                if (id === requestId.current) setMonthly(result);
            } catch (error) {
                console.log("Error loading monthly revenue:", error);
            } finally {
                if (id === requestId.current) setChartLoading(false);
            }
        };
        load();
    }, [year]);

    const topCourses = dashboard?.topSalesCourses ?? [];
    const pieData = topCourses.filter((c: any) => c.totalSalePrice > 0).map((c: any) => ({
        category: c.title.length > 18 ? `${c.title.slice(0, 18)}…` : c.title,
        revenue: c.totalSalePrice,
    }));

    const totals = monthly?.totals ?? { revenue: 0, payments: 0, courses: 0 };
    const selectedYear = monthly?.year ?? year;
    const hasMonthlyData = totals.payments > 0;

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
                            <StatCard icon={DollarSign} label="Total Revenue" value={naira(summary?.totalRevenue ?? 0)} sub={`${naira(summary?.revenueThisMonth ?? 0)} this month`} />
                            <StatCard icon={BookOpen} label="Active Courses" value={(dashboard?.totalCourses ?? 0).toString()} />
                            <StatCard icon={TrendingUp} label="Successful Payments" value={(summary?.successfulPayments ?? 0).toLocaleString()} />
                        </div>

                        {/* Revenue by month */}
                        <div className="bg-background rounded-2xl border border-border p-4 sm:p-6 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                <div>
                                    <h2 className="font-semibold text-foreground">Revenue by Month</h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Successful payments, valued at course prices in naira (coupon discounts not deducted).
                                    </p>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Year</span>
                                    <select
                                        value={selectedYear ?? ""}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                                    >
                                        {(monthly?.years ?? (selectedYear ? [selectedYear] : [])).map((y: number) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                <MiniStat label={`Revenue ${selectedYear ?? ""}`} value={naira(totals.revenue)} />
                                <MiniStat label="Payments" value={totals.payments.toLocaleString()} />
                                <MiniStat label="Courses sold" value={totals.courses.toLocaleString()} />
                                <MiniStat label="Avg. per payment" value={naira(totals.payments ? totals.revenue / totals.payments : 0)} />
                            </div>

                            {monthly?.unpricedPayments > 0 && (
                                <p className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    {monthly.unpricedPayments} successful payment(s) in {selectedYear} have no course details and are not included.
                                </p>
                            )}

                            <div className={`relative h-80 transition-opacity ${chartLoading ? "opacity-50" : ""}`}>
                                {!monthly ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={monthly.months} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
                                                <YAxis yAxisId="revenue" tick={{ fontSize: 11 }} tickFormatter={compactNaira} width={56} />
                                                <YAxis yAxisId="payments" orientation="right" tick={{ fontSize: 11 }} allowDecimals={false} width={36} />
                                                <Tooltip content={<MonthTooltip year={selectedYear} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                                <Bar yAxisId="revenue" dataKey="revenue" name="Revenue (₦)" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                                <Line yAxisId="payments" dataKey="payments" name="Payments" type="monotone" stroke={PAYMENTS_COLOR} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                        {!hasMonthlyData && !chartLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <p className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-lg">No sales recorded in {selectedYear}.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {topCourses.length === 0 ? (
                            <div className="bg-background rounded-2xl border border-border p-10 text-center text-muted-foreground">
                                No course sales data to analyze yet.
                            </div>
                        ) : (
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
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminAnalytics;
