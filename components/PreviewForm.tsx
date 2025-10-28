"use client";

import React from "react";

interface PreviewProps {
  data: any;
}

// ✅ Format key names nicely
const formatKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// ✅ Truncate long text (with tooltip)
const truncate = (text: string, limit = 80) => {
  if (!text) return "—";
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

// ✅ Universal value renderer
const renderValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // ✅ Handle array values
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";

    // ✅ Array of numbers (like pest/disease IDs)
    if (value.every((v) => typeof v === "number"))
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              ID: {v}
            </span>
          ))}
        </div>
      );

    // ✅ Array of strings
    if (value.every((v) => typeof v === "string"))
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <span
              key={i}
              title={v}
              className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
            >
              {truncate(v, 40)}
            </span>
          ))}
        </div>
      );

    // ✅ Array of objects (like chemicals, pestDetails, etc.)
    if (value.some((v) => typeof v === "object")) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {value.map((obj, idx) => {
            const entries = Object.entries(obj).filter(
              ([, val]) =>
                val !== null &&
                val !== "" &&
                !String(val).toLowerCase().includes("id")
            );

            return (
              <div
                key={idx}
                className="border rounded-xl p-3 bg-gray-50 text-sm shadow-sm"
              >
                {entries.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-2">
                    Empty item
                  </p>
                ) : (
                  entries.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between border-b last:border-0 py-1"
                    >
                      <span className="text-gray-600 font-medium">
                        {formatKey(k)}
                      </span>
                      <span
                        className="text-gray-800 text-right max-w-[200px] truncate"
                        title={String(v)}
                      >
                        {truncate(String(v))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      );
    }
  }

  // ✅ Handle single object
  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value).filter(
      ([, v]) => v !== null && v !== "" && !String(v).toLowerCase().includes("id")
    );

    if (entries.length === 0)
      return <p className="text-gray-400 italic">No details available</p>;

    return (
      <div className="border rounded-lg p-2 bg-gray-50 text-sm shadow-sm">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between text-sm border-b border-gray-100 last:border-0 py-1"
          >
            <span className="text-gray-600 font-medium">{formatKey(k)}</span>
            <span
              className="text-gray-800 text-right max-w-[250px] truncate font-semibold"
              title={String(v)}
            >
              {truncate(String(v))}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return truncate(String(value));
};

export default function PreviewSubmit({ data }: PreviewProps) {
  if (!data) return null;

  const isArray = Array.isArray(data);

  return (
    <div className="max-w-4xl mx-auto text-gray-700 max-h-[70vh] overflow-y-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Preview Your Details
      </h2>

      <div className="space-y-6 bg-white p-6 rounded-2xl shadow border">
        {isArray
          ? data.map((item: any, idx: number) => (
              <div key={idx} className="space-y-2">
                {renderValue(item)}
              </div>
            ))
          : Object.entries(data).map(([sectionKey, fields]) => {
              const isEmpty =
                fields == null ||
                (Array.isArray(fields) && fields.length === 0) ||
                (typeof fields === "object" &&
                  !Array.isArray(fields) &&
                  Object.keys(fields).length === 0);

              return (
                <div key={sectionKey} className="space-y-2">
                  <h3 className="text-lg font-semibold text-blue-700 border-b pb-1">
                    {formatKey(sectionKey)}
                  </h3>
                  <div className="space-y-2 pl-1">
                    {isEmpty ? (
                      <p className="text-gray-400 italic">No data available</p>
                    ) : (
                      renderValue(fields)
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Please review all information before submitting.
      </p>
    </div>
  );
}
