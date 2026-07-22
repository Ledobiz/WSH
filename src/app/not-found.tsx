import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, BookOpen } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import ErrorState from "@/src/components/website/ErrorState";
import { coursesUrl } from "@/src/utils/url";

export const metadata: Metadata = {
    title: "Page Not Found - Women Skills Hub",
    description: "The page you are looking for could not be found.",
};

const NotFound = () => {
    return (
        <ErrorState
            code="404"
            title="We couldn't find that page"
            description="The page you're looking for may have been moved, renamed, or never existed. Let's get you back on track."
            icon={<Compass strokeWidth={1.75} />}
        >
            <Button asChild variant="hero" size="lg">
                <Link href="/">
                    <Home />
                    Back to Home
                </Link>
            </Button>
            <Button asChild variant="outline-hero" size="lg">
                <Link href={coursesUrl}>
                    <BookOpen />
                    Browse Courses
                </Link>
            </Button>
        </ErrorState>
    );
};

export default NotFound;
