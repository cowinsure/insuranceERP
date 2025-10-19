"use client";

import React, { useState } from "react";
import DropdownField from "@/components/DropDownField";
import InputField from "@/components/InputField";
import { StageTwoData } from "../StageTwo";

interface ObservationProps {
  data: any;
  onChange: (field: keyof StageTwoData, value: any) => void;
}

const Observation: React.FC<ObservationProps> = ({ data, onChange }) => {
  const [selectedVariety, setSelectedVariety] = useState("");

  const varietyDescriptions: Record<string, string> = {
    "Local variety":
      "Local variety: tall plants, late maturity, small panicle, thick grains, low yield",
    "Improved variety":
      "Improved variety: moderate height, medium maturity, higher yield, uniform grains",
    "Hybrid variety":
      "Hybrid variety: short plants, early maturity, high yield, uniform and bold grains",
  };

  const handleVarietyChange = (value: string) => {
    setSelectedVariety(value);
    onChange("observationData", {
      seedVarietyObservation: value,
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-inner">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Harvesting Observations
      </h2>

      {/* Seed Variety Observation */}
      <DropdownField
        id="seedVarietyObservation"
        name="seedVarietyObservation"
        label="Seed Variety Observation"
        value={data.observationData.seedVarietyObservation}
        onChange={(e) => handleVarietyChange(e.target.value)}
        options={[
          { value: "", label: "Select variety" },
          { value: "Local variety", label: "Local variety" },
          { value: "Improved variety", label: "Improved variety" },
          { value: "Hybrid variety", label: "Hybrid variety" },
        ]}
      />
      {selectedVariety && (
        <p className="text-sm text-gray-500 mt-1">
          {varietyDescriptions[selectedVariety]}
        </p>
      )}

      {/* Good Agricultural Practices */}
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-2">
          Good Agricultural Practices
        </label>
        <textarea
          value={data.observationData.goodPractices}
          onChange={(e) =>
            onChange("observationData", {
              goodPractices: e.target.value,
            })
          }
          placeholder="Describe the observed practices..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
        />
      </div>

      {/* Manageable */}
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-2">
          Was it Manageable?
        </label>
        <div className="flex gap-6">
          {["Yes", "No"].map((val) => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name="manageable"
                value={val}
                checked={data.observationData.manageable === val}
                onChange={(e) =>
                  onChange("observationData", { manageable: e.target.value })
                }
              />
              {val}
            </label>
          ))}
        </div>
      </div>

      {/* Harvesting Timing */}
      <DropdownField
        id="haverstTiming"
        name="haverstTiming"
        label="Harvesting Timing"
        value={data.observationData.harvestingTiming}
        onChange={(e) =>
          onChange("observationData", {
            harvestingTiming: e.target.value,
          })
        }
        options={[
          { value: "", label: "Select timing" },
          { value: "Early Harvesting", label: "Early Harvesting" },
          { value: "Late Harvesting", label: "Late Harvesting" },
          { value: "On Time Harvesting", label: "On Time Harvesting" },
        ]}
      />
    </div>
  );
};

export default Observation;
