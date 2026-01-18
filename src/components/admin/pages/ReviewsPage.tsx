'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { approveReviewWithoutReply, courseReviews, markAsReviewedWithoutApproval, replyToCourseReview } from "@/src/services/admin/student";
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageLoader from "../../website/PageLoader";
import Pagination from "../Pagination";
import { formatDateAndTime } from "@/src/utils/client_functions";
import ConfirmationModal from "../../ConfirmationModal";
import { toast } from "react-toastify";
import ButtonLoader from "../ButtonLoader";

const ReviewsPage = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReview, setSelectedReview] = useState<string>('');
    const [comment, setComment] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [showIgnoreModal, setShowIgnoreModal] = useState(false);

    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

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
            setLoading(true);

            try {
                const response = await courseReviews(currentPage, pageSize);
                setReviews(response.data);
                setTotalPages(response.pagination.totalPages);
                setTotalEntries(response.pagination.totalCount);
            }
            catch (error) {
                console.log("Error fetching reviews:", error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, [currentPage]);

    const handleConfirmApproveWithoutReply = async (reviewId: string) => {
        // Logic to approve the review without replying
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;
        setSelectedReview(review.id);
        setShowConfirmationModal(true);
    }

    const submitReviewReply = async (reviewId: string) => {
        if (!comment.trim()) {
            toast.error("Reply comment cannot be empty.");
            return;
        }

        setSubmittingReply(true);

        try {
            const response = await replyToCourseReview(reviewId, comment.trim());
            
            if (response.success) {
                toast.success(response.message);

                // Refresh reviews after successful reply
                const updatedReviews = await courseReviews(currentPage, pageSize);
                setReviews(updatedReviews.data);
            } else {
                toast.error(response.message);
            }
        }
        catch (error) {
            console.log("Error submitting review reply:", error);
            toast.error("Failed to submit reply. Please try again.");
        }
        finally {
            setSubmittingReply(false);
            setComment('');
        }
    }

    const confirmApproveWithoutReply = async () => {
        try {
            const response = await approveReviewWithoutReply(selectedReview);
            if (response.success) {
                toast.success(response.message);
                // Refresh reviews after successful approval
                const updatedReviews = await courseReviews(currentPage, pageSize);
                setReviews(updatedReviews.data);
            } else {
                toast.error(response.message);
            }
        }
        catch (error) {
            console.log("Error approving review without reply:", error);
            toast.error("Failed to approve review. Please try again.");
        }
        finally {
            setShowConfirmationModal(false);
            setSelectedReview('');
        }
    }

    const handleIgnoreReview = (reviewId: string) => {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;
        setSelectedReview(review.id);
        setShowIgnoreModal(true);
    }

    const ignoreReviewAndDontPublish = async () => {
        try {
            // Logic to mark the review as reviewed without approval
            const response = await markAsReviewedWithoutApproval(selectedReview);
            if (response.success) {
                toast.success(response.message);
                // Refresh reviews after successful action
                const updatedReviews = await courseReviews(currentPage, pageSize);
                setReviews(updatedReviews.data);
            } else {
                toast.error(response.message);
            }
        }
        catch (error) {
            console.log("Error ignoring review:", error);
            toast.error("Failed to ignore review. Please try again.");
        }
        finally {
            setShowIgnoreModal(false);
            setSelectedReview('');
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Home</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Student Reviews
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Student Reviews</h4>
                                </div>
                            </div>

                            {loading ? <PageLoader /> : (
                                <>
                                <div className="card-body">
                                        {!reviews.length && (
                                            <div className="text-center p-5">
                                                <img
                                                    src={`${appUrl}/assets/img/empty.svg`}
                                                    alt="Empty State"
                                                    className="img-fluid mb-4"
                                                    style={{ maxWidth: 260, opacity: "0.9" }}
                                                />
                                                <h4 className="fw-bold">No reviews found</h4>
                                                <p className="text-muted mb-4">
                                                    It's either we're unable to fetch the reviews or students haven't submitted any yet.
                                                </p>
                                            </div>
                                        )}

                                        {reviews.length > 0 && (
                                            <div className="card-body mt-2 mt-sm-4">
                                                {reviews.map((review, index) => (
                                                    <>
                                                        <div key={index} className="d-sm-flex">
                                                            <img
                                                                className="img-fluid square--80 circle float-start me-3"
                                                                src={`${review.user.gender === 'male' ? `${appUrl}/assets/img/male-avatar.webp` : `${appUrl}/assets/img/female-avatar.webp`}`}
                                                                alt="avatar"
                                                            />
                                                            <div>
                                                                <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                                                    <div>
                                                                        <h5 className="m-0">{review.user.name}</h5>
                                                                        <span className="me-3 text-muted small">
                                                                            { formatDateAndTime(review.createdAt) }{" "}
                                                                        </span>
                                                                    </div>
                                                                    <ul className="list-inline mb-0">
                                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                                            <li key={index} className="list-inline-item me-0">
                                                                                <i className={`fas fa-star ${index < review.rating ? 'text-warning' : 'text-muted'}`} />
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <h6>
                                                                    <span className="fw-light">Review on:</span> {review.course.title}
                                                                </h6>
                                                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                                                    {review.comment}
                                                                </p>

                                                                {review.reply && (
                                                                    <div className="card bg-light p-3 mb-3">
                                                                        <strong className="mb-2 d-block">Your Reply:</strong>
                                                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{review.reply}</p>
                                                                    </div>
                                                                )}

                                                                {!review.reply && !review.isReviewed && (
                                                                    <div className="text-end">
                                                                        <a
                                                                            className="btn btn-sm btn-gray rounded-pill px-3 mb-0"
                                                                            data-bs-toggle="collapse"
                                                                            href={`#collapseComment${review.id}`}
                                                                            role="button"
                                                                            aria-expanded="false"
                                                                            aria-controls={`collapseComment${review.id}`}
                                                                        >
                                                                            Reply
                                                                        </a>

                                                                        <button type="button" className="btn btn-sm btn-primary rounded-pill px-3 ml-3 mb-0"
                                                                            onClick={() => handleConfirmApproveWithoutReply(review.id)}
                                                                        >
                                                                            Approve Without Replying
                                                                        </button>

                                                                        <button type="button" className="btn btn-sm btn-danger rounded-pill px-3 ml-3 mb-0"
                                                                            onClick={() => handleIgnoreReview(review.id)}
                                                                        >
                                                                            Ignore Review
                                                                        </button>

                                                                        <div className="collapse" id={`collapseComment${review.id}`}>
                                                                            <div className="d-flex mt-3 position-relative">
                                                                                <textarea
                                                                                    className="form-control ht-200 mb-0"
                                                                                    placeholder="Add a comment..."
                                                                                    value={comment}
                                                                                    onChange={(e) => setComment(e.target.value)}
                                                                                />
                                                                                <div className="position-absolute end-0 bottom-0 me-2 mb-2">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn square--60 circle bg-main text-white fs-3"
                                                                                        onClick={() => submitReviewReply(review.id)}
                                                                                        disabled={submittingReply}
                                                                                    >
                                                                                        {submittingReply ? <ButtonLoader color="#ffffff" /> : <i className="bi bi-send" />}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer bg-white py-3">
                                        <Pagination 
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalEntries={totalEntries}
                                            pageSize={pageSize}
                                            onPageChange={(page) => handleUrlChange('page', page)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal 
                text="Are you sure you want to approve this review without replying?"
                isOpen={showConfirmationModal}
                isForDelete={false}
                onConfirm={confirmApproveWithoutReply}
                onClose={() => setShowConfirmationModal(false)}
            />

            <ConfirmationModal 
                text="Are you sure you want to ignore this review and not publish it?"
                isOpen={showIgnoreModal}
                isForDelete={false}
                onConfirm={ignoreReviewAndDontPublish}
                onClose={() => setShowIgnoreModal(false)}
            />
        </>
    )
}
export default ReviewsPage