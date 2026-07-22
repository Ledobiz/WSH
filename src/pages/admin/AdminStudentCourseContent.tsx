'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { ChevronLeft, Video, FileText, ChevronDown, ChevronUp, CheckCircle2, Circle, Loader2, Info } from "lucide-react";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { getStudentCourseContent } from "@/src/services/admin/student";
import { adminStudentsUrl } from "@/src/utils/url";
import { useSmartBack } from "@/src/hooks/useSmartBack";

const AdminStudentCourseContent = ({ userId, courseId }: { userId: string; courseId: string }) => {
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const goBack = useSmartBack(`${adminStudentsUrl}/${userId}/courses`);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const result = await getStudentCourseContent(userId, courseId);
                if (result.success && result.student) {
                    setStudent(result.student);
                    setExpanded(new Set((result.student.studentModules || []).map((m: any) => m.id)));
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.log("Error loading student course content:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [userId, courseId]);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const isCompleted = (comp: any) =>
        (comp.studentLectureRecords || []).some((r: any) => r.status === "completed");

    const modules: any[] = student?.studentModules || [];
    const totalLectures = modules.reduce((s, m) => s + (m.studentModuleComponents?.length || 0), 0);
    const completedLectures = modules.reduce(
        (s, m) => s + (m.studentModuleComponents || []).filter(isCompleted).length,
        0
    );

    return (
        <>
            <AdminHeader title="Student Course Content" />

            <div className="p-4 md:p-8">
                <button
                    onClick={goBack}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer"
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </button>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : notFound ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>This student isn&apos;t enrolled in this course, or the content couldn&apos;t be loaded.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-4">
                            <h1 className="text-lg sm:text-xl font-bold text-foreground">{student.course?.title}</h1>
                            <p className="text-xs text-muted-foreground">
                                {student.user?.name || student.user?.email} · {modules.length} modules • {totalLectures} lectures • {completedLectures} completed
                            </p>
                        </div>

                        {/* Context note */}
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border mb-6 text-xs text-muted-foreground">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>
                                This is the student&apos;s <strong className="text-foreground">own copy</strong> of the content — exactly what they see in their lectures. It can lag behind the master course until you use <strong className="text-foreground">Refresh Course Content</strong> on the Student Courses page.
                            </span>
                        </div>

                        {modules.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>This student has no lecture content yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {modules.map((mod, modIdx) => {
                                    const comps: any[] = mod.studentModuleComponents || [];
                                    const modDone = comps.filter(isCompleted).length;
                                    return (
                                        <div key={mod.id} className="bg-background border border-border rounded-2xl overflow-hidden">
                                            <div className="flex items-center gap-2 p-3 sm:p-4 bg-muted/50 cursor-pointer" onClick={() => toggle(mod.id)}>
                                                <span className="text-xs font-medium text-muted-foreground shrink-0">M{modIdx + 1}</span>
                                                <h3 className="flex-1 font-medium text-foreground text-sm sm:text-base truncate">{mod.name}</h3>
                                                <span className="text-xs text-muted-foreground shrink-0">{modDone}/{comps.length} done</span>
                                                {expanded.has(mod.id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                            </div>

                                            {expanded.has(mod.id) && (
                                                <div className="p-2 sm:p-3 space-y-2">
                                                    {comps.length === 0 ? (
                                                        <p className="text-xs text-muted-foreground px-2 py-3">No lectures in this module.</p>
                                                    ) : comps.map((comp) => {
                                                        const Icon = comp.type === "video" ? Video : FileText;
                                                        const done = isCompleted(comp);
                                                        return (
                                                            <div key={comp.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border border-border bg-background">
                                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                                    <Icon className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-foreground truncate">{comp.name}</p>
                                                                    <p className="text-xs text-muted-foreground capitalize">
                                                                        {comp.type}{comp.duration ? ` • ${comp.duration} min` : ""}{comp.isFree ? " • Free" : ""}{!comp.isActive ? " • Hidden" : ""}
                                                                    </p>
                                                                </div>
                                                                <span className={`flex items-center gap-1 text-xs shrink-0 ${done ? "text-green-600" : "text-muted-foreground"}`}>
                                                                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                                                    <span className="hidden sm:inline">{done ? "Completed" : "Pending"}</span>
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminStudentCourseContent;
