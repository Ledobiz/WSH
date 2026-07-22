'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, MoreVertical, BookOpen, Eye, Download, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { getAllStudents, assignCourseToStudent } from "@/src/services/admin/student";
import { fetchActiveCourses } from "@/src/services/admin/course";
import { adminStudentsUrl } from "@/src/utils/url";

const AdminStudents = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
    const [enrollStudentId, setEnrollStudentId] = useState<string | null>(null);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [enrolling, setEnrolling] = useState(false);

    const [bulkEnrollDialogOpen, setBulkEnrollDialogOpen] = useState(false);
    const [bulkCourse, setBulkCourse] = useState("");
    const [confirmBulk, setConfirmBulk] = useState(false);

    const loadStudents = async () => {
        const result = await getAllStudents(1, 200);
        setStudents((result as any).data || []);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [, coursesResult] = await Promise.all([loadStudents(), fetchActiveCourses()]);
                setCourses(coursesResult.courses || []);
            } catch (error) {
                console.log("Error loading students:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => students.filter((s) => {
        const matchesSearch =
            (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (s.email || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && s.isActive) ||
            (statusFilter === "inactive" && !s.isActive);
        return matchesSearch && matchesStatus;
    }), [students, search, statusFilter]);

    const toggleStudent = (id: string) =>
        setSelectedStudents((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

    const toggleAll = () =>
        setSelectedStudents(selectedStudents.length === filtered.length ? [] : filtered.map((s) => s.id));

    const openEnroll = (studentId: string) => {
        setEnrollStudentId(studentId);
        setSelectedCourses([]);
        setEnrollDialogOpen(true);
    };

    const handleEnroll = async () => {
        if (!enrollStudentId || selectedCourses.length === 0) return;
        setEnrolling(true);
        try {
            const results = await Promise.all(
                selectedCourses.map((courseId) => assignCourseToStudent(enrollStudentId, courseId))
            );
            const succeeded = results.filter((r) => r.success).length;
            const failed = results.length - succeeded;
            if (succeeded) toast.success(`Enrolled in ${succeeded} course(s).`);
            if (failed) toast.error(`${failed} enrollment(s) failed or already existed.`);
            setEnrollDialogOpen(false);
            await loadStudents();
        } finally {
            setEnrolling(false);
        }
    };

    const handleConfirmBulk = async () => {
        if (!bulkCourse) return;
        setConfirmBulk(false);
        const results = await Promise.all(
            selectedStudents.map((userId) => assignCourseToStudent(userId, bulkCourse))
        );
        const succeeded = results.filter((r) => r.success).length;
        toast.success(`${succeeded} student(s) enrolled.`);
        if (results.length - succeeded > 0) toast.error(`${results.length - succeeded} already enrolled or failed.`);
        setBulkEnrollDialogOpen(false);
        setBulkCourse("");
        setSelectedStudents([]);
        await loadStudents();
    };

    const handleExportCSV = () => {
        const rows = students.filter((s) => selectedStudents.includes(s.id));
        const headers = ["Name", "Email", "Status", "Enrolled Courses", "Joined"];
        const csv = [
            headers.join(","),
            ...rows.map((s) => [
                s.name || "",
                s.email || "",
                s.isActive ? "active" : "inactive",
                (s.students?.length ?? 0).toString(),
                new Date(s.createdAt).toLocaleDateString(),
            ].map((c) => `"${c}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `students_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${rows.length} student(s) exported.`);
    };

    const activeCount = students.filter((s) => s.isActive).length;

    return (
        <>
            <AdminHeader title="Students" />

            <div className="p-4 md:p-8 pb-28">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Students</h1>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 mb-6 max-w-md">
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{students.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border text-center">
                        <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
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
                                            <Checkbox checked={selectedStudents.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                                        </th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Courses</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((student) => (
                                        <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                            <td className="p-4">
                                                <Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={() => toggleStudent(student.id)} />
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-foreground">{student.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground">{student.email}</p>
                                            </td>
                                            <td className="p-4 text-foreground">{student.students?.length ?? 0}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(student.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${student.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {student.isActive ? "active" : "inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`${adminStudentsUrl}/${student.id}/courses`}><Eye className="h-4 w-4 mr-2" /> View Courses</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEnroll(student.id)} className="cursor-pointer">
                                                            <BookOpen className="h-4 w-4 mr-2" /> Enroll in Course
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
                                    <Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={() => toggleStudent(student.id)} className="mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground truncate">{student.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 cursor-pointer"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild className="cursor-pointer">
                                                        <Link href={`${adminStudentsUrl}/${student.id}/courses`}><Eye className="h-4 w-4 mr-2" /> View Courses</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEnroll(student.id)} className="cursor-pointer">
                                                        <BookOpen className="h-4 w-4 mr-2" /> Enroll in Course
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                            <span>{student.students?.length ?? 0} courses</span>
                                            <span>•</span>
                                            <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded-full ${student.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {student.isActive ? "active" : "inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground"><p>No students found.</p></div>
                        )}
                    </div>
                )}
            </div>

            {/* Bulk action bar */}
            {selectedStudents.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4 border border-border">
                    <p className="text-sm font-medium">{selectedStudents.length} selected</p>
                    <Button onClick={() => setBulkEnrollDialogOpen(true)} size="sm" className="bg-background text-foreground hover:bg-background/90 cursor-pointer">
                        <BookOpen className="h-4 w-4 mr-2" /> Enroll
                    </Button>
                    <Button onClick={handleExportCSV} size="sm" className="bg-background text-foreground hover:bg-background/90 cursor-pointer">
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                    <Button onClick={() => setSelectedStudents([])} variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer">Clear</Button>
                </div>
            )}

            {/* Enroll dialog (single student) */}
            <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Enroll Student in Courses</DialogTitle></DialogHeader>
                    <div className="space-y-3 mt-2">
                        {courses.map((course) => (
                            <label key={course.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
                                <Checkbox
                                    checked={selectedCourses.includes(course.id)}
                                    onCheckedChange={(checked) => setSelectedCourses((prev) => checked ? [...prev, course.id] : prev.filter((id) => id !== course.id))}
                                />
                                <img src={course.thumbnail || ""} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">{course.category?.name}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <Button onClick={handleEnroll} disabled={selectedCourses.length === 0 || enrolling} className="w-full mt-4 cursor-pointer">
                        {enrolling ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Enrolling...</> : `Enroll in ${selectedCourses.length} Course(s)`}
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Bulk enroll dialog */}
            <Dialog open={bulkEnrollDialogOpen} onOpenChange={setBulkEnrollDialogOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Enroll {selectedStudents.length} Student(s)</DialogTitle></DialogHeader>
                    <div className="space-y-3 mt-2">
                        <p className="text-sm text-muted-foreground">Select a course:</p>
                        {courses.map((course) => (
                            <label key={course.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${bulkCourse === course.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}>
                                <input type="radio" name="bulk-course" value={course.id} checked={bulkCourse === course.id} onChange={(e) => setBulkCourse(e.target.value)} className="h-4 w-4" />
                                <img src={course.thumbnail || ""} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">{course.category?.name}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <Button onClick={() => bulkCourse && setConfirmBulk(true)} disabled={!bulkCourse} className="w-full mt-4 cursor-pointer">Continue</Button>
                </DialogContent>
            </Dialog>

            {/* Bulk confirm */}
            <AlertDialog open={confirmBulk} onOpenChange={setConfirmBulk}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Enrollment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enroll {selectedStudents.length} student(s) in <strong>{courses.find((c) => c.id === bulkCourse)?.title}</strong>? They will get immediate access.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmBulk}>Enroll Students</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminStudents;
