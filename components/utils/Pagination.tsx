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
    <div className="flex flex-col sm:flex-row items-center justify-between mt-3 lg:mt-6 w-full gap-4">
      {/* Page Size Selector */}
      <div className="lg:flex hidden items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            onPageSizeChange(value === "All" ? "All" : Number(value));
            onPageChange(1);
          }}
        >
          <SelectTrigger className="border border-gray-300 rounded px-2 py-1 text-sm w-[80px]">
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

      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
