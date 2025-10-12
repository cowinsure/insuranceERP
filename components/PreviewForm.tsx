"use client";

interface PreviewProps {
  data: Record<string, string | undefined>;
}

export default function PreviewSubmit({ data }: PreviewProps) {
  return (
    <div className="max-w-2xl mx-auto text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Preview Your Details</h2>
      <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b py-1">
            <span className="capitalize font-medium">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span>{value || "—"}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Please review all information before submitting.
      </p>
    </div>
  );
}
