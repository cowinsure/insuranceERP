"use client";

import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import {
  CropData,
  PreviousSeasonHistory,
} from "@/components/model/crop/CropCoreModel";

interface HistoryProps {
  selectedCrop: CropData;
  value: Partial<PreviousSeasonHistory>[]; // current step data
  onChange: (data: Partial<PreviousSeasonHistory>[]) => void;
}

const History = ({ selectedCrop, value, onChange }: HistoryProps) => {
  // Initialize from value prop or empty
  const initialData = value?.[0] || {};

  const [formData, setFormData] = useState<Partial<PreviousSeasonHistory>>({
    immediate_previous_crop: initialData.immediate_previous_crop || "",
    last_year_crop_type_name: initialData.last_year_crop_type_name || "",
    last_year_production:
      initialData.last_year_production !== undefined
        ? initialData.last_year_production
        : undefined,
    sowing_date: initialData.sowing_date || "",
    harvest_date: initialData.harvest_date || "",
    seed_used_last_year: initialData.seed_used_last_year || "",
    reason_for_changing_seed: initialData.reason_for_changing_seed || "",
  });

  // Update local form state if parent value changes
  useEffect(() => {
    const newData = value?.[0] || {};
    setFormData({
      immediate_previous_crop: newData.immediate_previous_crop || "",
      last_year_crop_type_name: newData.last_year_crop_type_name || "",
      last_year_production:
        newData.last_year_production !== undefined
          ? newData.last_year_production
          : undefined,
      sowing_date: newData.sowing_date || "",
      harvest_date: newData.harvest_date || "",
      seed_used_last_year: newData.seed_used_last_year || "",
      reason_for_changing_seed: newData.reason_for_changing_seed || "",
    });
  }, [value]);

  // Handle input changes and notify parent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: val } = e.target;
    const parsed =
      name === "last_year_production"
        ? val === ""
          ? undefined
          : Number(val)
        : val;
    const updated = { ...formData, [name]: parsed };
    setFormData(updated);
    onChange([updated]); // always send as array
  };
console.log(formData.last_year_crop_type_name);
  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        History
      </h2>

      <div className="space-y-5 max-h-[400px] overflow-auto">
        <InputField
          placeholder="Ex - Boro Rice"
          label="Immediate Previous Crop"
          id="immediatePreviousCrop"
          name="immediate_previous_crop"
          value={formData.immediate_previous_crop || ""}
          onChange={handleChange}
        />

        <InputField
          placeholder="Ex - Aman"
          label="Last Year's Crop"
          id="lastYearsCrop"
          name="last_year_crop_type_name"
          value={formData.last_year_crop_type_name || ""}
          onChange={handleChange}
        />

        <InputField
          type="number"
          placeholder="Enter the number of production"
          label="Last Year Production (mound/33 decimal)"
          id="lastYearProduction"
          name="last_year_production"
          value={formData.last_year_production ?? ""}
          onChange={handleChange}
        />

        <div className="grid md:grid-cols-2 gap-5">
          <InputField
            label="Sowing Date (Aman)"
            id="sowingDate"
            name="sowing_date"
            type="date"
            value={formData.sowing_date || ""}
            onChange={handleChange}
          />
          <InputField
            label="Harvest Date"
            id="harvestDate"
            name="harvest_date"
            type="date"
            value={formData.harvest_date || ""}
            onChange={handleChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <InputField
            label="Seed Used Last Year"
            id="seedUsedLastYear"
            name="seed_used_last_year"
            placeholder="e.g., BRRI dhan49"
            value={formData.seed_used_last_year || ""}
            onChange={handleChange}
          />
          <InputField
            label="Reason for Changing Seed (if any)"
            id="reasonForChangingSeed"
            name="reason_for_changing_seed"
            placeholder="e.g., Low yield, disease issues"
            value={formData.reason_for_changing_seed || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};

export default History;
