'use client';

/**
 * Route-level error boundary for the app directory.
 * Catches runtime errors thrown while rendering a route and its children.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import ErrorState from '@/src/components/website/ErrorState';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <ErrorState
            code="500"
            title="Something went wrong"
            description="An unexpected error occurred on our end. You can try again, or head back home while we look into it."
            icon={<AlertTriangle strokeWidth={1.75} />}
            footer={
                process.env.NODE_ENV === 'development' ? (
                    <details className="mx-auto max-w-md rounded-xl border border-border bg-muted/50 p-4">
                        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                            Error details (development only)
                        </summary>
                        <div className="mt-3 space-y-2 text-xs">
                            <div>
                                <p className="font-semibold text-foreground">Message</p>
                                <p className="break-words text-muted-foreground">{error.message}</p>
                            </div>
                            {error.digest && (
                                <div>
                                    <p className="font-semibold text-foreground">Digest</p>
                                    <p className="text-muted-foreground">{error.digest}</p>
                                </div>
                            )}
                            {error.stack && (
                                <div>
                                    <p className="font-semibold text-foreground">Stack</p>
                                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono text-muted-foreground">
                                        {error.stack}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </details>
                ) : null
            }
        >
            <Button onClick={reset} variant="hero" size="lg">
                <RotateCw />
                Try again
            </Button>
            <Button asChild variant="outline-hero" size="lg">
                <Link href="/">
                    <Home />
                    Back to Home
                </Link>
            </Button>
        </ErrorState>
    );
}
