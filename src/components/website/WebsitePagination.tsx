interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const WebsitePagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <ul className="pagination d-flex align-items-center justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button onClick={() => onPageChange(currentPage - 1)} className="page-link" aria-label="Previous">
                                    <span className="ti-arrow-left" />
                                    <span className="sr-only">Previous</span>
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => onPageChange(i + 1)}>{i + 1}</button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(currentPage + 1)} aria-label="Next">
                                    <span className="ti-arrow-right" />
                                    <span className="sr-only">Next</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WebsitePagination