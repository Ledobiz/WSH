'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { Search, Star, Eye, EyeOff, MoreVertical, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { courseReviews, replyToCourseReview, approveReviewWithoutReply, markAsReviewedWithoutApproval } from "@/src/services/admin/student";

const statusOf = (r: any): "pending" | "published" | "hidden" => {
    if (!r.isReviewed) return "pending";
    return r.isApproved ? "published" : "hidden";
};

const statusBadge = (status: string) =>
    status === "published" ? "bg-green-100 text-green-700" :
        status === "pending" ? "bg-yellow-100 text-yellow-700" :
            "bg-muted text-muted-foreground";

const AdminReviews = () => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const load = async () => {
        const result = await courseReviews(1, 100);
        setReviews((result as any).data || []);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await load();
            } catch (error) {
                console.log("Error loading reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const reviewerName = (r: any) => r.isAnonymous ? "Anonymous" : (r.user?.name || "Student");

    const filtered = useMemo(() => reviews.filter((r) => {
        const matchesSearch =
            reviewerName(r).toLowerCase().includes(search.toLowerCase()) ||
            (r.course?.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (r.comment || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || statusOf(r) === statusFilter;
        return matchesSearch && matchesStatus;
    }), [reviews, search, statusFilter]);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "0";
    const pendingCount = reviews.filter((r) => !r.isReviewed).length;

    const openReply = (r: any) => {
        setReplyReviewId(r.id);
        setReplyText(r.reply || "");
        setReplyDialogOpen(true);
    };

    const handleReply = async () => {
        if (!replyReviewId || !replyText.trim()) return toast.error("Please enter a reply message.");
        setSubmitting(true);
        try {
            const result = await replyToCourseReview(replyReviewId, replyText.trim());
            if (result.success) {
                toast.success(result.message);
                setReplyDialogOpen(false);
                setReplyText("");
                await load();
            } else {
                toast.error(result.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = async (id: string) => {
        const result = await approveReviewWithoutReply(id);
        if (result.success) { toast.success(result.message); await load(); }
        else toast.error(result.message);
    };

    const handleIgnore = async (id: string) => {
        const result = await markAsReviewedWithoutApproval(id);
        if (result.success) { toast.success(result.message); await load(); }
        else toast.error(result.message);
    };

    return (
        <>
            <AdminHeader title="Reviews" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Reviews</h1>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg">
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground"><p>No reviews found.</p></div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((review) => {
                            const status = statusOf(review);
                            return (
                                <div key={review.id} className="bg-background rounded-2xl border border-border p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-medium text-foreground text-sm">{reviewerName(review)}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(status)}`}>{status}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">{review.course?.title}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 cursor-pointer"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openReply(review)} className="cursor-pointer">
                                                    <MessageSquare className="h-4 w-4 mr-2" /> Reply to Review
                                                </DropdownMenuItem>
                                                {status !== "published" && (
                                                    <DropdownMenuItem onClick={() => handleApprove(review.id)} className="cursor-pointer">
                                                        <Eye className="h-4 w-4 mr-2" /> Approve &amp; Publish
                                                    </DropdownMenuItem>
                                                )}
                                                {status !== "hidden" && (
                                                    <DropdownMenuItem onClick={() => handleIgnore(review.id)} className="cursor-pointer">
                                                        <EyeOff className="h-4 w-4 mr-2" /> Ignore / Hide
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-center gap-0.5 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-border"}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                                    {review.images?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {review.images.map((img: string, i: number) => (
                                                <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                                            ))}
                                        </div>
                                    )}
                                    {review.reply && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                                <p className="text-xs font-medium text-primary">Admin Reply</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.reply}</p>
                                            {review.replyDate && (
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(review.replyDate).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reply dialog */}
            <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to Review</DialogTitle>
                        <DialogDescription>Replying approves and publishes the review on the website.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                        <Label htmlFor="reply">Your Reply</Label>
                        <Textarea id="reply" placeholder="Write your response to this review..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={5} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleReply} disabled={submitting}>
                            {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Sending...</> : "Send Reply"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminReviews;
