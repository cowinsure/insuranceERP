import InputField from "@/components/InputField";
import React from "react";

interface HarvestProps {
  data: any;
  onChange: () => void;
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
        value={data?.harvestDate}
        onChange={(e) => {}}
      />
      <InputField
        id="totalProduction"
        type="number"
        placeholder="e.g. 42.8"
        name="totalProduction"
        label="Total Production (kg)"
        value={data?.totalProduction}
        onChange={(e) => {}}
      />
      <InputField
        id="moistureContent"
        type="number"
        placeholder="e.g. 16.7"
        name="moistureContent"
        label="Moisture Content (%)"
        value={data?.moistureContent}
        onChange={(e) => {}}
      />
    </div>
  );
};

export default Harvest;
