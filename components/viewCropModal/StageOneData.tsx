"use client";
import React, { useEffect, useState } from "react";
import { CropData } from "../model/crop/CropCoreModel";

interface StageOneDataProps {
  data: Record<string, any>;
}

const StageOneData: React.FC<StageOneDataProps> = ({ data }) => {
  return (
    <div className="space-y-6 text-gray-700 max-h-[400px] overflow-y-auto">
      {/* 🌱 Seed Information */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Seed Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Seed Name"
            value={data.crop_asset_seed_details?.[0]?.seed_common_name || ""}
          />
          <InputField label="Variety" value={data.variety || ""} />
          <InputField
            label="Seed Company"
            value={data.crop_asset_seed_details?.[0]?.seed_company_name || ""}
          />
          <InputField
            label="Seed Type"
            value={data.crop_asset_seed_details?.[0]?.seed_type_name || ""}
          />
        </div>
      </section>

      {/* 💧 Land & Irrigation */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Land & Irrigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Irrigation Facility"
            value={
              data.crop_asset_irrigation_cultivation_details?.[0]
                ?.irrigation_facility || ""
            }
          />
          <InputField
            label="Irrigation Source"
            value={
              data.crop_asset_irrigation_cultivation_details?.[0]
                ?.irrigation_source || ""
            }
          />
          <InputField
            label="Cultivation System"
            value={
              data.crop_asset_irrigation_cultivation_details?.[0]
                ?.crop_cultivation_system_name || ""
            }
          />
          <InputField
            label="Land Suitability"
            value={
              data.crop_asset_irrigation_cultivation_details?.[0]
                ?.crop_land_suitability_name || "Not specified"
            }
          />
        </div>
      </section>

      {/* 🌾 Previous Crop Info */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Previous Crop Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Immediate Previous Crop"
            value={
              data.crop_asset_previous_season_history_details?.[0]
                ?.immediate_previous_crop || ""
            }
          />
          <InputField
            label="Harvest Date"
            value={
              data.crop_asset_previous_season_history_details?.[0]
                ?.harvest_date || ""
            }
          />
          <InputField
            label="Last Year's Crop"
            value={
              data.crop_asset_previous_season_history_details?.[0]
                ?.last_year_crop_type_name || ""
            }
          />
          <InputField
            label="Last Year Production"
            value={
              data.crop_asset_previous_season_history_details?.[0]?.last_year_production?.toString() ||
              ""
            }
          />
          <InputField
            label="Sowing Date"
            value={
              data.crop_asset_previous_season_history_details?.[0]
                ?.sowing_date || ""
            }
          />
          <InputField
            label="Seed Used Last Year"
            value={
              data.crop_asset_previous_season_history_details?.[0]
                ?.seed_used_last_year || ""
            }
          />
          <InputField
            label="Reason For Changing Seed"
            value={
              data.crop_asset_previous_season_history_details?.[0]
                ?.reason_for_changing_seed || ""
            }
          />
        </div>
      </section>

      {/* 🐛 Pest & Disease Attacks */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Pest & Disease Attacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Pest Attacks"
            items={
              data.crop_asset_pest_attack_details?.map(
                (p: {
                  pest_attack_observations_type_name: any;
                  attack_date: any;
                }) => ({
                  name: p.pest_attack_observations_type_name,
                  quantity: p.attack_date || "",
                })
              ) || []
            }
          />
          <ArrayDisplay
            title="Disease Attacks"
            items={
              data.crop_asset_disease_attack_details?.map(
                (d: {
                  disease_attack_observations_type_name: any;
                  attack_date: any;
                }) => ({
                  name: d.disease_attack_observations_type_name,
                  quantity: d.attack_date || "",
                })
              ) || []
            }
          />
        </div>
      </section>

      {/* 🧪 Chemicals Used */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Inputs Used (Fertilizers & Pesticides)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Chemicals"
            items={
              data.crop_asset_chemical_usage_details?.map(
                (c: { chemical_name: any; qty: any; qty_unit: any }) => ({
                  name: c.chemical_name,
                  quantity: `${c.qty} ${c.qty_unit}`,
                })
              ) || []
            }
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
      {value ? (
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
  items: { name: string; quantity: string }[];
}) => (
  <div>
    <h3 className="font-medium mb-2 text-gray-600">{title}</h3>
    {items && items.length > 0 ? (
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm bg-gray-50 border border-gray-200 p-2 rounded"
          >
            {item.name}{" "}
            {item.quantity && (
              <span className="text-gray-500">— {item.quantity}</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 text-sm italic">No data</p>
    )}
  </div>
);

export default StageOneData;
