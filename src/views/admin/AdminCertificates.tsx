'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Award, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, Eye, Film, ImageIcon, Loader2, Pencil, Search, XCircle,
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/src/components/admin/AdminHeader";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
    approveCertificateRequest, getCertificateRequest, getCertificateRequests, rejectCertificateRequest,
} from "@/src/services/admin/certificate";
import { CERTIFICATE_LIMITS, CertificateStatus, formatBytes, normalizeCertificateName, validateCertificateName } from "@/src/utils/certificate";

const PAGE_SIZE = 20;
type Tab = CertificateStatus | "all";

const TABS: { key: Tab; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
];

const statusBadge = (status: CertificateStatus) => {
    if (status === "approved") return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"><CheckCircle2 className="h-3 w-3" /> approved</span>;
    if (status === "rejected") return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700"><XCircle className="h-3 w-3" /> rejected</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"><Clock className="h-3 w-3" /> pending</span>;
};

const fmt = (value?: string | Date | null) => (value ? new Date(value).toLocaleString() : "—");

const AdminCertificates = () => {
    const [tab, setTab] = useState<Tab>("pending");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 0, currentPage: 1 });
    const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const requestId = useRef(0);

    const [openId, setOpenId] = useState<string | null>(null);
    const closeSheet = useCallback(() => setOpenId(null), []);

    const loadList = useCallback(async () => {
        const id = ++requestId.current;
        setLoading(true);
        try {
            const result: any = await getCertificateRequests({ status: tab, search, page, pageSize: PAGE_SIZE });
            if (id !== requestId.current) return;
            if (!result.success) toast.error(result.message);
            setRows(result.data ?? []);
            setPagination(result.pagination ?? { totalCount: 0, totalPages: 0, currentPage: 1 });
            setCounts(result.counts ?? { pending: 0, approved: 0, rejected: 0 });
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, [tab, search, page]);

    useEffect(() => { loadList(); }, [loadList]);

    useEffect(() => {
        const handle = setTimeout(() => {
            const next = searchInput.trim();
            if (next !== search) { setSearch(next); setPage(1); }
        }, 300);
        return () => clearTimeout(handle);
    }, [searchInput, search]);

    const total = counts.pending + counts.approved + counts.rejected;
    const countFor = (key: Tab) => (key === "all" ? total : counts[key]);

    return (
        <>
            <AdminHeader title="Certificate Requests" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Certificate Requests</h1>

                <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
                    <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted/50 p-1">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => { setTab(t.key); setPage(1); }}
                                className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${tab === t.key ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {t.label}
                                <span className={`ml-1.5 rounded-full px-1.5 text-[11px] ${t.key === "pending" && counts.pending > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{countFor(t.key)}</span>
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by student, email, certificate name or course..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
                    </div>
                </div>

                <div className={`bg-background rounded-2xl border border-border overflow-hidden transition-opacity ${loading && rows.length ? "opacity-60" : ""}`}>
                    {loading && rows.length === 0 ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
                    ) : rows.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            <Award className="mx-auto mb-2 h-8 w-8 opacity-40" />
                            No {tab === "all" ? "" : tab} certificate requests{search ? " match your search" : ""}.
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-left">
                                            <th className="p-4 font-medium text-muted-foreground">Student</th>
                                            <th className="p-4 font-medium text-muted-foreground">Course</th>
                                            <th className="p-4 font-medium text-muted-foreground">Name on certificate</th>
                                            <th className="p-4 font-medium text-muted-foreground">Submitted</th>
                                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                                            <th className="p-4" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r) => (
                                            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setOpenId(r.id)}>
                                                <td className="p-4">
                                                    <p className="font-medium text-foreground">{r.user?.name || "—"}</p>
                                                    <p className="text-xs text-muted-foreground">{r.user?.email}</p>
                                                </td>
                                                <td className="p-4 max-w-[220px]"><p className="truncate text-foreground">{r.course?.title}</p></td>
                                                <td className="p-4 text-foreground">{r.certificateName}</td>
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(r.submittedAt).toLocaleDateString()}
                                                    {r.attempt > 1 && <span className="ml-1 text-xs">(attempt {r.attempt})</span>}
                                                </td>
                                                <td className="p-4">{statusBadge(r.status)}</td>
                                                <td className="p-4 text-right">
                                                    <Button variant="outline" size="sm" className="cursor-pointer"><Eye className="h-4 w-4 mr-1" /> Review</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden divide-y divide-border">
                                {rows.map((r) => (
                                    <button key={r.id} onClick={() => setOpenId(r.id)} className="w-full cursor-pointer p-4 text-left hover:bg-muted/30">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-foreground">{r.certificateName}</p>
                                                <p className="truncate text-xs text-muted-foreground">{r.user?.email}</p>
                                            </div>
                                            {statusBadge(r.status)}
                                        </div>
                                        <p className="mt-1 truncate text-xs text-foreground">{r.course?.title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(r.submittedAt).toLocaleDateString()} · {r._count?.files ?? 0} file(s){r.attempt > 1 ? ` · attempt ${r.attempt}` : ""}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between gap-3 border-t border-border p-4 text-sm">
                                    <p className="text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalCount} request(s)</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} className="cursor-pointer" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="sm" disabled={page >= pagination.totalPages || loading} onClick={() => setPage((p) => p + 1)} className="cursor-pointer" aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <CertificateReviewSheet id={openId} onClose={closeSheet} onReviewed={loadList} />
        </>
    );
};

// ---------------------------------------------------------------------------

const CertificateReviewSheet = ({ id, onClose, onReviewed }: { id: string | null; onClose: () => void; onReviewed: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState<any>(null);
    const [name, setName] = useState("");
    const [editingName, setEditingName] = useState(false);
    const [reason, setReason] = useState("");
    const [rejecting, setRejecting] = useState(false);
    const [confirmApprove, setConfirmApprove] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        setRequest(null);
        setEditingName(false);
        setRejecting(false);
        setReason("");
        getCertificateRequest(id).then((result: any) => {
            if (cancelled) return;
            if (!result.success) { toast.error(result.message); onClose(); return; }
            setRequest(result.request);
            setName(result.request.certificateName);
        }).finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id, onClose]);

    const pending = request?.status === "pending";
    const nameError = validateCertificateName(name);
    const nameChanged = Boolean(request) && normalizeCertificateName(name) !== request.certificateName;

    const previewHref = request
        ? `/api/certificates/${request.id}/download?inline=1${nameChanged && !nameError ? `&name=${encodeURIComponent(normalizeCertificateName(name))}` : ""}`
        : "#";

    const attempts: Record<number, any[]> = {};
    (request?.files ?? []).forEach((f: any) => { (attempts[f.attempt] ??= []).push(f); });
    const attemptNumbers = Object.keys(attempts).map(Number).sort((a, b) => b - a);

    const finish = (message: string) => {
        toast.success(message);
        onReviewed();
        onClose();
    };

    const approve = async () => {
        setConfirmApprove(false);
        setBusy(true);
        try {
            const result = await approveCertificateRequest(request.id, nameChanged ? name : undefined);
            if (!result.success) return toast.error(result.message);
            finish(result.message);
        } finally {
            setBusy(false);
        }
    };

    const reject = async () => {
        if (reason.trim().length < CERTIFICATE_LIMITS.reasonMin) return toast.error("Please give the student a clear reason.");
        setBusy(true);
        try {
            const result = await rejectCertificateRequest(request.id, reason, nameChanged && !nameError ? name : undefined);
            if (!result.success) return toast.error(result.message);
            finish(result.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Sheet open={Boolean(id)} onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
                <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>Certificate request</SheetTitle>
                        <SheetDescription>{request ? request.course?.title : "Loading…"}</SheetDescription>
                    </SheetHeader>

                    {loading || !request ? (
                        <div className="flex items-center justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
                    ) : (
                        <div className="mt-4 space-y-6">
                            {/* Student */}
                            <section className="grid grid-cols-2 gap-3 text-sm">
                                <div><p className="text-xs text-muted-foreground">Student</p><p className="font-medium text-foreground">{request.user?.name || "—"}</p></div>
                                <div className="min-w-0"><p className="text-xs text-muted-foreground">Email</p><p className="truncate text-foreground">{request.user?.email}</p></div>
                                <div><p className="text-xs text-muted-foreground">Status</p>{statusBadge(request.status)}</div>
                                <div><p className="text-xs text-muted-foreground">Submitted</p><p className="text-foreground">{fmt(request.submittedAt)}{request.attempt > 1 ? ` (attempt ${request.attempt})` : ""}</p></div>
                                {request.reviewedAt && (
                                    <div className="col-span-2"><p className="text-xs text-muted-foreground">Last reviewed</p><p className="text-foreground">{fmt(request.reviewedAt)}{request.reviewedBy?.name ? ` by ${request.reviewedBy.name}` : ""}</p></div>
                                )}
                            </section>

                            {/* Name */}
                            <section className="rounded-xl border border-border p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <Label htmlFor="admin-cert-name">Name on certificate</Label>
                                    {pending && !editingName && (
                                        <Button variant="ghost" size="sm" onClick={() => setEditingName(true)} className="h-7 cursor-pointer text-xs"><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>
                                    )}
                                </div>
                                {editingName ? (
                                    <>
                                        <Input id="admin-cert-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={CERTIFICATE_LIMITS.nameMax} className="mt-2 text-base" />
                                        {nameError ? <p className="mt-1 text-xs text-red-600">{nameError}</p> : nameChanged && (
                                            <p className="mt-1 text-xs text-amber-700">The corrected name will be saved when you approve or reject.</p>
                                        )}
                                        <Button variant="link" size="sm" className="h-auto px-0 text-xs cursor-pointer" onClick={() => { setName(request.certificateName); setEditingName(false); }}>Undo changes</Button>
                                    </>
                                ) : (
                                    <p className="mt-1 text-lg font-semibold text-foreground">{request.certificateName}</p>
                                )}
                                {request.originalName !== request.certificateName && (
                                    <p className="mt-1 text-xs text-muted-foreground">Student originally entered: <span className="font-medium">{request.originalName}</span></p>
                                )}
                                {!pending && <p className="mt-2 text-xs text-muted-foreground">The name can only be edited while a request is pending.</p>}
                            </section>

                            {/* Signature */}
                            <section>
                                <p className="mb-2 text-sm font-medium text-foreground">Student signature</p>
                                <div className="flex h-24 items-center justify-center rounded-xl border border-border bg-white p-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={request.signatureUrl} alt="Student signature" className="max-h-full max-w-full object-contain" />
                                </div>
                            </section>

                            {/* Practicals */}
                            <section>
                                <p className="mb-2 text-sm font-medium text-foreground">Practicals</p>
                                {attemptNumbers.map((attempt) => (
                                    <div key={attempt} className="mb-4">
                                        <p className="mb-2 text-xs text-muted-foreground">
                                            {attempt === request.attempt ? "Current submission" : `Earlier submission (attempt ${attempt})`} · {attempts[attempt].length} file(s)
                                        </p>
                                        <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${attempt !== request.attempt ? "opacity-70" : ""}`}>
                                            {attempts[attempt].map((f: any) => (
                                                <div key={f.id} className="overflow-hidden rounded-xl border border-border bg-muted/30">
                                                    {f.resourceType === "video" ? (
                                                        <video src={f.url} controls preload="metadata" className="aspect-video w-full bg-black" />
                                                    ) : (
                                                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="block">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={f.url} alt="Practical" className="aspect-video w-full object-cover" loading="lazy" />
                                                        </a>
                                                    )}
                                                    <div className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            {f.resourceType === "video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                                            {f.bytes ? formatBytes(f.bytes) : f.resourceType}
                                                        </span>
                                                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground" aria-label="Open in new tab"><ExternalLink className="h-3 w-3" /></a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {request.status === "rejected" && request.rejectionReason && (
                                <section className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                                    <p className="font-semibold">Rejection reason sent to student</p>
                                    <p className="mt-1 whitespace-pre-line">{request.rejectionReason}</p>
                                </section>
                            )}

                            {/* Actions */}
                            <section className="sticky bottom-0 -mx-6 border-t border-border bg-background px-6 py-4">
                                <Button asChild variant="outline" className="mb-3 w-full cursor-pointer">
                                    <a href={previewHref} target="_blank" rel="noopener noreferrer"><Eye className="mr-2 h-4 w-4" /> Preview certificate (PDF)</a>
                                </Button>

                                {pending && (rejecting ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="reject-reason">Reason for rejection (the student will see this)</Label>
                                        <Textarea
                                            id="reject-reason"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            maxLength={CERTIFICATE_LIMITS.reasonMax}
                                            rows={4}
                                            placeholder="e.g. The videos don't clearly show the final product. Please upload a clearer video of your finished work."
                                        />
                                        <div className="flex gap-2">
                                            <Button variant="ghost" onClick={() => setRejecting(false)} disabled={busy} className="flex-1 cursor-pointer">Cancel</Button>
                                            <Button variant="destructive" onClick={reject} disabled={busy || reason.trim().length < CERTIFICATE_LIMITS.reasonMin} className="flex-1 cursor-pointer">
                                                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send rejection"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setRejecting(true)} disabled={busy} className="flex-1 cursor-pointer border-red-200 text-red-700 hover:bg-red-50">
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <Button onClick={() => setConfirmApprove(true)} disabled={busy || Boolean(nameError)} className="flex-1 cursor-pointer">
                                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Approve</>}
                                        </Button>
                                    </div>
                                ))}
                            </section>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <AlertDialog open={confirmApprove} onOpenChange={setConfirmApprove}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve this certificate?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The certificate will be issued to <strong>{normalizeCertificateName(name)}</strong>
                            {nameChanged ? " (corrected name)" : ""}. Once approved, the name can no longer be changed by anyone,
                            and the student can download the certificate at any time.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={approve}>Approve certificate</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminCertificates;
