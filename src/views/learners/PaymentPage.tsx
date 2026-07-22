'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Receipt, Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import EmptyState from "@/src/components/website/EmptyState";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useAuth } from "@/src/providers/AuthProvider";
import { paymentHistory } from "@/src/services/student/payment";
import DashboardHeader from "@/src/components/learners/DashboardHeader";
import { coursesUrl } from "@/src/utils/url";
import { useCart } from "@/src/providers/CartProvider";

const statusConfig = {
    success: { icon: CheckCircle2, label: "Successful", className: "bg-success/10 text-success border-success/20" },
    pending: { icon: Clock, label: "Pending", className: "bg-accent/10 text-accent border-accent/20" },
    failed: { icon: XCircle, label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const PaymentSkeleton = () => (
    <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background rounded-2xl border border-border p-4 space-y-3">
                <div className="flex gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>
        ))}
    </div>
);

const formatCourses = (transaction: any) => {
    const courses: string[] = [];
    transaction.carts.forEach((cart: any) => {
        cart.cartItems.forEach((item: any) => {
            if (item.course) {
                courses.push(item.course.title);
            }
        });   
    });
    return courses.join(', ');
}

const PaymentPage = () => {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<any[]>([]);
    const { user } = useAuth();
    const { formatPrice } = useCart();

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const response = await paymentHistory(user?.id)

                if (response && response.success) {
                    setPayments(response.transactions);
                }
            } 
            catch (error) {
                console.log('Error fetching payment history', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPaymentHistory();
    }, [user]);

    const totalSpent = payments.filter((p) => p.status === "success").reduce((sum, p) => {
        const num = parseInt(p.amount, 10);
        return sum + num;
    }, 0);

    return (
        <>
            <DashboardHeader title='Payment History' />
            
            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Payment History</h1>

                {loading ? (
                    <PaymentSkeleton />
                ) : payments.length === 0 ? (
                    <EmptyState
                        icon={Receipt}
                        title="No Payments Yet"
                        description="Your payment history will appear here once you purchase a course."
                        actionLabel="Browse Courses"
                        actionLink={coursesUrl}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-background rounded-2xl border border-border p-4">
                                <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                                <p className="text-xl font-bold text-foreground">{ formatPrice(totalSpent) }</p>
                            </div>
                            <div className="bg-background rounded-2xl border border-border p-4">
                                <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                                <p className="text-xl font-bold text-foreground">{ payments.length }</p>
                            </div>
                        </div>

                        {/* Payment list */}
                        <div className="space-y-3">
                            {payments.map((payment, i) => {
                                const status = statusConfig[payment.status as keyof typeof statusConfig] ?? statusConfig.pending;
                                const StatusIcon = status.icon;
                                return (
                                    <motion.div
                                        key={payment.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-background rounded-2xl border border-border p-4"
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">{formatCourses(payment)}</h3>
                                                    <p className="font-bold text-sm text-foreground shrink-0">{formatPrice(payment.amount)}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-xs text-muted-foreground">{payment.gateway}</p>
                                                    <Badge variant="outline" className={`text-[10px] gap-1 ${status.className}`}>
                                                        <StatusIcon className="h-3 w-3" /> {status.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-muted-foreground truncate">Ref: {payment.reference}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                                                        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default PaymentPage