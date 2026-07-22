'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Loader2, Ticket } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { fetchAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/src/services/admin/coupon";
import { fetchActiveCourses } from "@/src/services/admin/course";

interface CouponForm {
    code: string;
    name: string;
    description: string;
    scope: "cart" | "course";
    courseId: string;
    discountType: "fixed" | "percentage";
    discountAmount: string;
    maxUse: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

const emptyForm: CouponForm = {
    code: "", name: "", description: "", scope: "cart", courseId: "",
    discountType: "percentage", discountAmount: "", maxUse: "", startDate: "", endDate: "", isActive: true,
};

const toDateInput = (d: string | Date) => new Date(d).toISOString().split("T")[0];

const AdminCoupons = () => {
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<CouponForm>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const load = async () => {
        const result = await fetchAllCoupons();
        setCoupons(result.coupons || []);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [, coursesResult] = await Promise.all([load(), fetchActiveCourses()]);
                setCourses(coursesResult.courses || []);
            } catch (error) {
                console.log("Error loading coupons:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (coupon: any) => {
        setEditing(coupon);
        setForm({
            code: coupon.code || "",
            name: coupon.name || "",
            description: coupon.description || "",
            scope: coupon.courseId ? "course" : "cart",
            courseId: coupon.courseId || "",
            discountType: coupon.isFixedAmount ? "fixed" : "percentage",
            discountAmount: String(coupon.discountAmount ?? ""),
            maxUse: String(coupon.maxUse ?? ""),
            startDate: coupon.startDate ? toDateInput(coupon.startDate) : "",
            endDate: coupon.endDate ? toDateInput(coupon.endDate) : "",
            isActive: !!coupon.isActive,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.code.trim()) return toast.error("Coupon code is required");
        if (form.scope === "course" && !form.courseId) return toast.error("Choose a course for this coupon");
        if (!form.discountAmount || Number(form.discountAmount) <= 0) return toast.error("Enter a valid discount amount");
        if (form.discountType === "percentage" && Number(form.discountAmount) > 100) return toast.error("Percentage cannot exceed 100");
        if (!form.startDate || !form.endDate) return toast.error("Start and end dates are required");
        if (new Date(form.endDate) < new Date(form.startDate)) return toast.error("End date must be after start date");

        setSubmitting(true);
        try {
            const payload = {
                code: form.code.trim(),
                name: form.name || null,
                description: form.description || null,
                isFixedAmount: form.discountType === "fixed",
                discountAmount: Number(form.discountAmount),
                courseId: form.scope === "course" ? form.courseId : null,
                maxUse: form.maxUse ? Number(form.maxUse) : 1,
                startDate: form.startDate,
                endDate: form.endDate,
                isActive: form.isActive,
            };
            const result = editing
                ? await updateCoupon(editing.id, payload as any)
                : await createCoupon(payload as any);
            if (result.success) {
                toast.success(result.message);
                setDialogOpen(false);
                await load();
            } else {
                toast.error(result.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const result = await deleteCoupon(deleteTarget.id);
        if (result.success) { toast.success(result.message); await load(); }
        else toast.error(result.message);
        setDeleteTarget(null);
    };

    const describeDiscount = (c: any) =>
        c.isFixedAmount ? `₦${c.discountAmount.toLocaleString()} off` : `${c.discountAmount}% off`;

    const describeScope = (c: any) => c.courseId ? (c.course?.title || "Specific course") : "Entire cart";

    return (
        <>
            <AdminHeader title="Coupons" />

            <div className="p-4 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-display font-bold text-foreground md:hidden">Coupons</h1>
                    <div className="hidden md:block" />
                    <Button onClick={openCreate} className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-1" /> New Coupon
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Ticket className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>No coupons yet. Create your first one.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {coupons.map((c) => {
                            const expired = new Date(c.endDate) < new Date();
                            const exhausted = c.totalUsed >= c.maxUse;
                            const live = c.isActive && !expired && !exhausted;
                            return (
                                <div key={c.id} className="bg-background rounded-2xl border border-border p-4 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Ticket className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-mono font-semibold text-foreground">{c.code}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${live ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                                                {live ? "active" : expired ? "expired" : exhausted ? "used up" : "inactive"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground mt-1">{describeDiscount(c)} · {describeScope(c)}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {c.totalUsed}/{c.maxUse} used · {toDateInput(c.startDate)} → {toDateInput(c.endDate)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => openEdit(c)}>
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => setDeleteTarget(c)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create / Edit dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Coupon" : "New Coupon"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div>
                            <Label>Coupon Code <span className="text-destructive">*</span></Label>
                            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. WELCOME10" className="mt-1 font-mono" />
                        </div>
                        <div>
                            <Label>Name / Label <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Welcome discount" className="mt-1" />
                        </div>

                        <div>
                            <Label>Applies To <span className="text-destructive">*</span></Label>
                            <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as "cart" | "course" })} className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                                <option value="cart">Entire cart</option>
                                <option value="course">A specific course</option>
                            </select>
                        </div>
                        {form.scope === "course" && (
                            <div>
                                <Label>Course <span className="text-destructive">*</span></Label>
                                <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                                    <option value="">-- Choose --</option>
                                    {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Discount Type <span className="text-destructive">*</span></Label>
                                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "fixed" | "percentage" })} className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed amount (₦)</option>
                                </select>
                            </div>
                            <div>
                                <Label>{form.discountType === "fixed" ? "Amount (₦)" : "Percent (%)"} <span className="text-destructive">*</span></Label>
                                <Input type="number" value={form.discountAmount} onChange={(e) => setForm({ ...form, discountAmount: e.target.value })} placeholder={form.discountType === "fixed" ? "5000" : "10"} className="mt-1" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-2">
                            {form.scope === "course"
                                ? "Discount is applied to the selected course's price."
                                : "Discount is applied to the cart total."}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Max Uses <span className="text-destructive">*</span></Label>
                                <Input type="number" value={form.maxUse} onChange={(e) => setForm({ ...form, maxUse: e.target.value })} placeholder="100" className="mt-1" />
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border" />
                                    <span className="text-sm text-foreground">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Date <span className="text-destructive">*</span></Label>
                                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-1" />
                            </div>
                            <div>
                                <Label>End Date <span className="text-destructive">*</span></Label>
                                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-1" />
                            </div>
                        </div>

                        <Button onClick={handleSubmit} disabled={submitting} className="w-full cursor-pointer">
                            {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : editing ? "Save Changes" : "Create Coupon"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete confirm */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Delete coupon &quot;{deleteTarget?.code}&quot;? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminCoupons;
