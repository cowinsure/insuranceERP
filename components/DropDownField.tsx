import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface DropdownFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  options: { value: string | number; label: string }[];
  error?: string;
  placeholder?: string;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  options,
  error,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (val: string | number) => {
    const fakeEvent = {
      target: { value: val, name },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    onChange?.(fakeEvent);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="mb-1 text-xs lg:text-sm font-medium lg:font-semibold text-gray-400 tracking-wide">
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "w-full px-3 py-2 rounded-md bg-white text-left cursor-pointer",
          "border text-sm font-medium",
          "flex items-center justify-between",
          "transition-all",
          "hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
        )}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>

        <svg
          className={clsx(
            "w-4 h-4 transition-transform duration-300",
            open && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className={clsx(
            "absolute z-50 mt-2 w-full",
            "bg-white rounded-xl shadow-xl border",
            "overflow-hidden animate-dropdown",
          )}
        >
          <div className="max-h-56 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={clsx(
                  "px-4 py-2 text-sm cursor-pointer",
                  "transition-colors",
                  option.value === value
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700",
                )}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default DropdownField;
