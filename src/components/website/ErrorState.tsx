import { ReactNode } from "react";

interface ErrorStateProps {
    /** Large status code shown as the hero number, e.g. "404" or "500". */
    code: string;
    /** Short headline describing the error. */
    title: string;
    /** Supporting copy explaining what happened / what to do next. */
    description: string;
    /** Icon rendered inside the badge above the code. */
    icon: ReactNode;
    /** Action buttons (typically Home / retry / browse). */
    children?: ReactNode;
    /** Optional extra content rendered below the actions (e.g. dev-only details). */
    footer?: ReactNode;
}

/**
 * Branded, full-screen error layout shared by the 404 and 500 pages.
 * Uses the design-system tokens so it adapts to light and dark themes.
 */
const ErrorState = ({ code, title, description, icon, children, footer }: ErrorStateProps) => {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
            {/* Decorative gradient glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="w-full max-w-lg text-center">
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 [&_svg]:h-8 [&_svg]:w-8">
                    {icon}
                </div>

                <h1
                    className="select-none font-display text-[7rem] font-extrabold leading-none tracking-tight text-transparent sm:text-[9rem]"
                    style={{
                        backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                    }}
                >
                    {code}
                </h1>

                <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
                <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">{description}</p>

                {children && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {children}
                    </div>
                )}

                {footer && <div className="mt-8 text-left">{footer}</div>}
            </div>
        </main>
    );
};

export default ErrorState;
