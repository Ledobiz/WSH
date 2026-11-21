'use client';

import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useAuth } from "@/src/providers/AuthProvider";
import { createReview } from "@/src/services/student/review";

const RATING_LABELS: Record<number, string> = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent!" };
const MAX_LENGTH = 2000;

interface CertificateReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    courseTitle: string;
    /** Called once the review is saved (or the server says it already exists). */
    onReviewed: () => void;
}

// Quick course review, required before a certificate can be requested.
const CertificateReviewDialog = ({ open, onOpenChange, courseId, courseTitle, onReviewed }: CertificateReviewDialogProps) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setRating(0);
        setComment("");
        setAnonymous(false);
    }, [open, courseId]);

    const submit = async () => {
        if (submitting) return;
        if (!user?.id) return toast.error("Please sign in again.");
        if (rating === 0) return toast.error("Please select a rating.");
        if (!comment.trim()) return toast.error("Please write a short review.");

        setSubmitting(true);
        try {
            const result = await createReview(user.id, courseId, {
                rating,
                comment: comment.trim(),
                anonymous,
                images: [],
            });
            // "Already reviewed" also unlocks the certificate.
            if (!result.success && !/already reviewed/i.test(result.message)) {
                toast.error(result.message);
                return;
            }
            toast.success("Thank you for your review! You can now request your certificate.");
            onReviewed();
            onOpenChange(false);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit your review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!submitting) onOpenChange(next); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Review this course</DialogTitle>
                    <DialogDescription>
                        Before requesting your certificate, please tell us about your experience with <strong>{courseTitle}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <p className="mb-2 text-sm font-medium text-foreground">Your rating</p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    disabled={submitting}
                                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                                    className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star className={`h-8 w-8 transition-colors ${star <= rating ? "fill-accent text-accent" : "text-border"}`} />
                                </button>
                            ))}
                            {rating > 0 && <span className="ml-2 text-xs text-muted-foreground">{RATING_LABELS[rating]}</span>}
                        </div>
                    </div>

                    <div>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={MAX_LENGTH}
                            disabled={submitting}
                            placeholder="What did you learn? How was the class?"
                            className="min-h-[110px] text-sm"
                        />
                        <p className="mt-1 text-right text-[11px] text-muted-foreground">{comment.length}/{MAX_LENGTH}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox id="cert-review-anon" checked={anonymous} onCheckedChange={(c) => setAnonymous(c === true)} disabled={submitting} />
                        <label htmlFor="cert-review-anon" className="cursor-pointer text-sm text-foreground">Post my review anonymously</label>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        You can edit your review or add photos later from the Reviews page. Once a review is published it can&apos;t be deleted.
                    </p>
                </div>

                <div className="mt-2 flex gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting} className="flex-1 cursor-pointer">Cancel</Button>
                    <Button onClick={submit} disabled={submitting} aria-busy={submitting} className="flex-1 cursor-pointer">
                        {submitting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting...</> : "Submit review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CertificateReviewDialog;
