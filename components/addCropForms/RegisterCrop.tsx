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

export interface LandData {
  land_name: string;
  land_id: number;
  farmer_name?: string;
  mobile_number?: string;
}

export interface CropType {
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

  // ✅ new states for farmer info
  const [farmerName, setFarmerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

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
      if (response.status === "success") setCropType(response.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // ✅ Handle change for simple fields
  const handleChange =
    (key: keyof CropRegisterData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleCropNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCropName(name);
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
    const parsedValue = parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      [name === "land_name"
        ? "land_id"
        : name === "crop_name"
        ? "crop_type_id"
        : name]: parsedValue,
    }));

    // ✅ Update farmer info when land changes
    if (name === "land_name") {
      const selectedLand = landData.find((land) => land.land_id === parsedValue);
      if (selectedLand) {
        setFarmerName(selectedLand.farmer_name || "Farmer name not found");
        setMobileNumber(selectedLand.mobile_number || "N/A");
      } else {
        setFarmerName("");
        setMobileNumber("");
      }
    }
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
      if (response.status === "success") {
        toast.success("Crop registered successfully!");
        setFormData({ ...defaultCropData });
        setFarmerName("");
        setMobileNumber("");
        setCropName("");
        onSuccess();
        closeModal?.();
      } else {
        toast.error(response.message || "Failed to register crop");
      }
    } catch (error) {
      toast.error("Error submitting crop data");
    }
  };

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

        {/* ✅ Farmer Name (auto-filled, read-only) */}
        <InputField
          id="farmer_name"
          label="Farmer Name"
          name="farmer_name"
          type="text"
          value={farmerName}
          onChange={() => {}}
          readOnly={true}
          placeholder="Name will be auto-filled"
        />

        {/* ✅ Mobile Number (auto-filled, read-only) */}
        <InputField
          id="mobile_number"
          label="Mobile Number"
          name="mobile_number"
          type="text"
          value={mobileNumber}
          onChange={() => {}}
          readOnly={true}
          placeholder="Number will be auto-filled"
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
