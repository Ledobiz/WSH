'use client'

import NavBreadcrumb from "../NavBreadcrumb"

const StudentListPage = () => {
    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <NavBreadcrumb page="Students" />
            
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="card border bg-transparent rounded-3">
                        <div className="card-header border-bottom">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <h4 className="mb-2 mb-sm-0">All Students</h4>
                            </div>
                        </div>
                        
                        <div className="card-body">
                            <div className="row g-3 align-items-center justify-content-between mb-4">
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
                                
                                <div className="col-md-3">
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
                                <table className="table align-middle p-4 mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col" className="border-0 rounded-start">
                                                Student Name
                                            </th>
                                            <th scope="col" className="border-0">
                                                progress
                                            </th>
                                            <th scope="col" className="border-0">
                                                Courses
                                            </th>
                                            <th scope="col" className="border-0">
                                                Enrolled Date
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
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/avatar-1.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Jake Thompson</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                Las Vegas
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                {/* Title with info */}
                                                    <h6 className="fw-semibold">80%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                            className="progress w-100"
                                                            role="progressbar"
                                                            aria-label="Success striped example"
                                                            aria-valuenow={80}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                            style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "80%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Courses */}
                                            <td>
                                                <span className="text-muted-2">12</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">10 Jan 2025</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a
                                                href="#"
                                                className="btn btn-sm btn-gray me-1 mb-0"
                                                data-bs-toggle="modal"
                                                data-bs-target="#messageModal"
                                                >
                                                <i className="bi bi-chat-dots" />
                                                </a>
                                                <a
                                                className="btn btn-sm btn-light-red mb-0"
                                                data-bs-toggle="tooltip"
                                                data-bs-title="Block"
                                                >
                                                <i className="bi bi-ban" />
                                                </a>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/avatar-2.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Chris Walker</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                San Diego
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                    {/* Title with info */}
                                                    <h6 className="fw-semibold">60%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                        className="progress w-100"
                                                        role="progressbar"
                                                        aria-label="Success striped example"
                                                        aria-valuenow={60}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "60%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Courses */}
                                            <td>
                                                <span className="text-muted-2">16</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">12 Feb 2025</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a
                                                href="#"
                                                className="btn btn-sm btn-gray me-1 mb-0"
                                                data-bs-toggle="modal"
                                                data-bs-target="#messageModal"
                                                >
                                                <i className="bi bi-chat-dots" />
                                                </a>
                                                <a
                                                className="btn btn-sm btn-light-red mb-0"
                                                data-bs-toggle="tooltip"
                                                data-bs-title="Block"
                                                >
                                                <i className="bi bi-ban" />
                                                </a>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/avatar-3.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Ryan Mitchell</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                San Francisco
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                    {/* Title with info */}
                                                    <h6 className="fw-semibold">70%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                        className="progress w-100"
                                                        role="progressbar"
                                                        aria-label="Success striped example"
                                                        aria-valuenow={70}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "70%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Courses */}
                                            <td>
                                                <span className="text-muted-2">21</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">06 Mar 2025</span>
                                            </td>
                                            {/* Action item */}
                                                <td>
                                                    <a
                                                    href="#"
                                                    className="btn btn-sm btn-gray me-1 mb-0"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#messageModal"
                                                    >
                                                    <i className="bi bi-chat-dots" />
                                                    </a>
                                                    <a
                                                    className="btn btn-sm btn-light-red mb-0"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-title="Block"
                                                    >
                                                    <i className="bi bi-ban" />
                                                    </a>
                                                </td>
                                            </tr>
                                            {/* Table item */}
                                            <tr>
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                            src="assets/img/avatar-4.html"
                                                            className="img-fluid rounded"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Matt Cooper</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                San Antonio
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                    {/* Title with info */}
                                                    <h6 className="fw-semibold">50%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                        className="progress w-100"
                                                        role="progressbar"
                                                        aria-label="Success striped example"
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "50%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Courses */}
                                            <td>
                                                <span className="text-muted-2">17</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">02 Apr 2025</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a
                                                href="#"
                                                className="btn btn-sm btn-gray me-1 mb-0"
                                                data-bs-toggle="modal"
                                                data-bs-target="#messageModal"
                                                >
                                                <i className="bi bi-chat-dots" />
                                                </a>
                                                <a
                                                className="btn btn-sm btn-light-red mb-0"
                                                data-bs-toggle="tooltip"
                                                data-bs-title="Block"
                                                >
                                                <i className="bi bi-ban" />
                                                </a>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/avatar-5.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Emily Parker</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                Kansas City
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                    {/* Title with info */}
                                                    <h6 className="fw-semibold">60%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                        className="progress w-100"
                                                        role="progressbar"
                                                        aria-label="Success striped example"
                                                        aria-valuenow={60}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "60%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted-2">22</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">06 Apr 2025</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a
                                                href="#"
                                                className="btn btn-sm btn-gray me-1 mb-0"
                                                data-bs-toggle="modal"
                                                data-bs-target="#messageModal"
                                                >
                                                <i className="bi bi-chat-dots" />
                                                </a>
                                                <a
                                                className="btn btn-sm btn-light-red mb-0"
                                                data-bs-toggle="tooltip"
                                                data-bs-title="Block"
                                                >
                                                <i className="bi bi-ban" />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/avatar-6.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Megan Turner</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                New Orleans
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                    {/* Title with info */}
                                                    <h6 className="fw-semibold">90%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                        className="progress w-100"
                                                        role="progressbar"
                                                        aria-label="Success striped example"
                                                        aria-valuenow={90}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "90%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Courses */}
                                            <td>
                                                <span className="text-muted-2">28</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">02 May 2025</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a
                                                href="#"
                                                className="btn btn-sm btn-gray me-1 mb-0"
                                                data-bs-toggle="modal"
                                                data-bs-target="#messageModal"
                                                >
                                                <i className="bi bi-chat-dots" />
                                                </a>
                                                <a
                                                className="btn btn-sm btn-light-red mb-0"
                                                data-bs-toggle="tooltip"
                                                data-bs-title="Block"
                                                >
                                                <i className="bi bi-ban" />
                                                </a>
                                            </td>
                                        </tr>
                                        {/* Table item */}
                                        <tr>
                                            {/* Student name */}
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/avatar-2.html"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <div className="student-info">
                                                        {/* Title with info */}
                                                        <h6 className="mb-0 fw-semibold table-responsive-title">
                                                        <a href="#">Alex Bennett</a>
                                                        </h6>
                                                        <div className="d-flex gap-2">
                                                            <p className="mb-0 text-muted-2 me-1">
                                                                <i className="bi bi-geo-alt-fill me-1" />
                                                                Long Beach
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Progress */}
                                            <td>
                                                <div className="progress-info">
                                                    {/* Title with info */}
                                                    <h6 className="fw-semibold">70%</h6>
                                                    <div className="d-flex w-30">
                                                        <div
                                                        className="progress w-100"
                                                        role="progressbar"
                                                        aria-label="Success striped example"
                                                        aria-valuenow={70}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ height: 8 }}
                                                        >
                                                            <div
                                                                className="progress-bar progress-bar-striped bg-success"
                                                                style={{ width: "70%" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Courses */}
                                            <td>
                                                <span className="text-muted-2">18</span>
                                            </td>
                                            {/* Price */}
                                            <td>
                                                <span className="text-muted-2">15 March 2025</span>
                                            </td>
                                            {/* Action item */}
                                            <td>
                                                <a
                                                href="#"
                                                className="btn btn-sm btn-gray me-1 mb-0"
                                                data-bs-toggle="modal"
                                                data-bs-target="#messageModal"
                                                >
                                                <i className="bi bi-chat-dots" />
                                                </a>
                                                <a
                                                className="btn btn-sm btn-light-red mb-0"
                                                data-bs-toggle="tooltip"
                                                data-bs-title="Block"
                                                >
                                                <i className="bi bi-ban" />
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
export default StudentListPage