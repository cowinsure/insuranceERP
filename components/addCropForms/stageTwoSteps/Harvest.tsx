import InputField from "@/components/InputField";
import React from "react";
import { StageTwoData } from "../StageTwo";

interface HarvestProps {
  data: StageTwoData;
  onChange: (field: keyof StageTwoData, value: any) => void;
}

const Harvest = ({ data, onChange }: HarvestProps) => {
  return (
    <div className="space-y-5 bg-white rounded-lg p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Harvest Details
      </h2>
      <InputField
        id="harvestDate"
        name="harvestDate"
        label="Harvest Date"
        type="date"
        value={data.harvestDate}
        onChange={(e) => onChange("harvestDate", e.target.value)}
      />
      <InputField
        id="totalProduction"
        type="number"
        placeholder="e.g. 42.8"
        name="totalProduction"
        label="Total Production (kg)"
        value={data.totalProduction}
        onChange={(e) => onChange("totalProduction", e.target.value)}
      />
      <InputField
        id="moistureContent"
        type="number"
        placeholder="e.g. 16.7"
        name="moistureContent"
        label="Moisture Content (%)"
        value={data.moistureContent}
        onChange={(e) => onChange("moistureContent", e.target.value)}
      />
    </div>
  );
};

export default Harvest;
