'use client';

/**
 * Root-level error boundary. Replaces the root layout when an error is thrown
 * in the layout itself, so it must render its own <html>/<body> and cannot rely
 * on the app's global stylesheet — all styling here is self-contained.
 */

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Critical application error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                <style>{`
                    .wsh-ge-wrap {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem 1rem;
                        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background: #ffffff;
                        color: #1c1a20;
                        overflow: hidden;
                        position: relative;
                    }
                    .wsh-ge-glow {
                        position: absolute;
                        border-radius: 9999px;
                        filter: blur(80px);
                        pointer-events: none;
                    }
                    .wsh-ge-glow.one { top: -6rem; left: -6rem; width: 20rem; height: 20rem; background: rgba(120, 34, 154, 0.18); }
                    .wsh-ge-glow.two { bottom: -6rem; right: -6rem; width: 20rem; height: 20rem; background: rgba(246, 168, 35, 0.20); }
                    .wsh-ge-card { position: relative; text-align: center; max-width: 32rem; width: 100%; }
                    .wsh-ge-badge {
                        margin: 0 auto 2rem; width: 4rem; height: 4rem; border-radius: 1rem;
                        display: flex; align-items: center; justify-content: center;
                        background: rgba(120, 34, 154, 0.10); color: hsl(282, 70%, 35%);
                        box-shadow: inset 0 0 0 1px rgba(120, 34, 154, 0.20);
                    }
                    .wsh-ge-code {
                        margin: 0; font-size: 7rem; line-height: 1; font-weight: 800; letter-spacing: -0.03em;
                        background-image: linear-gradient(135deg, hsl(282, 70%, 35%), hsl(40, 92%, 55%));
                        -webkit-background-clip: text; background-clip: text; color: transparent;
                    }
                    .wsh-ge-title { margin: 0.5rem 0 0; font-size: 1.75rem; font-weight: 600; }
                    .wsh-ge-desc { margin: 0.75rem auto 0; max-width: 28rem; font-size: 1rem; color: #6b6873; }
                    .wsh-ge-actions { margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
                    .wsh-ge-btn {
                        display: inline-flex; align-items: center; gap: 0.5rem;
                        height: 2.75rem; padding: 0 2rem; border-radius: 0.5rem;
                        font-size: 0.95rem; font-weight: 600; cursor: pointer;
                        border: 2px solid transparent; text-decoration: none; transition: all 0.2s ease;
                    }
                    .wsh-ge-btn.primary { background: hsl(282, 70%, 35%); color: #ffffff; }
                    .wsh-ge-btn.primary:hover { background: hsl(282, 70%, 30%); }
                    .wsh-ge-btn.outline { background: transparent; color: hsl(282, 70%, 35%); border-color: hsl(282, 70%, 35%); }
                    .wsh-ge-btn.outline:hover { background: hsl(282, 70%, 35%); color: #ffffff; }
                    @media (prefers-color-scheme: dark) {
                        .wsh-ge-wrap { background: #0e0d11; color: #f2f1f4; }
                        .wsh-ge-desc { color: #9d99a5; }
                        .wsh-ge-badge { background: rgba(190, 130, 220, 0.12); color: hsl(282, 50%, 70%); box-shadow: inset 0 0 0 1px rgba(190, 130, 220, 0.25); }
                        .wsh-ge-code { background-image: linear-gradient(135deg, hsl(282, 50%, 70%), hsl(40, 92%, 55%)); }
                        .wsh-ge-btn.primary { background: hsl(282, 50%, 70%); color: #0e0d11; }
                        .wsh-ge-btn.primary:hover { background: hsl(282, 50%, 64%); }
                        .wsh-ge-btn.outline { color: hsl(282, 50%, 70%); border-color: hsl(282, 50%, 70%); }
                        .wsh-ge-btn.outline:hover { background: hsl(282, 50%, 70%); color: #0e0d11; }
                    }
                    @media (max-width: 480px) { .wsh-ge-code { font-size: 5rem; } }
                `}</style>

                <main className="wsh-ge-wrap">
                    <div className="wsh-ge-glow one" aria-hidden />
                    <div className="wsh-ge-glow two" aria-hidden />

                    <div className="wsh-ge-card">
                        <div className="wsh-ge-badge" aria-hidden>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>

                        <p className="wsh-ge-code">500</p>
                        <h1 className="wsh-ge-title">A critical error occurred</h1>
                        <p className="wsh-ge-desc">
                            Something went seriously wrong and the page couldn&apos;t load. Please refresh to try again.
                        </p>

                        <div className="wsh-ge-actions">
                            <button type="button" className="wsh-ge-btn primary" onClick={reset}>
                                Try again
                            </button>
                            <a href="/" className="wsh-ge-btn outline">
                                Back to Home
                            </a>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
