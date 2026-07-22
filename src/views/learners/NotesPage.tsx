'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Search, Trash2, Edit3, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";

import DashboardHeader from "@/src/components/learners/DashboardHeader";
import EmptyState from "@/src/components/website/EmptyState";
import { NoteListSkeleton } from "@/src/components/learners/LMSSkeletons";
import { useAuth } from "@/src/providers/AuthProvider";
import { deleteLectureNote, editLectureNote, getAllUserNotes } from "@/src/services/student/course";
import { courseDetailUrl, myCoursesUrl } from "@/src/utils/url";

interface UserNote {
    id: string;
    note: string;
    courseId: string;
    studentModuleComponentId: string;
    createdAt: string;
    updatedAt: string;
    course?: { id: string; title: string } | null;
    studentModuleComponent?: { id: string; name: string; studentModuleId: string } | null;
}

const NotesPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState<UserNote[]>([]);
    const [search, setSearch] = useState("");
    const [filterCourse, setFilterCourse] = useState("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;

        const fetchNotes = async () => {
            setLoading(true);
            try {
                const result = await getAllUserNotes(userId);
                if (result.success) {
                    setNotes((result.notes as unknown as UserNote[]) || []);
                }
            } catch (error) {
                console.log("Error fetching notes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [user?.id]);

    const getCourseTitle = (note: UserNote) => note.course?.title || "Unknown Course";
    const getLessonTitle = (note: UserNote) => note.studentModuleComponent?.name || "Unknown Lesson";

    const getLectureLink = (note: UserNote) => {
        const params = new URLSearchParams();
        if (note.studentModuleComponent?.studentModuleId) {
            params.set("moduleId", note.studentModuleComponent.studentModuleId);
        }
        params.set("componentId", note.studentModuleComponentId);
        return `${courseDetailUrl}/${note.courseId}?${params.toString()}`;
    };

    const filtered = notes.filter((n) => {
        const matchSearch =
            n.note.toLowerCase().includes(search.toLowerCase()) ||
            getLessonTitle(n).toLowerCase().includes(search.toLowerCase());
        const matchCourse = filterCourse === "all" || n.courseId === filterCourse;
        return matchSearch && matchCourse;
    });

    const handleDelete = async (id: string) => {
        const previous = notes;
        setNotes((prev) => prev.filter((n) => n.id !== id));

        const result = await deleteLectureNote(id);
        if (result.success) {
            toast.success(result.message);
        } else {
            setNotes(previous);
            toast.error(result.message);
        }
    };

    const handleSaveEdit = async (id: string) => {
        if (!editContent.trim()) return;

        const content = editContent.trim();
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, note: content, updatedAt: new Date().toISOString() } : n))
        );
        setEditingId(null);

        const result = await editLectureNote(id, content);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    // Unique courses present in the notes, for the filter dropdown
    const uniqueCourses = Array.from(
        new Map(notes.map((n) => [n.courseId, getCourseTitle(n)])).entries()
    );

    return (
        <>
            <DashboardHeader title="My Notes" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">My Notes</h1>

                {loading ? (
                    <NoteListSkeleton />
                ) : notes.length === 0 ? (
                    <EmptyState
                        icon={StickyNote}
                        title="No Notes Yet"
                        description="Start taking notes while watching your lessons. Your notes will appear here."
                        actionLabel="Go to My Courses"
                        actionLink={myCoursesUrl}
                    />
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search notes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                className="px-3 py-2 rounded-lg text-sm border border-border bg-background text-foreground"
                            >
                                <option value="all">All Courses</option>
                                {uniqueCourses.map(([cId, title]) => (
                                    <option key={cId} value={cId}>{title}</option>
                                ))}
                            </select>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            {filtered.length} note{filtered.length !== 1 ? "s" : ""}
                        </p>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((note) => (
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-background rounded-2xl border border-border p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                                                <Badge variant="secondary" className="text-[10px] shrink-0">
                                                    {getCourseTitle(note)}
                                                </Badge>
                                                <Link
                                                    href={getLectureLink(note)}
                                                    className="text-xs text-primary hover:underline flex items-center gap-0.5 truncate"
                                                >
                                                    {getLessonTitle(note)}
                                                    <ChevronRight className="h-3 w-3 shrink-0" />
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(note.id);
                                                        setEditContent(note.note);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note.id)}
                                                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                </button>
                                            </div>
                                        </div>

                                        {editingId === note.id ? (
                                            <div className="space-y-2">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="min-h-[80px] text-sm"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleSaveEdit(note.id)}>Save</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground whitespace-pre-wrap">{note.note}</p>
                                        )}

                                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(note.updatedAt).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filtered.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground text-sm">No notes match your search</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default NotesPage;
