'use client';

import { formatAmount, getTotalLectures } from "@/src/utils/client_functions";
import CourseDetailsBanner from "./CourseDetailsBanner";
import { DBCourseInterface } from "@/src/types";
import { useState } from "react";
import CustomModal from "@/src/components/admin/CustomModal";
import { useCart } from "@/src/providers/CartProvider";
import { cartUrl } from "@/src/utils/url";

const CourseDetailsPage = ({course}: {course: DBCourseInterface}) => {
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewVideo, setPreviewVideo] = useState('');
    const { addToCart, cartCourses, loadingId, removeFromCart } = useCart();

    const handlePreviewModal = async (videoId: string) => {
        const res = await fetch('/api/video/preview', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({videoId}),
        });

        if (!res.ok) return;
        const data = await res.json();

        setPreviewVideo(data.playbackUrl);
        setShowPreviewModal(true);
    }

    return (
        <>
            <CourseDetailsBanner title={course.title}
                description=""
                banner={course.banner}
                lectures={getTotalLectures(course)}
                totalEnrolled={course.students.length}
                level="Beginner | Advanced"
            />

            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-8 col-md-12 pe-xl-4">
                            <div className="edu_wraper border">
                                <h4 className="edu_title">Course Overview</h4>

                                <div 
                                    dangerouslySetInnerHTML={{ __html: course.description ?? '' }} 
                                />
                            </div>
                            <div className="edu_wraper border">
                                <h4 className="edu_title">Course Circullum</h4>
                                <div id="accordionExample" className="accordion circullum">
                                    {course.courseModules.map((module, index) => (
                                        <div key={module.id} className="card border shadow-0 mb-3">
                                            <div id={`heading${index}`} className="card-header">
                                                <h6 className="mb-0 accordion_title">
                                                    <a
                                                        href="#"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#collapse${index}`}
                                                        aria-expanded="true"
                                                        aria-controls={`collapse${index}`}
                                                        className="d-block position-relative text-dark collapsible-link py-2"
                                                    >
                                                        {`Part ${index + 1}: ${module.name}`}
                                                    </a>
                                                </h6>
                                            </div>
                                            <div
                                                id={`collapse${index}`}
                                                aria-labelledby={`heading${index}`}
                                                data-parent="#accordionExample"
                                                className={`collapse ${index == 0 ? 'show' : ''}`}
                                            >
                                                <div className="card-body">
                                                    <ul className="lectures_lists">
                                                        {module.moduleComponents.map((component, index) => (
                                                            <li key={component.id}>
                                                                <div className="lectures_lists_title">
                                                                    <i className="bi bi-camera-video" />
                                                                    Lecture: {index + 1}
                                                                </div>
                                                                { component.name }
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* <div className="rating-overview border">
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
                            </div> */}
                        </div>
                    
                        {/* Sidebar */}
                        <div className="col-xl-4 col-lg-4 col-md-12">
                            <div className="ed_view_box border">
                                <div className="courses-video">
                                    <div className="thumb">
                                        <img
                                            className="pro_img img-fluid w100"
                                            src={course.thumbnail ?? ''}
                                            alt="7.jpg"
                                        />
                                        <div className="overlay_icon">
                                            <div className="bb-video-box">
                                                <button
                                                    onClick={() => handlePreviewModal(course.previewVideo ?? '')}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#popup-video"
                                                    className="play-popup-video"
                                                >
                                                    <i className="bi bi-play-fill" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="author-body py-3">
                                    <div className="ed_view_price">
                                        <span className="badge bg-light-red text-red rounded-pill">
                                            {((course.originalFee - course.discountedFee) / course.originalFee) * 100}% off
                                        </span>
                                        <h2 className="lh-base">{formatAmount(course.discountedFee)}</h2>
                                    </div>
                                    <div className="ed_view_features mb-4">
                                        <h6 className="fw-semibold">Course Features</h6>
                                        <ul>
                                            <li>
                                                <i className="bi bi-check-circle-fill me-2 text-green" />
                                                Life-time access
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle-fill me-2 text-green" />
                                                Video Lectures
                                            </li>
                                            <li>
                                                <i className="bi bi-check-circle-fill me-2 text-green" />
                                                24x7 Support
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="ed_view_link d-flex align-items-center justify-content-center flex-column gap-3 m-0 p-0">
                                        {cartCourses.find((c) => c.id === course.id) ? (
                                            <>
                                                <button onClick={() => removeFromCart(course.id)} className="btn btn-danger rounded-pill w-100">
                                                    <i className="bi bi-trash me-2" />
                                                    Remove From Cart
                                                </button>
                                                <a href={cartUrl} className="btn btn-gray w-100 rounded-pill">
                                                    <i className="bi bi-basket2 me-2" />
                                                    Go To Cart
                                                </a>
                                            </>
                                        ) : (
                                            <button onClick={() => addToCart(course)} className="btn btn-gray rounded-pill w-100">
                                                <i className="bi bi-basket2 me-2" />
                                                Add To Cart
                                            </button>
                                        )}
                                        
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
                                        <span className="text-dark right">{course.students.length}</span>
                                    </li>
                                    <li>
                                        <span className="info-title">
                                            <i className="bi bi-camera-reels" />
                                            Lectures
                                        </span>
                                        <span className="text-dark right">{getTotalLectures(course)}</span>
                                    </li>
                                    <li>
                                        <span className="info-title">
                                            <i className="bi bi-tags" />
                                            Skill Level
                                        </span>
                                        <span className="text-dark right">Beginner | Advanced</span>
                                    </li>
                                    <li>
                                        <span className="info-title">
                                            <i className="bi bi-flag" />
                                            Language
                                        </span>
                                        <span className="text-dark right">English</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CustomModal 
                isOpen={showPreviewModal}
                title={course.title}
                onClose={() => setShowPreviewModal(false)}
                size="modal-xl"
            >
                <div className="video-box d-flex align-items-center justify-content-center">
                    <iframe
                        src={previewVideo}
                        loading="lazy"
                        style={{
                            border: 0,
                            position: 'absolute',
                            top: 0,
                            height: '100%',
                            width: '100%'
                        }}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                    />
                </div>
            </CustomModal>
        </>
    )
}
export default CourseDetailsPage