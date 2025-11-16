"use client";

import React, { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import { X } from "lucide-react";


interface HarvestProps {
  data: any;
  onChange: (val: any) => void;
}

const Harvest = ({ data, onChange }: HarvestProps) => {
  const [harvestDate, setHarvestDate] = useState("");
  const [productionValues, setProductionValues] = useState<number[]>([]);
  const [moistureValues, setMoistureValues] = useState<number[]>([]);
  const [productionInput, setProductionInput] = useState("");
  const [moistureInput, setMoistureInput] = useState("");

  // Load data from backend
  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const info = data[0];

    setHarvestDate(info?.harvest_date || "");

    // Sanitize production values to always be numbers
    const productions =
      info?.crop_harvest_production_details?.map(
        (p: any) => Number(p.production_kg) || 0
      ) || [];

    // Sanitize moisture values to always be numbers
    const moistures =
      info?.crop_harvest_moisture_content_details?.map(
        (m: any) => Number(m.moisture_content_per) || 0
      ) || [];

    setProductionValues(productions);
    setMoistureValues(moistures);
  }, [data]);

  // 🧮 Compute totals
  const getTotalProduction = (values: number[]) => {
    if (!values.length) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return parseFloat(avg.toFixed(2));
  };

  const getAverageMoisture = (values: number[]) => {
    const avg = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
    return parseFloat(avg.toFixed(2));
  };

  // 🔄 Send formatted payload to parent
  const updateParent = (
    date = harvestDate,
    prod = productionValues,
    moist = moistureValues
  ) => {
    const totalProduction = getTotalProduction(prod);
    const avgMoisture = getAverageMoisture(moist);

    const formatted = {
      harvest_date: date,
      total_production_kg: totalProduction,
      moisture_content_percentage: avgMoisture,
      crop_harvest_production_details: prod.map((val, idx) => ({
        harvest_production_id: 0,
        production_no: idx + 1,
        production_kg: val,
        remarks: "",
      })),
      crop_harvest_moisture_content_details: moist.map((val, idx) => ({
        harvest_moisture_content_id: 0,
        production_no: idx + 1,
        moisture_content_per: val,
        remarks: "",
      })),
    };

    onChange(formatted);
  };

  const handleDateChange = (value: string) => {
    setHarvestDate(value);
    updateParent(value);
  };

  const handleAddValue = (field: "production" | "moisture", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    if (field === "production" && productionValues.length < 3) {
      const updated = [...productionValues, num];
      setProductionValues(updated);
      updateParent(harvestDate, updated, moistureValues);
      setProductionInput("");
    }

    if (field === "moisture" && moistureValues.length < 3) {
      const updated = [...moistureValues, num];
      setMoistureValues(updated);
      updateParent(harvestDate, productionValues, updated);
      setMoistureInput("");
    }
  };

  const handleRemoveValue = (
    field: "production" | "moisture",
    index: number
  ) => {
    if (field === "production") {
      const updated = productionValues.filter((_, i) => i !== index);
      setProductionValues(updated);
      updateParent(harvestDate, updated, moistureValues);
    } else {
      const updated = moistureValues.filter((_, i) => i !== index);
      setMoistureValues(updated);
      updateParent(harvestDate, productionValues, updated);
    }
  };

  console.log(productionValues.length);

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
        value={harvestDate}
        onChange={(e) => handleDateChange(e.target.value)}
      />

      {/* Total Production */}
      <div>
        <label className="font-semibold text-sm text-gray-500">
          Total Production (kg) <span className="text-gray-400">(Max : 3)</span>
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            inputMode="decimal"
            className="border border-gray-300 rounded-md p-2 flex-1"
            placeholder="e.g. 42.8"
            value={productionInput}
            onChange={(e) => setProductionInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleAddValue("production", productionInput)}
            disabled={!productionInput || productionValues.length >= 3}
            className={`${
              productionValues.length >= 3
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50`}
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row gap-3 md:gap-8">
          {productionValues.map((val, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%]"
            >
              <span className="font-semibold">{val} kg</span>
              <button
                onClick={() => handleRemoveValue("production", idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>

        {/* {productionValues.length >= 3 && (
          <p className="text-sm text-orange-400 mt-1">
            Maximum of 3 entries reached.
          </p>
        )} */}

        {/* Show total production */}
        <p className=" text-blue-400 mt-2 font-semibold">
          Average weight:{" "}
          <span className="font-semibold">
            {getTotalProduction(productionValues)} kg
          </span>
        </p>
      </div>

      {/* Moisture Content */}
      <div>
        <label className="font-semibold text-sm text-gray-500">
          Moisture Content (%) <span className="text-gray-400">(Max : 3)</span>
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            inputMode="decimal"
            className="border border-gray-300 rounded-md p-2 flex-1"
            placeholder="e.g. 16.7"
            value={moistureInput}
            onChange={(e) => setMoistureInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleAddValue("moisture", moistureInput)}
            disabled={!moistureInput || moistureValues.length >= 3}
            className={`${
              moistureValues.length >= 3
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50`}
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row gap-3 md:gap-8">
          {moistureValues.map((val, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%]"
            >
              <span className="font-semibold">{val}%</span>
              <button
                onClick={() => handleRemoveValue("moisture", idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>

        {/* {moistureValues.length >= 3 && (
          <p className="text-sm text-orange-400 mt-1">
            Maximum of 3 entries reached.
          </p>
        )} */}

        {/* Show average moisture */}
        <p className="text-blue-400 mt-2 font-semibold">
          Average:{" "}
          <span className="font-semibold">
            {getAverageMoisture(moistureValues).toFixed(1)}%
          </span>
        </p>
      </div>

    </div>
  );
};

export default Harvest;
