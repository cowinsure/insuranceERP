import React from "react";
import clsx from "clsx";

interface DropdownFieldProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  options: { value: string | number; label: string }[]; // Array of options, each with a value and label
  error?: string;
  placeholder?: string;
}

// function renderStyledText(text: string) {
//   const match = text?.match(/[\u0980-\u09FF]/);
//   if (!match) return text;

//   const index = match.index;
//   const englishPart = text.slice(0, index).trim();
//   const bengaliPart = text.slice(index).trim();
//   return (
//     <>
//       {englishPart} <span className="">{bengaliPart}</span>
//     </>
//   );
// }

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
  return (
    <div className="relative">
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="mb-1 text-sm font-bold text-gray-400 tracking-wide"
        >
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={clsx(
            "p-2 border rounded-md bg-gray-50 font-semibold",
            "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-blue-50",
            "hover:bg-blue-50 hover:border-blue-300 cursor-pointer",
            error ? "border-red-600" : "border-gray-300"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option, idx) => (
            <option
              key={idx}
              value={option.value}
              className="font-semibold tracking-wide space-y-2"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-red-400 mt-1 font-medium text-sm absolute">
          {error}
        </p>
      )}
    </div>
  );
};

export default DropdownField;
