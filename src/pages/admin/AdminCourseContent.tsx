'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { ChevronLeft, Plus, Edit, Trash2, Video, FileText, ChevronDown, ChevronUp, ExternalLink, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import { fetchAllModules, addModule, updateModule, deleteModule, reorderModules } from "@/src/services/admin/course_module";
import { addComponent, updateComponent, deleteComponent, reorderComponents } from "@/src/services/admin/module_component";
import { adminCoursesUrl } from "@/src/utils/url";
import { useSmartBack } from "@/src/hooks/useSmartBack";

const AdminCourseContent = ({ courseId }: { courseId: string }) => {
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const goBack = useSmartBack(adminCoursesUrl);

    // Module dialog
    const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<any>(null);
    const [moduleName, setModuleName] = useState("");
    const [moduleDuration, setModuleDuration] = useState("");
    const [moduleDescription, setModuleDescription] = useState("");

    // Component dialog
    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const [targetModuleId, setTargetModuleId] = useState("");
    const [editingComponent, setEditingComponent] = useState<any>(null);
    const [compName, setCompName] = useState("");
    const [compType, setCompType] = useState("video");
    const [compDuration, setCompDuration] = useState("");
    const [compVideoUrl, setCompVideoUrl] = useState("");
    const [compBunnyLibraryId, setCompBunnyLibraryId] = useState("");
    const [compFile, setCompFile] = useState<File | null>(null);
    const [compDescription, setCompDescription] = useState("");
    const [compIsPrerequisite, setCompIsPrerequisite] = useState(false);
    const [compIsFree, setCompIsFree] = useState(false);
    const [compIsActive, setCompIsActive] = useState(true);

    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ kind: "module" | "component"; id: string; name: string } | null>(null);

    // Drag-and-drop reordering
    const [dragModuleId, setDragModuleId] = useState<string | null>(null);
    const [dragComp, setDragComp] = useState<{ moduleId: string; id: string } | null>(null);
    const [savingOrder, setSavingOrder] = useState(false);

    const loadModules = async () => {
        const result = await fetchAllModules(courseId);
        const mods = result.modules || [];
        setModules(mods);
        setExpanded(new Set(mods.map((m: any) => m.id)));
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                await loadModules();
            } catch (error) {
                console.log("Error loading modules:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [courseId]);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // ---- Module handlers ----
    const openAddModule = () => {
        setEditingModule(null);
        setModuleName(""); setModuleDuration(""); setModuleDescription("");
        setModuleDialogOpen(true);
    };
    const openEditModule = (mod: any) => {
        setEditingModule(mod);
        setModuleName(mod.name || "");
        setModuleDuration(mod.totalDuration != null ? String(mod.totalDuration) : "");
        setModuleDescription(mod.description || "");
        setModuleDialogOpen(true);
    };
    const saveModule = async () => {
        if (!moduleName.trim()) return toast.error("Module name is required");
        setSubmitting(true);
        try {
            const payload = {
                name: moduleName.trim(),
                description: moduleDescription || null,
                totalDuration: moduleDuration ? Number(moduleDuration) : null,
            };
            const result = editingModule
                ? await updateModule(editingModule.id, payload as any)
                : await addModule(courseId, payload as any);
            if (result.success) {
                toast.success(result.message);
                setModuleDialogOpen(false);
                await loadModules();
            } else {
                toast.error(result.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ---- Component handlers ----
    const openAddComponent = (moduleId: string) => {
        setTargetModuleId(moduleId);
        setEditingComponent(null);
        setCompName(""); setCompType("video"); setCompDuration("");
        setCompVideoUrl(""); setCompBunnyLibraryId(""); setCompFile(null);
        setCompDescription(""); setCompIsPrerequisite(false); setCompIsFree(false); setCompIsActive(true);
        setComponentDialogOpen(true);
    };
    const openEditComponent = (moduleId: string, comp: any) => {
        setTargetModuleId(moduleId);
        setEditingComponent(comp);
        setCompName(comp.name || "");
        setCompType(comp.type || "video");
        setCompDuration(comp.duration != null ? String(comp.duration) : "");
        setCompVideoUrl(comp.vimeoVideoUrl || "");
        setCompBunnyLibraryId(comp.bunnyLibraryId || "");
        setCompFile(null);
        setCompDescription(comp.description || "");
        setCompIsPrerequisite(!!comp.isPrerequisite);
        setCompIsFree(!!comp.isFree);
        setCompIsActive(comp.isActive !== undefined ? comp.isActive : true);
        setComponentDialogOpen(true);
    };
    const saveComponent = async () => {
        if (!compName.trim()) return toast.error("Component name is required");
        if (compType === "video" && !compVideoUrl.trim()) return toast.error("Video ID / URL is required");
        if (compType !== "video" && !editingComponent && !compFile) return toast.error("Please upload a file");

        setSubmitting(true);
        try {
            const payload = {
                name: compName.trim(),
                description: compDescription || null,
                isActive: compIsActive,
                type: compType,
                vimeoVideoUrl: compType === "video" ? compVideoUrl.trim() : null,
                bunnyLibraryId: compType === "video" ? (compBunnyLibraryId.trim() || null) : null,
                fileName: compType !== "video" ? compFile : null,
                isPrerequisite: compIsPrerequisite,
                isFree: compIsFree,
                duration: compDuration ? Number(compDuration) : null,
            };
            const result = editingComponent
                ? await updateComponent(editingComponent.id, payload as any)
                : await addComponent(targetModuleId, payload as any);
            if (result.success) {
                toast.success(result.message);
                setComponentDialogOpen(false);
                await loadModules();
            } else {
                toast.error(result.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const result = deleteTarget.kind === "module"
            ? await deleteModule(deleteTarget.id)
            : await deleteComponent(deleteTarget.id);
        if (result.success) {
            toast.success(result.message || "Deleted");
            await loadModules();
        } else {
            toast.error(result.message || "Failed to delete");
        }
        setDeleteTarget(null);
    };

    // ---- Reorder handlers (native HTML5 drag & drop) ----
    const handleModuleDrop = async (targetId: string) => {
        const sourceId = dragModuleId;
        setDragModuleId(null);
        if (!sourceId || sourceId === targetId) return;

        const from = modules.findIndex((m) => m.id === sourceId);
        const to = modules.findIndex((m) => m.id === targetId);
        if (from === -1 || to === -1) return;

        const previous = modules;
        const reordered = [...modules];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(to, 0, moved);
        setModules(reordered); // optimistic

        setSavingOrder(true);
        try {
            const result = await reorderModules(courseId, reordered.map((m) => m.id));
            if (!result.success) {
                toast.error(result.message);
                setModules(previous); // revert
            }
        } finally {
            setSavingOrder(false);
        }
    };

    const handleComponentDrop = async (moduleId: string, targetCompId: string) => {
        const source = dragComp;
        setDragComp(null);
        // Components can only be reordered within their own module.
        if (!source || source.moduleId !== moduleId || source.id === targetCompId) return;

        const modIndex = modules.findIndex((m) => m.id === moduleId);
        if (modIndex === -1) return;

        const comps = [...(modules[modIndex].moduleComponents || [])];
        const from = comps.findIndex((c: any) => c.id === source.id);
        const to = comps.findIndex((c: any) => c.id === targetCompId);
        if (from === -1 || to === -1) return;

        const [moved] = comps.splice(from, 1);
        comps.splice(to, 0, moved);

        const previous = modules;
        const newModules = modules.map((m, i) => (i === modIndex ? { ...m, moduleComponents: comps } : m));
        setModules(newModules); // optimistic

        setSavingOrder(true);
        try {
            const result = await reorderComponents(moduleId, comps.map((c: any) => c.id));
            if (!result.success) {
                toast.error(result.message);
                setModules(previous); // revert
            }
        } finally {
            setSavingOrder(false);
        }
    };

    const totalComponents = modules.reduce((s, m) => s + (m.moduleComponents?.length || 0), 0);

    return (
        <>
            <AdminHeader title="Course Content" />

            <div className="p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                    <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg sm:text-xl font-bold text-foreground">Manage Course Content</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{modules.length} modules • {totalComponents} components</span>
                            {savingOrder && <span className="flex items-center gap-1 text-primary"><Loader2 className="h-3 w-3 animate-spin" /> Saving order…</span>}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <GripVertical className="h-3 w-3" /> Drag the handle to reorder modules and lectures. The order is saved automatically and shown to students.
                        </p>
                    </div>
                    <Button onClick={openAddModule} className="shrink-0 cursor-pointer">
                        <Plus className="h-4 w-4 mr-1" /> Add Module
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : modules.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No modules yet. Click &quot;Add Module&quot; to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {modules.map((mod, modIdx) => (
                            <div
                                key={mod.id}
                                className={`bg-background border rounded-2xl overflow-hidden transition-colors ${dragModuleId && dragModuleId !== mod.id ? "border-primary/40" : "border-border"}`}
                                onDragOver={(e) => { if (dragModuleId && dragModuleId !== mod.id) e.preventDefault(); }}
                                onDrop={(e) => { e.preventDefault(); handleModuleDrop(mod.id); }}
                            >
                                <div className="flex items-center gap-2 p-3 sm:p-4 bg-muted/50">
                                    <span
                                        draggable
                                        onDragStart={(e) => { e.stopPropagation(); setDragModuleId(mod.id); }}
                                        onDragEnd={() => setDragModuleId(null)}
                                        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
                                        title="Drag to reorder module"
                                    >
                                        <GripVertical className="h-4 w-4" />
                                    </span>
                                    <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer" onClick={() => toggle(mod.id)}>
                                        <span className="text-xs font-medium text-muted-foreground shrink-0">M{modIdx + 1}</span>
                                        <h3 className="flex-1 font-medium text-foreground text-sm sm:text-base truncate">{mod.name}</h3>
                                        <span className="text-xs text-muted-foreground shrink-0">{mod.moduleComponents?.length || 0} items</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => openEditModule(mod)}>
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive cursor-pointer" onClick={() => setDeleteTarget({ kind: "module", id: mod.id, name: mod.name })}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <button type="button" className="shrink-0 cursor-pointer text-muted-foreground" onClick={() => toggle(mod.id)} title={expanded.has(mod.id) ? "Collapse" : "Expand"}>
                                        {expanded.has(mod.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>
                                </div>

                                {expanded.has(mod.id) && (
                                    <div className="p-2 sm:p-3 space-y-2">
                                        {(mod.moduleComponents || []).map((comp: any) => {
                                            const Icon = comp.type === "video" ? Video : FileText;
                                            const isDragTarget = dragComp && dragComp.moduleId === mod.id && dragComp.id !== comp.id;
                                            return (
                                                <div
                                                    key={comp.id}
                                                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border bg-background hover:bg-muted/30 transition-colors ${isDragTarget ? "border-primary/40" : "border-border"}`}
                                                    onDragOver={(e) => { if (isDragTarget) e.preventDefault(); }}
                                                    onDrop={(e) => { e.preventDefault(); handleComponentDrop(mod.id, comp.id); }}
                                                >
                                                    <span
                                                        draggable
                                                        onDragStart={(e) => { e.stopPropagation(); setDragComp({ moduleId: mod.id, id: comp.id }); }}
                                                        onDragEnd={() => setDragComp(null)}
                                                        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
                                                        title="Drag to reorder component"
                                                    >
                                                        <GripVertical className="h-4 w-4" />
                                                    </span>
                                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                        <Icon className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{comp.name}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {comp.type}{comp.duration ? ` • ${comp.duration} min` : ""}{comp.isFree ? " • Free" : ""}{!comp.isActive ? " • Hidden" : ""}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {comp.type !== "video" && comp.fileName && (
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => window.open(comp.fileName, "_blank")} title="View file">
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => openEditComponent(mod.id, comp)}>
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive cursor-pointer" onClick={() => setDeleteTarget({ kind: "component", id: comp.id, name: comp.name })}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <Button variant="outline" size="sm" className="w-full mt-1 cursor-pointer" onClick={() => openAddComponent(mod.id)}>
                                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Component
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Module Dialog */}
            <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-primary">{editingModule ? "Edit Module" : "Create Module"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div>
                            <Label>Module Name <span className="text-destructive">*</span></Label>
                            <Input value={moduleName} onChange={(e) => setModuleName(e.target.value.slice(0, 191))} placeholder="Enter module name" className="mt-1" maxLength={191} />
                        </div>
                        <div>
                            <Label>Total Duration (In Minutes)</Label>
                            <Input type="number" value={moduleDuration} onChange={(e) => setModuleDuration(e.target.value)} placeholder="e.g. 30" className="mt-1" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <div className="mt-1">
                                <RichTextEditor value={moduleDescription} onChange={setModuleDescription} height={200} />
                            </div>
                        </div>
                        <Button onClick={saveModule} className="w-full cursor-pointer" disabled={submitting || !moduleName.trim()}>
                            {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : editingModule ? "Save Changes" : "Submit"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Component Dialog */}
            <Dialog open={componentDialogOpen} onOpenChange={setComponentDialogOpen}>
                <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-primary">{editingComponent ? "Edit Component" : "Add Component"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div>
                            <Label>Component Name <span className="text-destructive">*</span></Label>
                            <Input value={compName} onChange={(e) => setCompName(e.target.value.slice(0, 191))} placeholder="e.g. Introduction to Yogurt Making" className="mt-1" maxLength={191} />
                        </div>
                        <div>
                            <Label>Component Type <span className="text-destructive">*</span></Label>
                            <select value={compType} onChange={(e) => setCompType(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground">
                                <option value="video">Video</option>
                                <option value="file">File</option>
                            </select>
                        </div>
                        <div>
                            <Label>Duration (In Minutes)</Label>
                            <Input type="number" value={compDuration} onChange={(e) => setCompDuration(e.target.value)} placeholder="e.g. 10" className="mt-1" />
                        </div>
                        {compType === "video" ? (
                            <>
                                <div>
                                    <Label>Bunny Video ID <span className="text-destructive">*</span></Label>
                                    <Input value={compVideoUrl} onChange={(e) => setCompVideoUrl(e.target.value)} placeholder="Bunny video GUID" className="mt-1" />
                                    <p className="text-xs text-muted-foreground mt-1">The video&apos;s unique ID (GUID) from your Bunny Stream library.</p>
                                </div>
                                <div>
                                    <Label>Bunny Folder / Library ID <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                    <Input value={compBunnyLibraryId} onChange={(e) => setCompBunnyLibraryId(e.target.value)} placeholder="Leave blank to use the default library" className="mt-1" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Only set this if the video lives in a separate Bunny <strong>Library</strong>. Videos organized into Collections inside the default library play automatically and don&apos;t need this.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div>
                                <Label>Upload File {!editingComponent && <span className="text-destructive">*</span>}</Label>
                                <Input type="file" onChange={(e) => setCompFile(e.target.files?.[0] || null)} className="mt-1" />
                                {editingComponent && <p className="text-xs text-muted-foreground mt-1">Leave empty to keep the current file.</p>}
                            </div>
                        )}
                        <div>
                            <Label>Description</Label>
                            <div className="mt-1">
                                <RichTextEditor value={compDescription} onChange={setCompDescription} height={200} />
                            </div>
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                                <Checkbox id="isPrerequisite" checked={compIsPrerequisite} onCheckedChange={(c) => setCompIsPrerequisite(c === true)} className="mt-1" />
                                <div className="flex-1">
                                    <Label htmlFor="isPrerequisite" className="cursor-pointer">Is this component a prerequisite?</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Students cannot proceed to the next lecture without completing this one.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Checkbox id="isFree" checked={compIsFree} onCheckedChange={(c) => setCompIsFree(c === true)} className="mt-1" />
                                <div className="flex-1">
                                    <Label htmlFor="isFree" className="cursor-pointer">Is this a free component?</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Check if this component can be viewed for free (useful for preview videos).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Checkbox id="isActive" checked={compIsActive} onCheckedChange={(c) => setCompIsActive(c === true)} className="mt-1" />
                                <div className="flex-1">
                                    <Label htmlFor="isActive" className="cursor-pointer">Is available to enrolled students?</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Uncheck to hide this component from students for now.</p>
                                </div>
                            </div>
                        </div>
                        <Button onClick={saveComponent} className="w-full cursor-pointer" disabled={submitting || !compName.trim()}>
                            {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : editingComponent ? "Save Changes" : "Add Component"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {deleteTarget?.kind === "module" ? "Module" : "Component"}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
                            {deleteTarget?.kind === "module" ? " All its components will be removed too." : ""}
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

export default AdminCourseContent;
