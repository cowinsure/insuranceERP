// "use client";

// import { forwardRef, useImperativeHandle, useState } from "react";
// import InputField from "./InputField";
// import DropdownField from "./DropDownField";
// import {
//   CropAssetSeedDetail,
//   SelectedCropMeta,
// } from "./model/crop/CropRegisterModel";
// import { CropData } from "./model/crop/CropCoreModel";

// export interface CropDetailsRef {
//   validateFields: () => boolean;
//   getValues: () => Record<string, any>;
// }

// interface CropDetailsFormProps {
//   data: CropAssetSeedDetail;
//   onChange: (updated: Partial<CropAssetSeedDetail>) => void;
//   selectedCrop: CropData;
// }

// const SeedDetails = forwardRef<CropDetailsRef, CropDetailsFormProps>(
//   ({ data, onChange, selectedCrop }, ref) => {
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});

//     console.log("Selected Crop in Seed Details Form:", selectedCrop);

//     /** 🔹 Handle change for both text and dropdown fields */
//     const handleChange = (
//       e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => {
//       const { name, value } = e.target;
//       onChange({ [name]: value });
//       if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//     };

//     /** 🔹 Dropdown options (example static data — will likely come from API) */
//     const seedVarietyOptions = [
//       { value: 1, label: "Local Variety (স্থানীয় জাত)" },
//       { value: 2, label: "High Yield Variety (উচ্চফলনশীল জাত)" },
//       { value: 3, label: "Hybrid (হাইব্রিড)" },
//     ];

//     const seedCompanyTypeOptions = [
//       { value: 1, label: "Government" },
//       { value: 2, label: "Private" },
//       { value: 3, label: "Local Market / Own Stock" },
//     ];

//     const seedTypeOptions = [
//       { value: 1, label: "Good – used by most farmers" },
//       { value: 2, label: "Moderate – used by many farmers" },
//       { value: 3, label: "Poor – locally developed, low yielding" },
//     ];

//     console.log(selectedCrop);

//     console.log(selectedCrop?.crop_asset_seed_details?.[0].seed_common_name);

//     return (
//       <div className="p-3">
//         <h2 className="text-xl font-semibold mb-5 text-center underline">
//           Seed Details
//         </h2>

//         <div className="space-y-5">
//           {/* ✅ Common Name of Seed */}
//           <InputField
//             id="seed_common_name"
//             label="Common Name of Seed"
//             type="text"
//             name="seed_common_name"
//             value={data.seed_common_name || ""}
//             onChange={handleChange}
//             placeholder={`${selectedCrop?.crop_asset_seed_details?.[0].seed_common_name || "Crop"}`}
//             error={errors.seed_common_name}
//           />

//           {/* ✅ Variety of Seed */}
//           <DropdownField
//             label="Variety of Seed"
//             id="seed_variety_id"
//             name="seed_variety_id"
//             value={
//               data.seed_variety_id?.toString() ||
//               selectedCrop?.crop_asset_seed_details?.[0]?.seed_variety_id?.toString() ||
//               ""
//             }
//             onChange={handleChange}
//             options={seedVarietyOptions}
//             error={errors.seed_variety_id}
//           />

//           {/* ✅ Seed Company Name */}
//           <InputField
//             id="seed_company_name"
//             label="Name of the Seed Company"
//             type="text"
//             name="seed_company_name"
//             value={data.seed_company_name || ""}
//             onChange={handleChange}
//             placeholder="Ex: Local Open Market or Own Stock Conserved"
//             error={errors.seed_company_name}
//           />

//           {/* ✅ Seed Company Type */}
//           <DropdownField
//             label="Seed Company Type"
//             id="seed_company_type_id"
//             name="seed_company_type_id"
//             value={data.seed_company_type_id?.toString() || ""}
//             onChange={handleChange}
//             options={seedCompanyTypeOptions}
//           />

//           {/* ✅ Seed Type */}
//           <DropdownField
//             label="Type of the Seed Used"
//             id="seed_type_id"
//             name="seed_type_id"
//             value={data.seed_type_id?.toString() || ""}
//             onChange={handleChange}
//             options={seedTypeOptions}
//             error={errors.seed_type_id}
//           />
//         </div>
//       </div>
//     );
//   }
// );

// SeedDetails.displayName = "SeedDetails";
// export default SeedDetails;

// Fresh Start
"use client";

import React from "react";
import InputField from "./InputField";
import DropdownField from "./DropDownField";
import { CropData } from "./model/crop/CropCoreModel";

// Define the step data type (replace this with your actual interface if different)
export interface CropAssetSeedDetail {
  seed_common_name?: string;
  seed_variety_id?: number;
  seed_company_name?: string;
  seed_company_type_id?: number;
  seed_type_id?: number;
}

interface SeedDetailsProps {
  selectedCrop?: CropData;
  value: Partial<CropAssetSeedDetail>; // current step data from parent
  onChange: (data: Partial<CropAssetSeedDetail>) => void;
}

const SeedDetails = ({ value, onChange }: SeedDetailsProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: val } = e.target;

    // Convert dropdown values to numbers if applicable
    const numberFields = [
      "seed_variety_id",
      "seed_company_type_id",
      "seed_type_id",
    ];
    const parsedValue = numberFields.includes(name)
      ? Number(val) || undefined
      : val;

    onChange({ ...value, [name]: parsedValue });
  };

  /** 🔹 Dropdown options */
  const seedVarietyOptions = [
    { value: 1, label: "Local Variety (স্থানীয় জাত)" },
    { value: 2, label: "High Yield Variety (উচ্চফলনশীল জাত)" },
    { value: 3, label: "Hybrid (হাইব্রিড)" },
  ];

  const seedCompanyTypeOptions = [
    { value: 1, label: "Government" },
    { value: 2, label: "Private" },
    { value: 3, label: "Local Market / Own Stock" },
  ];

  const seedTypeOptions = [
    { value: 1, label: "Good – used by most farmers" },
    { value: 2, label: "Moderate – used by many farmers" },
    { value: 3, label: "Poor – locally developed, low yielding" },
  ];

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Seed Details
      </h2>

      <div className="space-y-5">
        {/* ✅ Common Name of Seed */}
        <InputField
          id="seed_common_name"
          label="Common Name of Seed"
          type="text"
          name="seed_common_name"
          value={value.seed_common_name || ""}
          onChange={handleChange}
          placeholder="Enter Seed Common Name"
        />

        {/* ✅ Variety of Seed */}
        <DropdownField
          label="Variety of Seed"
          id="seed_variety_id"
          name="seed_variety_id"
          value={value.seed_variety_id || ""}
          onChange={handleChange}
          options={seedVarietyOptions}
        />

        {/* ✅ Seed Company Name */}
        <InputField
          id="seed_company_name"
          label="Name of the Seed Company"
          type="text"
          name="seed_company_name"
          value={value.seed_company_name || ""}
          onChange={handleChange}
          placeholder="Ex: Local Open Market or Own Stock Conserved"
        />

        {/* ✅ Seed Company Type */}
        <DropdownField
          label="Seed Company Type"
          id="seed_company_type_id"
          name="seed_company_type_id"
          value={value.seed_company_type_id || ""}
          onChange={handleChange}
          options={seedCompanyTypeOptions}
        />

        {/* ✅ Type of the Seed Used */}
        <DropdownField
          label="Type of the Seed Used"
          id="seed_type_id"
          name="seed_type_id"
          value={value.seed_type_id || ""}
          onChange={handleChange}
          options={seedTypeOptions}
        />
      </div>
    </div>
  );
};

SeedDetails.displayName = "SeedDetails";
export default SeedDetails;
