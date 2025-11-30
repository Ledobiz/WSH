interface BannerInterface {
    title: string,
    description: string,
    duration: string,
    lectures: number,
    totalEnrolled: number,
    level: string
}

const CourseDetailsBanner = ({title, description, duration, lectures, totalEnrolled, level}: BannerInterface) => {
    const appUrl = process.env.APP_URL;

    return (
        <div
            className="image-cover ed_detail_head lg theme-ov"
            style={{ background: '#f4f4f4 url('+appUrl+'/assets/img/detail-bg.jpg)' }}
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
                                        <i className="bi bi-calendar-check" />
                                        {duration}
                                    </li>
                                    <li>
                                        <i className="bi bi-camera-video" />
                                        {lectures} Lectures
                                    </li>
                                    <li>
                                        <i className="bi bi-people" />
                                        {totalEnrolled} Student Enrolled
                                    </li>
                                </ul>
                            </div>
                            <div className="ed_header_short">
                                <p>
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CourseDetailsBanner