'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatAmount, formatDateAndTime, getTotalLectures } from "@/src/utils/client_functions";
import CourseDetailsBanner from "./CourseDetailsBanner";
import { DBCourseInterface } from "@/src/types";
import { useEffect, useState } from "react";
import CustomModal from "@/src/components/admin/CustomModal";
import { useCart } from "@/src/providers/CartProvider";
import { cartUrl } from "@/src/utils/url";
import Link from "next/link";
import { courseReviews } from "@/src/services/website/course";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import WebsitePagination from "./WebsitePagination";

const CourseDetailsPage = ({course}: {course: DBCourseInterface}) => {
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewVideo, setPreviewVideo] = useState('');
    const [reviews, setReviews] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const { addToCart, cartCourses, removeFromCart, currency, convertAmount } = useCart();

    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const router = useRouter();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const convertedDiscountedFee = convertAmount(course.discountedFee);

    const formatWithCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN',
            minimumFractionDigits: currency === 'NGN' ? 0 : 2,
            maximumFractionDigits: currency === 'NGN' ? 0 : 2,
        }).format(amount);
    };

    // 1. Get initial values from URL or defaults
    const currentPage = Number(searchParams.get('page')) || 1;

    // 2. Function to update the URL
    const handleUrlChange = (name: string, value: string | number) => {
        const params = new URLSearchParams(searchParams);
        
        if (value) {
            params.set(name, value.toString().trim());
        } else {
            params.delete(name);
        }

        // Reset to page 1 if searching
        if (name === 'q') params.set('page', '1');

        replace(`${pathName}?${params.toString()}`);
    };

    const pageSize = 20;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await courseReviews(course.id, currentPage, pageSize);
                setReviews(response.data);
                setTotalPages(response.pagination.totalPages);
                setTotalEntries(response.pagination.totalCount);
            } catch (error) {
                console.log("Error fetching reviews:", error);
            }
        }

        fetchReviews();
    }, [currentPage, pageSize, course]);

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

    const handleBuyNow = async (course: any) => {
        addToCart(course);
        router.push(cartUrl);
    }

    return (
        <>
            <CourseDetailsBanner title={course.title}
                description=""
                banner={course.banner}
                lectures={getTotalLectures(course)}
                totalEnrolled={course.students.length}
                level="Beginner | Advanced"
                buyNow={() => handleBuyNow(course)}
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

                                <button onClick={() => handleBuyNow(course)} className="btn btn-gray rounded-pill w-100">
                                    <i className="bi bi-basket2 me-2" />
                                    Buy Now
                                </button>
                            </div>

                            {course.courseModules.length > 0 && (
                                <div className="edu_wraper border">
                                    <h4 className="edu_title">Course Curriculum</h4>
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
                            )}
                            
                            {reviews.length > 0 && (
                                <>
                                    <div className="list-single-main-item fl-wrap border">
                                        <div className="list-single-main-item-title fl-wrap">
                                            <h3>
                                                Course Reviews <span>({totalEntries})</span>
                                            </h3>
                                        </div>
                                        <div className="reviews-comments-wrap">
                                            {reviews.map((review, index) => (
                                                <div key={index} className="reviews-comments-item">
                                                    <div className="review-comments-avatar">
                                                        <img src={`${review.user.gender === 'male' ? `${appUrl}/assets/img/male-avatar.webp` : `${appUrl}/assets/img/female-avatar.webp`}`} 
                                                            className="img-fluid" 
                                                            alt="" 
                                                        />
                                                    </div>
                                                    <div className="reviews-comments-item-text">
                                                        <h4>
                                                            <a href="#">{ review.isAnonymous ? 'Anonymous Student' : review.user.name}</a>
                                                            <span className="reviews-comments-item-date">
                                                                <i className="bi bi-clock" />
                                                                { formatDateAndTime(review.createdAt) }{" "}
                                                            </span>
                                                        </h4>
                                                        <div className={`listing-rating ${review.rating < 3 ? 'mid' : ((review.rating == 3) ? 'good' : 'high')}`} data-starrating2={5}>
                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                <i key={index} className={`bi bi-star-fill ${index < review.rating ? 'active' : ''}`} />
                                                            ))}
                                                            <span className="review-count">{review.rating}</span>{" "}
                                                        </div>
                                                        <div className="clearfix" />
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>
                                                            &quot;{review.comment}&quot;
                                                        </p>

                                                        {review.reply && (
                                                            <div className="card bg-light p-3 mb-3">
                                                                <strong className="mb-2 d-block">Reply From Women Skills Hub:</strong>
                                                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{review.reply}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <WebsitePagination 
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        onPageChange={(page) => handleUrlChange('page', page)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    
                        {/* Sidebar */}
                        <div className="col-xl-4 col-lg-4 col-md-12">
                            <div className="ed_view_box border">
                                {course.previewVideo && (
                                    <div className="courses-video">
                                        <div className="thumb">
                                            <img
                                                className="pro_img img-fluid w100"
                                                src={course.thumbnail ?? ''}
                                                alt={course.title}
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
                                )}

                                <div className="author-body py-3">
                                    <div className="ed_view_price">
                                        <span className="badge bg-light-red text-red rounded-pill">
                                            {(((course.originalFee - course.discountedFee) / course.originalFee) * 100).toFixed(1)}% off
                                        </span>
                                        <h2 className="lh-base">{formatWithCurrency(convertedDiscountedFee)}</h2>
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
                                                <Link href={cartUrl} className="btn btn-gray w-100 rounded-pill">
                                                    <i className="bi bi-basket2 me-2" />
                                                    Buy Now
                                                </Link>
                                            </>
                                        ) : (
                                            <button onClick={() => handleBuyNow(course)} className="btn btn-gray rounded-pill w-100">
                                                <i className="bi bi-basket2 me-2" />
                                                Buy Now
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
                                    {/* <li>
                                        <span className="info-title">
                                            <i className="bi bi-camera-reels" />
                                            Lectures
                                        </span>
                                        <span className="text-dark right">{getTotalLectures(course)}</span>
                                    </li> */}
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