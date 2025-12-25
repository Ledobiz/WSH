'use client'

import { formatAmount } from "@/src/utils/client_functions"
import { coursesUrl } from "@/src/utils/url"
import Link from "next/link"

interface CardPropertyInterface {
    slug: string,
    title: string,
    lectures: number,
    level: string,
    originalPrice: number,
    discountedPrice: number,
    image: string
}

const CourseCard = ({slug, title, lectures, level, originalPrice, discountedPrice, image}: CardPropertyInterface) => {
    return (
        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
            <div className="education_block_grid border">
                <div className="education-thumb position-relative">
                    <div className="save-course position-absolute top-0 end-0 me-3 mt-3">
                        <a href="#" className="bookmark-button">
                            <i className="bi bi-suit-heart" />
                        </a>
                    </div>
                    
                    <Link href={`${coursesUrl}/${slug}`}>
                        <img
                            src={ image }
                            className="img-fluid"
                            alt={ title }
                        />
                    </Link>

                    <div className="course-hours position-absolute top-0 start-0 ms-3 mt-3">
                        <span className="badge bg-dark rounded-pill">
                            <i className="bi bi-clock-history me-1" />
                            10h 50m
                        </span>
                    </div>
                </div>
                <div className="education-body p-3">
                    <div className="education-title">
                        <h4 className="fs-6 fw-medium">
                            <Link href={`${coursesUrl}/${slug}`}>{ title }</Link>
                        </h4>
                    </div>
                    <div className="cources-info">
                        <ul>
                            <li>
                                <i className="bi bi-cash-stack" />
                                <s>{ formatAmount(originalPrice) }</s>
                            </li>
                            <li>
                                <i className="bi bi-cash-stack" />
                                { formatAmount(discountedPrice) }
                            </li>
                            <li>
                                <i className="bi bi-camera-reels" />
                                {  lectures } {lectures > 1 ? 'Lectures' : 'Lecture'}
                            </li>
                            <li>
                                <i className="bi bi-bar-chart" />
                                { level }
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="education-footer border-0 p-3 pt-2">
                    <Link
                        href={`${coursesUrl}/${slug}`}
                        className="btn btn-md btn-outline-gray border-2 rounded-pill w-100"
                    >
                        Enrol Now
                        <i className="bi bi-arrow-right ms-2" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default CourseCard