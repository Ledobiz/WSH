'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import AdminHeader from "@/src/components/admin/AdminHeader";
import { getSalesData } from "@/src/services/admin/dashboard";

const formatMoney = (currency: string, amount: number) =>
    `${currency === "NGN" ? "₦" : `${currency} `}${amount.toLocaleString()}`;

const statusBadge = (status: string) =>
    status === "success" ? "bg-green-100 text-green-700" :
        status === "pending" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700";

const AdminFinances = () => {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const result = await getSalesData(1, 200);
                setSales(result);
                setTransactions((result.transactionHistory as any)?.data || []);
            } catch (error) {
                console.log("Error loading finances:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const methods = useMemo(() => Array.from(new Set(transactions.map((t) => t.gateway).filter(Boolean))), [transactions]);

    const filtered = useMemo(() => transactions.filter((tx) => {
        const firstCourse = tx.carts?.[0]?.cartItems?.[0]?.course?.title || "";
        const matchesSearch =
            (tx.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (tx.reference || "").toLowerCase().includes(search.toLowerCase()) ||
            firstCourse.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
        const matchesMethod = methodFilter === "all" || tx.gateway === methodFilter;
        return matchesSearch && matchesStatus && matchesMethod;
    }), [transactions, search, statusFilter, methodFilter]);

    return (
        <>
            <AdminHeader title="Finances" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Finances</h1>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-lg md:text-2xl font-bold text-foreground break-words">₦{(sales?.totalSalesAmount ?? 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-lg md:text-2xl font-bold text-green-600 break-words">₦{(sales?.salesThisMonth ?? 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-lg md:text-2xl font-bold text-foreground">{(sales?.salesInNumber ?? 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Transactions</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name, reference or course..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                            <option value="all">All Methods</option>
                            {methods.map((m) => <option key={m} value={m} className="capitalize">{m}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="bg-background rounded-2xl border border-border overflow-hidden">
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Reference</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((tx) => {
                                        const firstCourse = tx.carts?.[0]?.cartItems?.[0]?.course?.title;
                                        return (
                                            <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                                <td className="p-4">
                                                    <p className="font-medium text-foreground">{tx.name || "—"}</p>
                                                    <p className="text-xs text-muted-foreground">{tx.email}</p>
                                                </td>
                                                <td className="p-4 text-foreground max-w-[200px] truncate">{firstCourse || "—"}</td>
                                                <td className="p-4 font-semibold text-foreground">{formatMoney(tx.currency, tx.amount)}</td>
                                                <td className="p-4 text-muted-foreground capitalize">{tx.gateway}</td>
                                                <td className="p-4 text-xs text-muted-foreground font-mono">{tx.reference}</td>
                                                <td className="p-4 text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${statusBadge(tx.status)}`}>{tx.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-border">
                            {filtered.map((tx) => {
                                const firstCourse = tx.carts?.[0]?.cartItems?.[0]?.course?.title;
                                return (
                                    <div key={tx.id} className="p-4">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-foreground text-sm">{tx.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{firstCourse || "—"}</p>
                                            </div>
                                            <p className="font-semibold text-foreground text-sm ml-3">{formatMoney(tx.currency, tx.amount)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <span className="capitalize">{tx.gateway}</span>
                                            <span>•</span>
                                            <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded-full ${statusBadge(tx.status)}`}>{tx.status}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground"><p>No transactions found.</p></div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminFinances;
