'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, EyeOff, Users, Layers, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import { fetchAllCourses, createCourse, updateCourse, deleteCourse } from "@/src/services/admin/course";
import { fetchAllCategories } from "@/src/services/admin/category";
import { adminCoursesUrl } from "@/src/utils/url";

interface CourseFormState {
    title: string;
    categoryId: string;
    description: string;
    originalFee: string;
    discountedFee: string;
    previewVideo: string;
    isFree: boolean;
    isActive: boolean;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    whoIsCourseFor: string;
    telegramLink: string;
}

const emptyForm: CourseFormState = {
    title: "", categoryId: "", description: "", originalFee: "", discountedFee: "",
    previewVideo: "", isFree: false, isActive: true, seoTitle: "", seoDescription: "",
    seoKeywords: "", whoIsCourseFor: "", telegramLink: "",
};

const totalLessons = (course: any) =>
    (course.courseModules ?? []).reduce((t: number, m: any) => t + (m.moduleComponents?.length || 0), 0);

const AdminCourses = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [form, setForm] = useState<CourseFormState>(emptyForm);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const loadCourses = async () => {
        const result = await fetchAllCourses(1, 100);
        setCourses((result as any).data || []);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [, catResult] = await Promise.all([loadCourses(), fetchAllCategories()]);
                setCategories(catResult.categories || []);
            } catch (error) {
                console.log("Error loading courses:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => courses.filter((c) => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "published" && c.isActive) ||
            (statusFilter === "draft" && !c.isActive);
        return matchesSearch && matchesStatus;
    }), [courses, search, statusFilter]);

    const openCreate = () => {
        setEditingCourse(null);
        setForm(emptyForm);
        setThumbnailFile(null);
        setBannerFile(null);
        setDialogOpen(true);
    };

    const openEdit = (course: any) => {
        setEditingCourse(course);
        setForm({
            title: course.title || "",
            categoryId: course.categoryId || "",
            description: course.description || "",
            originalFee: String(course.originalFee ?? ""),
            discountedFee: String(course.discountedFee ?? ""),
            previewVideo: course.previewVideo || "",
            isFree: !!course.isFree,
            isActive: !!course.isActive,
            seoTitle: course.seoTitle || "",
            seoDescription: course.seoDescription || "",
            seoKeywords: course.seoKeywords || "",
            whoIsCourseFor: course.whoIsCourseFor || "",
            telegramLink: course.telegramLink || "",
        });
        setThumbnailFile(null);
        setBannerFile(null);
        setDialogOpen(true);
    };

    const buildPayload = () => ({
        title: form.title.trim(),
        categoryId: form.categoryId,
        description: form.description,
        originalFee: Number(form.originalFee) || 0,
        discountedFee: Number(form.discountedFee) || 0,
        thumbnail: thumbnailFile,
        banner: bannerFile,
        previewVideo: form.previewVideo || null,
        isFree: form.isFree,
        isActive: form.isActive,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
        whoIsCourseFor: form.whoIsCourseFor || null,
        telegramLink: form.telegramLink || null,
    });

    const handleSubmit = async () => {
        if (!form.title.trim()) return toast.error("Course title is required");
        if (!form.categoryId) return toast.error("Please choose a category");
        if (!editingCourse && (!thumbnailFile || !bannerFile)) {
            return toast.error("Thumbnail and banner images are required");
        }

        setSubmitting(true);
        try {
            const payload = buildPayload();
            const result = editingCourse
                ? await updateCourse(editingCourse.id, payload as any)
                : await createCourse(payload as any);

            if (result.success) {
                toast.success(result.message);
                setDialogOpen(false);
                await loadCourses();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error saving course:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleTogglePublish = async (course: any) => {
        const payload = {
            title: course.title,
            categoryId: course.categoryId,
            description: course.description || "",
            originalFee: course.originalFee,
            discountedFee: course.discountedFee,
            thumbnail: null,
            banner: null,
            previewVideo: course.previewVideo || null,
            isFree: !!course.isFree,
            isActive: !course.isActive,
            seoTitle: course.seoTitle || "",
            seoDescription: course.seoDescription || "",
            seoKeywords: course.seoKeywords || "",
            whoIsCourseFor: course.whoIsCourseFor || null,
            telegramLink: course.telegramLink || null,
        };
        const result = await updateCourse(course.id, payload as any);
        if (result.success) {
            toast.success(course.isActive ? "Course unpublished" : "Course published");
            await loadCourses();
        } else {
            toast.error(result.message);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const result = await deleteCourse(deleteTarget.id);
        if (result.success) {
            toast.success("Course deleted");
            await loadCourses();
        } else {
            toast.error(result.message);
        }
        setDeleteTarget(null);
    };

    const publishedCount = courses.filter((c) => c.isActive).length;

    return (
        <>
            <AdminHeader title="Courses" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Courses</h1>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                        <Button onClick={openCreate} className="cursor-pointer">
                            <Plus className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Add Course</span><span className="sm:hidden">Add</span>
                        </Button>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                    <div className="bg-background rounded-2xl p-3 sm:p-4 border border-border text-center">
                        <p className="text-xl sm:text-2xl font-bold text-foreground">{courses.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="bg-background rounded-2xl p-3 sm:p-4 border border-border text-center">
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{publishedCount}</p>
                        <p className="text-xs text-muted-foreground">Published</p>
                    </div>
                    <div className="bg-background rounded-2xl p-3 sm:p-4 border border-border text-center">
                        <p className="text-xl sm:text-2xl font-bold text-muted-foreground">{courses.length - publishedCount}</p>
                        <p className="text-xs text-muted-foreground">Drafts</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No courses found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((course) => (
                            <div key={course.id} className="bg-background rounded-2xl border border-border p-3 sm:p-4 flex gap-3 sm:gap-4">
                                <img src={course.thumbnail || ""} alt={course.title} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0 bg-muted" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-foreground text-sm md:text-base truncate">{course.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">{course.category?.name}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 cursor-pointer">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(course)} className="cursor-pointer">
                                                    <Edit className="h-4 w-4 mr-2" /> Edit Course
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <Link href={`${adminCoursesUrl}/${course.id}/content`}>
                                                        <Layers className="h-4 w-4 mr-2" /> Manage Content
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <Link href={`${adminCoursesUrl}/${course.id}/students`}>
                                                        <Users className="h-4 w-4 mr-2" /> View Students
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePublish(course)} className="cursor-pointer">
                                                    {course.isActive ? <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</> : <><Eye className="h-4 w-4 mr-2" /> Publish</>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => setDeleteTarget(course)}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrolledCount ?? 0}</span>
                                        <span>{course.isFree ? "Free" : `₦${course.discountedFee.toLocaleString()}`}</span>
                                        <span className="hidden sm:inline">{(course.courseModules?.length ?? 0)} modules • {totalLessons(course)} lessons</span>
                                        <span className={`px-2 py-0.5 rounded-full ${course.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {course.isActive ? "published" : "draft"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle>{editingCourse ? "Edit Course" : "Create Course"}</DialogTitle>
                        <p className="text-sm text-muted-foreground">Fill basic information regarding your course.</p>
                    </DialogHeader>
                    <div className="space-y-5 mt-2">
                        <div>
                            <Label>Course Title <span className="text-destructive">*</span></Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter course title" className="mt-1" maxLength={191} />
                            <p className="text-xs text-muted-foreground mt-1">Maximum of 191 character course title.</p>
                        </div>
                        <div>
                            <Label>Telegram Link (Optional)</Label>
                            <Input value={form.telegramLink} onChange={(e) => setForm({ ...form, telegramLink: e.target.value })} placeholder="Enter Telegram link if available" className="mt-1" />
                        </div>
                        <div>
                            <Label>Course category <span className="text-destructive">*</span></Label>
                            <select
                                value={form.categoryId}
                                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                            >
                                <option value="">-- Choose --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <input type="checkbox" id="freeCourse" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} className="rounded border-border" />
                            <Label htmlFor="freeCourse">Is this a free course?</Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label>Original Fee (₦) <span className="text-destructive">*</span></Label>
                                <Input type="number" value={form.originalFee} onChange={(e) => setForm({ ...form, originalFee: e.target.value })} placeholder="0" className="mt-1" />
                            </div>
                            <div>
                                <Label>Discounted Fee (₦) <span className="text-destructive">*</span></Label>
                                <Input type="number" value={form.discountedFee} onChange={(e) => setForm({ ...form, discountedFee: e.target.value })} placeholder="0" className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <Label>Course Thumbnail {!editingCourse && <span className="text-destructive">*</span>}</Label>
                            <Input type="file" accept=".jpg,.png,.jpeg,.webp" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                                {editingCourse ? "Leave empty to keep the current thumbnail. " : ""}Allowed: JPG, PNG, JPEG, webp
                            </p>
                        </div>
                        <div>
                            <Label>Course Banner {!editingCourse && <span className="text-destructive">*</span>}</Label>
                            <Input type="file" accept=".jpg,.png,.jpeg,.webp" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                                {editingCourse ? "Leave empty to keep the current banner. " : ""}Allowed: JPG, PNG, JPEG, webp
                            </p>
                        </div>
                        <div>
                            <Label>Preview Video URL</Label>
                            <Input value={form.previewVideo} onChange={(e) => setForm({ ...form, previewVideo: e.target.value })} placeholder="Enter course preview video URL" className="mt-1" />
                        </div>
                        <div>
                            <Label>SEO Meta Title <span className="text-destructive">*</span></Label>
                            <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="e.g., Advanced Baking" className="mt-1" maxLength={65} />
                            <p className="text-xs text-muted-foreground mt-1">Use max 65 characters only.</p>
                        </div>
                        <div>
                            <Label>SEO Description <span className="text-destructive">*</span></Label>
                            <Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder="e.g., Meta Description" className="mt-1" maxLength={160} />
                            <p className="text-xs text-muted-foreground mt-1">Use max 150 characters only.</p>
                        </div>
                        <div>
                            <Label>SEO Keywords <span className="text-destructive">*</span></Label>
                            <Input value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} placeholder="e.g., baking, pastry, cake" className="mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">Use keywords with commas.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <input type="checkbox" id="isPublic" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-border mt-1" />
                            <div>
                                <Label htmlFor="isPublic">Is available to the public?</Label>
                                <p className="text-xs text-muted-foreground">Check if the course should appear on the website.</p>
                            </div>
                        </div>
                        <div>
                            <Label>Course Description <span className="text-destructive">*</span></Label>
                            <div className="mt-1">
                                <RichTextEditor value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Describe the course..." />
                            </div>
                        </div>
                        <div>
                            <Label>Who is the course for</Label>
                            <div className="mt-1">
                                <RichTextEditor value={form.whoIsCourseFor} onChange={(v) => setForm({ ...form, whoIsCourseFor: v })} placeholder="Describe the ideal student..." />
                            </div>
                        </div>
                        <Button onClick={handleSubmit} disabled={submitting} className="w-full cursor-pointer">
                            {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : editingCourse ? "Save Changes" : "Submit"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? Courses with enrolled students cannot be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminCourses;
