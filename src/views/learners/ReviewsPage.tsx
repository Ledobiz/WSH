'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ImagePlus, X, Camera, Edit3, Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Badge } from "@/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { toast } from "sonner";

import DashboardHeader from "@/src/components/learners/DashboardHeader";
import EmptyState from "@/src/components/website/EmptyState";
import { ReviewListSkeleton } from "@/src/components/learners/LMSSkeletons";
import { useAuth } from "@/src/providers/AuthProvider";
import { createReview, deleteReview, getReviewData, updateReview } from "@/src/services/student/review";
import { coursesUrl } from "@/src/utils/url";

interface EnrolledCourse {
    studentId: string;
    courseId: string;
    title: string;
    thumbnail: string;
    completed: boolean;
}

interface Review {
    id: string;
    courseId: string;
    rating: number;
    comment: string;
    images: string[];
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
    course?: { id: string; title: string; thumbnail: string } | null;
}

// Local image entry: existing images carry only a url; new uploads carry a File.
interface FormImage {
    url: string;
    file?: File;
}

const RATING_LABELS: Record<number, string> = {
    1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent!",
};

const StarRating = ({
    rating,
    onRate,
    size = "md",
}: {
    rating: number;
    onRate?: (r: number) => void;
    size?: "sm" | "md" | "lg";
}) => {
    const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onRate?.(star)}
                    disabled={!onRate}
                    className={`transition-transform ${onRate ? "hover:scale-110 active:scale-95 cursor-pointer" : "cursor-default"}`}
                >
                    <Star
                        className={`${sizeMap[size]} transition-colors ${
                            star <= rating ? "fill-accent text-accent" : "text-border"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

const ReviewsPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [showForm, setShowForm] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formRating, setFormRating] = useState(0);
    const [formText, setFormText] = useState("");
    const [formAnonymous, setFormAnonymous] = useState(false);
    const [formImages, setFormImages] = useState<FormImage[]>([]);
    const [selectedCourseForNew, setSelectedCourseForNew] = useState<string>("");
    const [showNewReviewPicker, setShowNewReviewPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async (userId: string) => {
        const result = await getReviewData(userId);
        if (result.success) {
            setEnrolledCourses(result.enrolledCourses as EnrolledCourse[]);
            setReviews((result.reviews as unknown as Review[]) || []);
        }
    };

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const load = async () => {
            setLoading(true);
            try {
                await fetchData(userId);
            } catch (error) {
                console.log("Error loading reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?.id]);

    const getCourseTitle = (courseId: string) =>
        enrolledCourses.find((c) => c.courseId === courseId)?.title ||
        reviews.find((r) => r.courseId === courseId)?.course?.title ||
        "Unknown Course";

    const getCourseImage = (courseId: string) =>
        enrolledCourses.find((c) => c.courseId === courseId)?.thumbnail ||
        reviews.find((r) => r.courseId === courseId)?.course?.thumbnail ||
        "";

    const reviewedCourseIds = reviews.map((r) => r.courseId);
    const unreviewedCourses = enrolledCourses.filter((c) => !reviewedCourseIds.includes(c.courseId));
    const eligibleCourses = enrolledCourses.filter((c) => c.completed && !reviewedCourseIds.includes(c.courseId));

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach((file) => {
            setFormImages((prev) => [...prev, { url: URL.createObjectURL(file), file }]);
        });
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setFormImages((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormRating(0);
        setFormText("");
        setFormAnonymous(false);
        setFormImages([]);
        setShowForm(null);
        setEditingId(null);
        setShowNewReviewPicker(false);
        setSelectedCourseForNew("");
    };

    const handleSubmit = async (courseId: string) => {
        if (formRating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!formText.trim()) {
            toast.error("Please write a review");
            return;
        }
        const userId = user?.id;
        if (!userId) return;

        setSubmitting(true);
        try {
            let result;
            if (editingId) {
                result = await updateReview(editingId, {
                    rating: formRating,
                    comment: formText.trim(),
                    anonymous: formAnonymous,
                    existingImages: formImages.filter((i) => !i.file).map((i) => i.url),
                    newImages: formImages.filter((i) => i.file).map((i) => i.file!),
                });
            } else {
                result = await createReview(userId, courseId, {
                    rating: formRating,
                    comment: formText.trim(),
                    anonymous: formAnonymous,
                    images: formImages.filter((i) => i.file).map((i) => i.file!),
                });
            }

            if (result.success) {
                toast.success(result.message);
                await fetchData(userId);
                resetForm();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error submitting review:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (review: Review) => {
        setEditingId(review.id);
        setShowForm(review.courseId);
        setFormRating(review.rating);
        setFormText(review.comment);
        setFormAnonymous(review.isAnonymous);
        setFormImages(review.images.map((url) => ({ url })));
    };

    const addImagesToReview = (review: Review) => {
        startEdit(review);
        setTimeout(() => fileInputRef.current?.click(), 100);
    };

    const handleDelete = async (reviewId: string) => {
        const userId = user?.id;
        if (!userId) return;

        const previous = reviews;
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));

        const result = await deleteReview(reviewId);
        if (result.success) {
            toast.success(result.message);
            await fetchData(userId);
        } else {
            setReviews(previous);
            toast.error(result.message);
        }
    };

    const handleNewReviewFromPicker = () => {
        if (!selectedCourseForNew) {
            toast.error("Please select a course");
            return;
        }
        setShowNewReviewPicker(false);
        resetForm();
        setShowForm(selectedCourseForNew);
    };

    return (
        <>
            <DashboardHeader title="My Reviews" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">My Reviews</h1>

                {loading ? (
                    <ReviewListSkeleton />
                ) : (
                    <div className="space-y-6">
                        {/* Write a review button / course picker */}
                        {unreviewedCourses.length > 0 && !showForm && (
                            <div>
                                {!showNewReviewPicker ? (
                                    <Button
                                        variant="hero"
                                        onClick={() => setShowNewReviewPicker(true)}
                                        className="gap-2 text-sm cursor-pointer"
                                    >
                                        <Plus className="h-4 w-4" /> Write a Review
                                    </Button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-background rounded-2xl border border-border p-4"
                                    >
                                        <p className="text-sm font-medium text-foreground mb-3">Select a course to review</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Select value={selectedCourseForNew} onValueChange={setSelectedCourseForNew}>
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Choose a course..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {unreviewedCourses.map((c) => (
                                                        <SelectItem key={c.courseId} value={c.courseId}>
                                                            {c.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex gap-2">
                                                <Button variant="hero" size="sm" onClick={handleNewReviewFromPicker}>
                                                    Continue
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={resetForm}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Completed courses awaiting review */}
                        {eligibleCourses.length > 0 && !showForm && (
                            <div>
                                <h2 className="text-base font-display font-semibold text-foreground mb-3">
                                    Courses Awaiting Your Review
                                </h2>
                                <div className="space-y-3">
                                    {eligibleCourses.map((course) => (
                                        <div
                                            key={course.courseId}
                                            className="bg-background rounded-2xl border border-border p-4 flex items-center gap-3"
                                        >
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-12 h-12 rounded-xl object-cover shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm text-foreground truncate">{course.title}</h3>
                                                <p className="text-xs text-muted-foreground">Completed</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="hero"
                                                onClick={() => {
                                                    resetForm();
                                                    setShowForm(course.courseId);
                                                }}
                                                className="shrink-0 text-xs cursor-pointer"
                                            >
                                                <Star className="h-3.5 w-3.5 mr-1" /> Review
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Review form */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-background rounded-2xl border-2 border-primary/20 p-4 md:p-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-display font-bold text-foreground text-base">
                                            {editingId ? "Edit Review" : "Write a Review"}
                                        </h3>
                                        <button onClick={resetForm} className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
                                        <img
                                            src={getCourseImage(showForm)}
                                            alt=""
                                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                                        />
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {getCourseTitle(showForm)}
                                        </p>
                                    </div>

                                    {/* Star rating */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-foreground mb-2">
                                            How would you rate this course? <span className="text-destructive">*</span>
                                        </p>
                                        <StarRating rating={formRating} onRate={setFormRating} size="lg" />
                                        {formRating > 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">{RATING_LABELS[formRating]}</p>
                                        )}
                                    </div>

                                    {/* Review text */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-foreground mb-2">
                                            Tell us about your experience <span className="text-destructive">*</span>
                                        </p>
                                        <Textarea
                                            value={formText}
                                            onChange={(e) => setFormText(e.target.value)}
                                            placeholder="What did you like? What could be improved? Share your experience..."
                                            className="min-h-[100px] text-sm"
                                        />
                                    </div>

                                    {/* Image upload */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-foreground mb-2">
                                            Add photos or screenshots <span className="text-muted-foreground font-normal">(optional)</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {formImages.map((img, i) => (
                                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-0 right-0 p-0.5 bg-foreground/70 rounded-bl-lg cursor-pointer"
                                                    >
                                                        <X className="h-3 w-3 text-background" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                                            >
                                                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                                            </button>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Anonymous checkbox */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <Checkbox
                                            id="anonymous"
                                            checked={formAnonymous}
                                            onCheckedChange={(checked) => setFormAnonymous(checked === true)}
                                        />
                                        <label htmlFor="anonymous" className="text-sm text-foreground cursor-pointer">
                                            Submit review anonymously
                                        </label>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="hero"
                                            onClick={() => handleSubmit(showForm)}
                                            disabled={submitting}
                                            className="flex-1 sm:flex-none cursor-pointer"
                                        >
                                            {submitting ? "Saving..." : editingId ? "Update Review" : "Submit Review"}
                                        </Button>
                                        <Button variant="outline" onClick={resetForm} disabled={submitting}>Cancel</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Existing reviews */}
                        {reviews.length > 0 && (
                            <div>
                                <h2 className="text-base font-display font-semibold text-foreground mb-3">Your Reviews</h2>
                                <div className="space-y-3">
                                    {reviews.map((review) => (
                                        <motion.div
                                            key={review.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-background rounded-2xl border border-border p-4"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <img
                                                    src={getCourseImage(review.courseId)}
                                                    alt=""
                                                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm text-foreground truncate">
                                                        {getCourseTitle(review.courseId)}
                                                    </h3>
                                                    <StarRating rating={review.rating} size="sm" />
                                                </div>
                                                {review.isAnonymous && (
                                                    <Badge variant="secondary" className="text-[10px] shrink-0">Anonymous</Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">{review.comment}</p>

                                            {review.images.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {review.images.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img}
                                                            alt=""
                                                            className="w-16 h-16 rounded-lg object-cover border border-border"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                                                <button
                                                    onClick={() => startEdit(review)}
                                                    className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                                                >
                                                    <Edit3 className="h-3 w-3" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => addImagesToReview(review)}
                                                    className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                                                >
                                                    <Camera className="h-3 w-3" /> Add Photos
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="flex items-center gap-1 text-xs text-destructive hover:underline cursor-pointer"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                                <span className="text-[10px] text-muted-foreground ml-auto">
                                                    {new Date(review.updatedAt).toLocaleDateString("en-US", {
                                                        month: "short", day: "numeric", year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {reviews.length === 0 && unreviewedCourses.length === 0 && (
                            <EmptyState
                                icon={MessageSquare}
                                title="No Reviews Yet"
                                description="Enroll in a course to leave a review. Your feedback helps other students!"
                                actionLabel="Browse Courses"
                                actionLink={coursesUrl}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ReviewsPage;
