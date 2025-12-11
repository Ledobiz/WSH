'use client'

import NavBreadcrumb from "../NavBreadcrumb"

const EarningPage = () => {
    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            <NavBreadcrumb page="Earnings" />
            
            <div className="row gy-3 mb-4">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <div className="card rounded-3 border px-3 py-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="square--60 circle bg-light-green fs-3">
                                <i className="bi bi-coin text-green" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <h2 className="fw-semibold m-0">$890</h2>
                                <span className="text-muted">Sales This Month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <div className="card rounded-3 border px-3 py-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="square--60 circle bg-light-red fs-3">
                                <i className="bi bi-wallet2 text-red" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <h2 className="fw-semibold m-0">$2,580</h2>
                                <span className="text-muted">Next Payout</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                    <div className="card rounded-3 border px-3 py-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="square--60 circle bg-light-main fs-3">
                                <i className="bi bi-piggy-bank text-main" />
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <h2 className="fw-semibold m-0">$60,550</h2>
                                <span className="text-muted">Sales Overall</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="card border bg-transparent rounded-3">
                        <div className="card-header border-bottom">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <h4 className="mb-2 mb-sm-0">Recent Selling Courses</h4>
                                <a href="#" className="btns text-muted mb-0">
                                View All
                                </a>
                            </div>
                        </div>
                        
                        <div className="card-body">
                            <div className="table-responsive border-0 rounded-3">
                                <table className="table align-middle p-4 mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col" className="border-0 rounded-start">
                                                Course Name
                                            </th>
                                            <th scope="col" className="border-0">
                                                Selling
                                            </th>
                                            <th scope="col" className="border-0">
                                                Amount
                                            </th>
                                            <th scope="col" className="border-0">
                                                Period
                                            </th>
                                            <th scope="col" className="border-0 rounded-end">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-1.jpg"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                        <a href="#">Building Scalable APIs with GraphQL</a>
                                                    </h6>
                                                </div>
                                            </td>
                                            {/* Selling item */}
                                            <td>
                                                <span className="text-muted-2">42</span>
                                            </td>
                                            {/* Amount item */}
                                            <td>
                                                <span className="text-muted-2">$18,432</span>
                                            </td>
                                            {/* Period item */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                06 months
                                                </span>
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
                                                <div className="d-flex align-items-center">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-2.jpg"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    {/* Title */}
                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                        <a href="#">Building Scalable APIs with GraphQL</a>
                                                    </h6>
                                                </div>
                                            </td>
                                            {/* Selling item */}
                                            <td>
                                                <span className="text-muted-2">36</span>
                                            </td>
                                            {/* Amount item */}
                                            <td>
                                                <span className="text-muted-2">$20,560</span>
                                            </td>
                                            {/* Period item */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                09 months
                                                </span>
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
                                                <div className="d-flex align-items-center">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-3.jpg"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    {/* Title */}
                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                        <a href="#">Building Scalable APIs with GraphQL</a>
                                                    </h6>
                                                </div>
                                            </td>
                                            {/* Selling item */}
                                            <td>
                                                <span className="text-muted-2">44</span>
                                            </td>
                                            {/* Amount item */}
                                            <td>
                                                <span className="text-muted-2">$45,550</span>
                                            </td>
                                            {/* Period item */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                    12 months
                                                </span>
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
                                                <div className="d-flex align-items-center">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                        src="assets/img/courses-4.jpg"
                                                        className="img-fluid rounded"
                                                        alt=""
                                                        />
                                                    </div>
                                                    {/* Title */}
                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                        <a href="#">Building Scalable APIs with GraphQL</a>
                                                    </h6>
                                                </div>
                                            </td>
                                            {/* Selling item */}
                                            <td>
                                                <span className="text-muted-2">65</span>
                                            </td>
                                            {/* Amount item */}
                                            <td>
                                                <span className="text-muted-2">$22,568</span>
                                            </td>
                                            {/* Period item */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                18 months
                                                </span>
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
                                                <div className="d-flex align-items-center">
                                                    {/* Image */}
                                                    <div className="w-15">
                                                        <img
                                                            src="assets/img/courses-5.jpg"
                                                            className="img-fluid rounded"
                                                            alt=""
                                                        />
                                                    </div>
                                                    {/* Title */}
                                                    <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                        <a href="#">Building Scalable APIs with GraphQL</a>
                                                    </h6>
                                                </div>
                                            </td>
                                            {/* Selling item */}
                                            <td>
                                                <span className="text-muted-2">75</span>
                                            </td>
                                            {/* Amount item */}
                                            <td>
                                                <span className="text-muted-2">$36,980</span>
                                            </td>
                                            {/* Period item */}
                                            <td>
                                                <span className="badge bg-light-green text-green">
                                                08 months
                                                </span>
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
                                            5
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
        </div>
    )
}
export default EarningPage