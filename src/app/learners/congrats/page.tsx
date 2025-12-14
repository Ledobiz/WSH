import Navbar from "@/src/components/dashboard/Navbar";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Congrats - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const page = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <div id="page-wrapper">
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

            <section className="pt-4">
                <div className="container">
                    <div className="row gx-xl-5">
                        <Sidebar />

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <section>
                                <div className="container">
                                    <div className="row justify-content-center">
                                        <div className="col-xl-7 col-lg-8 col-md-12">
                                            <div className="thankyou-wrap text-center">
                                                <div className="square--90 circle bg-green text-light mx-auto mb-4">
                                                    <i className="bi bi-patch-check-fill fs-1" />
                                                </div>
                                                <h2 className="text-dark">
                                                    Course submission completed successfully.
                                                </h2>
                                                <p>
                                                    Thank you for submitting your item. We will review it shortly and
                                                    notify you by email once your course has been accepted. Please
                                                    ensure that your{" "}
                                                    <a href="#" className="text-main">
                                                    Payment and Tax information
                                                    </a>{" "}
                                                    is accurate and up to date.
                                                </p>
                                                <a href="index.html" className="btn btn-light-main mt-4 mb-5">
                                                    Back to Homepage
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default page