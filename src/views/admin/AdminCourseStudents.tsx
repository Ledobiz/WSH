'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, MoreVertical, Eye, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { getCourseStudents, bulkRemoveStudentsFromCourse, bulkUpdateStudentLectures } from "@/src/services/admin/student";
import { adminCoursesUrl, adminStudentsUrl } from "@/src/utils/url";
import { useSmartBack } from "@/src/hooks/useSmartBack";

const AdminCourseStudents = ({ courseId }: { courseId: string }) => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [courseTitle, setCourseTitle] = useState("");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const goBack = useSmartBack(adminCoursesUrl);

    // "update" = push newly-available lecture content; "remove" = unenrol
    const [confirmAction, setConfirmAction] = useState<null | "update" | "remove">(null);

    const load = async () => {
        const result: any = await getCourseStudents(courseId, 1, 200);
        if (result.success) {
            const data = (result.data as any[]) || [];
            setStudents(data);
            if (data.length > 0 && data[0].course) setCourseTitle(data[0].course.title);
        } else {
            toast.error(result.message || "Failed to load students");
            setStudents([]);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await load();
            } catch (error) {
                console.log("Error loading course students:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [courseId]);

    const filtered = useMemo(() => students.filter((s) => {
        const q = search.toLowerCase();
        return (s.user?.name || "").toLowerCase().includes(q) || (s.user?.email || "").toLowerCase().includes(q);
    }), [students, search]);

    const toggle = (id: string) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const toggleAll = () =>
        setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id));

    const isComplete = (s: any) => s.totalLectures > 0 && s.lecturesCompleted === s.totalLectures;

    const runBulkUpdate = async () => {
        setProcessing(true);
        try {
            const result = await bulkUpdateStudentLectures(courseId, selected);
            if (result.success) {
                toast.success(result.message);
                setSelected([]);
                await load();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error updating lectures:", error);
            toast.error("Failed to update lectures. Please try again.");
        } finally {
            setProcessing(false);
            setConfirmAction(null);
        }
    };

    const runBulkRemove = async () => {
        setProcessing(true);
        try {
            const result = await bulkRemoveStudentsFromCourse(courseId, selected);
            if (result.success) {
                toast.success(result.message);
                setSelected([]);
                await load();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error removing students:", error);
            toast.error("Failed to remove students. Please try again.");
        } finally {
            setProcessing(false);
            setConfirmAction(null);
        }
    };

    const completedCount = students.filter(isComplete).length;

    return (
        <>
            <AdminHeader title="Course Students" />

            <div className="p-4 md:p-8 pb-28">
                <button onClick={goBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer">
                    <ChevronLeft className="h-4 w-4" /> Back
                </button>

                <div className="mb-6">
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">{courseTitle || "Course Students"}</h1>
                    <p className="text-xs text-muted-foreground">Enrolled students · push new lecture content or unenrol in bulk</p>
                </div>

                {/* Toolbar */}
                <div className="relative flex-1 mb-6 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 mb-6 max-w-md">
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{students.length}</p>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
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
                                        <th className="text-left p-4 w-12">
                                            <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                                        </th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Lectures</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Enrolled</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((student) => (
                                        <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                            <td className="p-4">
                                                <Checkbox checked={selected.includes(student.id)} onCheckedChange={() => toggle(student.id)} />
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-foreground">{student.user?.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground">{student.user?.email}</p>
                                            </td>
                                            <td className="p-4 text-foreground">{student.lecturesCompleted ?? 0} / {student.totalLectures ?? 0}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(student.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${isComplete(student) ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {isComplete(student) ? "Completed" : "In Progress"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`${adminStudentsUrl}/${student.userId}/courses`}><Eye className="h-4 w-4 mr-2" /> View Student Courses</Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-border">
                            {filtered.map((student) => (
                                <div key={student.id} className="p-4 flex items-start gap-3">
                                    <Checkbox checked={selected.includes(student.id)} onCheckedChange={() => toggle(student.id)} className="mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground truncate">{student.user?.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{student.user?.email}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 cursor-pointer"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild className="cursor-pointer">
                                                        <Link href={`${adminStudentsUrl}/${student.userId}/courses`}><Eye className="h-4 w-4 mr-2" /> View Student Courses</Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                            <span>{student.lecturesCompleted ?? 0} / {student.totalLectures ?? 0} lectures</span>
                                            <span>•</span>
                                            <span>Enrolled {new Date(student.createdAt).toLocaleDateString()}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded-full ${isComplete(student) ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {isComplete(student) ? "Completed" : "In Progress"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground"><p>No students enrolled in this course yet.</p></div>
                        )}
                    </div>
                )}
            </div>

            {/* Bulk action bar */}
            {selected.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4 border border-border">
                    <p className="text-sm font-medium">{selected.length} selected</p>
                    <Button onClick={() => setConfirmAction("update")} size="sm" className="bg-background text-foreground hover:bg-background/90 cursor-pointer">
                        <RefreshCw className="h-4 w-4 mr-2" /> Update Lectures
                    </Button>
                    <Button onClick={() => setConfirmAction("remove")} size="sm" className="bg-background text-destructive hover:bg-background/90 cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </Button>
                    <Button onClick={() => setSelected([])} variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer">Clear</Button>
                </div>
            )}

            {/* Bulk update confirmation */}
            <AlertDialog open={confirmAction === "update"} onOpenChange={(open) => !open && !processing && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Lecture Content?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Push any newly-added modules and lectures to the {selected.length} selected student(s). They get the updated content immediately; their progress is preserved.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.preventDefault(); runBulkUpdate(); }} disabled={processing}>
                            {processing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</> : "Update Lectures"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk remove confirmation */}
            <AlertDialog open={confirmAction === "remove"} onOpenChange={(open) => !open && !processing && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Students?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove the {selected.length} selected student(s) from this course? They will lose access to the course and their progress.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.preventDefault(); runBulkRemove(); }} disabled={processing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {processing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Removing...</> : "Remove Students"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminCourseStudents;
