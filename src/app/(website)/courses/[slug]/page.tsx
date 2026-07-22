import PageTransition from "@/src/components/PageTransition";
import Navbar from "@/src/components/website/Navbar";
import Footer from "@/src/components/website/Footer";
import CourseDetail from "@/src/views/website/CourseDetail";
import { singleCourseWebsite } from "@/src/services/website/course";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const result = await singleCourseWebsite(slug);
    const course = result.course;

    if (!course) {
        return {
            title: "Course - Women Skills Hub",
            description: "The home for upskilling for financial independence"
        };
    }

    return {
        title: course.seoTitle || `${course.title} - Women Skills Hub`,
        description: course.seoDescription || course.description || "The home for upskilling for financial independence",
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />

                <CourseDetail slug={slug} />

                <Footer />
            </div>
        </PageTransition>
    );
}
