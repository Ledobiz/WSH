'use client';

import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Film, ImageIcon, Loader2, Lock, PenLine, RotateCcw, Upload, X,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Progress } from "@/src/components/ui/progress";

import SignaturePad, { SignaturePadHandle } from "./SignaturePad";
import CertificatePreview from "./CertificatePreview";
import { getCertificateUploadSignatures, submitCertificateRequest } from "@/src/services/student/certificate";
import { uploadSignedFile } from "@/src/utils/cloudinary-direct-upload";
import {
    ACCEPTED_PRACTICAL_TYPES,
    CERTIFICATE_LIMITS,
    formatBytes,
    normalizeCertificateName,
    UploadedAsset,
    validateCertificateName,
} from "@/src/utils/certificate";

export interface ExistingCertificateRequest {
    certificateName: string;
    signatureUrl: string;
    rejectionReason: string | null;
    submittedAt: string;
}

interface CertificateRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    courseTitle: string;
    existing: ExistingCertificateRequest | null; // set when re-submitting after a rejection
    onSubmitted: () => void;
}

type PracticalItem = {
    id: string;
    file: File;
    previewUrl: string;
    kind: "image" | "video";
    status: "uploading" | "done" | "error";
    progress: number;
    asset?: UploadedAsset;
    error?: string;
};

const STEPS = ["Practicals", "Name", "Signature", "Review"] as const;
const UPLOAD_CONCURRENCY = 3;

