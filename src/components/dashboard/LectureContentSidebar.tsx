'use client'

import styles from './LectureContentSidebar.module.css'

const LectureContentSidebar = () => {
    return (
        <div className="col-lg-4">
            <div className="bg-white rounded-4 shadow-sm">
                <h3 className="fw-bold mb-0">Course Content</h3>
                <h4 className="text-muted small mb-4">3 modules</h4>
                
                <div className={styles.courseScroll}>
                    {/* MODULE 1 */}
                    <div className="mb-4">
                        <button
                            className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                            data-bs-toggle="collapse"
                            data-bs-target="#module1"
                            aria-expanded="true"
                        >
                            Module 1: Introduction to Seller Financing &nbsp;&nbsp;
                            <i className="bi bi-chevron-down toggle-arrow"></i>
                        </button>
                        <h3 className="text-muted small mb-2">0/3 completed</h3>
                        <div id="module1" className="collapse show">
                            <div className="lesson-item p-3 mb-2 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">1</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            What is Seller Financing?
                                        </p>
                                        <span className="text-muted small">10:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot ongoing" />
                                    </div>
                                </div>
                            </div>
                            <div className="lesson-item p-3 mb-2 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">2</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            Benefits for Buyers and Sellers
                                        </p>
                                        <span className="text-muted small">12:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot completed" />
                                    </div>
                                </div>
                            </div>
                            <div className="lesson-item p-3 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">3</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">Common Misconceptions</p>
                                        <span className="text-muted small">09:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* MODULE 2 (collapsed template) */}
                    <div className="mb-4 border-top">
                        <button
                            className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                            data-bs-toggle="collapse"
                            data-bs-target="#module2"
                            aria-expanded="false"
                        >
                            Module 1: Introduction to Seller Financing &nbsp;&nbsp;
                            <i className="bi bi-chevron-down toggle-arrow"></i>
                        </button>
                        <h3 className="text-muted small mb-2">0/3 completed</h3>
                        <div id="module2" className="collapse">
                            <div className="lesson-item p-3 mb-2 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">1</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            What is Seller Financing?
                                        </p>
                                        <span className="text-muted small">10:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
                                    </div>
                                </div>
                            </div>
                            <div className="lesson-item p-3 mb-2 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">2</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            Benefits for Buyers and Sellers
                                        </p>
                                        <span className="text-muted small">12:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
                                    </div>
                                </div>
                            </div>
                            <div className="lesson-item p-3 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">3</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">Common Misconceptions</p>
                                        <span className="text-muted small">09:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 border-top">
                        <button
                            className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                            data-bs-toggle="collapse"
                            data-bs-target="#module3"
                            aria-expanded="false"
                        >
                            Module 1: Introduction to Seller Financing &nbsp;&nbsp;
                            <i className="bi bi-chevron-down toggle-arrow"></i>
                        </button>
                        <h3 className="text-muted small mb-2">0/3 completed</h3>
                        <div id="module3" className="collapse">
                            <div className="lesson-item p-3 mb-2 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">1</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            What is Seller Financing?
                                        </p>
                                        <span className="text-muted small">10:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
                                    </div>
                                </div>
                            </div>
                            <div className="lesson-item p-3 mb-2 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">2</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">
                                            Benefits for Buyers and Sellers
                                        </p>
                                        <span className="text-muted small">12:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
                                    </div>
                                </div>
                            </div>
                            <div className="lesson-item p-3 rounded-3">
                                <div className="d-flex align-items-center">
                                    <div className="lesson-number me-3">3</div>
                                    <div>
                                        <p className="mb-0 fw-semibold">Common Misconceptions</p>
                                        <span className="text-muted small">09:00</span>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="lesson-dot" />
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
export default LectureContentSidebar