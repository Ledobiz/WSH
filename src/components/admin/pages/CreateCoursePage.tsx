'use client'

const CreateCoursePage = () => {
    return (
        <div className="col-xl-9 col-lg-12">
            <div className="card shadow-sm">
                <div className="card-body p-4 p-lg-5">
                    <div className="step-indicator mb-4">
                        <div className="active">
                            <span>1</span>
                            <p>Info</p>
                        </div>
                        <div>
                            <span>2</span>
                            <p>Curriculum</p>
                        </div>
                        <div>
                            <span>3</span>
                            <p>Pricing</p>
                        </div>
                        <div>
                            <span>4</span>
                            <p>Publish</p>
                        </div>
                    </div>
                    <form id="multiStepForm">
                        {/* Step 1: Basic Info */}
                        <div className="step active">
                            <div className="mb-4">
                                <h5 className="text-darks mb-0 lh-base">Basic Information</h5>
                                <p className="text-muted">
                                Fill basic information regarding your course.
                                </p>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Course Title</label>
                                <input
                                type="text"
                                className="form-control"
                                placeholder="Enter course title"
                                />
                                <small className="text-muted">
                                Write a 60 character course title.
                                </small>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Courses category</label>
                                <select className="form-control" id="c-category">
                                    <option value="">&nbsp;</option>
                                    <option value="webdesign">Web Design</option>
                                    <option value="graphicdesign">Graphic Design</option>
                                    <option value="finance">Finance</option>
                                    <option value="itsoftware">IT &amp; Software</option>
                                    <option value="ecommerce">Ecommerce</option>
                                    <option value="bootstrap">Bootstrap</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Courses Level</label>
                                <select className="form-control" id="level">
                                    <option value="">&nbsp;</option>
                                    <option value="beignners">Beignners</option>
                                    <option value="advance">Advance</option>
                                    <option value="intermediate">Intermediate</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Course Description</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter description"
                                    defaultValue={""}
                                />
                            </div>
                            <div className="mb-4">
                                <h5 className="text-darks mb-0 lh-base">Course Media</h5>
                                <p className="text-muted">
                                Upload a professional thumbnail, a preview video, and any
                                additional resources.
                                </p>
                            </div>
                            {/* Thumbnail Upload */}
                            <div className="mb-4">
                                <label className="form-label">
                                Course Thumbnail <span className="text-danger">*</span>
                                </label>
                                <div className="border rounded d-flex align-items-center justify-content-between p-3">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-image fs-4 text-primary me-3" />
                                    <input
                                    type="file"
                                    id="thumbnailInput"
                                    className="form-control"
                                    accept="image/*"
                                    />
                                </div>
                                <img
                                    id="thumbnailPreview"
                                    src="#"
                                    className="img-thumbnail ms-3"
                                    style={{ width: 100, display: "none" }}
                                    alt="Preview"
                                />
                                </div>
                                <small className="text-muted d-block mt-2">
                                Recommended: 800x600px | JPG/PNG
                                </small>
                            </div>
                            {/* Preview Video Upload */}
                            <div className="mb-4">
                                <label className="form-label">Preview Video</label>
                                <div className="border rounded p-3 d-flex align-items-center">
                                <i className="bi bi-play-circle fs-4 text-primary me-3" />
                                <input
                                    className="form-control"
                                    type="file"
                                    accept="video/mp4,video/webm"
                                />
                                </div>
                                <small className="text-muted d-block mt-2">
                                Format: MP4/WebM | Max: 100MB
                                </small>
                            </div>
                            {/* Additional Resources Upload */}
                            <div className="mb-4">
                                <label className="form-label">Course Resources</label>
                                <div className="border rounded p-3 d-flex align-items-center">
                                <i className="bi bi-folder2-open fs-4 text-primary me-3" />
                                <input className="form-control" type="file" multiple="" />
                                </div>
                                <small className="text-muted d-block mt-2">
                                Optional: PDF, ZIP, or DOCX | Max 5 files
                                </small>
                            </div>
                            </div>
                            {/* Step 1: Course Curriculum */}
                            <div className="step">
                            <div className="mb-4">
                                <h5 className="lh-base m-0">Course Curriculum</h5>
                                <p className="text-muted">
                                Add course sections and lessons below. You can add as many as
                                needed.
                                </p>
                            </div>
                            <div id="curriculumContainer">
                                <div className="section border p-3 rounded mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0 text-dark">Lesson Title</h6>
                                    <button
                                    type="button"
                                    className="btn btn-sm btn-red remove-section rounded-2"
                                    >
                                    Remove Section
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Lesson Title</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Getting Started"
                                    />
                                </div>
                                <div className="lessons">
                                    <div className="lesson mb-3">
                                    <label className="form-label">Lecture Title</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="e.g., Introduction"
                                    />
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        placeholder="Lecture description..."
                                        defaultValue={""}
                                    />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light-main add-lesson rounded-2"
                                >
                                    + Add Lecture
                                </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-main rounded-2"
                                id="addSection"
                            >
                                + Add Lesson
                            </button>
                            </div>
                            {/* Step 3 */}
                            <div className="step">
                            <div className="form-group mb-3">
                                <label className="form-label">Is this as a free course?</label>
                                <div className="form-check">
                                <input
                                    id="freecpurse"
                                    className="form-check-input"
                                    name="freecpurse"
                                    type="checkbox"
                                />
                                <label
                                    htmlFor="freecpurse"
                                    className="form-check-label text-muted-2"
                                >
                                    Check if this is a free course.
                                </label>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Course Price ($)</label>
                                <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 99"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">This course has a discount</label>
                                <div className="form-check">
                                <input
                                    id="coursediscount"
                                    className="form-check-input"
                                    name="coursediscount"
                                    type="checkbox"
                                />
                                <label
                                    htmlFor="coursediscount"
                                    className="form-check-label text-muted-2"
                                >
                                    Check if this course has discount.
                                </label>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Discount Price ($)</label>
                                <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 99"
                                />
                                <span className="text-muted text-mid">
                                This course has <i className="fs-semibold text-green">10.5%</i>{" "}
                                discount.
                                </span>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Discount Expiry Period</label>
                                <div className="d-flex align-items-center gap-3">
                                <div className="form-check">
                                    <input
                                    id="lifetime"
                                    className="form-check-input"
                                    name="expireperiod"
                                    type="radio"
                                    />
                                    <label
                                    htmlFor="lifetime"
                                    className="form-check-label text-muted-2"
                                    >
                                    Lifetime
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                    id="limitedtime"
                                    className="form-check-input"
                                    name="expireperiod"
                                    type="radio"
                                    defaultChecked=""
                                    />
                                    <label
                                    htmlFor="limitedtime"
                                    className="form-check-label text-muted-2"
                                    >
                                    Limited Period
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Number of Days</label>
                                <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 20"
                                />
                            </div>
                            </div>
                            {/* Step 4 */}
                            <div className="step">
                            <div className="form-group mb-3">
                                <label className="form-label">SEO Meta Title</label>
                                <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Advance Java Script"
                                />
                                <span className="text-muted text-mid">
                                Use max 65 characters only.
                                </span>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">SEO Description</label>
                                <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., Meta Description"
                                />
                                <span className="text-muted text-mid">
                                Use max 150 characters only.
                                </span>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Course Tags</label>
                                <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., Design, Figma, Java"
                                />
                                <span className="text-muted text-mid">Use tags with commas.</span>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Visibility</label>
                                <select className="form-control" id="visibility">
                                <option value="">&nbsp;</option>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                </select>
                            </div>
                            </div>
                            {/* Buttons */}
                            <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="btn btn-gray px-4" id="prevBtn">
                                Previous
                            </button>
                            <button type="button" className="btn btn-main px-4" id="nextBtn">
                                Next
                            </button>
                            </div>
                        </form>
                        </div>
                    </div>
                    </div>
    )
}
export default CreateCoursePage