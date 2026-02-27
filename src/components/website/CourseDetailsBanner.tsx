interface BannerInterface {
    title: string,
    description: string,
    lectures: number,
    totalEnrolled: number,
    level: string,
    banner?: string | null,
    buyNow: () => void,
}

const CourseDetailsBanner = ({title, description, lectures, totalEnrolled, level, banner, buyNow}: BannerInterface) => {
    return (
        <div
            className="image-cover ed_detail_head lg theme-ov"
            style={{ background: '#f4f4f4 url('+banner+')', paddingTop: '150px' }}
            data-overlay={7}
        >
            <div className="container">
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-10">
                        <div className="ed_detail_wrap light">
                            <div className="course-type d-flex align-items-center gap-2 mb-1">
                                <span className="badge bg-green rounded-pill">{level}</span>
                            </div>
                            <div className="ed_header_caption">
                                <h2 className="ed_title">{title}</h2>
                                <ul>
                                    <li>
                                        <i className="bi bi-camera-video" />
                                        {lectures} Lectures
                                    </li>
                                    {/* <li>
                                        <i className="bi bi-people" />
                                        {totalEnrolled} Student Enrolled
                                    </li> */}
                                </ul>
                            </div>
                            <div className="ed_header_short">
                                <p>
                                    {description}
                                </p>
                            </div>

                            <button onClick={buyNow} className="btn btn-gray rounded-pill">
                                <i className="bi bi-basket2 me-2" />
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CourseDetailsBanner