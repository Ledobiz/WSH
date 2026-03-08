'use client'

import { categoryCourses } from "@/src/services/website/course";
import { getTotalLectures } from "@/src/utils/client_functions";
import { categoryUrl, registerUrl } from "@/src/utils/url";
import Link from "next/link";
import { useEffect, useState } from "react"
import { Prisma } from "@prisma/client";
import ButtonLoader from "../admin/ButtonLoader";
import CourseCard from "./CourseCard";

type CategoryInterface = Prisma.CategoryGetPayload<{
    include: {
        courses: {
            include: {
                courseModules: {
                    where: { deletedAt: null },
                    include: {
                        moduleComponents: true;
                    }
                }
            }
        }
    }
}>;

const Homepage = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    
    useEffect(() => {
        const fetchCategories = async () => {
            const dbcategories = await categoryCourses();
            setCategories(dbcategories.categories);
            setLoadingCategories(false);
        }

        fetchCategories();
    }, []);

    return (
        <>
            <section>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="sec-heading center">
                                <h2>Work &amp; Process</h2>
                                <p>Learn high-impact, career-focused courses designed for women — from digital skills to business, crafts, and professional development.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center gx-xl-5 g-4">
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="prc-wraps">
                                <div className="prc-icons mb-3">
                                    <div className="square--80 circle bg-light-green mx-auto">
                                        <span className="text-green fs-3">
                                            <i className="bi bi-search" />
                                        </span>
                                    </div>
                                </div>
                                <div className="prc-caption text-center">
                                    <h4>Explore Skill-Based Courses</h4>
                                    <p className="text-muted-2">
                                        Browse beginner to advanced classes in cake making, mocktails, paper crafts and more.
                                    </p>
                                </div>
                            </div>
                        </div>
                    
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="prc-wraps">
                                <div className="prc-icons mb-3">
                                    <div className="square--80 circle bg-light-main mx-auto">
                                        <span className="text-main fs-3">
                                            <i className="bi bi-calendar-date" />
                                        </span>
                                    </div>
                                </div>
                                <div className="prc-caption text-center">
                                    <h4>Enroll & Learn at Your Pace</h4>
                                    <p className="text-muted-2">
                                        Start right away — online or in-person options available with flexible schedules.
                                    </p>
                                </div>
                            </div>
                        </div>
                    
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="prc-wraps">
                                <div className="prc-icons mb-3">
                                    <div className="square--80 circle bg-light-red mx-auto">
                                        <span className="text-red fs-3">
                                            <i className="bi bi-shield-fill-check" />
                                        </span>
                                    </div>
                                </div>
                                <div className="prc-caption text-center">
                                    <h4>Earn a Certification & Build Your Future</h4>
                                    <p className="text-muted-2">
                                        Receive certificates to showcase your learning and boost your career.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="border-top">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="sec-heading center">
                                <h2>Explore Our Courses</h2>
                                <p>
                                    Learn from Industry Expert and Advance Your Career with Practical
                                    Skills
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row justify-content-center">
                        {loadingCategories ? <ButtonLoader /> : (
                            <>
                                <div className="col-xl-12 col-lg-12 col-12">
                                    <ul
                                        className="nav nav-tabs simple smalls scroll-tab align-items-center justify-content-center border-0 mb-4"
                                        id="courseTab"
                                        role="tablist"
                                    >
                                        {categories?.map((category, index) => (
                                            <li key={category.id} className={`nav-item ${index == 0 ? 'ms-0' : ''}`} role="presentation">
                                                <a
                                                    className={`nav-link ${index == 0 ? 'active' : ''}`}
                                                    id={`${category.id}-tab`}
                                                    data-bs-toggle="pill"
                                                    href={`#${category.id}`}
                                                    role="tab"
                                                    aria-controls={category.id}
                                                    aria-selected={index == 0 ? 'true' : 'false'}
                                                    tabIndex={index == 0 ? 0 : -1}
                                                >
                                                    {category.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            
                                <div className="col-xl-12 col-lg-12 col-12">
                                    <div className="tab-content" id="courseTabContent">
                                        {categories?.map((category, index) => (
                                            <div
                                                key={category.id}
                                                className={`tab-pane fade ${index == 0 ? 'show active' : ''}`}
                                                id={category.id}
                                                role="tabpanel"
                                                aria-labelledby={`${category.id}-tab`}
                                                tabIndex={0}
                                            >
                                                <div className="row justify-content-center g-3">
                                                    {category?.courses?.map((course) => (
                                                        <CourseCard
                                                            key={course.id}
                                                            course={course} 
                                                            slug={course.slug}
                                                            title={course.title}
                                                            lectures={getTotalLectures(course)}
                                                            originalPrice={course.originalFee}
                                                            discountedPrice={course.discountedFee}
                                                            image={course.thumbnail ?? ''}
                                                            isFree={course.isFree}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
            
            <section className="bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="sec-heading center">
                                <h2>Discover Categories</h2>
                                <p>Browse a Wide Range of Subjects to Start Learning What You Love</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row justify-content-center g-4">
                        {loadingCategories ? <ButtonLoader /> : (
                            categories?.map((category) => (
                                <div key={category.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                    <Link href={`${categoryUrl}/${category.slug}`} className="card-hover p-4 rounded-3 card card-body d-flex flex-column gap-3 m-0">
                                        {/* <div className="icon-wraps">
                                            <span className="icon-slap fs-1">
                                                <i className="bi bi-code-slash" />
                                            </span>
                                        </div> */}
                                        <div>
                                            <h4 className="text-dark fw-normal mb-0 lh-base">
                                                {category.name}
                                            </h4>
                                            <span className="text-muted-2">
                                                <span className="fw-semibold me-1">{category.courses.length}</span>{category.courses.length > 1 ? 'Courses' : 'Course'}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
            
            <section>
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="benifit-oflearning">
                                <div className="d-block mb-4">
                                    <h2>Benifit of Women Skills Hub</h2>
                                    <p>
                                        We’re empowering women with practical, income-generating skills.
                                        Whether you’re starting a business, switching careers, or earning more income, Women Skills Hub equips you with real skills that pay real results.
                                    </p>
                                </div>
                                <div className="benifit-wraps mb-4">
                                    <div className="d-flex flex-column gap-4">
                                        <div className="d-flex align-items-center justify-content-start gap-3">
                                            <div className="icons">
                                                <span className="square--50 circle bg-light-green fs-5">
                                                    <i className="bi bi-patch-check-fill text-green" />
                                                </span>
                                            </div>
                                            <div className="caps">
                                                <h5>100% online, flexible learning</h5>
                                                <p className="text-muted-2 m-0">Life-time access to courses and materials and you learn at your own pace.</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-start gap-3">
                                            <div className="icons">
                                                <span className="square--50 circle bg-light-green fs-5">
                                                    <i className="bi bi-patch-check-fill text-green" />
                                                </span>
                                            </div>
                                            <div className="caps">
                                                <h5>Hands-on, practical lessons</h5>
                                                <p className="text-muted-2 m-0">We teach you skills you can apply immediately. Things we practice are directly applicable to real-world scenarios.</p>
                                            </div>
                                        </div>
                            
                                        <div className="d-flex align-items-center justify-content-start gap-3">
                                            <div className="icons">
                                                <span className="square--50 circle bg-light-green fs-5">
                                                    <i className="bi bi-patch-check-fill text-green" />
                                                </span>
                                            </div>
                                            <div className="caps">
                                                <h5>Courses delivered as advertised</h5>
                                                <p className="text-muted-2 m-0">
                                                    No hidden fees or surprise charges. What you see is what you get.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a href={registerUrl} className="btn btn-main rounded-pill px-5">
                                    Create an Account
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="facts-img">
                                <img src={`${appUrl}/assets/img/hero-img-2.png`} className="img-fluid" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* <section className="bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="sec-heading center">
                                <h2>Hear from Our Students</h2>
                                <p>
                                    Discover What Learners Around the World Are Saying About Our Courses
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-12 col-lg-12">
                        <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="card-hover p-4 rounded-3 card card-body m-0">
                                    <div className="rating-star">
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="review-caption d-block mb-4">
                                        <h5 className="text-dark fw-semibold mb-0 lh-base">
                                            "Awesome service and courses."
                                        </h5>
                                        <p className="text-muted-2">
                                            In a professional context it often happens that private or
                                            corporate clients corder a publication to be made and
                                            presented with the actual.
                                        </p>
                                    </div>
                                    <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                                        <div className="revierwer-avatar d-flex align-items-center gap-2">
                                            <div className="avatar-box">
                                                <img
                                                    src={`${appUrl}/assets/img/avatar-1.jpg`}
                                                    className="img-fluid square--50 circle"
                                                    alt="Avatar Image"
                                                />
                                            </div>
                                            <div className="reviewer-caps">
                                                <h6 className="fw-semibold text-dark m-0">Taylor Morgan</h6>
                                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                            </div>
                                        </div>
                                        <div className="reviewer-post">
                                            <span className="badge bg-green rounded-pill">Student</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="card-hover p-4 rounded-3 card card-body m-0">
                                    <div className="rating-star">
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="review-caption d-block mb-4">
                                        <h5 className="text-dark fw-semibold mb-0 lh-base">
                                            "Awesome service and courses."
                                        </h5>
                                        <p className="text-muted-2">
                                            In a professional context it often happens that private or
                                            corporate clients corder a publication to be made and
                                            presented with the actual.
                                        </p>
                                    </div>
                                    <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                                        <div className="revierwer-avatar d-flex align-items-center gap-2">
                                            <div className="avatar-box">
                                                <img
                                                    src={`${appUrl}/assets/img/avatar-2.jpg`}
                                                    className="img-fluid square--50 circle"
                                                    alt="Avatar Image"
                                                />
                                            </div>
                                            <div className="reviewer-caps">
                                                <h6 className="fw-semibold text-dark m-0">Cameron Lee</h6>
                                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                            </div>
                                        </div>
                                        <div className="reviewer-post">
                                            <span className="badge bg-green rounded-pill">Student</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="card-hover p-4 rounded-3 card card-body m-0">
                                    <div className="rating-star">
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                        </div>
                                        <div className="review-caption d-block mb-4">
                                            <h5 className="text-dark fw-semibold mb-0 lh-base">
                                                "Awesome service and courses."
                                            </h5>
                                            <p className="text-muted-2">
                                                In a professional context it often happens that private or
                                                corporate clients corder a publication to be made and
                                                presented with the actual.
                                            </p>
                                        </div>
                                        <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                                            <div className="revierwer-avatar d-flex align-items-center gap-2">
                                                <div className="avatar-box">
                                                    <img
                                                        src={`${appUrl}/assets/img/avatar-3.jpg`}
                                                        className="img-fluid square--50 circle"
                                                        alt="Avatar Image"
                                                    />
                                                </div>
                                                <div className="reviewer-caps">
                                                    <h6 className="fw-semibold text-dark m-0">Jamie Brooks</h6>
                                                    <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                                </div>
                                            </div>
                                            <div className="reviewer-post">
                                                <span className="badge bg-green rounded-pill">Student</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="card-hover p-4 rounded-3 card card-body m-0">
                                    <div className="rating-star">
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="review-caption d-block mb-4">
                                        <h5 className="text-dark fw-semibold mb-0 lh-base">
                                            "Awesome service and courses."
                                        </h5>
                                        <p className="text-muted-2">
                                            In a professional context it often happens that private or
                                            corporate clients corder a publication to be made and
                                            presented with the actual.
                                        </p>
                                    </div>
                                    <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                                        <div className="revierwer-avatar d-flex align-items-center gap-2">
                                            <div className="avatar-box">
                                                <img
                                                    src={`${appUrl}/assets/img/avatar-4.jpg`}
                                                    className="img-fluid square--50 circle"
                                                    alt="Avatar Image"
                                                />
                                            </div>
                                            <div className="reviewer-caps">
                                                <h6 className="fw-semibold text-dark m-0">Riley James</h6>
                                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                            </div>
                                        </div>
                                        <div className="reviewer-post">
                                            <span className="badge bg-green rounded-pill">Student</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="card-hover p-4 rounded-3 card card-body m-0">
                                    <div className="rating-star">
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="review-caption d-block mb-4">
                                        <h5 className="text-dark fw-semibold mb-0 lh-base">
                                            "Awesome service and courses."
                                        </h5>
                                        <p className="text-muted-2">
                                            In a professional context it often happens that private or
                                            corporate clients corder a publication to be made and
                                            presented with the actual.
                                        </p>
                                    </div>
                                    <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                                        <div className="revierwer-avatar d-flex align-items-center gap-2">
                                            <div className="avatar-box">
                                                <img
                                                    src={`${appUrl}/assets/img/avatar-5.jpg`}
                                                    className="img-fluid square--50 circle"
                                                    alt="Avatar Image"
                                                />
                                            </div>
                                            <div className="reviewer-caps">
                                                <h6 className="fw-semibold text-dark m-0">Casey Allen</h6>
                                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                            </div>
                                        </div>
                                        <div className="reviewer-post">
                                            <span className="badge bg-green rounded-pill">Student</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="card-hover p-4 rounded-3 card card-body m-0">
                                    <div className="rating-star">
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                            <span className="text-warning">
                                                <i className="bi bi-star-fill" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="review-caption d-block mb-4">
                                        <h5 className="text-dark fw-semibold mb-0 lh-base">
                                            "Awesome service and courses."
                                        </h5>
                                        <p className="text-muted-2">
                                            In a professional context it often happens that private or
                                            corporate clients corder a publication to be made and
                                            presented with the actual.
                                        </p>
                                    </div>
                                    <div className="d-flex bg-light align-items-center justify-content-between rounded-3 p-3">
                                        <div className="revierwer-avatar d-flex align-items-center gap-2">
                                            <div className="avatar-box">
                                                <img
                                                    src={`${appUrl}/assets/img/avatar-6.jpg`}
                                                    className="img-fluid square--50 circle"
                                                    alt="Avatar Image"
                                                />
                                            </div>
                                            <div className="reviewer-caps">
                                                <h6 className="fw-semibold text-dark m-0">Jordan Blake</h6>
                                                <p className="text-muted-2 m-0 text-mid">10 Jul 2025</p>
                                            </div>
                                        </div>
                                        <div className="reviewer-post">
                                            <span className="badge bg-green rounded-pill">Student</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            
            <section
                className="bg-cover newsletter bg-main position-relative"
                style={{ background: "url(assets/img/subscribe-bg.png)" }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                            <div className="text-start">
                                <div className="subscribe-caption d-block mb-4">
                                    <div className="d-flex align-items-center mb-1">
                                        <span className="label bg-warning rounded-pill text-dark">
                                            <i className="bi bi-patch-check me-2" />
                                            Get Certificate
                                        </span>
                                    </div>
                                    <h2 className="fs-1 lh-base text-light">
                                        Advance Your Learning with Women Skills Hub
                                    </h2>
                                    <p className="text-light opacity-75">
                                        Subscribe our newsletter &amp; get latest news and updation!
                                    </p>
                                </div>
                                <div className="d-block join-block">
                                    <div className="d-flex align-items-center justify-content-start flex-wrap gap-3">
                                        <a href={registerUrl} className="btn mid btn-whites rounded-pill px-4">
                                            Get Started Today
                                            <i className="bi bi-send ms-2" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="position-absolute end-0 bottom-0 d-none d-lg-block">
                    <img
                        src={`${appUrl}/assets/img/subscribe-shapes.png`}
                        className="img-fluid"
                        width={500}
                        alt="Image"
                    />
                </div>
            </section>
        </>
    )
}
export default Homepage