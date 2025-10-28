"use client";

import DropdownField from "@/components/DropDownField";
import InputField from "@/components/InputField";
import React, { useEffect, useState } from "react";
import { CropType } from "../RegisterCrop";
import useApi from "@/hooks/use_api";
import { toast } from "sonner";

interface HistoryProps {
  data: any;
  onChange: (updatedData: any) => void;
}

const History = ({ data, onChange }: HistoryProps) => {
  const { get } = useApi();
  const [cropType, setCropType] = useState<CropType[]>([]);

  useEffect(() => {
    getCropType();
  }, []);

  const getCropType = async () => {
    try {
      const response = await get("/cms/crop-type-service", {
        params: { start_record: 1, page_size: 10, crop_id: -1 },
      });
      if (response.status === "success") setCropType(response.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // Handle input changes and notify parent
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    console.log("From history form:", name, val);

    // When dropdown changes, also sync crop name
    if (name === "last_year_crop_type_id") {
      const selectedCrop = cropType.find(
        (crop) => crop.crop_type_id === Number(val)
      );
      onChange({
        ...data,
        last_year_crop_type_id: Number(val),
        last_year_crop_type_name: selectedCrop ? selectedCrop.crop_name : "",
      });
    } else {
      onChange({ ...data, [name]: val });
    }
  };

  // Auto-sync crop name if ID exists and list has loaded
  useEffect(() => {
    if (data.last_year_crop_type_id && cropType.length > 0) {
      const selected = cropType.find(
        (c) => c.crop_type_id === data.last_year_crop_type_id
      );
      if (
        selected &&
        selected.crop_name !== data.last_year_crop_type_name
      ) {
        onChange({
          ...data,
          last_year_crop_type_name: selected.crop_name,
        });
      }
    }
  }, [data.last_year_crop_type_id, cropType]);

  console.log("History data:", data);
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

        {/* ✅ FIXED: value should use ID, not name */}
        <DropdownField
          label="Last Year's Crop"
          id="lastYearsCrop"
          name="last_year_crop_type_id"
          value={data.last_year_crop_type_id || ""}
          onChange={handleChange}
          required
          options={cropType.map((crop) => ({
            value: crop.crop_type_id,
            label: crop.crop_name,
          }))}
        />

        <InputField
          type="number"
          placeholder="Enter the number of production"
          label="Last Year Production (mound/33 decimal)"
          id="lastYearProduction"
          name="last_year_production"
          value={data.last_year_production ?? ""}
          onChange={handleChange}
        />

        <div className="grid md:grid-cols-2 gap-5">
          {/* <InputField
            label="Sowing Date (Aman)"
            id="sowingDate"
            name="sowing_date"
            type="date"
            value={data.sowing_date || ""}
            onChange={handleChange}
          /> */}
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
