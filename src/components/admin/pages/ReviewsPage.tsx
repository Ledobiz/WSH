'use client'

const ReviewsPage = () => {
    return (
        <div className="col-lg-9 col-md-12 col-sm-12">
            {/* Row */}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="#">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="#">Instructor Dashboard</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Reviews
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            {/* /Row */}
            {/* Row */}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="card border bg-transparent rounded-3">
                        {/* Card header START */}
                        <div className="card-header border-bottom">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <h4 className="mb-2 mb-sm-0">Student Reviews</h4>
                            </div>
                        </div>
                        {/* Card header END */}
                        {/* Card body START */}
                        <div className="card-body">
                            <div className="card-body mt-2 mt-sm-4">
                                {/* Review item START */}
                                <div className="d-sm-flex">
                                    {/* Avatar image */}
                                    <img
                                        className="img-fluid square--80 circle float-start me-3"
                                        src="assets/img/user-1.jpg"
                                        alt="avatar"
                                    />
                                    <div>
                                        <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                            {/* Title */}
                                            <div>
                                                <h5 className="m-0">Jake Thompson</h5>
                                                <span className="me-3 text-muted small">
                                                10 Jan 2024 at 10:10AM{" "}
                                                </span>
                                            </div>
                                            {/* Review star */}
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="far fa-star text-warning" />
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Content */}
                                        <h6>
                                            <span className="fw-light">Review on:</span> JavaScript DOM in
                                            30 Minutes
                                        </h6>
                                        <p>
                                        The toppings you may chose for that TV dinner pizza slice when
                                        you forgot to shop for foods, the paint you may slap on your
                                        face to impress the new boss is your business. But what about
                                        your daily bread.{" "}
                                        </p>
                                        {/* Button */}
                                        <div className="text-end">
                                            <a
                                                className="btn btn-sm btn-gray rounded-pill px-3 mb-0"
                                                data-bs-toggle="collapse"
                                                href="#collapseComment"
                                                role="button"
                                                aria-expanded="false"
                                                aria-controls="collapseComment"
                                            >
                                                Reply
                                            </a>
                                            {/* collapse textarea */}
                                            <div className="collapse show" id="collapseComment">
                                                <div className="d-flex mt-3 position-relative">
                                                    <textarea
                                                        className="form-control ht-200 mb-0"
                                                        placeholder="Add a comment..."
                                                        defaultValue={""}
                                                    />
                                                    <div className="position-absolute end-0 bottom-0 me-2 mb-2">
                                                        <button
                                                        type="button"
                                                        className="btn square--60 circle bg-main text-white fs-3"
                                                        >
                                                        <i className="bi bi-send" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Divider */}
                                <hr />
                                {/* Review item END */}
                                {/* Review item START */}
                                <div className="d-sm-flex">
                                    {/* Avatar image */}
                                    <img
                                        className="img-fluid square--80 circle float-start me-3"
                                        src="assets/img/user-2.jpg"
                                        alt="avatar"
                                    />
                                    <div>
                                        <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                            {/* Title */}
                                            <div>
                                                <h5 className="m-0">Lauren Hayes</h5>
                                                <span className="me-3 text-muted small">
                                                10 Jan 2024 at 10:10AM{" "}
                                                </span>
                                            </div>
                                            {/* Review star */}
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="far fa-star text-warning" />
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Content */}
                                        <h6>
                                            <span className="fw-light">Review on:</span> JavaScript DOM in
                                            30 Minutes
                                        </h6>
                                        <p>
                                        The toppings you may chose for that TV dinner pizza slice when
                                        you forgot to shop for foods, the paint you may slap on your
                                        face to impress the new boss is your business. But what about
                                        your daily bread.{" "}
                                        </p>
                                        {/* Button */}
                                        <div className="text-end">
                                            <a
                                                className="btn btn-sm btn-gray rounded-pill px-3 mb-0"
                                                href="#"
                                            >
                                                Reply
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* Divider */}
                                <hr />
                                {/* Review item END */}
                                {/* Review item START */}
                                <div className="d-sm-flex">
                                    {/* Avatar image */}
                                    <img
                                        className="img-fluid square--80 circle float-start me-3"
                                        src="assets/img/user-3.jpg"
                                        alt="avatar"
                                    />
                                        <div>
                                            <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                                {/* Title */}
                                                <div>
                                                    <h5 className="m-0">Alex Bennett</h5>
                                                    <span className="me-3 text-muted small">
                                                    10 Jan 2024 at 10:10AM{" "}
                                                    </span>
                                                </div>
                                                {/* Review star */}
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item me-0">
                                                    <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                    <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                    <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                    <i className="fas fa-star text-warning" />
                                                    </li>
                                                    <li className="list-inline-item me-0">
                                                    <i className="far fa-star text-warning" />
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* Content */}
                                            <h6>
                                                <span className="fw-light">Review on:</span> JavaScript DOM in
                                                30 Minutes
                                            </h6>
                                            <p>
                                                The toppings you may chose for that TV dinner pizza slice when
                                                you forgot to shop for foods, the paint you may slap on your
                                                face to impress the new boss is your business. But what about
                                                your daily bread.{" "}
                                            </p>
                                            {/* Button */}
                                            <div className="text-end">
                                                <a
                                                    className="btn btn-sm btn-gray rounded-pill px-3 mb-0"
                                                    href="#"
                                                >
                                                    Reply
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <hr />

                                    <div className="d-sm-flex">
                                        <img
                                            className="img-fluid square--80 circle float-start me-3"
                                            src="assets/img/user-4.html"
                                            alt="avatar"
                                        />
                                        <div>
                                            <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                            {/* Title */}
                                            <div>
                                                <h5 className="m-0">Megan Turner</h5>
                                                <span className="me-3 text-muted small">
                                                10 Jan 2024 at 10:10AM{" "}
                                                </span>
                                            </div>
                                            {/* Review star */}
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="far fa-star text-warning" />
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Content */}
                                        <h6>
                                            <span className="fw-light">Review on:</span> JavaScript DOM in
                                            30 Minutes
                                        </h6>
                                        <p>
                                            The toppings you may chose for that TV dinner pizza slice when
                                            you forgot to shop for foods, the paint you may slap on your
                                            face to impress the new boss is your business. But what about
                                            your daily bread.{" "}
                                        </p>
                                        {/* Button */}
                                        <div className="text-end">
                                        <a
                                            className="btn btn-sm btn-gray rounded-pill px-3 mb-0"
                                            href="#"
                                        >
                                            Reply
                                        </a>
                                        </div>
                                    </div>
                                </div>
                                {/* Divider */}
                                <hr />
                                        
                                <div className="d-sm-flex">
                                    <img
                                        className="img-fluid square--80 circle float-start me-3"
                                        src="assets/img/user-5.html"
                                        alt="avatar"
                                    />
                                    <div>
                                        <div className="mb-3 d-sm-flex justify-content-sm-between align-items-center">
                                            {/* Title */}
                                            <div>
                                                <h5 className="m-0">Chris Walker</h5>
                                                <span className="me-3 text-muted small">
                                                05 Jan 2024 at 10:10AM{" "}
                                                </span>
                                            </div>
                                            {/* Review star */}
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="fas fa-star text-warning" />
                                                </li>
                                                <li className="list-inline-item me-0">
                                                <i className="far fa-star text-warning" />
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Content */}
                                        <h6>
                                            <span className="fw-light">Review on:</span> JavaScript DOM in
                                            30 Minutes
                                        </h6>
                                        <p>
                                            The toppings you may chose for that TV dinner pizza slice when
                                            you forgot to shop for foods, the paint you may slap on your
                                            face to impress the new boss is your business. But what about
                                            your daily bread.{" "}
                                        </p>
                                        {/* Button */}
                                        <div className="text-end">
                                            <a
                                                className="btn btn-sm btn-gray rounded-pill px-3 mb-0"
                                                href="#"
                                            >
                                                Reply
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* Review item END */}
                            </div>
                        </div>
                        {/* Card body START */}
                        <div className="card-footer bg-white py-3">
                            {/* Pagination */}
                            <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
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
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ReviewsPage