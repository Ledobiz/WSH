'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Eraser, Undo2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

type Point = { x: number; y: number };

export interface SignaturePadHandle {
    isEmpty: () => boolean;
    /** Transparent PNG cropped to the ink, or null if nothing was drawn. */
    toPngBlob: () => Promise<Blob | null>;
    clear: () => void;
}

interface SignaturePadProps {
    onChange?: (hasInk: boolean) => void;
}

const INK = "#111111";

const lineWidthFor = (canvas: HTMLCanvasElement) => Math.max(2, canvas.clientWidth / 220);

// Draws strokes (stored as normalised 0..1 points) onto a context of size w x h.
const paintStrokes = (ctx: CanvasRenderingContext2D, strokes: Point[][], w: number, h: number, lineWidth: number) => {
    ctx.strokeStyle = INK;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    for (const stroke of strokes) {
        if (stroke.length === 0) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x * w, stroke[0].y * h);
        if (stroke.length === 1) ctx.lineTo(stroke[0].x * w + 0.1, stroke[0].y * h);
        for (let i = 1; i < stroke.length - 1; i++) {
            // Smooth with quadratic curves through midpoints.
            const mx = ((stroke[i].x + stroke[i + 1].x) / 2) * w;
            const my = ((stroke[i].y + stroke[i + 1].y) / 2) * h;
            ctx.quadraticCurveTo(stroke[i].x * w, stroke[i].y * h, mx, my);
        }
        if (stroke.length > 1) {
            const last = stroke[stroke.length - 1];
            ctx.lineTo(last.x * w, last.y * h);
        }
        ctx.stroke();
    }
};

// Lightweight signature pad (mouse, touch and pen via Pointer Events).
const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(({ onChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const strokesRef = useRef<Point[][]>([]);
    const drawingRef = useRef(false);
    const [hasInk, setHasInk] = useState(false);

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paintStrokes(ctx, strokesRef.current, canvas.clientWidth, canvas.clientHeight, lineWidthFor(canvas));
    }, []);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        redraw();
    }, [redraw]);

    useEffect(() => {
        resize();
        const observer = new ResizeObserver(resize);
        if (canvasRef.current) observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, [resize]);

    const update = (next: boolean) => {
        setHasInk(next);
        onChange?.(next);
    };

    const pointAt = (canvas: HTMLCanvasElement, clientX: number, clientY: number): Point => {
        const rect = canvas.getBoundingClientRect();
        return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
    };

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        drawingRef.current = true;
        strokesRef.current.push([pointAt(e.currentTarget, e.clientX, e.clientY)]);
        redraw();
        if (!hasInk) update(true);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current) return;
        e.preventDefault();
        const stroke = strokesRef.current[strokesRef.current.length - 1];
        const coalesced = typeof e.nativeEvent.getCoalescedEvents === "function" ? e.nativeEvent.getCoalescedEvents() : [];
        const events = coalesced.length ? coalesced : [e.nativeEvent];
        for (const ev of events) stroke.push(pointAt(e.currentTarget, ev.clientX, ev.clientY));
        redraw();
    };

    const onPointerUp = () => { drawingRef.current = false; };

    const clear = () => {
        strokesRef.current = [];
        redraw();
        update(false);
    };

    const undo = () => {
        strokesRef.current.pop();
        redraw();
        update(strokesRef.current.length > 0);
    };

    useImperativeHandle(ref, () => ({
        isEmpty: () => strokesRef.current.length === 0,
        clear,
        toPngBlob: async () => {
            const source = canvasRef.current;
            if (!source || strokesRef.current.length === 0) return null;

            // Crop to the ink bounds (plus padding) and export at 3x for a crisp PDF.
            const w = source.clientWidth;
            const h = source.clientHeight;
            const lineWidth = lineWidthFor(source);
            const all = strokesRef.current.flat();
            const pad = lineWidth * 2;
            const minX = Math.max(0, Math.min(...all.map((p) => p.x * w)) - pad);
            const minY = Math.max(0, Math.min(...all.map((p) => p.y * h)) - pad);
            const maxX = Math.min(w, Math.max(...all.map((p) => p.x * w)) + pad);
            const maxY = Math.min(h, Math.max(...all.map((p) => p.y * h)) + pad);

            const scale = 3;
            const out = document.createElement("canvas");
            out.width = Math.max(1, Math.round((maxX - minX) * scale));
            out.height = Math.max(1, Math.round((maxY - minY) * scale));
            const ctx = out.getContext("2d")!;
            ctx.scale(scale, scale);
            ctx.translate(-minX, -minY);
            paintStrokes(ctx, strokesRef.current, w, h, lineWidth);

            return new Promise((resolve) => out.toBlob((blob) => resolve(blob), "image/png"));
        },
    }));

    return (
        <div>
            <div className="relative rounded-xl border-2 border-dashed border-border bg-white">
                <canvas
                    ref={canvasRef}
                    aria-label="Signature pad. Draw your signature here."
                    className="block h-44 w-full touch-none cursor-crosshair rounded-xl"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                />
                <div className="pointer-events-none absolute inset-x-6 bottom-10 border-b border-muted-foreground/30" />
                {!hasInk && (
                    <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-muted-foreground">
                        Sign here with your finger, mouse or stylus
                    </p>
                )}
            </div>
            <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={undo} disabled={!hasInk} className="cursor-pointer">
                    <Undo2 className="mr-1 h-4 w-4" /> Undo
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={!hasInk} className="cursor-pointer">
                    <Eraser className="mr-1 h-4 w-4" /> Clear
                </Button>
            </div>
        </div>
    );
});

SignaturePad.displayName = "SignaturePad";

export default SignaturePad;
