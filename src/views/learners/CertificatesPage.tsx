'use client';

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Clock, Download, Lock, RotateCcw, Send, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import DashboardHeader from "@/src/components/learners/DashboardHeader";
import EmptyState from "@/src/components/website/EmptyState";
import { CertificatesSkeleton } from "@/src/components/learners/LMSSkeletons";
import CertificateRequestDialog from "@/src/components/learners/certificate/CertificateRequestDialog";
import { getMyCertificates } from "@/src/services/student/certificate";
import type { CertificateStatus } from "@/src/utils/certificate";

interface CertificateRequestSummary {
    id: string;
    status: CertificateStatus;
    certificateName: string;
    signatureUrl: string;
    rejectionReason: string | null;
    attempt: number;
    submittedAt: string;
    reviewedAt: string | null;
    approvedAt: string | null;
}

interface CertificateCourse {
    courseId: string;
    courseTitle: string;
    thumbnail: string | null;
    enrolledAt: string;
    completed: boolean;
    request: CertificateRequestSummary | null;
}

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const StatusBadge = ({ request }: { request: CertificateRequestSummary | null }) => {
    if (!request) return <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Not requested</span>;
    if (request.status === "approved") return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] text-green-700"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
    if (request.status === "rejected") return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] text-red-700"><XCircle className="h-3 w-3" /> Needs changes</span>;
    return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] text-yellow-800"><Clock className="h-3 w-3" /> Under review</span>;
};

const CertificatesPage = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<CertificateCourse[]>([]);
    const [active, setActive] = useState<CertificateCourse | null>(null);

    const load = useCallback(async () => {
        try {
            const result = await getMyCertificates();
            setCourses((result.certificates ?? []) as CertificateCourse[]);
        } catch (error) {
            console.log("Error fetching certificates:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <>
            <DashboardHeader title="Certificates" />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Certificates</h1>

                {loading ? (
                    <CertificatesSkeleton />
                ) : courses.length === 0 ? (
                    <EmptyState
                        icon={Award}
                        title="No Certificates Yet"
                        description="None of your courses offer a certificate yet. Once you're enrolled in a course that does, you can request yours here."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course, i) => {
                            const request = course.request;
                            return (
                                <motion.div
                                    key={course.courseId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-background rounded-2xl border border-border p-5 flex gap-4"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Award className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-foreground text-sm line-clamp-2">{course.courseTitle}</h3>
                                            <StatusBadge request={request} />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Enrolled {formatDate(course.enrolledAt)}
                                            {course.completed && <span className="text-green-700"> · Course completed</span>}
                                        </p>

                                        {request && (
                                            <p className="mt-2 flex min-w-0 items-center gap-1 text-xs text-foreground">
                                                <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
                                                <span className="shrink-0">Name on certificate:</span>
                                                <strong className="truncate">{request.certificateName}</strong>
                                            </p>
                                        )}

                                        {!request && (
                                            <>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    Upload your practicals, enter your name and sign to request your certificate.
                                                </p>
                                                <Button size="sm" onClick={() => setActive(course)} className="mt-3 gap-1.5 text-xs h-8 cursor-pointer">
                                                    <Send className="h-3.5 w-3.5" /> Request Certificate
                                                </Button>
                                            </>
                                        )}

                                        {request?.status === "pending" && (
                                            <p className="mt-3 rounded-lg bg-yellow-50 p-2.5 text-xs text-yellow-900">
                                                Submitted {formatDate(request.submittedAt)}. We&apos;re reviewing your practicals and will email you once it&apos;s done.
                                            </p>
                                        )}

                                        {request?.status === "rejected" && (
                                            <>
                                                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
                                                    <p className="font-semibold">Feedback from our team</p>
                                                    <p className="mt-0.5 whitespace-pre-line">{request.rejectionReason}</p>
                                                </div>
                                                <Button size="sm" onClick={() => setActive(course)} className="mt-3 gap-1.5 text-xs h-8 cursor-pointer">
                                                    <RotateCcw className="h-3.5 w-3.5" /> Re-submit Request
                                                </Button>
                                            </>
                                        )}

                                        {request?.status === "approved" && (
                                            <>
                                                {request.approvedAt && <p className="mt-1 text-xs text-muted-foreground">Approved {formatDate(request.approvedAt)}</p>}
                                                <Button asChild variant="outline" size="sm" className="mt-3 gap-1.5 text-xs h-8 cursor-pointer">
                                                    <a href={`/api/certificates/${request.id}/download`} download>
                                                        <Download className="h-3.5 w-3.5" /> Download Certificate (PDF)
                                                    </a>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {active && (
                <CertificateRequestDialog
                    open
                    onOpenChange={(open) => { if (!open) setActive(null); }}
                    courseId={active.courseId}
                    courseTitle={active.courseTitle}
                    existing={active.request?.status === "rejected" ? {
                        certificateName: active.request.certificateName,
                        signatureUrl: active.request.signatureUrl,
                        rejectionReason: active.request.rejectionReason,
                        submittedAt: active.request.submittedAt,
                    } : null}
                    onSubmitted={load}
                />
            )}
        </>
    );
};

export default CertificatesPage;
