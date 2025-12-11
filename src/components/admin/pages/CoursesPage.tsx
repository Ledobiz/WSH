'use client'

import NavBreadcrumb from "../NavBreadcrumb"

const CoursesPage = () => {
    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <NavBreadcrumb page="Courses" />
            
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="card border bg-transparent rounded-3">
                        {/* Card header START */}
                        <div className="card-header border-bottom">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <h4 className="mb-2 mb-sm-0">All Courses</h4>
                            </div>
                        </div>
                        {/* Card header END */}
                        {/* Card body START */}
                        <div className="card-body">
                            <div className="row g-3 align-items-center justify-content-between mb-4">
                                {/* Search */}
                                <div className="col-md-7">
                                    <form className="rounded position-relative">
                                        <input
                                        className="form-control pe-5 bg-transparent"
                                        type="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                        />
                                        <button
                                        className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                                        type="submit"
                                        >
                                        <i className="bi bi-search text-muted opacity-75 fs-6 " />
                                        </button>
                                    </form>
                                </div>
                                {/* Select option */}
                                <div className="col-md-3">
                                    {/* Short by filter */}
                                    <form>
                                        <div className="position-relative">
                                            <select id="sorting" className="form-control">
                                                <option value="">&nbsp;</option>
                                                <option value={1}>Free</option>
                                                <option value={2}>Most Popular</option>
                                                <option value={3}>Most Viewed</option>
                                                <option value={4}>Newest</option>
                                                <option value={5}>Trending</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="table-responsive border-0 rounded-3">
                                {/* Table START */}
                                <table className="table align-middle p-4 mb-0">
                                    {/* Table head */}
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col" className="border-0 rounded-start">
                                                Course Title
                                            </th>
                                            <th scope="col" className="border-0">
                                                Enrolled
                                            </th>
                                            <th scope="col" className="border-0">
                                                Status
                                            </th>
                                            <th scope="col" className="border-0">
                                                Price
                                            </th>
                                            <th scope="col" className="border-0 rounded-end">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    {/* Table body START */}
                                    <tbody>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-1.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">SEO Crash Course: Ranking Your Website</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-camera-video me-1" />
                                                                18 lectures
                                                            </p>
                                                            <p className="mb-0 text-muted-2">
                                                                <i className="bi bi-check-circle-fill text-success me-1" />
                                                                6 Completed
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">625</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                Live
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$249</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-2.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">JavaScript Interactive Web Development</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            27 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            11 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">0</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-red text-red">
                                                Rejected
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$149</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-3.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">
                                                            WordPress for Beginners: Creating Your Own Blog
                                                        </a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            20 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            12 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">450</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light text-secondary">
                                                Disable
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$159</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-4.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">
                                                            HTML &amp; CSS Basics: Building Your First Website
                                                        </a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            45 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            22 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">0</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-red text-red">
                                                Rejected
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$249</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-5.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">
                                                            Web Design Essentials: A Beginner's Guide
                                                        </a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            26 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            10 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">825</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                Live
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$345</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-6.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">
                                                            Web Design Essentials: A Beginner's Guide
                                                        </a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            26 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            10 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">825</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                Live
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$345</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-7.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Responsive Web Design for Mobile Users</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            40 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            22 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">590</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                Live
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$299</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Course item */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-8.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="courses-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">
                                                            UI/UX Design Creating User-Friendly Interfaces
                                                        </a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                        <p className="mb-0 text-muted-2 me-1">
                                                            <i className="bi bi-camera-video me-1" />
                                                            20 lectures
                                                        </p>
                                                        <p className="mb-0 text-muted-2">
                                                            <i className="bi bi-check-circle-fill text-success me-1" />
                                                            7 Completed
                                                        </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Enrolled Students item */}
                                            <td>
                                                <span className="text-muted-2">546</span>
                                            </td>
                                            {/* Course Status */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                Live
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">$120</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0">
                                                <i className="bi bi-pencil-square" />
                                                </a>
                                                <button className="btn btn-sm btn-light-red mb-0">
                                                <i className="bi bi-trash3" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                {/* Table body END */}
                                </table>
                                {/* Table END */}
                            </div>
                            {/* Pagination */}
                            <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-3">
                                {/* Content */}
                                <p className="mb-0 text-center text-sm-start text-muted">
                                Showing 1 to 8 of 20 entries
                                </p>
                                {/* Pagination */}
                                <nav
                                className="d-flex justify-content-center mb-0"
                                aria-label="navigation"
                                >
                                    <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                        <li className="page-item mb-0">
                                        <a className="page-link" href="#" tabIndex={-1}>
                                            <i className="fas fa-angle-left" />
                                        </a>
                                        </li>
                                        <li className="page-item mb-0">
                                        <a className="page-link" href="#">
                                            1
                                        </a>
                                        </li>
                                        <li className="page-item mb-0 active">
                                        <a className="page-link" href="#">
                                            2
                                        </a>
                                        </li>
                                        <li className="page-item mb-0">
                                        <a className="page-link" href="#">
                                            3
                                        </a>
                                        </li>
                                        <li className="page-item mb-0">
                                        <a className="page-link" href="#">
                                            4
                                        </a>
                                        </li>
                                        <li className="page-item mb-0">
                                        <a className="page-link" href="#">
                                            <i className="fas fa-angle-right" />
                                        </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        {/* Card body START */}
                    </div>
                </div>
            </div>
            {/* /Row */}
        </div>
    )
}
export default CoursesPage