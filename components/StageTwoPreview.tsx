"use client";

import React from "react";
import { useLocalization } from "@/core/context/LocalizationContext";

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
  const { t } = useLocalization();
  if (!data) return <p className="text-gray-400 italic">{t('no_data_available')}</p>;

  console.log(data);
  return (
    <div className="max-w-4xl mx-auto text-gray-700 max-h-[75vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-md border space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        {t('stage_2_crop_data_preview')}
      </h2>

      {/* 🌾 Harvest */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          {t('harvest')}
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3 space-y-2">
          {renderRow(t('harvest_date'), data.harvest?.harvest_date)}

          {/* ✅ Total Production (array display) */}
          <div className="p-2 flex items-center justify-between">
            <span className="font-medium text-gray-600 text-sm">
              {t('total_production_kg_cap')}
            </span>
            {Array.isArray(data.harvest?.crop_harvest_production_details) &&
            data.harvest.crop_harvest_production_details.length > 0 ? (
              <ul className="list-inside text-gray-800 font-semibold mt-1 text-right">
                {data.harvest.crop_harvest_production_details.map(
                  (val: any, idx: number) => (
                    <li
                      key={idx}
                      className="bg-gray-50 rounded-full border px-4 py-1 mb-1"
                    >
                      {val.production_kg} kg
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-400 italic text-right">
                {t('no_data_provided')}
              </p>
            )}
          </div>

          {/* ✅ Moisture Content (array display) */}
          <div className="p-2 flex items-center justify-between">
            <span className="font-medium text-gray-600 text-sm">
              {t('moisture_content_percent_cap')}
            </span>
            {Array.isArray(
              data.harvest?.crop_harvest_moisture_content_details
            ) &&
            data.harvest.crop_harvest_moisture_content_details.length > 0 ? (
              <ul className="list-inside text-gray-800 font-semibold mt-1 text-right">
                {data.harvest.crop_harvest_moisture_content_details.map(
                  (val: any, idx: number) => (
                    <li
                      key={idx}
                      className="bg-gray-50 rounded-full border px-4 py-1 mb-1"
                    >
                      {val.moisture_content_per} %
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-400 italic text-right">
                {t('no_data_provided')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 🌾 Observation */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          {t('observation')}
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
          {/* Seed Variety Observation */}
          {data.harvest?.harvest_seed_variety_observation_name && (
            <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
              <span className="font-medium text-gray-600">{t('seed_variety')}</span>
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
                {t('harvesting_timing')}
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
                {t('good_agricultural_practices')}
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
            <p className="text-gray-400 italic mt-1">{t('no_practices_selected')}</p>
          )}
        </div>
      </section>

      {/* 🐛 Pests & Diseases + Manageable Harvest */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          {t('pests_disease')}
        </h3>
        <div className="rounded-lg bg-white shadow-sm p-3">
          {/* ✅ Manageable Harvest */}
          {typeof data.pestsDisease?.is_manageable_harvest === "boolean" && (
            <>
              {renderRow(
                t('manageable_harvest'),
                data.pestsDisease.is_manageable_harvest ? "Yes" : "No"
              )}
              {!data.pestsDisease.is_manageable_harvest &&
                data.pestsDisease.reason_for_is_manageable_harvest &&
                renderRow(
                  t('remarks'),
                  data.pestsDisease.reason_for_is_manageable_harvest
                )}
            </>
          )}

          {renderList(
            t('pests'),
            data.pestsDisease?.pestNames?.map((name: string) => ({ name })) ||
              []
          )}
          {renderList(
            t('diseases'),
            data.pestsDisease?.diseaseNames?.map((name: string) => ({
              name,
            })) || []
          )}
        </div>
      </section>

      {/* ☁️ Weather Effects */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          {t('weather_effects')}
        </h3>

        {data.weather?.length ? (
          <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
            {renderRow(t('period_from'), data.weather.date_from)}
            {renderRow(t('period_to'), data.weather.date_to)}
            {renderRow(t('general_remarks'), data.weather.remarks)}

            {/* List of Weather Effects */}
            <div className="mt-2 space-y-2">
              {data.weather.map((w: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg bg-gray-50 p-2 shadow-sm"
                >
                  {renderRow(t('effect_type'), w.weather_effect_type_name)}
                  {renderRow(t('remarks'), w.remarks || "")}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 italic">{t('no_weather_effects_recorded')}</p>
        )}
      </section>

      <p className="text-center text-sm text-gray-500 mt-4">
        {t('please_review_all_information_carefully_before_submitting')}
      </p>
    </div>
  );
}
