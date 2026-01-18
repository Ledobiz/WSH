import { registerUrl } from "@/src/utils/url";
import Link from "next/link";

const Hero = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <div className="image-cover hero_banner home-5" data-overlay="0">
            <div className="container pt-lg-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="hero-caption mb-2">
                            <div className="mb-3 d-flex gap-3 align-items-center">
                                <div className="avatar-group">
                                    <span className="avatar-single">
                                        <img
                                            alt="avatar"
                                            src="assets/img/avatar-1.jpg"
                                            className="img-fluid border thumb-sm circle"
                                        />
                                    </span>
                                    <span className="avatar-single">
                                        <img
                                            alt="avatar"
                                            src="assets/img/avatar-2.jpg"
                                            className="img-fluid border thumb-sm circle"
                                        />
                                    </span>
                                    <span className="avatar-single">
                                    <img
                                        alt="avatar"
                                        src="assets/img/avatar-3.jpg"
                                        className="img-fluid border thumb-sm circle"
                                    />
                                    </span>
                                    <span className="avatar-single">
                                    <img
                                        alt="avatar"
                                        src="assets/img/avatar-5.jpg"
                                        className="img-fluid border thumb-sm circle"
                                    />
                                    </span>
                                    <span className="avatar-single">
                                    <img
                                        alt="avatar"
                                        src="assets/img/avatar-6.jpg"
                                        className="img-fluid border thumb-sm circle"
                                    />
                                    </span>
                                </div>
                                <div className="reviews-caption">
                                    <div className="d-flex align-items-center gap-2 fs-5 lh-0">
                                        <div className="text-light fw-semibold">4.9</div>
                                        <div className="reviews-star">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={14}
                                                height={14}
                                                fill="currentColor"
                                                className="bi bi-star-fill text-warning"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={14}
                                                height={14}
                                                fill="currentColor"
                                                className="bi bi-star-fill text-warning"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={14}
                                                height={14}
                                                fill="currentColor"
                                                className="bi bi-star-fill text-warning"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={14}
                                                height={14}
                                                fill="currentColor"
                                                className="bi bi-star-fill text-warning"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={14}
                                                height={14}
                                                fill="currentColor"
                                                className="bi bi-star-fill text-warning"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-light">Engaged Students</div>
                                </div>
                            </div>
                            <h1 className="big-header-capt mb-0">
                                Master New Skills With Women Skills Hub's
                                Expert-Led Courses
                            </h1>
                        </div>
                        <div className="hero-search my-4">
                            <form
                                className="search-form shadow-sm"
                            >
                                <div className="form-group flex-fill">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search for courses"
                                    />
                                    <i className="ico bi bi-search" />
                                </div>
                                <div className="form-group">
                                    <button type="button" className="btn btn-dark">
                                        <i className="bi bi-send"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="d-block mt-2">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="join-buttons">
                                    <Link href={registerUrl} className="btn btn-backup rounded-pill px-4">Enrol Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="flixio position-relative">
                            <div className="bg-white rounded-4 p-3 px-4 position-absolute start-0 bottom-0 ms-4 shadow-sm animate-bounce d-none d-md-block">
                                <div className="d-flex align-items-center justify-content-start flex-column gap-3">
                                    <div className="d-flex align-items-center gap-2 lh-0">
                                        <div className="reviews-star">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={18}
                                                height={18}
                                                fill="currentColor"
                                                className="bi bi-star-fill text-warning"
                                                viewBox="0 0 16 16"
                                            >
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </div>
                                        <div className="text-dark fw-semibold">Success Rate 4.9%</div>
                                    </div>
                                    <div className="d-flex align-items-start flex-column gap-1 w-100">
                                        <div
                                            className="progress w-100 mb-2"
                                            role="progressbar"
                                            aria-label="Example with label"
                                            aria-valuenow={80}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            style={{ height: 5 }}
                                        >
                                            <div className="progress-bar bg-success" style={{ width: "80%" }} />
                                        </div>
                                        <div
                                            className="progress w-100 mb-2"
                                            role="progressbar"
                                            aria-label="Example with label"
                                            aria-valuenow={60}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            style={{ height: 5 }}
                                        >
                                            <div className="progress-bar bg-primary" style={{ width: "60%" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <img className="img-fluid" src="assets/img/wsh-banner.png" alt="hero-banner" />
                            
                            <div className="bg-white rounded-4 p-3 pe-4 position-absolute end-0 top-0 mt-5 shadow-sm animate-bounce d-none d-md-block">
                                <div className="d-flex align-items-center justify-content-start gap-2">
                                    <div className="square--50 circle bg-light-green text-green">
                                        <i className="bi bi-mortarboard-fill fs-4" />
                                    </div>
                                    <div className="d-flex align-items-start flex-column gap-1">
                                        <div className="fs-6 text-dark fw-semibold">Join for Free</div>
                                        <div className="text-gray-500">50+ Courses Available</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Hero