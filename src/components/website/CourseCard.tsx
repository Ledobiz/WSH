'use client'

import { formatAmount } from "@/src/utils/client_functions"
import Link from "next/link"

interface CardPropertyInterface {
    slug: string,
    title: string,
    lectures: number,
    level: string,
    price: number,
    rating: number,
    image: string
}

const CourseCard = ({slug, title, lectures, level, price, rating, image}: CardPropertyInterface) => {
    return (
        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
            <div className="education_block_grid border">
                <div className="education-thumb position-relative">
                    <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                        <a href="#" className="bookmark-button">
                            <i className="bi bi-suit-heart" />
                        </a>
                    </div>
                    <Link href={`/courses/${slug}`}>
                        <img
                            src={ image }
                            className="img-fluid"
                            alt={ title }
                        />
                    </Link>
                </div>
                <div className="education-body p-3">
                    <div className="education-title">
                        <h4 className="fs-6 fw-medium">
                            <Link href={`/courses/${slug}`}>{ title }</Link>
                        </h4>
                    </div>
                    <div className="cources-info">
                        <ul>
                            <li>
                                <i className="bi bi-camera-reels" />
                                {  lectures } Lectures
                            </li>
                            <li>
                                <i className="bi bi-bar-chart" />
                                { level }
                            </li>
                            <li>
                                {/* <i className="bi bi-coin" /> */}
                                {/* &#8358; &nbsp; */}
                                { formatAmount(price) }
                            </li>
                            <li>
                                <i className="bi bi-star-fill text-warning" />
                                <span className="overall-rates text-dark fw-medium ms-1">
                                    { rating }
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="education-footer border-0 p-3 pt-2">
                    <Link
                    href={`/courses/${slug}`}
                    className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                    >
                        Enroll Now
                        <i className="bi bi-arrow-right ms-2" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default CourseCard