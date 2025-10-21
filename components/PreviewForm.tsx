"use client";

import React from "react";

interface PreviewProps {
  data: Record<string, any> | null;
}

const renderValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) return "—";

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";

    if (value.every((item) => typeof item === "object" && item !== null)) {
      // Array of objects — render styled list
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div
              key={index}
              className="text-sm text-left bg-white rounded px-2 py-1 border"
            >
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b py-1">
                  <p className="capitalize font-semibold text-gray-600">
                    {k.replace(/([A-Z])/g, " $1")} :
                  </p>
                  <strong>{renderValue(v)}</strong>
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
    // Single object — render styled key-value block
    return (
      <div className="text-sm text-left bg-white rounded px-2 py-1 border space-y-1">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b py-1">
            <p className="capitalize font-semibold text-gray-600">
              {k.replace(/([A-Z])/g, " $1")} :
            </p>
            <strong>{renderValue(v)}</strong>
          </div>
        ))}
      </div>
    );
  }

  return value || "—";
};

export default function PreviewSubmit({ data }: PreviewProps) {
  if (!data) return null;

  // Check if top-level data is an array or object
  const isArray = Array.isArray(data);

  return (
    <div className="max-w-2xl mx-auto text-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Preview Your Details
      </h2>

      <div className="space-y-6 bg-gray-50 p-4 rounded-lg border max-h-[400px] overflow-auto">
        {isArray
          ? data.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                {renderValue(item)}
              </div>
            ))
          : Object.entries(data).map(([sectionKey, fields]) => (
              <div key={sectionKey}>
                <h3 className="text-lg font-semibold capitalize mb-2 pb-1">
                  {sectionKey.replace(/([A-Z])/g, " $1")}
                </h3>
                <div className="space-y-1">
                  {typeof fields === "object" && fields !== null ? (
                    Object.entries(fields).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 border-b py-2">
                        <span className="capitalize font-medium">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-right">{renderValue(value)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-2 border-b py-2">
                      <span className="capitalize font-medium">
                        {sectionKey.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-right">{renderValue(fields)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Please review all information before submitting.
      </p>
    </div>
  );
}
