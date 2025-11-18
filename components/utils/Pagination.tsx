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
    <div className="flex flex-col items-center justify-center mt-10 w-full gap-4">
      {/* Page Navigation */}
      <div className="flex items-center w-full justify-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border disabled:opacity-50 cursor-pointer shrink-0 text-sm"
        >
          Prev
        </button>

        {/* Responsive Scrollable Page Numbers */}
        <div className="flex gap-2 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1 whitespace-nowrap">
          {showPageNumbers &&
            pagesToShow.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1 rounded-lg border text-gray-600 text-sm shrink-0">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(Number(page))}
                    className={`px-3 py-1 rounded-lg border text-sm shrink-0 ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border disabled:opacity-50 cursor-pointer shrink-0 text-sm"
        >
          Next
        </button>
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Show:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            onPageSizeChange(value === "All" ? "All" : Number(value));
            onPageChange(1);
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
