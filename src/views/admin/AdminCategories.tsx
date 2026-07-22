'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Check, X, Loader2, Tag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { createCategory, editCategory, deleteCategory, fetchAllCategories } from "@/src/services/admin/category";

const AdminCategories = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [newName, setNewName] = useState("");
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const load = async () => {
        const result = await fetchAllCategories();
        setCategories(result.categories || []);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await load();
            } catch (error) {
                console.log("Error loading categories:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return toast.error("Enter a category name");
        setAdding(true);
        try {
            const result = await createCategory(newName.trim());
            if (result.success) {
                toast.success(result.message || "Category created");
                setNewName("");
                await load();
            } else {
                toast.error(result.errors || "Failed to create category");
            }
        } finally {
            setAdding(false);
        }
    };

    const handleSaveEdit = async (id: string) => {
        if (!editName.trim()) return;
        const result = await editCategory(id, editName.trim());
        if (result.success) {
            toast.success(result.message || "Category updated");
            setEditingId(null);
            await load();
        } else {
            toast.error(result.errors || "Failed to update category");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const result = await deleteCategory(deleteTarget.id);
        if (result.success) {
            toast.success(result.message || "Category deleted");
            await load();
        } else {
            toast.error(result.message || "Failed to delete category");
        }
        setDeleteTarget(null);
    };

    return (
        <>
            <AdminHeader title="Categories" />

            <div className="p-4 md:p-8 max-w-3xl">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Categories</h1>

                {/* Add form */}
                <div className="bg-background rounded-2xl border border-border p-4 mb-6">
                    <div className="flex gap-2">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            placeholder="New category name..."
                            className="flex-1"
                        />
                        <Button onClick={handleAdd} disabled={adding} className="cursor-pointer">
                            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Add</>}
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Tag className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>No categories yet. Add your first one above.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-background rounded-xl border border-border p-3 flex items-center gap-3">
                                {editingId === cat.id ? (
                                    <>
                                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" autoFocus />
                                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => handleSaveEdit(cat.id)}>
                                            <Check className="h-4 w-4 text-success" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => setEditingId(null)}>
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Tag className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{cat.slug}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => setDeleteTarget(cat)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
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

export default AdminCategories;
