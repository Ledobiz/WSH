'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, Newspaper, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { fetchAllBlogPosts, deleteBlogPost } from "@/src/services/admin/blog";
import { adminBlogUrl } from "@/src/utils/url";
import { formatDate } from "@/src/utils/client_functions";

const AdminBlog = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);

    const load = async (searchTerm?: string) => {
        const result = await fetchAllBlogPosts(1, 50, searchTerm);
        setPosts(result.data || []);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await load();
            } catch (error) {
                console.log("Error loading blog posts:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            await load(search.trim() || undefined);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const result = await deleteBlogPost(deleteTarget.id);
            if (result.success) {
                toast.success(result.message || "Post deleted");
                await load(search.trim() || undefined);
            } else {
                toast.error(result.message || "Failed to delete post");
            }
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    return (
        <>
            <AdminHeader title="Blog" />

            <div className="p-4 md:p-8 max-w-5xl">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <h1 className="text-xl font-display font-bold text-foreground md:hidden">Blog</h1>
                    <div className="flex-1 hidden md:block" />
                    <Button asChild className="cursor-pointer">
                        <Link href={`${adminBlogUrl}/new`}>
                            <Plus className="h-4 w-4 mr-1" /> New Post
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <div className="flex gap-2 mb-6">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search by title or category..."
                        className="flex-1"
                    />
                    <Button variant="outline" onClick={handleSearch} className="cursor-pointer">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>No blog posts yet. Create your first one.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-background rounded-xl border border-border p-3 flex items-center gap-3">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-muted"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <Badge
                                            variant="secondary"
                                            className={post.status === "published"
                                                ? "bg-success/10 text-success"
                                                : "bg-muted text-muted-foreground"}
                                        >
                                            {post.status === "published" ? "Published" : "Draft"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{post.category}</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {post.status === "published" && post.publishedAt
                                            ? formatDate(post.publishedAt, { day: "numeric", month: "short", year: "numeric" })
                                            : `Updated ${formatDate(post.updatedAt, { day: "numeric", month: "short", year: "numeric" })}`}
                                        {" · "}{post.readTime}
                                    </p>
                                </div>
                                <Button asChild size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                                    <Link href={`${adminBlogUrl}/${post.id}/edit`}>
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </Link>
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => setDeleteTarget(post)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This can&apos;t be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminBlog;
