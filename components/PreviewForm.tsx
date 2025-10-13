"use client";

interface PreviewProps {
  data: Record<string, Record<string, any>> | null;
}

export default function PreviewSubmit({ data }: PreviewProps) {
  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Preview Your Details</h2>
      <div className="space-y-6 bg-gray-50 p-4 rounded-lg border">
        {Object.entries(data).map(([sectionKey, fields]) => (
          <div key={sectionKey}>
            <h3 className="text-lg font-semibold capitalize mb-2 border-b pb-1">
              {sectionKey.replace(/([A-Z])/g, " $1")}
            </h3>
            <div className="space-y-1">
              {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="capitalize font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span>
                    {typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : value || "—"}
                  </span>
                </div>
              ))}
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
