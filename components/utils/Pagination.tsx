"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  //   if (totalPages <= 1) return null; // no need to show pagination

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === page ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
