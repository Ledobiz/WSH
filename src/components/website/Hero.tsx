const Hero = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    return (
        <div
            className="hero_banner home-2 position-relative"
            style={{ background: `#e7eff6 url(${appUrl}/assets/img/map.svg)no-repeat` }}
        >
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-xl-8 col-lg-9 col-md-12">
                        <div className="hero-caption text-center mb-5">
                            <div className="mb-3 d-flex gap-3 align-items-center justify-content-center">
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
                                        <div className="text-dark fw-semibold">4.9</div>
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
                                    <div>Engaged Students</div>
                                </div>
                            </div>
                            <h1 className="big-header-capt text-dark mb-0">
                                Master New Skills With <span className="text-main">LearnUp</span>{" "}
                                Expert-Led Courses
                            </h1>
                        </div>
                        <div className="hero-search modern">
                            <form
                            action="https://themezhub.net/learnup-2.1/learnup/get"
                            className="search-form shadow-sm"
                            >
                                <div className="form-group flex-fill">
                                    <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for courses, skills, and videos"
                                    />
                                    <i className="ico bi bi-search" />
                                </div>
                                <div className="form-group">
                                    <button type="button" className="btn btn-dark">
                                    Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="position-absolute start-0 bottom-0">
                <img src={`${appUrl}/assets/img/designer-girl.png`} style={{width: '400px'}} className="img-fluid" />
            </div>
            <div className="position-absolute end-0 bottom-0 d-none d-md-block">
                <img src={`${appUrl}/assets/img/banner-catalog-5.png`} className="img-fluid" />
            </div>
            <div className="position-absolute end-0 top-0 me-5">
                <img
                    src={`${appUrl}/assets/img/banner-lamp-2.png`}
                    className="img-fluid"
                    width={70}
                />
            </div>
        </div>
    )
}
export default Hero