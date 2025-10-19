import InputField from "@/components/InputField";
import React from "react";

interface HistoryData {
  immediatePreviousCrop: string;
  harvestDate: string;
  lastYearsCrop: string;
  lastYearProduction: string;
  sowingDate: string;
  seedUsedLastYear: string;
  reasonForChangingSeed: string;
}

interface HistoryProps {
  data: HistoryData;
  onChange: (field: string, value: string) => void;
}

const History = ({ data, onChange }: HistoryProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        History
      </h2>
      <div className="space-y-5 max-h-[400px] overflow-auto">
        {/* Immediate Previous Crop */}
        <InputField
          placeholder="Ex - Boro Rice"
          label="Immediate Previous Crop"
          id="immediatePreviousCrop"
          name="immediatePreviousCrop"
          value={data.immediatePreviousCrop}
          onChange={handleChange}
        />

        {/* Last Year's Crop */}
        <InputField
          placeholder="Ex - Aman"
          label="Last Year's Crop"
          id="lastYearsCrop"
          name="lastYearsCrop"
          value={data.lastYearsCrop}
          onChange={handleChange}
        />

        {/* Last Year Production */}
        <InputField
          type="number"
          placeholder="Enter the number of production"
          label="Last Year Production (mound/33 decimal)"
          id="lastYearProduction"
          name="lastYearProduction"
          value={data.lastYearProduction}
          onChange={handleChange}
        />

        <div className="grid md:grid-cols-2 gap-5">
          {/* Sowing Date */}
          <InputField
            label="Sowing Date (Aman)"
            id="sowingDate"
            name="sowingDate"
            type="date"
            value={data.sowingDate}
            onChange={handleChange}
          />
          {/* Harvest Date */}
          <InputField
            label="Harvest Date"
            id="harvestDate"
            name="harvestDate"
            type="date"
            value={data.harvestDate}
            onChange={handleChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Seed Used Last Year */}
          <InputField
            label="Seed Used Last Year"
            id="seedUsedLastYear"
            name="seedUsedLastYear"
            placeholder="e.g., BRRI dhan49"
            value={data.seedUsedLastYear}
            onChange={handleChange}
          />

          {/* Reason for Changing Seed */}
          <InputField
            label="Reason for Changing Seed (if any)"
            id="reasonForChangingSeed"
            name="reasonForChangingSeed"
            placeholder="e.g., Low yield, disease issues"
            value={data.reasonForChangingSeed}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};

export default History;
