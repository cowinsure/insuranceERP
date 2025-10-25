"use client";

import React from "react";

interface PreviewProps {
  data: any;
}

// Helper: Format key names nicely
const formatKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word

const renderValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";

    // Array of objects
    if (value.every((item) => typeof item === "object" && item !== null)) {
      return (
        <div className="space-y-2">
          {value.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border rounded p-2 space-y-1 text-sm"
            >
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    {formatKey(k)}
                  </span>
                  <strong className="text-gray-800">{renderValue(v)}</strong>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // Array of primitives
    return value.join(", ");
  }

  if (typeof value === "object") {
    return (
      <div className="bg-white border rounded p-2 space-y-1 text-sm">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="font-medium text-gray-600">{formatKey(k)}</span>
            <strong className="text-gray-800">{renderValue(v)}</strong>
          </div>
        ))}
      </div>
    );
  }

  return value;
};

export default function PreviewSubmit({ data }: PreviewProps) {
  if (!data) return null;

  const isArray = Array.isArray(data);

  return (
    <div className="max-w-3xl mx-auto text-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Preview Your Details
      </h2>

      <div className="space-y-6 bg-gray-50 p-4 rounded-lg border max-h-[600px] overflow-auto">
        {isArray
          ? data.map((item: any, idx: number) => (
              <div key={idx} className="space-y-2">
                {renderValue(item)}
              </div>
            ))
          : Object.entries(data).map(([sectionKey, fields]) => (
              <div key={sectionKey} className="space-y-2">
                <h3 className="text-lg font-semibold capitalize mb-1">
                  {formatKey(sectionKey)}
                </h3>
                {typeof fields === "object" && fields !== null ? (
                  <div className="space-y-1">
                    {Object.entries(fields).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 border-b py-1 text-sm"
                      >
                        {/* <span className="font-medium text-gray-600">
                          {formatKey(key)}
                        </span> */}
                        <span className="text-right text-gray-800">
                          {renderValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 border-b py-1 text-sm">
                    <span className="font-medium text-gray-600">
                      {formatKey(sectionKey)}
                    </span>
                    <span className="text-right text-gray-800">
                      {renderValue(fields)}
                    </span>
                  </div>
                )}
              </div>
            ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Please review all information before submitting.
      </p>
    </div>
  );
}
