'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

import AdminHeader from "@/src/components/admin/AdminHeader";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import { createBlogPost, updateBlogPost, fetchBlogPostById } from "@/src/services/admin/blog";
import { blogCategoryOptions } from "@/src/data/blog";
import { adminBlogUrl } from "@/src/utils/url";

const emptyForm = {
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    status: "draft" as "draft" | "published",
};

const AdminBlogForm = ({ postId }: { postId?: string }) => {
    const router = useRouter();
    const isEdit = !!postId;

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImage, setCurrentImage] = useState<string>("");

    useEffect(() => {
        if (!postId) return;
        const init = async () => {
            setLoading(true);
            try {
                const result = await fetchBlogPostById(postId);
                if (result.success && result.post) {
                    const p = result.post;
                    setForm({
                        title: p.title,
                        excerpt: p.excerpt,
                        content: p.content,
                        category: p.category,
                        author: p.author,
                        status: p.status as "draft" | "published",
                    });
                    setCurrentImage(p.image);
                } else {
                    toast.error(result.message || "Post not found");
                    router.push(adminBlogUrl);
                }
            } catch (error) {
                console.log("Error loading post:", error);
                toast.error("Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [postId, router]);

    const handleSubmit = async () => {
        if (!form.title.trim()) return toast.error("Enter a title");
        if (!form.category) return toast.error("Choose a category");
        if (!form.excerpt.trim()) return toast.error("Enter a short excerpt");
        if (!form.content.trim()) return toast.error("Write the post content");
        if (!isEdit && !imageFile) return toast.error("Upload a featured image");

        setSubmitting(true);
        try {
            const payload = {
                title: form.title.trim(),
                excerpt: form.excerpt.trim(),
                content: form.content,
                category: form.category,
                author: form.author,
                status: form.status,
                image: imageFile,
            };

            const result = isEdit
                ? await updateBlogPost(postId!, payload as any)
                : await createBlogPost(payload as any);

            if (result.success) {
                toast.success(result.message || "Saved");
                router.push(adminBlogUrl);
            } else {
                toast.error(result.message || "Failed to save post");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const previewUrl = imageFile ? URL.createObjectURL(imageFile) : currentImage;

    return (
        <>
            <AdminHeader title={isEdit ? "Edit Post" : "New Post"} />

            <div className="p-4 md:p-8 max-w-3xl">
                <Link href={adminBlogUrl} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-5 bg-background rounded-2xl border border-border p-4 md:p-6">
                        <div>
                            <Label>Title <span className="text-destructive">*</span></Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g., How to Start a Small Chops Business"
                                className="mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label>Category <span className="text-destructive">*</span></Label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                                >
                                    <option value="">-- Choose --</option>
                                    {blogCategoryOptions.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Status <span className="text-destructive">*</span></Label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                                >
                                    <option value="draft">Draft (hidden)</option>
                                    <option value="published">Published (live)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label>Author</Label>
                            <Input
                                value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                placeholder="Women Skills Hub"
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Leave empty to use &quot;Women Skills Hub&quot;.</p>
                        </div>

                        <div>
                            <Label>Excerpt <span className="text-destructive">*</span></Label>
                            <Textarea
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                placeholder="A short summary shown on the blog listing (1–2 sentences)."
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label>Featured Image {!isEdit && <span className="text-destructive">*</span>}</Label>
                            <Input
                                type="file"
                                accept=".jpg,.png,.jpeg,.webp"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {isEdit ? "Leave empty to keep the current image. " : ""}Allowed: JPG, PNG, JPEG, webp
                            </p>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="mt-3 w-full max-w-sm aspect-[16/10] object-cover rounded-xl border border-border" />
                            ) : (
                                <div className="mt-3 w-full max-w-sm aspect-[16/10] rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 opacity-50" />
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>Content <span className="text-destructive">*</span></Label>
                            <div className="mt-1">
                                <RichTextEditor
                                    value={form.content}
                                    onChange={(value) => setForm({ ...form, content: value })}
                                    height={400}
                                    placeholder="Write your blog post here..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button asChild variant="outline" className="cursor-pointer">
                                <Link href={adminBlogUrl}>Cancel</Link>
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting} className="cursor-pointer">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEdit ? "Update Post" : "Create Post")}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminBlogForm;
