import type { Metadata } from "next";
import Navbar from "@/src/components/website/Navbar"
import CourseDetailsPage from "@/src/components/website/CourseDetailsPage";
import Footer from "@/src/components/website/Footer";
import { Suspense } from "react";
import Loading from "@/src/components/website/loading";
import { singleCourseWebsite } from "@/src/services/website/course";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        slug: string;
    };
}

// Fetch course data on the server BEFORE rendering
const getCourseData = async (slug: string) => {
    return await singleCourseWebsite(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = await getCourseData(slug);
    
    const title = result?.course?.seoTitle || 'Women Skills Hub - The home for upskilling for financial independence';
    const description = result?.course?.seoDescription || 'The home for upskilling for financial independence';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: result?.course?.thumbnail ? [{ url: result.course.thumbnail }] : [],
            type: 'article',
        },
    };
}

const CourseDetails = async ({params}: {params: Promise<{slug: string}>}) => {
    const { slug } = await params;

    const result = await singleCourseWebsite(slug);

    if (!result.course) {
        notFound();
    }

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />

                <CourseDetailsPage course={result.course} />

                <Footer />
            </div>
        </Suspense>
    )
}
export default CourseDetails