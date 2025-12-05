import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/src/components/website/Navbar"
import HeroBanner from "@/src/components/website/HeroBanner";
import CourseCard from "@/src/components/website/CourseCard";
import Footer from "@/src/components/website/Footer";
import { Suspense } from "react";
import Loading from "@/src/components/website/loading";

export const metadata: Metadata = {
    title: "Courses - Women Skills Hub",
    description: "The home for upskilling for financial independence"
};

const courses = [
    {
        slug: "html-from-basics-to-advanced",
        title: "HTML from Basics to Advanced",
        lectures: 32,
        level: "Beginner",
        price: 5000,
        rating: 4.9,
        image: "assets/img/courses-1.jpg"
    },
    {
        slug: "javascript-for-web-development",
        title: "JavaScript for Web Development",
        lectures: 45,
        level: "Advance",
        price: 3000,
        rating: 4.9,
        image: "assets/img/courses-2.jpg"
    },
    {
        slug: "uiux-design-essentials-designing-user-centered-interfaces",
        title: "UX/UI Design Essentials: Designing User-Centered Interfaces",
        lectures: 22,
        level: "Beginner",
        price: 10000,
        rating: 4.2,
        image: "assets/img/courses-3.jpg"
    },
    {
        slug: "web-development-bootcamp",
        title: "Web Development Bootcamp: Learn to Build Modern Websites",
        lectures: 48,
        level: "Beginner",
        price: 15000,
        rating: 4.2,
        image: "assets/img/courses-4.jpg"
    },
    {
        slug: "advanced-wordpress-techniques",
        title: "Advanced WordPress Techniques: Dive Deep into Styling and Layout",
        lectures: 65,
        level: "Advance",
        price: 20000,
        rating: 4.2,
        image: "assets/img/courses-5.jpg"
    },
    {
        slug: "backend-development-with-nodejs",
        title: "Backend Development with Node.js: Building Scalable Web Apps",
        lectures: 31,
        level: "Beginner",
        price: 10000,
        rating: 4.2,
        image: "assets/img/courses-6.jpg"
    },
    {
        slug: "python-unleashed-mastering",
        title: "Python Unleashed: Mastering",
        lectures: 45,
        level: "Advance",
        price: 5000,
        rating: 4.9,
        image: "assets/img/courses-7.jpg"
    },
];

const Courses = () => {
    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />
                <HeroBanner page="Courses" />

                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-xxl-12 col-lg-12 col-12">
                                <div className="row align-items-center g-3 mb-3">
                                    <div className="col-xxl-9 col-xl-8 col-lg-9 col-md-6 col-sm-12 col-12">
                                        We found <strong>142</strong> courses for you
                                    </div>
                                </div>
                                
                                <div className="row justify-content-center g-xl-3 g-4 mb-5 align-items-stretch">
                                    {courses.map((course) => (
                                        <CourseCard 
                                            key={course.slug} 
                                            slug={course.slug}
                                            title={course.title}
                                            lectures={course.lectures}
                                            level={course.level}
                                            price={course.price}
                                            rating={course.rating}
                                            image={course.image}
                                        />
                                    ))}
                                </div>
                                
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <ul className="pagination d-flex align-items-center justify-content-center">
                                                    <li className="page-item">
                                                        <a className="page-link" href="#" aria-label="Previous">
                                                            <span className="ti-arrow-left" />
                                                            <span className="sr-only">Previous</span>
                                                        </a>
                                                    </li>
                                                    <li className="page-item">
                                                        <a className="page-link" href="#">
                                                            1
                                                        </a>
                                                    </li>
                                                    <li className="page-item">
                                                        <a className="page-link" href="#">
                                                            2
                                                        </a>
                                                    </li>
                                                    <li className="page-item active">
                                                        <a className="page-link" href="#">
                                                            3
                                                        </a>
                                                    </li>
                                                    <li className="page-item">
                                                        <a className="page-link" href="#">
                                                            <i className="bi bi-three-dots" />
                                                        </a>
                                                    </li>
                                                    <li className="page-item">
                                                        <a className="page-link" href="#">
                                                            18
                                                        </a>
                                                    </li>
                                                    <li className="page-item">
                                                        <a className="page-link" href="#" aria-label="Next">
                                                            <span className="ti-arrow-right" />
                                                            <span className="sr-only">Next</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </Suspense>
    )
}
export default Courses