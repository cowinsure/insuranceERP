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

const renderValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // ✅ Handle array of strings
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (value.every((v) => typeof v === "string"))
      return value.map((v, i) => (
        <span
          key={i}
          title={v}
          className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs mr-1 mb-1"
        >
          {truncate(v, 40)}
        </span>
      ));

    // ✅ Array of objects (like cultivation, fertilizers, etc.)
    return (
      <div className="space-y-2">
        {value.map((obj, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-2 bg-gray-50 text-sm shadow-sm font-semibold"
          >
            {Object.entries(obj)
              .filter(([k]) => !k.includes("id")) // hide IDs
              .map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between text-sm border-b border-gray-100 last:border-0 py-2"
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
              ))}
          </div>
        ))}
      </div>
    );
  }

  // ✅ Single object
  if (typeof value === "object") {
    return (
      <div className="border rounded-lg p-2 bg-gray-50 text-sm shadow-sm">
        {Object.entries(value)
          .filter(([k]) => !k.includes("id"))
          .map(([k, v]) => (
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
    <div className="max-w-3xl mx-auto text-gray-700">
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
          : Object.entries(data).map(([sectionKey, fields]) => (
              <div key={sectionKey} className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-1">
                  {formatKey(sectionKey)}
                </h3>
                <div className="space-y-2 pl-1">
                  {renderValue(fields)}
                </div>
              </div>
            ))}
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Please review all information before submitting.
      </p>
    </div>
  );
}
