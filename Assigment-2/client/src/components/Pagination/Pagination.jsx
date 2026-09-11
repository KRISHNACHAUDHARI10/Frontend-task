import React from 'react';
import './Pagination.scss';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage = 7 }) => {
  const startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{startRange}</strong> to <strong>{endRange}</strong> of <strong>{totalItems}</strong> entries
      </div>

      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="btn-page"
        >
          Prev
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`btn-page btn-page-num ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="btn-page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
