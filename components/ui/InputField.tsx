// components/ui/InputField.tsx

import clsx from "clsx";
import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
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
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-sm font-bold text-gray-600">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={clsx(
          "p-2 border border-gray-300 bg-gray-50 rounded-md font-semibold",
          "focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50",
          "hover:bg-green-50 hover:border-green-300",
          type === "date" &&
            "appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
        )}
      />
    </div>
  );
};

export default InputField;
