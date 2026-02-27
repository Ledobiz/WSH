import type { Metadata } from "next";
import Navbar from "@/src/components/website/Navbar"
import Footer from "@/src/components/website/Footer";
import { Suspense } from "react";
import Loading from "@/src/components/website/loading";
import { singleCategoryCourses } from "@/src/services/website/course";
import { notFound } from "next/navigation";
import CategoryCourses from "@/src/components/website/CategoryCourses";
import Link from "next/link";

interface PageProps {
    params: {
        slug: string;
    };
}

// Fetch course data on the server BEFORE rendering
const getCategoryData = async (slug: string) => {
    return await singleCategoryCourses(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = await getCategoryData(slug);

    const categoryTitle = result?.category ? `${result?.category?.name} Courses` : null;
    
    const title = categoryTitle || 'Women Skills Hub - The home for upskilling for financial independence';
    const description = `Browse through all our courses under ${categoryTitle}`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description
        },
    };
}

const Category = async ({params}: {params: Promise<{slug: string}>}) => {
    const { slug } = await params;

    const result = await singleCategoryCourses(slug);

    if (!result.category) {
        notFound();
    }

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />

                <section className="bg-gredient page-title" style={{paddingTop: '150px'}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className="breadcrumb m-0">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb simple light">
                                            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">{`Category / ${result?.category?.name}`}</li>
                                        </ol>
                                    </nav>
                                </div>
                                <div className="pageTitle-wrap">
                                    <h1 className="text-light">{`${result?.category?.name} Courses`}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <CategoryCourses courses={result.category.courses} />

                <Footer />
            </div>
        </Suspense>
    )
}
export default Category