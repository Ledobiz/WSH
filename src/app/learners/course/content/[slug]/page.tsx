import Navbar from "@/src/components/dashboard/Navbar";
import CourseLecturePage from "@/src/components/dashboard/pages/CourseLecturePage";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import Loading from "@/src/components/website/loading"
import { Metadata } from "next";
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Course Content - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const MyCourses = async ({ params }: { params: Promise<{slug: string}>} ) => {
    const { slug } = await params;
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <Suspense fallback={<Loading />}>
            <Navbar />

            <section
                className="bg-cover p-0 d-none d-md-block"
                style={{ background: `url(${appUrl}/assets/img/student-bg.jpg)no-repeat` }}
                data-overlay={4}
            >
                <div className="container-fluid px-0">
                    <div className="ht-250" />
                </div>
            </section>

            <div className="container-fluid py-4">
                <div className="row gx-xl-5">
                    <Sidebar />

                    <CourseLecturePage courseId={slug} />
                </div>
            </div>
            
            <Footer />
        </Suspense>
    )
}
export default MyCourses