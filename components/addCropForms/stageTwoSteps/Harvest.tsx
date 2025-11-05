// import InputField from "@/components/InputField";
// import React from "react";

// interface HarvestProps {
//   data: any;
//   onChange: (val: any) => void; // parent handler
// }

// const Harvest = ({ data, onChange }: HarvestProps) => {
//   // Take the first harvest entry if exists, or empty defaults
//   const harvest = data[0] || {
//     harvest_date: "",
//     crop_harvest_production_details: "",
//     crop_harvest_moisture_content_details: "",
//   };

//   const handleChange = (field: string, value: any) => {
//     const updated = {
//       ...harvest,
//       [field]: value,
//     };
//     onChange([updated]); // pass back as array to match parent state
//   };

//   return (
//     <div className="space-y-5 bg-white rounded-lg">
//       <h2 className="text-xl font-semibold mb-5 text-center underline">
//         Harvest Details
//       </h2>
//       <InputField
//         id="harvestDate"
//         name="harvestDate"
//         label="Harvest Date"
//         type="date"
//         value={harvest.harvest_date}
//         onChange={(e) => handleChange("harvest_date", e.target.value)}
//       />
//       <InputField
//         id="totalProduction"
//         type="number"
//         placeholder="e.g. 42.8"
//         name="totalProduction"
//         label="Total Production (kg)"
//         value={harvest.crop_harvest_production_details}
//         onChange={(e) => handleChange("crop_harvest_production_details", e.target.value)}
//       />
//       <InputField
//         id="moistureContent"
//         type="number"
//         placeholder="e.g. 16.7"
//         name="moistureContent"
//         label="Moisture Content (%)"
//         value={harvest.crop_harvest_moisture_content_details}
//         onChange={(e) =>
//           handleChange("crop_harvest_moisture_content_details", e.target.value)
//         }
//       />
//     </div>
//   );
// };

// export default Harvest;

"use client";

import React, { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import { X, XCircleIcon } from "lucide-react";

interface HarvestProps {
  data: any;
  onChange: (val: any) => void;
}

interface HarvestData {
  harvest_date: string;
  crop_harvest_production_details: number[];
  crop_harvest_moisture_content_details: number[];
}

const Harvest = ({ data, onChange }: HarvestProps) => {
  // Ensure values are always arrays
  const [harvest, setHarvest] = useState<HarvestData>({
    harvest_date: "",
    crop_harvest_production_details: [],
    crop_harvest_moisture_content_details: [],
  });

  const [totalProductionInput, setTotalProductionInput] = useState("");
  const [moistureInput, setMoistureInput] = useState("");

  // Update parent whenever harvest state changes
  useEffect(() => {
    // Only send to parent after first mount when harvest has valid values
    if (!harvest) return;
    onChange([harvest]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    harvest.harvest_date,
    harvest.crop_harvest_production_details,
    harvest.crop_harvest_moisture_content_details,
  ]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const initialHarvest = data[0] || {};

    setHarvest({
      harvest_date: initialHarvest.harvest_date || "",
      crop_harvest_production_details: Array.isArray(
        initialHarvest.crop_harvest_production_details
      )
        ? initialHarvest.crop_harvest_production_details
        : initialHarvest.crop_harvest_production_details
        ? [initialHarvest.crop_harvest_production_details]
        : [],
      crop_harvest_moisture_content_details: Array.isArray(
        initialHarvest.crop_harvest_moisture_content_details
      )
        ? initialHarvest.crop_harvest_moisture_content_details
        : initialHarvest.crop_harvest_moisture_content_details
        ? [initialHarvest.crop_harvest_moisture_content_details]
        : [],
    });
    // Run only when data FIRST comes in (e.g. when modal opens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddValue = (
    field:
      | "crop_harvest_production_details"
      | "crop_harvest_moisture_content_details",
    value: string
  ) => {
    if (!value) return;
    const currentArray = harvest[field] || [];
    if (currentArray.length >= 3) return;

    const updated = {
      ...harvest,
      [field]: [...currentArray, parseFloat(value)],
    };
    setHarvest(updated);

    if (field === "crop_harvest_production_details")
      setTotalProductionInput("");
    else setMoistureInput("");
  };

  const handleRemoveValue = (
    field:
      | "crop_harvest_production_details"
      | "crop_harvest_moisture_content_details",
    index: number
  ) => {
    const currentArray = harvest[field] || [];
    const updatedArray = currentArray.filter((_: any, i: any) => i !== index);
    setHarvest({ ...harvest, [field]: updatedArray });
  };

  const handleChangeField = (field: string, value: any) => {
    setHarvest({ ...harvest, [field]: value });
  };

  return (
    <div className="space-y-5 bg-white rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Harvest Details
      </h2>

      {/* Harvest Date */}
      <InputField
        id="harvestDate"
        name="harvestDate"
        label="Harvest Date"
        type="date"
        value={harvest.harvest_date}
        onChange={(e) => handleChangeField("harvest_date", e.target.value)}
      />

      {/* Total Production */}
      <div>
        <label className="font-semibold text-sm text-gray-500">
          Total Production (kg)
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            className="border border-gray-300 rounded-md p-2 flex-1"
            placeholder="e.g. 42.8"
            value={totalProductionInput}
            onChange={(e) => setTotalProductionInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              handleAddValue(
                "crop_harvest_production_details",
                totalProductionInput
              )
            }
            disabled={
              !totalProductionInput ||
              harvest.crop_harvest_production_details.length >= 3
            }
            className="bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row sm:items-start md:items-center gap-3 md:gap-8">
          {harvest.crop_harvest_production_details.map(
            (val: number, idx: number) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%] animate__animated animate__fadeIn"
              >
                <span className="font-semibold">{val} kg</span>
                <button
                  onClick={() =>
                    handleRemoveValue("crop_harvest_production_details", idx)
                  }
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </li>
            )
          )}
        </ul>

        {harvest.crop_harvest_production_details.length >= 3 && (
          <p className="text-sm text-orange-400 mt-1">
            Maximum of 3 entries reached.
          </p>
        )}
      </div>

      {/* Moisture Content */}
      <div>
        <label className="font-semibold text-sm text-gray-500">
          Moisture Content (%)
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            className="border border-gray-300 rounded-md p-2 flex-1"
            placeholder="e.g. 16.7"
            value={moistureInput}
            onChange={(e) => setMoistureInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              handleAddValue(
                "crop_harvest_moisture_content_details",
                moistureInput
              )
            }
            disabled={
              !moistureInput ||
              harvest.crop_harvest_moisture_content_details.length >= 3
            }
            className="bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row sm:items-start md:items-center gap-3 md:gap-8">
          {harvest.crop_harvest_moisture_content_details.map(
            (val: number, idx: number) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%] animate__animated animate__fadeIn"
              >
                <span className="font-semibold">{val}%</span>
                <button
                  onClick={() =>
                    handleRemoveValue(
                      "crop_harvest_moisture_content_details",
                      idx
                    )
                  }
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </li>
            )
          )}
        </ul>

        {harvest.crop_harvest_moisture_content_details.length >= 3 && (
          <p className="text-sm text-orange-400 mt-1">
            Maximum of 3 entries reached.
          </p>
        )}
      </div>
    </div>
  );
};

export default Harvest;
