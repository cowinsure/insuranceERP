// import React, { useEffect, useState } from "react";
// import InputField from "../InputField";
// import DropdownField from "../DropDownField";
// import { toast, Toaster } from "sonner";
// import useApi from "@/hooks/use_api";

// interface CropData {
//   crop_name: string;
//   variety: string;
//   plantation_date: string;
//   land: string;
// }

// interface RegisterCropProps {
//   setCropData: React.Dispatch<React.SetStateAction<any[]>>;
//   closeModal?: () => void;
// }

// interface LandData {
//   land_name: string;
// }

// const RegisterCrop: React.FC<RegisterCropProps> = ({
//   setCropData,
//   closeModal,
// }) => {
//   const { get } = useApi();
//   const [formData, setFormData] = useState<CropData>({
//     crop_name: "",
//     variety: "",
//     plantation_date: "",
//     land: "",
//   });
//   const [isLandData, setIsLandData] = useState<LandData[]>([]);

//   useEffect(() => {
//     getLandData();
//   }, []);

//   /**************** Get requests  ****************/
//   const getLandData = async () => {
//     try {
//       const response = await get("/lams/land-info-service", {
//         params: { start_record: 1, page_size: 10 },
//       });
//       // console.log(response);

//       if (response.status === "success") {
//         setIsLandData(response.data);
//       }
//     } catch (error) {
//       toast.error(`${error}`);
//     }
//   };

//   /**************** ########  ****************/

//   // Handles text/date inputs
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ✅ Handles dropdown input
//   const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Add new crop to existing list
//     setCropData((prevCrops) => [...prevCrops, formData]);

//     // Reset form after submission
//     setFormData({
//       crop_name: "",
//       variety: "",
//       plantation_date: "",
//       land: "",
//     });

//     if (closeModal) closeModal();
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <InputField
//           label="Crop Name"
//           id="crop_name"
//           name="crop_name"
//           placeholder="Crop Name"
//           value={formData.crop_name}
//           onChange={handleChange}
//           required
//         />

//         <InputField
//           label="Variety"
//           id="variety"
//           name="variety"
//           placeholder="Variety"
//           value={formData.variety}
//           onChange={handleChange}
//           required
//         />

//         <InputField
//           label="Plantation Date"
//           id="plantation_date"
//           name="plantation_date"
//           type="date"
//           value={formData.plantation_date}
//           onChange={handleChange}
//           required
//         />

//         {/* ✅ Controlled dropdown */}
//         <DropdownField
//           id="land"
//           label="Select Land"
//           name="land"
//           value={formData.land}
//           onChange={handleDropdownChange}
//           required
//           options={isLandData.map((land) => ({
//             value: land.land_name,
//             label: land.land_name,
//           }))}
//         />

//         <button
//           type="submit"
//           className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 border w-full"
//         >
//           Submit
//         </button>
//       </form>
//       <Toaster richColors />
//     </div>
//   );
// };

// export default RegisterCrop;

"use client";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import DropdownField from "../DropDownField";
import { toast, Toaster } from "sonner";
import useApi from "@/hooks/use_api";
import { CropData } from "../model/crop/CropCoreModel";

