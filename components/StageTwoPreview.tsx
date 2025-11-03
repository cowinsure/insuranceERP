"use client";

import React from "react";

interface StageTwoPreviewProps {
  data: any;
}

const truncate = (text: string, limit = 60) => {
  if (!text) return;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const renderRow = (label: string, value: any) => (
  <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span
      className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
      title={String(value || "")}
    >
      {value || <span className="text-gray-400">N/A</span>}
    </span>
  </div>
);

const renderList = (label: string, items: any[]) => (
  <div className="border rounded-lg p-2 bg-gray-50 mb-2">
    <span className="font-semibold text-gray-700">{label}</span>
    {items && items.length > 0 ? (
      <ul className="list-disc list-inside text-gray-600 mt-1">
        {items.map((i, idx) => (
          <li key={idx}>{i.name || "N/A"}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 italic mt-1">No data provided</p>
    )}
  </div>
);

export default function StageTwoPreview({ data }: StageTwoPreviewProps) {
  if (!data) return <p className="text-gray-400 italic">No data available</p>;

  return (
    <div className="max-w-4xl mx-auto text-gray-700 max-h-[75vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-md border space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Stage 2 Crop Data Preview
      </h2>

      {/* 🌾 Harvest */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Harvest
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3">
          {renderRow("Harvest Date", data.harvest?.harvest_date)}
          {renderRow(
            "Total Production (Kg)",
            data.harvest?.total_production_kg
          )}
          {renderRow(
            "Moisture Content (%)",
            data.harvest?.moisture_content_percentage
          )}
        </div>
      </section>

      {/* 🌾 Observation */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Observation
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
          {/* Seed Variety Observation */}
          {data.harvest?.harvest_seed_variety_observation_name && (
            <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
              <span className="font-medium text-gray-600">Seed Variety</span>
              <span
                className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                title={data.harvest.harvest_seed_variety_observation_name}
              >
                {data.harvest.harvest_seed_variety_observation_name}
              </span>
            </div>
          )}

          {/* Harvesting Timing */}
          {data.harvest?.harvesting_timing_name && (
            <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
              <span className="font-medium text-gray-600">
                Harvesting Timing
              </span>
              <span
                className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                title={data.harvest.harvesting_timing_name}
              >
                {data.harvest.harvesting_timing_name}
              </span>
            </div>
          )}

          {/* Good Agricultural Practices */}
          {data.harvest?.crop_harvest_details?.length > 0 ? (
            <div className="border rounded-lg p-3 bg-gray-50">
              <span className="font-medium text-gray-600">
                Good Agricultural Practices
              </span>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {data.harvest.crop_harvest_details.map(
                  (d: any, idx: number) => (
                    <li key={idx} className="py-2 font-semibold">
                      {d.good_agricultural_practices_type_name || "N/A"}
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 italic mt-1">No practices selected</p>
          )}

          {/* Manageable Harvest */}
          {typeof data.harvest?.is_manageable_harvest === "boolean" && (
            <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
              <span className="font-medium text-gray-600">
                Manageable Harvest
              </span>
              <span
                className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                title={data.harvest.is_manageable_harvest ? "Yes" : "No"}
              >
                {data.harvest.is_manageable_harvest ? "Yes" : "No"}
              </span>
            </div>
          )}

          {/* Remarks if not manageable */}
          {data.harvest?.is_manageable_harvest === false &&
            data.harvest?.reason_for_is_manageable_harvest && (
              <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                <span className="font-medium text-gray-600">Remarks</span>
                <span
                  className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                  title={data.harvest.reason_for_is_manageable_harvest}
                >
                  {data.harvest.reason_for_is_manageable_harvest}
                </span>
              </div>
            )}
        </div>
      </section>

      {/* 🐛 Pests & Diseases */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Pests & Disease
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3">
          {renderList(
            "Pests",
            data.pestsDisease?.pestNames?.map((name: string) => ({ name })) ||
              []
          )}
          {renderList(
            "Diseases",
            data.pestsDisease?.diseaseNames?.map((name: string) => ({
              name,
            })) || []
          )}
        </div>
      </section>

      {/* ☁️ Weather Effects */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Weather Effects
        </h3>

        {data.weather?.weather_effects_full?.length ? (
          <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
            {/* Period & General Remarks */}
            {renderRow("Period From", data.weather.date_from)}
            {renderRow("Period To", data.weather.date_to)}
            {renderRow("General Remarks", data.weather.remarks)}

            {/* Individual Weather Effects */}
            <div className="mt-2 space-y-2">
              {data.weather.weather_effects_full.map((w: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg bg-gray-50 p-2 shadow-sm"
                >
                  {renderRow("Effect Type", w.weather_effect_type_name)}
                  {renderRow("Remarks", w.remarks || "")}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic">No weather effects recorded</p>
        )}
      </section>

      <p className="text-center text-sm text-gray-500 mt-4">
        Please review all information carefully before submitting.
      </p>
    </div>
  );
}
