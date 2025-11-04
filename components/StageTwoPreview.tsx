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

  console.log(data);
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
        <div className="rounded-lg bg-white shadow-sm p-3 space-y-2">
          {renderRow("Harvest Date", data.harvest?.harvest_date)}

          {/* ✅ Total Production (array display) */}
          <div className="p-2 flex items-center justify-between">
            <span className="font-medium text-gray-600 text-sm">
              Total Production (Kg)
            </span>
            {Array.isArray(data.harvest?.total_production_kg) &&
            data.harvest.total_production_kg.length > 0 ? (
              <ul className="list-inside text-gray-800 font-semibold mt-1 text-right">
                {data.harvest.total_production_kg.map(
                  (val: number, idx: number) => (
                    <li
                      key={idx}
                      className="bg-gray-50 rounded-full border px-4 py-1 mb-1"
                    >
                      {" "}
                      {val} kg
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-400 italic text-right">
                No data provided
              </p>
            )}
          </div>

          {/* ✅ Moisture Content (array display) */}
          <div className="p-2 flex items-center justify-between">
            <span className="font-medium text-gray-600 text-sm">
              Moisture Content (%)
            </span>
            {Array.isArray(data.harvest?.moisture_content_percentage) &&
            data.harvest.moisture_content_percentage.length > 0 ? (
              <ul className="list-inside text-gray-800 font-semibold mt-1 text-right">
                {data.harvest.moisture_content_percentage.map(
                  (val: number, idx: number) => (
                    <li
                      key={idx}
                      className="bg-gray-50 rounded-full border px-4 py-1 mb-1"
                    >
                      {val} %
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-400 italic text-right">
                No data provided
              </p>
            )}
          </div>
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
        </div>
      </section>

      {/* 🐛 Pests & Diseases + Manageable Harvest */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Pests, Disease
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3">
          {/* ✅ Manageable Harvest */}
          {typeof data.pestsDisease?.is_manageable_harvest === "boolean" && (
            <>
              {renderRow(
                "Manageable Harvest",
                data.pestsDisease.is_manageable_harvest ? "Yes" : "No"
              )}
              {!data.pestsDisease.is_manageable_harvest &&
                data.pestsDisease.reason_for_is_manageable_harvest &&
                renderRow(
                  "Remarks",
                  data.pestsDisease.reason_for_is_manageable_harvest
                )}
            </>
          )}

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
            {renderRow("Period From", data.weather.date_from)}
            {renderRow("Period To", data.weather.date_to)}
            {renderRow("General Remarks", data.weather.remarks)}

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

      {/* 📝 Survey (FGD) */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Survey (FGD)
        </h3>

        {data.survey?.length ? (
          <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
            {data.survey.map((s: any, idx: number) => (
              <div key={idx} className="space-y-2">
                {s.top_three_varieties?.length ? (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Top Three Varieties
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {s.top_three_varieties.map((v: string, i: number) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No varieties provided</p>
                )}

                {renderRow(
                  "Average Production This Year (kg)",
                  s.avg_production_this_year
                )}
                {renderRow(
                  "Average Production Last Year (kg)",
                  s.avg_production_last_year
                )}

                {renderRow("Yield Loss", s.yield_loss === "yes" ? "Yes" : "No")}

                {s.yield_loss === "yes" &&
                s.key_reasons_yield_losses?.length ? (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Key Reasons of Yield Loss
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {s.key_reasons_yield_losses.map(
                        (reason: string, i: number) => (
                          <li key={i}>{reason}</li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}

                {s.weather_effects?.length ? (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Weather Effects
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {s.weather_effects.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {s.pest_and_disease?.length ? (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Pest & Disease
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {s.pest_and_disease.map((pd: string, i: number) => (
                        <li key={i}>{pd}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {s.remarks ? renderRow("Remarks", s.remarks) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No survey data available</p>
        )}
      </section>

      <p className="text-center text-sm text-gray-500 mt-4">
        Please review all information carefully before submitting.
      </p>
    </div>
  );
}
