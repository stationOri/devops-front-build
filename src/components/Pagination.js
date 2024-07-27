import React from 'react';
import "../css/components/Pagination.css";
import LeftPage from "../assets/images/left-chevron.png";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, activeColor }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 10; // Maximum number of page buttons to show

  const getPageRange = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      const start = Math.max(1, endPage - maxVisiblePages + 1);
      return Array.from({ length: endPage - start + 1 }, (_, i) => start + i);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageRange = getPageRange();

  return (
    <div className="paginationWrapper">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="paginationButton"
        disabled={currentPage === 1}
      >
        <img src={LeftPage} alt="Previous" className="paginationIcon" />
      </button>
      {pageRange.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`paginationButton ${currentPage === page ? "active" : ""}`}
          style={{ backgroundColor: currentPage === page ? activeColor : 'white' }}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className="paginationButton"
        disabled={currentPage === totalPages}
      >
        <img src={LeftPage} alt="Next" className="paginationIcon forrightarrow" />
      </button>
    </div>
  );
}

export default Pagination;
