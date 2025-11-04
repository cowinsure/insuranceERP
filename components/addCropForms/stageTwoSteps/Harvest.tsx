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
//     total_production_kg: "",
//     moisture_content_percentage: "",
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
//         value={harvest.total_production_kg}
//         onChange={(e) => handleChange("total_production_kg", e.target.value)}
//       />
//       <InputField
//         id="moistureContent"
//         type="number"
//         placeholder="e.g. 16.7"
//         name="moistureContent"
//         label="Moisture Content (%)"
//         value={harvest.moisture_content_percentage}
//         onChange={(e) =>
//           handleChange("moisture_content_percentage", e.target.value)
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

const Harvest = ({ data, onChange }: HarvestProps) => {
  const initialHarvest = data[0] || {};

  // Ensure values are always arrays
  const [harvest, setHarvest] = useState({
    harvest_date: initialHarvest.harvest_date || "",
    total_production_kg: Array.isArray(initialHarvest.total_production_kg)
      ? initialHarvest.total_production_kg
      : initialHarvest.total_production_kg
      ? [initialHarvest.total_production_kg]
      : [],
    moisture_content_percentage: Array.isArray(
      initialHarvest.moisture_content_percentage
    )
      ? initialHarvest.moisture_content_percentage
      : initialHarvest.moisture_content_percentage
      ? [initialHarvest.moisture_content_percentage]
      : [],
  });

  const [totalProductionInput, setTotalProductionInput] = useState("");
  const [moistureInput, setMoistureInput] = useState("");

  // Update parent whenever harvest state changes
  useEffect(() => {
    onChange([harvest]);
  }, [harvest]);

  const handleAddValue = (
    field: "total_production_kg" | "moisture_content_percentage",
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

    if (field === "total_production_kg") setTotalProductionInput("");
    else setMoistureInput("");
  };

  const handleRemoveValue = (
    field: "total_production_kg" | "moisture_content_percentage",
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
              handleAddValue("total_production_kg", totalProductionInput)
            }
            disabled={
              !totalProductionInput || harvest.total_production_kg.length >= 3
            }
            className="bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row sm:items-start md:items-center gap-3 md:gap-8">
          {harvest.total_production_kg.map((val: number, idx: number) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%] animate__animated animate__fadeIn"
            >
              <span className="font-semibold">{val} kg</span>
              <button
                onClick={() => handleRemoveValue("total_production_kg", idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>

        {harvest.total_production_kg.length >= 3 && (
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
              handleAddValue("moisture_content_percentage", moistureInput)
            }
            disabled={
              !moistureInput || harvest.moisture_content_percentage.length >= 3
            }
            className="bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row sm:items-start md:items-center gap-3 md:gap-8">
          {harvest.moisture_content_percentage.map(
            (val: number, idx: number) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%] animate__animated animate__fadeIn"
              >
                <span className="font-semibold">{val}%</span>
                <button
                  onClick={() =>
                    handleRemoveValue("moisture_content_percentage", idx)
                  }
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <XCircleIcon size={18} />
                </button>
              </li>
            )
          )}
        </ul>

        {harvest.moisture_content_percentage.length >= 3 && (
          <p className="text-sm text-orange-400 mt-1">
            Maximum of 3 entries reached.
          </p>
        )}
      </div>
    </div>
  );
};

export default Harvest;
