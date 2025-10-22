"use client";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import DropdownField from "../DropDownField";
import { toast, Toaster } from "sonner";
import useApi from "@/hooks/use_api";
import { CropRegisterData } from "../model/crop/CropRegisterModel";

const defaultDate = new Date().toISOString();

// ✅ Default object following CropRegisterData
export const defaultCropData: CropRegisterData = {
  land_id: 0,
  crop_type_id: 0,
  variety: "",
  season: "",
  planting_date: defaultDate,
  harvest_date: defaultDate,
  estimated_yield: 0,
  created_at: defaultDate,

  crop_asset_seed_details: [
    {
      seed_id: 0,
      seed_common_name: "",
      seed_variety_id: 0,
      seed_company_name: "",
      seed_company_type_id: 0,
      seed_type_id: 0,
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_chemical_usage_details: [
    {
      chemical_type_id: 0,
      chemical_name: "",
      qty: 0,
      qty_unit: "kg",
      remarks: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_disease_attack_details: [
    {
      disease_attack_type_id: 0,
      attack_date: defaultDate,
      remarks: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_irrigation_cultivation_details: [
    {
      irrigation_facility_id: 0,
      irrigation_source_id: 0,
      cultivation_system_id: 0,
      land_suitability_id: 0,
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_pest_attack_details: [
    {
      pest_attack_type_id: 0,
      attack_date: defaultDate,
      remarks: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_previous_season_history_details: [
    {
      immediate_previous_crop: "",
      harvest_date: defaultDate,
      last_year_crop_type_id: 0,
      last_year_production: 0,
      sowing_date: defaultDate,
      seed_used_last_year: "",
      reason_for_changing_seed: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_weather_effect_history: [
    {
      weather_effect_type_id: 0,
      remarks: "",
    },
  ],
};

interface RegisterCropProps {
  onSuccess: () => void;
  closeModal?: () => void;
}

interface LandData {
  land_name: string;
  land_id: 0;
}

interface CropType {
  crop_name: string;
  crop_type_id: number;
}

const RegisterCrop: React.FC<RegisterCropProps> = ({
  closeModal,
  onSuccess,
}) => {
  const { get, post } = useApi();
  const [formData, setFormData] = useState<CropRegisterData>({
    ...defaultCropData,
  });
  const [landData, setLandData] = useState<LandData[]>([]);
  const [cropType, setCropType] = useState<CropType[]>([]);
  const [cropName, setCropName] = useState("New Crop");

  useEffect(() => {
    getLandData();
    getCropType();
  }, []);

  // GET requests for dropdowns
  const getLandData = async () => {
    try {
      const response = await get("/lams/land-info-service", {
        params: { start_record: 1, page_size: 10 },
      });
      if (response.status === "success") setLandData(response.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const getCropType = async () => {
    try {
      const response = await get("/cms/crop-type-service", {
        params: { start_record: 1, page_size: 10, crop_id: -1 },
      });
      console.log(response);
      if (response.status === "success") setCropType(response.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  /////////////////////////////

  // ✅ Handle change for simple fields
  const handleChange =
    (key: keyof CropRegisterData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleCropNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCropName(name);
    // Keep crop name synced with seed details for backend
    setFormData((prev) => ({
      ...prev,
      crop_asset_seed_details: prev.crop_asset_seed_details.map((d) => ({
        ...d,
        seed_common_name: name,
      })),
    }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10); // since you're working with IDs

    setFormData((prev) => ({
      ...prev,
      [name === "land_name"
        ? "land_id"
        : name === "crop_name"
        ? "crop_type_id"
        : name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const response = await post("cms/crop-info-service/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.status === "success") {
        toast.success("Crop registered successfully!");
        setFormData({ ...defaultCropData });
        onSuccess();
        setCropName("");
        closeModal?.();
      } else {
        toast.error(response.message || "Failed to register crop");
      }
    } catch (error) {
      toast.error("Error submitting crop data");
    }
  };

  console.log(formData);

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Crop Name */}
        <DropdownField
          id="crop_type_id"
          label="Select Crop"
          name="crop_type_id"
          value={formData.crop_type_id || ""}
          onChange={handleDropdownChange}
          required
          options={cropType.map((crop) => ({
            value: crop.crop_type_id,
            label: crop.crop_name,
          }))}
        />

        {/* ✅ Variety */}
        <InputField
          id="variety"
          label="Variety"
          name="variety"
          placeholder="Enter variety"
          value={formData.variety}
          onChange={handleChange("variety")}
          required
        />

        {/* ✅ Planting Date */}
        <InputField
          id="planting_date"
          label="Planting Date"
          name="planting_date"
          type="date"
          value={formData.planting_date}
          onChange={handleChange("planting_date")}
          required
        />

        {/* ✅ Select Land */}
        <DropdownField
          id="land_name"
          label="Select Land"
          name="land_name"
          value={formData.land_id || ""}
          onChange={handleDropdownChange}
          required
          options={landData.map((land) => ({
            value: land.land_id,
            label: land.land_name,
          }))}
        />

        <button
          type="submit"
          className="bg-[#003846] cursor-pointer text-white px-4 py-2 rounded hover:opacity-90 w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterCrop;