const CertificateRequestDialog = ({ open, onOpenChange, courseId, courseTitle, existing, onSubmitted }: CertificateRequestDialogProps) => {
    const isResubmission = Boolean(existing);

    const [step, setStep] = useState(0);
    const [items, setItems] = useState<PracticalItem[]>([]);
    const [name, setName] = useState("");
    const [nameTouched, setNameTouched] = useState(false);
    const [keepSignature, setKeepSignature] = useState(true);
    const [hasInk, setHasInk] = useState(false);
    const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
    const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const padRef = useRef<SignaturePadHandle>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const itemsRef = useRef<PracticalItem[]>([]);
    itemsRef.current = items;

    // Reset everything each time the dialog opens; abort uploads when it closes.
    useEffect(() => {
        if (open) {
            abortRef.current = new AbortController();
            setStep(0);
            setItems([]);
            setName("");
            setNameTouched(false);
            setKeepSignature(true);
            setHasInk(false);
            setSignatureBlob(null);
            setSignaturePreviewUrl(null);
            setConfirmed(false);
            setSubmitting(false);
        }
        return () => {
            abortRef.current?.abort();
            itemsRef.current.forEach((i) => URL.revokeObjectURL(i.previewUrl));
        };
    }, [open]);

    useEffect(() => () => { if (signaturePreviewUrl) URL.revokeObjectURL(signaturePreviewUrl); }, [signaturePreviewUrl]);

    const patchItem = (id: string, patch: Partial<PracticalItem>) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

    const addFiles = async (fileList: FileList | File[]) => {
        const incoming = Array.from(fileList);
        const room = CERTIFICATE_LIMITS.maxFiles - itemsRef.current.length;
        if (room <= 0) return toast.error(`You can upload up to ${CERTIFICATE_LIMITS.maxFiles} files.`);

        const accepted: PracticalItem[] = [];
        for (const file of incoming.slice(0, room)) {
            const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
            if (!kind) { toast.error(`${file.name}: only pictures and videos are allowed.`); continue; }
            const limit = kind === "video" ? CERTIFICATE_LIMITS.maxVideoBytes : CERTIFICATE_LIMITS.maxImageBytes;
            if (file.size > limit) { toast.error(`${file.name} is too large (max ${formatBytes(limit)} for ${kind}s).`); continue; }
            accepted.push({
                id: crypto.randomUUID(),
                file,
                kind,
                previewUrl: URL.createObjectURL(file),
                status: "uploading",
                progress: 0,
            });
        }
        if (incoming.length > room) toast.error(`Only ${room} more file(s) can be added (max ${CERTIFICATE_LIMITS.maxFiles}).`);
        if (accepted.length === 0) return;

        setItems((prev) => [...prev, ...accepted]);

        const signed = await getCertificateUploadSignatures("practicals", accepted.length);
        if (!signed.success || signed.uploads.length < accepted.length) {
            accepted.forEach((a) => patchItem(a.id, { status: "error", error: "Could not start upload" }));
            return toast.error(signed.message || "Could not start the upload. Please try again.");
        }

        // Upload with limited concurrency so phones on slow networks aren't overwhelmed.
        let cursor = 0;
        const worker = async () => {
            while (cursor < accepted.length) {
                const index = cursor++;
                const item = accepted[index];
                try {
                    const asset = await uploadSignedFile(
                        item.file,
                        signed.uploads[index],
                        (progress) => patchItem(item.id, { progress }),
                        abortRef.current?.signal,
                    );
                    patchItem(item.id, { status: "done", progress: 100, asset });
                } catch (error) {
                    if ((error as Error)?.name === "AbortError") return;
                    patchItem(item.id, { status: "error", error: (error as Error)?.message || "Upload failed" });
                }
            }
        };
        await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, accepted.length) }, worker));
    };

    const removeItem = (id: string) =>
        setItems((prev) => {
            const target = prev.find((i) => i.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((i) => i.id !== id);
        });

    const retryItem = async (item: PracticalItem) => {
        removeItem(item.id);
        await addFiles([item.file]);
    };

    const uploading = items.some((i) => i.status === "uploading");
    const uploaded = items.filter((i) => i.status === "done");
    const failed = items.filter((i) => i.status === "error");

    const nameError = validateCertificateName(name);
    const finalName = isResubmission ? existing!.certificateName : normalizeCertificateName(name);
    const willUseNewSignature = !isResubmission || !keepSignature;

    const canContinue = [
        uploaded.length > 0 && !uploading && failed.length === 0,
        isResubmission || !nameError,
        !willUseNewSignature || hasInk || Boolean(signatureBlob),
        isResubmission || confirmed,
    ][step];

    const next = async () => {
        if (step === 1 && !isResubmission) setNameTouched(true);
        if (!canContinue) return;

        // Capture the signature before the pad unmounts.
        if (step === 2 && willUseNewSignature && padRef.current && !padRef.current.isEmpty()) {
            const blob = await padRef.current.toPngBlob();
            if (!blob) return toast.error("Please sign again.");
            setSignatureBlob(blob);
            setSignaturePreviewUrl(URL.createObjectURL(blob));
        }
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const back = () => setStep((s) => Math.max(s - 1, 0));

    const submit = async () => {
        if (!canContinue || submitting) return;
        setSubmitting(true);
        try {
            let signature: UploadedAsset | undefined;
            if (willUseNewSignature) {
                if (!signatureBlob) throw new Error("Please add your signature.");
                const signed = await getCertificateUploadSignatures("signatures", 1);
                if (!signed.success || !signed.uploads[0]) throw new Error(signed.message || "Could not upload your signature.");
                signature = await uploadSignedFile(signatureBlob, signed.uploads[0]);
            }

            const result = await submitCertificateRequest({
                courseId,
                name: isResubmission ? undefined : finalName,
                signature,
                files: uploaded.map((i) => i.asset!),
            });

            if (!result.success) throw new Error(result.message);
            toast.success(result.message);
            onOpenChange(false);
            onSubmitted();
        } catch (error) {
            toast.error((error as Error)?.message || "Failed to submit your request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(value) => { if (!submitting) onOpenChange(value); }}>
            <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>{isResubmission ? "Re-submit certificate request" : "Request your certificate"}</DialogTitle>
                    <DialogDescription className="line-clamp-2">{courseTitle}</DialogDescription>
                </DialogHeader>

                {/* Stepper */}
                <ol className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs">
                    {STEPS.map((label, i) => (
                        <li key={label} className="flex flex-1 items-center gap-1">
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-semibold ${i < step ? "bg-primary text-primary-foreground" : i === step ? "border-2 border-primary text-primary" : "bg-muted text-muted-foreground"}`}>
                                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </span>
                            <span className={`hidden sm:inline ${i === step ? "font-medium text-foreground" : "text-muted-foreground"}`}>{label}</span>
                            {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-border" />}
                        </li>
                    ))}
                </ol>

                {isResubmission && existing?.rejectionReason && step === 0 && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        <p className="font-semibold">Feedback on your last request</p>
                        <p className="mt-1 whitespace-pre-line">{existing.rejectionReason}</p>
                    </div>
                )}

                <div className="mt-4 min-h-[16rem]">
                    {/* Step 1 — practicals */}
                    {step === 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Upload clear pictures and/or videos of your practical work for this course. You can add up to {CERTIFICATE_LIMITS.maxFiles} files
                                (pictures up to {formatBytes(CERTIFICATE_LIMITS.maxImageBytes)}, videos up to {formatBytes(CERTIFICATE_LIMITS.maxVideoBytes)} each).
                            </p>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); }}
                                disabled={items.length >= CERTIFICATE_LIMITS.maxFiles}
                                className={`mt-3 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}
                            >
                                <Upload className="h-6 w-6 text-primary" />
                                <span className="text-sm font-medium text-foreground">Tap to choose pictures or videos</span>
                                <span className="text-xs text-muted-foreground">or drag and drop them here · {items.length}/{CERTIFICATE_LIMITS.maxFiles} added</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_PRACTICAL_TYPES}
                                multiple
                                className="hidden"
                                onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
                            />

                            {items.length > 0 && (
                                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {items.map((item) => (
                                        <li key={item.id} className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
                                            <div className="relative aspect-video bg-black/5">
                                                {item.kind === "image" ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.previewUrl} alt={item.file.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <video src={item.previewUrl} className="h-full w-full object-cover" muted preload="metadata" />
                                                )}
                                                <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 p-1 text-white">
                                                    {item.kind === "image" ? <ImageIcon className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label={`Remove ${item.file.name}`}
                                                    className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="p-2">
                                                <p className="truncate text-[11px] text-foreground">{item.file.name}</p>
                                                {item.status === "uploading" && <Progress value={item.progress} className="mt-1 h-1.5" />}
                                                {item.status === "done" && <p className="mt-0.5 flex items-center gap-1 text-[11px] text-green-700"><CheckCircle2 className="h-3 w-3" /> Uploaded</p>}
                                                {item.status === "error" && (
                                                    <button type="button" onClick={() => retryItem(item)} className="mt-0.5 flex cursor-pointer items-center gap-1 text-[11px] text-red-600 hover:underline">
                                                        <RotateCcw className="h-3 w-3" /> Failed — retry
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Step 2 — name */}
                    {step === 1 && (
                        isResubmission ? (
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Name on certificate (locked)</p>
                                <p className="mt-1 text-lg font-semibold text-foreground">{existing!.certificateName}</p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    This name was set when you first submitted your request on {new Date(existing!.submittedAt).toLocaleDateString()} and cannot be changed.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
                                    <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 shrink-0" /> Please read carefully</p>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                                        <li>This is the <strong>exact name that will be printed on your certificate</strong>.</li>
                                        <li>Check the <strong>spelling, capital letters and order</strong> of your names.</li>
                                        <li>Once you submit, you <strong>will NOT be able to change it</strong> — not on later downloads and not if you need to re-submit.</li>
                                    </ul>
                                </div>
                                <Label htmlFor="certificate-name" className="mt-4 block">Full name for your certificate</Label>
                                <Input
                                    id="certificate-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => setNameTouched(true)}
                                    placeholder="e.g. Adaeze Grace Okafor"
                                    maxLength={CERTIFICATE_LIMITS.nameMax}
                                    autoComplete="name"
                                    className="mt-1.5 text-base"
                                    aria-invalid={nameTouched && Boolean(nameError)}
                                />
                                {nameTouched && nameError
                                    ? <p className="mt-1.5 text-xs text-red-600">{nameError}</p>
                                    : <p className="mt-1.5 text-xs text-muted-foreground">Type it exactly as you want it to appear.</p>}
                                {name.trim() && !nameError && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-xs font-medium text-muted-foreground">How it will look:</p>
                                        <CertificatePreview name={name} courseTitle={courseTitle} />
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    {/* Step 3 — signature */}
                    {step === 2 && (
                        <div>
                            {isResubmission && (
                                <div className="mb-4 space-y-2">
                                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${keepSignature ? "border-primary bg-primary/5" : "border-border"}`}>
                                        <input type="radio" name="signature-choice" checked={keepSignature} onChange={() => setKeepSignature(true)} className="h-4 w-4" />
                                        <span className="flex-1 text-sm">Keep my previous signature</span>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={existing!.signatureUrl} alt="Previous signature" className="h-10 max-w-[140px] object-contain" />
                                    </label>
                                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${!keepSignature ? "border-primary bg-primary/5" : "border-border"}`}>
                                        <input type="radio" name="signature-choice" checked={!keepSignature} onChange={() => setKeepSignature(false)} className="h-4 w-4" />
                                        <span className="flex-1 text-sm">Sign again</span>
                                        <PenLine className="h-4 w-4 text-muted-foreground" />
                                    </label>
                                </div>
                            )}
                            {willUseNewSignature && (
                                <>
                                    <p className="mb-3 text-sm text-muted-foreground">
                                        Draw your signature below. It will be printed above the &quot;Student&quot; line on your certificate.
                                    </p>
                                    <SignaturePad ref={padRef} onChange={(ink) => { setHasInk(ink); if (ink) setSignatureBlob(null); }} />
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 4 — review */}
                    {step === 3 && (
                        <div>
                            <p className="mb-2 text-xs font-medium text-muted-foreground">Preview of your certificate</p>
                            <CertificatePreview
                                name={finalName}
                                courseTitle={courseTitle}
                                signatureUrl={willUseNewSignature ? signaturePreviewUrl : existing?.signatureUrl}
                            />
                            <p className="mt-1.5 text-[11px] text-muted-foreground">The date will be the day your request is approved.</p>

                            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                <div className="rounded-xl bg-muted/40 p-3">
                                    <dt className="text-xs text-muted-foreground">Name on certificate</dt>
                                    <dd className="font-semibold text-foreground">{finalName}</dd>
                                </div>
                                <div className="rounded-xl bg-muted/40 p-3">
                                    <dt className="text-xs text-muted-foreground">Practicals</dt>
                                    <dd className="font-semibold text-foreground">
                                        {uploaded.filter((i) => i.kind === "image").length} picture(s), {uploaded.filter((i) => i.kind === "video").length} video(s)
                                    </dd>
                                </div>
                            </dl>

                            {!isResubmission && (
                                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                                    <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
                                    <span>
                                        I confirm that <strong>&quot;{finalName}&quot;</strong> is spelled correctly and I understand that it
                                        <strong> cannot be changed</strong> after I submit this request.
                                    </span>
                                </label>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <Button type="button" variant="ghost" onClick={step === 0 ? () => onOpenChange(false) : back} disabled={submitting} className="cursor-pointer">
                        {step === 0 ? "Cancel" : <><ChevronLeft className="mr-1 h-4 w-4" /> Back</>}
                    </Button>

                    {step < STEPS.length - 1 ? (
                        <Button type="button" onClick={next} disabled={!canContinue && !(step === 1 && !nameTouched)} className="cursor-pointer">
                            {step === 0 && uploading ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Uploading…</> : <>Continue <ChevronRight className="ml-1 h-4 w-4" /></>}
                        </Button>
                    ) : (
                        <Button type="button" onClick={submit} disabled={!canContinue || submitting} className="cursor-pointer">
                            {submitting ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting…</> : isResubmission ? "Re-submit request" : "Submit request"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CertificateRequestDialog;
