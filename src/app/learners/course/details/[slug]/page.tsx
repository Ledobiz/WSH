import Navbar from "@/src/components/dashboard/Navbar";
import CourseDetailsPage from "@/src/components/dashboard/pages/CourseDetailsPage";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import { myCoursesUrl, studentDashboardUrl } from "@/src/utils/url";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Course Details - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const CourseDetails = async ({ params }: { params: Promise<{slug: string}>} ) => {
    const { slug } = await params;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Suspense fallback={<Loading />}>    
            <Navbar />

            <section
                className="bg-cover p-0"
                style={{ background: `url(${appUrl}/assets/img/student-bg.jpg)no-repeat` }}
                data-overlay={4}
            >
                <div className="container-fluid px-0">
                    <div className="ht-250" />
                </div>
            </section>

            <section className="pt-4">
                <div className="container">
                    <div className="row gx-xl-5">
                        <Sidebar />

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link href={studentDashboardUrl}>Student Dashboard</Link>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <Link href={myCoursesUrl}>My Courses</Link>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Details
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            
                            
                            <div className="row mb-4">
                                <CourseDetailsPage courseId={slug} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </Suspense>
    )
}
export default CourseDetails