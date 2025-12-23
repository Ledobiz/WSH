interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalEntries, pageSize, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const startEntry = ((currentPage - 1) * pageSize) + 1;
    const endEntry = Math.min(currentPage * pageSize, totalEntries);

    return (
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-3">
            <p className="mb-0 text-muted">
                Showing {startEntry} to {endEntry} of {totalEntries} entries
            </p>
            <nav aria-label="navigation" className="d-flex justify-content-center mb-0">
                <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                    <li className={`page-item mb-0 ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                            <i className="fas fa-angle-left" />
                        </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item mb-0 ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(i + 1)}>{i + 1}</button>
                        </li>
                    ))}

                    <li className={`page-item mb-0 ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                            <i className="fas fa-angle-right" />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
export default Pagination