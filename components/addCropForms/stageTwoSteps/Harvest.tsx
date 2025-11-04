import InputField from "@/components/InputField";
import React from "react";

interface HarvestProps {
  data: any;
  onChange: (val: any) => void; // parent handler
}

const Harvest = ({ data, onChange }: HarvestProps) => {
  // Take the first harvest entry if exists, or empty defaults
  const harvest = data[0] || {
    harvest_date: "",
    total_production_kg: "",
    moisture_content_percentage: "",
  };

  const handleChange = (field: string, value: any) => {
    const updated = {
      ...harvest,
      [field]: value,
    };
    onChange([updated]); // pass back as array to match parent state
  };

  return (
    <div className="space-y-5 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Harvest Details
      </h2>
      <InputField
        id="harvestDate"
        name="harvestDate"
        label="Harvest Date"
        type="date"
        value={harvest.harvest_date}
        onChange={(e) => handleChange("harvest_date", e.target.value)}
      />
      <InputField
        id="totalProduction"
        type="number"
        placeholder="e.g. 42.8"
        name="totalProduction"
        label="Total Production (kg)"
        value={harvest.total_production_kg}
        onChange={(e) => handleChange("total_production_kg", e.target.value)}
      />
      <InputField
        id="moistureContent"
        type="number"
        placeholder="e.g. 16.7"
        name="moistureContent"
        label="Moisture Content (%)"
        value={harvest.moisture_content_percentage}
        onChange={(e) =>
          handleChange("moisture_content_percentage", e.target.value)
        }
      />
    </div>
  );
};

export default Harvest;
