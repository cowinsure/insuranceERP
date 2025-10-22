"use client";

import InputField from "@/components/InputField";
import React from "react";
import { PreviousSeasonHistory } from "@/components/model/crop/CropCoreModel";

interface HistoryProps {
  data: PreviousSeasonHistory;
  onChange: (updated: Partial<PreviousSeasonHistory>) => void;
}

const History = ({ data, onChange }: HistoryProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

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
          value={data.immediate_previous_crop || ""}
          onChange={handleChange}
        />
        <InputField
          placeholder="Ex - Aman"
          label="Last Year's Crop"
          id="lastYearsCrop"
          name="last_year_crop_type_name"
          value={data.last_year_crop_type_name || ""}
          onChange={handleChange}
        />
        <InputField
          type="number"
          placeholder="Enter the number of production"
          label="Last Year Production (mound/33 decimal)"
          id="lastYearProduction"
          name="last_year_production"
          value={data.last_year_production || ""}
          onChange={handleChange}
        />
        <div className="grid md:grid-cols-2 gap-5">
          <InputField
            label="Sowing Date (Aman)"
            id="sowingDate"
            name="sowing_date"
            type="date"
            value={data.sowing_date || ""}
            onChange={handleChange}
          />
          <InputField
            label="Harvest Date"
            id="harvestDate"
            name="harvest_date"
            type="date"
            value={data.harvest_date || ""}
            onChange={handleChange}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <InputField
            label="Seed Used Last Year"
            id="seedUsedLastYear"
            name="seed_used_last_year"
            placeholder="e.g., BRRI dhan49"
            value={data.seed_used_last_year || ""}
            onChange={handleChange}
          />
          <InputField
            label="Reason for Changing Seed (if any)"
            id="reasonForChangingSeed"
            name="reason_for_changing_seed"
            placeholder="e.g., Low yield, disease issues"
            value={data.reason_for_changing_seed || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};

export default History;
