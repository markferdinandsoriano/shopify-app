import React from "react";
import "./styles.css";

const Pagination = ({
  currentPage,
  totalPages,
  pageLimit,
  siblings,
  onChangePage,
  hasNextPage,
  hasPrevPage,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onChangePage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const totalPageCount = Math.ceil(totalPages / pageLimit);

    const pageNumbers = [];
    const minSibling = Math.max(1, currentPage - siblings);
    const maxSibling = Math.min(totalPageCount, currentPage + siblings);

    for (let i = minSibling; i <= maxSibling; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`pagination__page ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button
        className={`pagination__btn ${!hasPrevPage ? "disabled" : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        className={`pagination__btn ${!hasNextPage ? "disabled" : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
