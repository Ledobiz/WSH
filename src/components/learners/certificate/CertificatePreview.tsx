'use client';

import { useLayoutEffect, useRef, useState } from "react";
import { Playball, Zilla_Slab, Hind } from "next/font/google";
import {
    CERTIFICATE_LAYOUT as L,
    CERTIFICATE_PAGE as P,
    certificateSentence,
    formatCertificateDate,
} from "@/src/utils/certificate";

const playball = Playball({ weight: "400", subsets: ["latin"], display: "swap" });
const zilla = Zilla_Slab({ weight: "700", subsets: ["latin"], display: "swap" });
const hind = Hind({ weight: "500", subsets: ["latin"], display: "swap" });

// Helpers to convert PDF points (origin bottom-left) into % of the preview box.
const px = (x: number) => `${(x / P.width) * 100}%`;
const fromBottom = (y: number) => `${(y / P.height) * 100}%`;
const fromTop = (y: number) => `${((P.height - y) / P.height) * 100}%`;
// Font sizes scale with the box width via container query units.
const cqw = (pt: number) => `${(pt / P.width) * 100}cqw`;

interface CertificatePreviewProps {
    name: string;
    courseTitle: string;
    signatureUrl?: string | null;
    date?: Date;
}

/**
 * Close HTML approximation of the generated PDF (same template image, fonts and
 * positions) so students can check their name and signature on any device —
 * many mobile browsers can't display PDFs inline. The PDF remains authoritative.
 */
const CertificatePreview = ({ name, courseTitle, signatureUrl, date = new Date() }: CertificatePreviewProps) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLSpanElement>(null);
    const capsRef = useRef<HTMLSpanElement>(null);
    const [nameScale, setNameScale] = useState(1);
    const [capsScale, setCapsScale] = useState(1);

    const displayName = name.trim() || "Your Name";

    // Shrink long names to fit, mirroring the PDF's fitSize().
    useLayoutEffect(() => {
        const fit = () => {
            const box = boxRef.current;
            if (!box || !nameRef.current || !capsRef.current) return;
            const width = box.clientWidth;
            const measure = (el: HTMLElement, maxPt: number, minRatio: number) => {
                const natural = el.scrollWidth / (el.dataset.scale ? Number(el.dataset.scale) : 1);
                const max = (maxPt / P.width) * width;
                return Math.max(minRatio, Math.min(1, max / Math.max(natural, 1)));
            };
            setNameScale(measure(nameRef.current, L.name.maxWidth, L.name.minSize / L.name.maxSize));
            setCapsScale(measure(capsRef.current, L.studentName.maxWidth, L.studentName.minSize / L.studentName.size));
        };
        fit();
        document.fonts?.ready.then(fit);
        const observer = new ResizeObserver(fit);
        if (boxRef.current) observer.observe(boxRef.current);
        return () => observer.disconnect();
    }, [displayName]);

    return (
        <div
            ref={boxRef}
            className="relative w-full select-none overflow-hidden rounded-xl border border-border shadow-sm"
            style={{ aspectRatio: `${P.width} / ${P.height}`, containerType: "inline-size" }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/certificate/template-preview.webp" alt="" className="absolute inset-0 h-full w-full" draggable={false} />

            {/* Name (script) */}
            <div className="absolute inset-x-0 flex justify-center" style={{ bottom: fromBottom(L.name.baselineY - L.name.maxSize * 0.28) }}>
                <span
                    ref={nameRef}
                    data-scale={nameScale}
                    className={`${playball.className} whitespace-nowrap leading-none`}
                    style={{ fontSize: `calc(${cqw(L.name.maxSize)} * ${nameScale})`, color: "#6a1b9a" }}
                >
                    {displayName}
                </span>
            </div>

            {/* Date in the pill */}
            <div
                className={`${zilla.className} absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap leading-none text-white`}
                style={{ left: px(L.date.centerX), top: fromTop(L.date.centerY), fontSize: cqw(L.date.size) }}
            >
                {formatCertificateDate(date)}
            </div>

            {/* Course sentence */}
            <p
                className={`${hind.className} absolute -translate-x-1/2 text-center`}
                style={{
                    left: px(L.pageCenterX),
                    top: fromTop(L.body.firstBaselineY + L.body.size * 0.82),
                    width: px(L.body.maxWidth),
                    fontSize: cqw(L.body.size),
                    lineHeight: L.body.lineHeight / L.body.size,
                    color: "#121212",
                }}
            >
                {certificateSentence(courseTitle)}
            </p>

            {/* Student signature */}
            {signatureUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={signatureUrl}
                    alt="Your signature"
                    className="absolute -translate-x-1/2 object-contain object-bottom"
                    style={{
                        left: px(L.studentLine.centerX),
                        bottom: fromBottom(L.studentLine.y + L.signature.gapAboveLine),
                        maxWidth: px(L.signature.maxWidth),
                        maxHeight: fromBottom(L.signature.maxHeight),
                    }}
                />
            )}

            {/* Name in capitals under the student line */}
            <div className="absolute flex -translate-x-1/2 justify-center" style={{ left: px(L.studentName.centerX), bottom: fromBottom(L.studentName.baselineY - L.studentName.size * 0.22) }}>
                <span
                    ref={capsRef}
                    data-scale={capsScale}
                    className={`${zilla.className} whitespace-nowrap leading-none`}
                    style={{ fontSize: `calc(${cqw(L.studentName.size)} * ${capsScale})`, color: "#6a1b9a" }}
                >
                    {displayName.toUpperCase()}
                </span>
            </div>
        </div>
    );
};

export default CertificatePreview;