// Default CropData object
const defaultCropData: CropData = {
  season: "",
  crop_id: 0,
  land_id: 0,
  variety: "",
  created_at: "",
  updated_at: "",
  crop_type_id: 0,
  harvest_date: "",
  planting_date: "",
  estimated_yield: 0,

  crop_asset_seed_details: [
    {
      created_at: "",
      crop_id: 0,
      crop_name: "",
      farmer_name: "",
      land_name: "",
      mobile_number: "",
      modified_at: "",
      seed_common_name: "",
      seed_company_name: "",
      seed_company_type_id: 0,
      seed_company_type_name: "",
      seed_id: 0,
      seed_type_id: 0,
      seed_type_name: "",
      seed_variety: "",
      seed_variety_id: 0,
      stage_name: "",
    },
  ],

  crop_asset_pest_attack_details: [
    {
      crop_id: 0,
      crop_name: "",
      land_name: "",
      created_at: "",
      remarks: "",
    },
  ],

  crop_asset_stage_history_details: [
    {
      crop_id: 0,
      crop_name: "",
      stage_name: "",
      remarks: "",
      created_at: "",
    },
  ],

  crop_asset_chemical_usage_details: [
    {
      qty: 0,
      qty_unit: "",
      crop_id: 0,
      crop_name: "",
      remarks: "",
      created_at: "",
    },
  ],

  crop_asset_disease_attack_details: [
    {
      crop_id: 0,
      crop_name: "",
      land_name: "",
      created_at: "",
      remarks: "",
    },
  ],

  crop_asset_irrigation_cultivation_details: [
    {
      crop_id: 0,
      crop_name: "",
      irrigation_source: "",
      irrigation_facility: "",
      land_suitability_id: 0,
      irrigation_source_id: 0,
      cultivation_system_id: 0,
      irrigation_facility_id: 0,
      crop_cultivation_system_name: "",
      crop_land_suitability_name: "",
      farmer_name: "",
      mobile_number: "",
      created_at: "",
      modified_at: "",
      stage_name: "",
    },
  ],

  crop_asset_previous_season_history_details: [
    {
      crop_id: 0,
      crop_name: "",
      sowing_date: "",
      harvest_date: "",
      seed_used_last_year: "",
      last_year_production: 0,
      immediate_previous_crop: "",
      reason_for_changing_seed: "",
      last_year_crop_type_id: 0,
      last_year_crop_type_name: "",
      farmer_name: "",
      mobile_number: "",
      created_at: "",
      modified_at: "",
      stage_name: "",
    },
  ],
};

interface RegisterCropProps {
  setCropData: React.Dispatch<React.SetStateAction<CropData[]>>;
  closeModal?: () => void;
}

interface LandData {
  land_name: string;
  land_id: number;
}

const RegisterCrop: React.FC<RegisterCropProps> = ({
  setCropData,
  closeModal,
}) => {
  const { get } = useApi();
  const [formData, setFormData] = useState<CropData>({ ...defaultCropData });
  const [landData, setLandData] = useState<LandData[]>([]);

  useEffect(() => {
    getLandData();
    // Reset form data each time modal opens
    setFormData({ ...defaultCropData });
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    // Find selected land
    const selectedLand = landData.find((l) => l.land_name === value);
    if (selectedLand) {
      setFormData((prev) => ({
        ...prev,
        land_id: selectedLand.land_id,
        crop_asset_irrigation_cultivation_details: [
          {
            ...prev.crop_asset_irrigation_cultivation_details![0],
            land_name: selectedLand.land_name,
          },
        ],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send formData to backend via API here if needed
    setCropData((prev) => [...prev, formData]);
    setFormData({ ...defaultCropData });
    if (closeModal) closeModal();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Crop Name"
          name="season"
          placeholder="Season"
          value={formData.season}
          onChange={handleChange}
          required
        />

        <InputField
          label="Variety"
          name="variety"
          placeholder="Variety"
          value={formData.variety}
          onChange={handleChange}
          required
        />

        <InputField
          label="Planting Date"
          name="planting_date"
          type="date"
          value={formData.planting_date}
          onChange={handleChange}
          required
        />

        <DropdownField
          label="Select Land"
          name="land"
          value={
            formData.crop_asset_irrigation_cultivation_details![0].land_name
          }
          onChange={handleDropdownChange}
          required
          options={landData.map((land) => ({
            value: land.land_name,
            label: land.land_name,
          }))}
        />

        <button
          type="submit"
          className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 border w-full"
        >
          Submit
        </button>
      </form>
      <Toaster richColors />
    </div>
  );
};

export default RegisterCrop;
