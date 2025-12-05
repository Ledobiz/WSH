import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/src/components/website/Navbar"
import CourseDetailsBanner from "@/src/components/website/CourseDetailsBanner";
import Footer from "@/src/components/website/Footer";
import { Suspense } from "react";
import Loading from "@/src/components/website/loading";

interface PageProps {
  params: {
    slug: string;
  };
}

// Fetch course data on the server BEFORE rendering
const getCourseData = async (slug: string) => {
    // Replace with your actual database query or API call
    const response = await fetch(`${process.env.BACKEND_URL}/api/courses/${slug}`, { 
        next: { revalidate: 3600 } 
    });
  
    if (!response.ok) throw new Error('Course not found');
    return response.json();
}

// Generate metadata using fetched data
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    /*const course = await getCourseData(params.slug);
    
    return {
        title: course.title,
        description: course.description,
        openGraph: {
            title: course.title,
            description: course.description,
            images: [{ url: course.image }],
            type: 'article',
        },
    };*/
}

const CourseDetailsPage = async ({params}: {params: Promise<{slug: string}>}) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const { slug } = await params
    console.log(slug);
    
    //const course = await getCourseData(slug);

    return (
        <Suspense fallback={<Loading />}>
            <div id="main-wrapper">
                <Navbar />

                <CourseDetailsBanner title="Ruby on Rails Program"
                    description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore. veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                    duration="10 - 20 weeks" 
                    lectures={20}
                    totalEnrolled={20}
                    level="Beginner"
                />

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-12 pe-xl-4">
                                <div className="edu_wraper border">
                                    <h4 className="edu_title">Course Overview</h4>
                                    <p>
                                        Learn the fundamental principles and practices of modern web design
                                        in this comprehensive course. Whether you're a beginner or looking
                                        to refresh your skills, you'll dive into HTML5, CSS3, responsive
                                        design, and more. Get hands-on experience with industry tools and
                                        create stunning websites from scratch.
                                    </p>
                                    <p>
                                        Unlock your creativity and master the art of web design with this
                                        all-in-one course. You'll start from the ground up—learning how
                                        websites work, how to structure content using HTML, style it with
                                        CSS, and make it come alive with JavaScript. This course blends
                                        theory with real-world projects to ensure you're job-ready by the
                                        end. Perfect for beginners or anyone looking to build beautiful,
                                        user-friendly websites from scratch.
                                    </p>
                                    
                                    <div className="who-enrolled-block mt-4">
                                        <h5 className="edu_title mb-2">Who Should Enroll?</h5>
                                        <ul className="features-list">
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Beginners interested in starting a career in web design
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Developers looking to expand their skills into design
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Anyone wanting to create their own websites or improve existing
                                                ones
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Students pursuing careers in tech, design, or media
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Freelancers who want to expand their service offerings
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Graphic designers looking to transition into UI/UX or web design
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle" />
                                                Entrepreneurs and business owners who want to build or maintain
                                                their own websites
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="edu_wraper border">
                                    <h4 className="edu_title">Course Circullum</h4>
                                    <div id="accordionExample" className="accordion circullum">
                                        <div className="card border shadow-0 mb-3">
                                            <div id="headingOne" className="card-header">
                                                <h6 className="mb-0 accordion_title">
                                                    <a
                                                        href="#"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseOne"
                                                        aria-expanded="true"
                                                        aria-controls="collapseOne"
                                                        className="d-block position-relative text-dark collapsible-link py-2"
                                                    >
                                                        Part 01: How To Learn Web Designing Step by Step
                                                    </a>
                                                </h6>
                                            </div>
                                            <div
                                                id="collapseOne"
                                                aria-labelledby="headingOne"
                                                data-parent="#accordionExample"
                                                className="collapse show"
                                            >
                                                <div className="card-body">
                                                    <ul className="lectures_lists">
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 01
                                                            </div>
                                                            Web Designing Beginner
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 02
                                                            </div>
                                                            Startup Designing with HTML5 &amp; CSS3
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 03
                                                            </div>
                                                            How To Call Google Map iFrame
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 04
                                                            </div>
                                                            Create Drop Down Navigation Using CSS3
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 05
                                                            </div>
                                                            How to Create Sticky Navigation Using JS
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                
                                        <div className="card border shadow-0 mb-3">
                                            <div id="headingTwo" className="card-header">
                                                <h6 className="mb-0 accordion_title">
                                                    <a
                                                        href="#"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseTwo"
                                                        aria-expanded="false"
                                                        aria-controls="collapseTwo"
                                                        className="d-block position-relative collapsed text-dark collapsible-link py-2"
                                                    >
                                                        Part 02: Learn Web Designing in Basic Level
                                                    </a>
                                                </h6>
                                            </div>
                                            <div
                                                id="collapseTwo"
                                                aria-labelledby="headingTwo"
                                                data-parent="#accordionExample"
                                                className="collapse"
                                            >
                                                <div className="card-body">
                                                    <ul className="lectures_lists">
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 01
                                                            </div>
                                                            Web Designing Beginner
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 02
                                                            </div>
                                                            Startup Designing with HTML5 &amp; CSS3
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 03
                                                            </div>
                                                            How To Call Google Map iFrame
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 04
                                                            </div>
                                                            Create Drop Down Navigation Using CSS3
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 05
                                                            </div>
                                                            How to Create Sticky Navigation Using JS
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="card border shadow-0 mb-3">
                                            <div id="headingThree" className="card-header">
                                                <h6 className="mb-0 accordion_title">
                                                    <a
                                                        href="#"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseThree"
                                                        aria-expanded="false"
                                                        aria-controls="collapseThree"
                                                        className="d-block position-relative collapsed text-dark collapsible-link py-2"
                                                    >
                                                        Part 03: Learn Web Designing in Advance Level
                                                    </a>
                                                </h6>
                                            </div>
                                            <div
                                                id="collapseThree"
                                                aria-labelledby="headingThree"
                                                data-parent="#accordionExample"
                                                className="collapse"
                                            >
                                                <div className="card-body">
                                                    <ul className="lectures_lists">
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 01
                                                            </div>
                                                            Web Designing Beginner
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 02
                                                            </div>
                                                            Startup Designing with HTML5 &amp; CSS3
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 03
                                                            </div>
                                                            How To Call Google Map iFrame
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 04
                                                            </div>
                                                            Create Drop Down Navigation Using CSS3
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 05
                                                            </div>
                                                            How to Create Sticky Navigation Using JS
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card border shadow-0 mb-3">
                                            <div id="headingFour" className="card-header">
                                                <h6 className="mb-0 accordion_title">
                                                    <a
                                                        href="#"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapseFour"
                                                        aria-expanded="false"
                                                        aria-controls="collapseFour"
                                                        className="d-block position-relative collapsed text-dark collapsible-link py-2"
                                                    >
                                                        Part 04: How To Become Succes in Designing &amp;
                                                        Development?
                                                    </a>
                                                </h6>
                                            </div>
                                            <div
                                                id="collapseFour"
                                                aria-labelledby="headingFour"
                                                data-parent="#accordionExample"
                                                className="collapse"
                                            >
                                                <div className="card-body">
                                                    <ul className="lectures_lists">
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 01
                                                            </div>
                                                            Web Designing Beginner
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 02
                                                            </div>
                                                            Startup Designing with HTML5 &amp; CSS3
                                                        </li>
                                                        <li>
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 03
                                                            </div>
                                                            How To Call Google Map iFrame
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 04
                                                            </div>
                                                            Create Drop Down Navigation Using CSS3
                                                        </li>
                                                        <li className="unview">
                                                            <div className="lectures_lists_title">
                                                                <i className="bi bi-camera-video" />
                                                                Lecture: 05
                                                            </div>
                                                            How to Create Sticky Navigation Using JS
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="rating-overview border">
                                    <div className="rating-overview-box">
                                        <span className="rating-overview-box-total text-dark">4.2</span>
                                        <span className="rating-overview-box-percent">out of 5.0</span>
                                        <div
                                            className="star-rating d-flex align-items-center justify-content-center gap-1 text-mid"
                                            data-rating={5}
                                        >
                                            <i className="bi bi-star-fill" />
                                            <i className="bi bi-star-fill" />
                                            <i className="bi bi-star-fill" />
                                            <i className="bi bi-star-fill" />
                                            <i className="bi bi-star-fill" />
                                        </div>
                                    </div>
                                    <div className="rating-bars">
                                        <div className="rating-bars-item">
                                            <span className="rating-bars-name">5 Star</span>
                                            <span className="rating-bars-inner">
                                                <span className="rating-bars-rating high" data-rating="4.7">
                                                    <span
                                                        className="rating-bars-rating-inner"
                                                        style={{ width: "85%" }}
                                                    />
                                                </span>
                                                <strong>85%</strong>
                                            </span>
                                        </div>
                                        <div className="rating-bars-item">
                                            <span className="rating-bars-name">4 Star</span>
                                            <span className="rating-bars-inner">
                                                <span className="rating-bars-rating good" data-rating="3.9">
                                                    <span
                                                        className="rating-bars-rating-inner"
                                                        style={{ width: "75%" }}
                                                    />
                                                </span>
                                                <strong>75%</strong>
                                            </span>
                                        </div>
                                        <div className="rating-bars-item">
                                            <span className="rating-bars-name">3 Star</span>
                                            <span className="rating-bars-inner">
                                                <span className="rating-bars-rating mid" data-rating="3.2">
                                                    <span
                                                        className="rating-bars-rating-inner"
                                                        style={{ width: "52.2%" }}
                                                    />
                                                </span>
                                                <strong>53%</strong>
                                            </span>
                                        </div>
                                        <div className="rating-bars-item">
                                            <span className="rating-bars-name">1 Star</span>
                                            <span className="rating-bars-inner">
                                                <span className="rating-bars-rating poor" data-rating={2.0}>
                                                    <span
                                                        className="rating-bars-rating-inner"
                                                        style={{ width: "20%" }}
                                                    />
                                                </span>
                                                <strong>20%</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="list-single-main-item fl-wrap border">
                                    <div className="list-single-main-item-title fl-wrap">
                                        <h3>
                                            Item Reviews - <span> 3 </span>
                                        </h3>
                                    </div>
                                    <div className="reviews-comments-wrap">
                                        <div className="reviews-comments-item">
                                            <div className="review-comments-avatar">
                                                <img src={`${appUrl}/assets/img/user-1.jpg`} className="img-fluid" alt="" />
                                            </div>
                                            <div className="reviews-comments-item-text">
                                                <h4>
                                                    <a href="#">Josaph Manrty</a>
                                                    <span className="reviews-comments-item-date">
                                                        <i className="bi bi-clock" />
                                                        27 Oct 2019
                                                    </span>
                                                </h4>
                                                <div className="listing-rating high" data-starrating2={5}>
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <span className="review-count">4.9</span>{" "}
                                                </div>
                                                <div className="clearfix" />
                                                <p>
                                                    " Commodo est luctus eget. Proin in nunc laoreet justo
                                                    volutpat blandit enim. Sem felis, ullamcorper vel aliquam non,
                                                    varius eget justo. Duis quis nunc tellus sollicitudin mauris.
                                                    "
                                                </p>
                                                <div className="pull-left reviews-reaction">
                                                    <a href="#" className="comment-like active">
                                                        <i className="bi bi-hand-thumbs-up" /> 12
                                                    </a>
                                                    <a href="#" className="comment-dislike active">
                                                        <i className="bi bi-hand-thumbs-down" /> 1
                                                    </a>
                                                    <a href="#" className="comment-love active">
                                                        <i className="bi bi-suit-heart" /> 07
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="reviews-comments-item">
                                            <div className="review-comments-avatar">
                                                <img src={`${appUrl}/assets/img/user-2.jpg`} className="img-fluid" alt="" />
                                            </div>
                                            <div className="reviews-comments-item-text">
                                                <h4>
                                                    <a href="#">Rita Chawla</a>
                                                    <span className="reviews-comments-item-date">
                                                        <i className="bi bi-clock" />2 Nov May 2019
                                                    </span>
                                                </h4>
                                                <div className="listing-rating mid" data-starrating2={5}>
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill" />
                                                    <span className="review-count">3.7</span>{" "}
                                                </div>
                                                <div className="clearfix" />
                                                <p>
                                                    " Commodo est luctus eget. Proin in nunc laoreet justo
                                                    volutpat blandit enim. Sem felis, ullamcorper vel aliquam non,
                                                    varius eget justo. Duis quis nunc tellus sollicitudin mauris.
                                                    "
                                                </p>
                                                <div className="pull-left reviews-reaction">
                                                    <a href="#" className="comment-like active">
                                                        <i className="bi bi-hand-thumbs-up" /> 12
                                                    </a>
                                                    <a href="#" className="comment-dislike active">
                                                        <i className="bi bi-hand-thumbs-down" /> 1
                                                    </a>
                                                    <a href="#" className="comment-love active">
                                                        <i className="bi bi-suit-heart" /> 07
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                            
                                        <div className="reviews-comments-item">
                                            <div className="review-comments-avatar">
                                                <img src={`${appUrl}/assets/img/user-3.jpg`} className="img-fluid" alt="" />
                                            </div>
                                            <div className="reviews-comments-item-text">
                                                <h4>
                                                    <a href="#">Adam Wilsom</a>
                                                    <span className="reviews-comments-item-date">
                                                        <i className="bi bi-clock" />
                                                        10 Nov 2019
                                                    </span>
                                                </h4>
                                                <div className="listing-rating good" data-starrating2={5}>
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill active" />
                                                    <i className="bi bi-star-fill" />{" "}
                                                    <span className="review-count">4.2</span>{" "}
                                                </div>
                                                <div className="clearfix" />
                                                <p>
                                                    " Commodo est luctus eget. Proin in nunc laoreet justo
                                                    volutpat blandit enim. Sem felis, ullamcorper vel aliquam non,
                                                    varius eget justo. Duis quis nunc tellus sollicitudin mauris.
                                                    "
                                                </p>
                                                <div className="pull-left reviews-reaction">
                                                    <a href="#" className="comment-like active">
                                                        <i className="bi bi-hand-thumbs-up" /> 12
                                                    </a>
                                                    <a href="#" className="comment-dislike active">
                                                        <i className="bi bi-hand-thumbs-down" /> 1
                                                    </a>
                                                    <a href="#" className="comment-love active">
                                                        <i className="bi bi-suit-heart" /> 07
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="edu_wraper border">
                                    <h4 className="edu_title">Submit Reviews</h4>
                                    <div className="review-form-box form-submit">
                                        <form>
                                            <div className="row g-4">
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="form-group">
                                                        <label className="text-mid mb-2">Name</label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Your Name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="form-group">
                                                        <label className="text-mid mb-2">Email</label>
                                                        <input
                                                            className="form-control"
                                                            type="email"
                                                            placeholder="Your Email"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="form-group">
                                                        <label className="text-mid mb-2">Review</label>
                                                        <textarea
                                                            className="form-control ht-140"
                                                            placeholder="Review"
                                                            defaultValue={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-main px-5">
                                                            Submit Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        
                            {/* Sidebar */}
                            <div className="col-xl-4 col-lg-4 col-md-12">
                                <div className="ed_view_box border">
                                    <div className="courses-video">
                                        <div className="thumb">
                                            <img
                                                className="pro_img img-fluid w100"
                                                src={`${appUrl}/assets/img/courses-4.jpg`}
                                                alt="7.jpg"
                                            />
                                            <div className="overlay_icon">
                                                <div className="bb-video-box">
                                                    <a
                                                        href="https://www.youtube.com/watch?v=A8EI6JaFbv4"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#popup-video"
                                                        className="play-popup-video"
                                                    >
                                                        <i className="bi bi-play-fill" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="author-body py-3">
                                        <div className="ed_view_price">
                                            <span className="badge bg-light-red text-red rounded-pill">
                                                25% off
                                            </span>
                                            <h2 className="lh-base">$179.45</h2>
                                        </div>
                                        <div className="ed_view_features mb-4">
                                            <h6 className="fw-semibold">Course Features</h6>
                                            <ul>
                                                <li>
                                                    <i className="bi bi-check-circle-fill me-2 text-green" />
                                                    Fully Programming
                                                </li>
                                                <li>
                                                    <i className="bi bi-check-circle-fill me-2 text-green" />
                                                    Help Code to Code
                                                </li>
                                                <li>
                                                    <i className="bi bi-check-circle-fill me-2 text-green" />
                                                    Free Trial 7 Days
                                                </li>
                                                <li>
                                                    <i className="bi bi-check-circle-fill me-2 text-green" />
                                                    Unlimited Videos
                                                </li>
                                                <li>
                                                    <i className="bi bi-check-circle-fill me-2 text-green" />
                                                    24x7 Support
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="ed_view_link d-flex align-items-center justify-content-center flex-column gap-3 m-0 p-0">
                                            <a href="#" className="btn btn-gray rounded-pill w-100">
                                                <i className="bi bi-basket2 me-2" />
                                                Add To Cart
                                            </a>
                                            <a href="#" className="btn btn-main w-100 rounded-pill">
                                                Enrol Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="edu_wraper border">
                                    <h4 className="edu_title">Course Features</h4>
                                    <ul className="edu_list right">
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-people" />
                                                Student Enrolled
                                            </span>
                                            <span className="text-dark right">1740</span>
                                        </li>
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-camera-reels" />
                                                Lectures
                                            </span>
                                            <span className="text-dark right">10</span>
                                        </li>
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-controller" />
                                                Quizzes
                                            </span>
                                            <span className="text-dark right">4</span>
                                        </li>
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-clock-history" />
                                                Duration
                                            </span>
                                            <span className="text-dark right">60h 40min</span>
                                        </li>
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-tags" />
                                                Skill Level
                                            </span>
                                            <span className="text-dark right">Beginner</span>
                                        </li>
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-flag" />
                                                Language
                                            </span>
                                            <span className="text-dark right">English</span>
                                        </li>
                                        <li>
                                            <span className="info-title">
                                                <i className="bi bi-shield-check" />
                                                Certification
                                            </span>
                                            <span className="text-dark right">Yes</span>
                                        </li>
                                    </ul>
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
export default CourseDetailsPage