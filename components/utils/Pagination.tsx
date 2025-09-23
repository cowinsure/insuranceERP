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
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

      {/* Rows per page selector */}
      <div className="ml-4 flex items-center gap-2">
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
