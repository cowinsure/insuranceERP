"use client";
import React from "react";

interface StageOneDataProps {
  data: Record<string, any>;
}

const StageOneData: React.FC<StageOneDataProps> = ({ data }) => {
  const safeArray = (arr: any[]) => (Array.isArray(arr) ? arr : []);
console.log(data)
  return (
    <div className="space-y-6 text-gray-700 max-h-[] overflow-y-auto">
      {/* 🌱 Seed Information */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Seed Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Seed Name"
            value={safeArray(data.crop_asset_seed_details)[0]?.seed_common_name}
          />
          <InputField
            label="Variety"
            value={safeArray(data.crop_asset_seed_details)[0]?.seed_variety}
          />
          <InputField
            label="Seed Company"
            value={
              safeArray(data.crop_asset_seed_details)[0]?.seed_company_name
            }
          />
          <InputField
            label="Seed Type"
            value={safeArray(data.crop_asset_seed_details)[0]?.seed_type_name}
          />
        </div>
      </section>

      {/* 💧 Irrigation & Cultivation */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Irrigation & Cultivation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Irrigation Facility"
            value={
              safeArray(data.crop_asset_irrigation_cultivation_details)[0]
                ?.irrigation_facility
            }
          />
          <InputField
            label="Irrigation Source"
            value={
              safeArray(data.crop_asset_irrigation_cultivation_details)[0]
                ?.irrigation_source
            }
          />
          <InputField
            label="Cultivation System"
            value={
              safeArray(data.crop_asset_irrigation_cultivation_details)[0]
                ?.crop_cultivation_system_name
            }
          />
          <InputField
            label="Land Suitability"
            value={
              safeArray(data.crop_asset_irrigation_cultivation_details)[0]
                ?.crop_land_suitability_name
            }
          />
        </div>
      </section>

      {/* 🌾 Crop History */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Crop History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Immediate Previous Crop"
            value={
              safeArray(data.crop_asset_previous_season_history_details)[0]
                ?.immediate_previous_crop
            }
          />
          <InputField
            label="Harvest Date"
            value={
              safeArray(data.crop_asset_previous_season_history_details)[0]
                ?.harvest_date
            }
          />
          <InputField
            label="Last Year's Crop"
            value={
              safeArray(data.crop_asset_previous_season_history_details)[0]
                ?.last_year_crop_type_name
            }
          />
          <InputField
            label="Last Year Production"
            value={safeArray(
              data.crop_asset_previous_season_history_details
            )[0]?.last_year_production?.toString()}
          />
          <InputField
            label="Sowing Date"
            value={
              safeArray(data.crop_asset_previous_season_history_details)[0]
                ?.sowing_date
            }
          />
          <InputField
            label="Seed Used Last Year"
            value={
              safeArray(data.crop_asset_previous_season_history_details)[0]
                ?.seed_used_last_year
            }
          />
          <InputField
            label="Reason For Changing Seed"
            value={
              safeArray(data.crop_asset_previous_season_history_details)[0]
                ?.reason_for_changing_seed
            }
          />
        </div>
      </section>

      {/* 🌦️ Weather Effects */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Weather Effects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Weather Events"
            items={safeArray(data.crop_asset_weather_effect_history).map(
              (w: any) => ({
                name: w?.weather_effect_type_name || "Unknown Weather Effect",
                // include remarks and created_at if available
                remarks: w?.remarks,
                date: w?.created_at || w?.modified_at || undefined,
              })
            )}
          />
        </div>
      </section>

      {/* 🐛 Pest & Disease Attacks */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Pest & Disease Attacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Pest Attacks"
            items={safeArray(data.crop_asset_pest_attack_details).map(
              (p: any) => ({
                name: p?.pest_attack_observations_type_name || "Unknown Pest",
                remarks: p?.remarks,
                date: p?.attack_date || p?.created_at || undefined,
              })
            )}
          />
          <ArrayDisplay
            title="Disease Attacks"
            items={safeArray(data.crop_asset_disease_attack_details).map(
              (d: any) => ({
                name:
                  d?.disease_attack_observations_type_name || "Unknown Disease",
                remarks: d?.remarks,
                date: d?.attack_date || d?.created_at || undefined,
              })
            )}
          />
        </div>
      </section>

      {/* 🧪 Chemicals Used */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Inputs Used (Fertilizers & Pesticides)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Chemicals"
            items={safeArray(data.crop_asset_chemical_usage_details).map(
              (c: any) => ({
                name: c?.chemical_name || "Unknown Chemical",
                quantity:
                  c?.qty || c?.qty === 0
                    ? `${c.qty} ${c.qty_unit || ""}`.trim()
                    : undefined,
                remarks: c?.remarks,
                date: c?.created_at || undefined,
              })
            )}
          />
        </div>
      </section>
    </div>
  );
};

/* ---------- Reusable Field Components ---------- */

const InputField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
      {value && value !== "null" ? (
        value
      ) : (
        <span className="text-gray-400 italic">Not provided</span>
      )}
    </div>
  </div>
);

const ArrayDisplay = ({
  title,
  items,
}: {
  title: string;
  items: { name: string; quantity?: string; remarks?: string; date?: string }[];
}) => {
  return (
    <div>
      <h3 className="font-medium mb-2 text-gray-600">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm bg-green-50 border border-gray-200 p-2 rounded"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div>{item.name}</div>
                {/* {item.date && (
                  <div className="text-xs text-gray-400 ml-2">
                    {new Date(item.date).toLocaleString()}
                  </div>
                )} */}

                {item.quantity && (
                  <div className="text-gray-500 font-semibold">{item.quantity}</div>
                )}
              </div>

              {item.remarks && (
                <div className="text-xs text-gray-500 italic mt-1">
                  Remarks: {item.remarks}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm italic">No data</p>
      )}
    </div>
  );
};

export default StageOneData;
