// components/ui/InputField.tsx

import clsx from "clsx";
import { read } from "fs";
import React from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  id: string;
  name: string;
  value?: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  max?: string;
  readOnly?: boolean;
  onFocus?: () => void;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  maxLength,
  readOnly = false,
  error,
  className,
  onFocus,
}) => {
  return (
    <div className="relative">
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 text-xs lg:text-sm font-medium lg:font-semibold text-gray-400 tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          onFocus={onFocus}
          className={clsx(
            "p-2 border border-gray-300 bg-gray-50 rounded-md font-medium",
            "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-blue-50",
            "hover:bg-blue-50 hover:border-blue-300",
            type === "date" &&
              "appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0",
            error ? "border-red-600" : "border-gray-300",
            `${className}`,
          )}
        />
      </div>
      {error && (
        <p className="text-red-400 mt-1 font-medium text-sm absolute">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
