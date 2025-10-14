"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number; // make optional
  onPageChange: (page: number) => void;
  pageSize: number | "All";
  onPageSizeChange: (size: number | "All") => void;
  showPageNumbers?: boolean; // new prop
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages = 1,
  onPageChange,
  pageSize,
  onPageSizeChange,
  showPageNumbers = true,
}) => {
  // Ensure totalPages is at least 1
  totalPages = Math.max(totalPages, 1);

  // Define how many pages we want to display around the current page
  const range = 2;

  // Determine page numbers to display
  let pagesToShow: (number | string)[] = [1];

  // Show the pages around the current page
  if (currentPage - range > 2) {
    pagesToShow.push(currentPage - range);
  }
  if (currentPage - range - 1 > 1) {
    pagesToShow.push("..."); // Show an ellipsis if there's a gap
  }

  for (
    let i = Math.max(2, currentPage - range);
    i <= Math.min(totalPages - 1, currentPage + range);
    i++
  ) {
    if (!pagesToShow.includes(i)) pagesToShow.push(i);
  }

  // Show the last page and add an ellipsis if needed
  if (currentPage + range < totalPages - 1) {
    pagesToShow.push("...");
  }
  if (totalPages > 1) pagesToShow.push(totalPages);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-10 flex-wrap">
      <div className="flex gap-2 flex-1 justify-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {showPageNumbers &&
          pagesToShow.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 rounded-lg border text-gray-600">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(Number(page))}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Rows per page selector */}
      <div className="ml-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Show:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            onPageSizeChange(value === "All" ? "All" : Number(value));
            onPageChange(1); // Reset to first page when page size changes
          }}
        >
          <SelectTrigger className="border rounded px-2 py-1 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, "All"].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
