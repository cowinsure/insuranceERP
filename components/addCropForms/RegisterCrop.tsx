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

interface RegisterCropProps {
  setCropData: React.Dispatch<React.SetStateAction<any[]>>;
  closeModal?: () => void;
}

interface LandData {
  id: number;
  land_name: string;
}

const RegisterCrop: React.FC<RegisterCropProps> = ({
  setCropData,
  closeModal,
}) => {
  const { get, post } = useApi();
  const [formData, setFormData] = useState({
    crop_name: "",
    variety: "",
    plantation_date: "",
    land: "",
  });
  const [isLandData, setIsLandData] = useState<LandData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLandData();
  }, []);

  /**************** Fetch Land List ****************/
  const getLandData = async () => {
    try {
      const response = await get("/lams/land-info-service", {
        params: { start_record: 1, page_size: 10 },
      });

      if (response.status === "success") {
        setIsLandData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch land info");
    }
  };

  /**************** Handle Input Changes ****************/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**************** Submit Form ****************/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Construct new CropData aligned with backend structure
      const newCrop: CropData = {
        season: "", // to be filled later
        crop_id: 0, // backend will assign
        land_id: Number(formData.land),
        variety: formData.variety,
        crop_type_id: 0, // later stage
        planting_date: formData.plantation_date,
        harvest_date: "", // unknown yet
        estimated_yield: 0, // future field

        // Empty arrays for relational details
        crop_asset_seed_details: [],
        crop_asset_pest_attack_details: [],
        crop_asset_stage_history_details: [],
        crop_asset_chemical_usage_details: [],
        crop_asset_disease_attack_details: [],
        crop_asset_irrigation_cultivation_details: [],
        crop_asset_previous_season_history_details: [],
      };

      // ✅ Include crop_name separately if backend supports it
      const payload = { ...newCrop, crop_name: formData.crop_name };

      const response = await post("/crop/create", payload);

      if (response.status === "success") {
        toast.success("Crop registered successfully!");
        setCropData((prev) => [...prev, response.data || payload]);

        // Reset form
        setFormData({
          crop_name: "",
          variety: "",
          plantation_date: "",
          land: "",
        });

        if (closeModal) closeModal();
      } else {
        toast.error(response.message || "Failed to register crop");
      }
    } catch (error: any) {
      toast.error(`Error creating crop: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**************** JSX ****************/
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Crop Name"
          id="crop_name"
          name="crop_name"
          placeholder="Crop Name"
          value={formData.crop_name}
          onChange={handleChange}
          required
        />

        <InputField
          label="Variety"
          id="variety"
          name="variety"
          placeholder="Variety"
          value={formData.variety}
          onChange={handleChange}
          required
        />

        <InputField
          label="Plantation Date"
          id="plantation_date"
          name="plantation_date"
          type="date"
          value={formData.plantation_date}
          onChange={handleChange}
          required
        />

        <DropdownField
          id="land"
          label="Select Land"
          name="land"
          value={formData.land}
          onChange={handleDropdownChange}
          required
          options={isLandData.map((land) => ({
            value: String(land.id),
            label: land.land_name,
          }))}
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 text-white px-4 py-2 rounded w-full border hover:bg-blue-600 cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <Toaster richColors />
    </div>
  );
};

export default RegisterCrop;
