"use client";

import { useState, useEffect } from "react";
import InputField from "./InputField";
import DropdownField from "./DropDownField";
import useApi from "@/hooks/use_api";

interface SeedDetailsProps {
  selectedCropId: number;
  data: any[]; // array of seed detail objects
  onChange: (updatedData: any[]) => void;
}

const SeedDetails = ({ selectedCropId, data, onChange }: SeedDetailsProps) => {
  const { get } = useApi();

  const [seedVarietyOptions, setSeedVarietyOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [seedTypeOptions, setSeedTypeOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const seedCompanyTypeOptions = [
    { value: 1, label: "Government" },
    { value: 2, label: "Private" },
    { value: 3, label: "Local Market / Own Stock" },
  ];

  // Initialize first seed row if empty
  useEffect(() => {
    if (!data || data.length === 0) {
      onChange([
        {
          seed_common_name: "",
          seed_variety_id: 0,
          seed_company_name: "",
          seed_company_type_id: 0,
          seed_type_id: 0,
        },
      ]);
    }
  }, [data, onChange]);

  // Fetch Seed Variety options
  useEffect(() => {
    const fetchSeedVarieties = async () => {
      try {
        const res = await get("/cms/seed-variety-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          const options = res.data.map((item: any) => ({
            value: item.id,
            label: item.seed_variety,
          }));
          setSeedVarietyOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch seed varieties", err);
      }
    };
    fetchSeedVarieties();
  }, [get]);

  // Fetch Seed Type options
  useEffect(() => {
    const fetchSeedTypes = async () => {
      try {
        const res = await get("/cms/seed-type-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          const options = res.data.map((item: any) => ({
            value: item.id,
            label: item.seed_type_name,
          }));
          setSeedTypeOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch seed types", err);
      }
    };
    fetchSeedTypes();
  }, [get]);

  // Update a single field in the seed data
  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Seed Details
      </h2>

      <div className="space-y-5">
        {/* Common Name of Seed */}
        <InputField
          id="seed_common_name"
          label="Common Name of Seed"
          type="text"
          name="seed_common_name"
          value={data[0]?.seed_common_name || ""}
          onChange={(e) => handleChange(0, "seed_common_name", e.target.value)}
          placeholder="Enter common name"
        />

        {/* Variety of Seed */}
        <DropdownField
          label="Variety of Seed"
          id="seed_variety_id"
          name="seed_variety_id"
          value={data[0]?.seed_variety_id || 0}
          onChange={(e) =>
            handleChange(0, "seed_variety_id", Number(e.target.value))
          }
          options={seedVarietyOptions}
        />

        {/* Seed Company Name */}
        <InputField
          id="seed_company_name"
          label="Name of the Seed Company"
          type="text"
          name="seed_company_name"
          value={data[0]?.seed_company_name || ""}
          onChange={(e) => handleChange(0, "seed_company_name", e.target.value)}
          placeholder="Ex: Local Open Market or Own Stock Conserved"
        />

        {/* Seed Company Type */}
        <DropdownField
          label="Seed Company Type"
          id="seed_company_type_id"
          name="seed_company_type_id"
          value={data[0]?.seed_company_type_id || 0}
          onChange={(e) =>
            handleChange(0, "seed_company_type_id", Number(e.target.value))
          }
          options={seedCompanyTypeOptions}
        />

        {/* Seed Type */}
        <DropdownField
          label="Type of the Seed Used"
          id="seed_type_id"
          name="seed_type_id"
          value={data[0]?.seed_type_id || 0}
          onChange={(e) =>
            handleChange(0, "seed_type_id", Number(e.target.value))
          }
          options={seedTypeOptions}
        />
      </div>
    </div>
  );
};

SeedDetails.displayName = "SeedDetails";
export default SeedDetails;

// Fresh Start
// "use client";

// import React from "react";
// import InputField from "./InputField";
// import DropdownField from "./DropDownField";
// import { SeedDetails as SeedDetailsType } from "./model/crop/CropCoreModel";

// interface SeedDetailsProps {
//   value: Partial<SeedDetailsType>;
//   onChange: (data: Partial<SeedDetailsType>) => void;
// }

// const SeedDetails = ({ value, onChange }: SeedDetailsProps) => {
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value: val } = e.target;

//     const numberFields = [
//       "seed_variety_id",
//       "seed_company_type_id",
//       "seed_type_id",
//     ];
//     const parsedValue =
//       numberFields.includes(name) && val !== ""
//         ? Number(val)
//         : val === ""
//         ? ""
//         : val;

//     onChange({ ...value, [name]: parsedValue });
//   };

//   const seedVarietyOptions = [
//     { value: 1, label: "Local Variety (স্থানীয় জাত)" },
//     { value: 2, label: "High Yield Variety (উচ্চফলনশীল জাত)" },
//     { value: 3, label: "Hybrid (হাইব্রিড)" },
//   ];

//   const seedCompanyTypeOptions = [
//     { value: 1, label: "Government" },
//     { value: 2, label: "Private" },
//     { value: 3, label: "Local Market / Own Stock" },
//   ];

//   const seedTypeOptions = [
//     { value: 1, label: "Good – used by most farmers" },
//     { value: 2, label: "Moderate – used by many farmers" },
//     { value: 3, label: "Poor – locally developed, low yielding" },
//   ];

//   return (
//     <div className="p-3">
//       <h2 className="text-xl font-semibold mb-5 text-center underline">
//         Seed Details
//       </h2>

//       <div className="space-y-5">
//         <InputField
//           id="seed_common_name"
//           label="Common Name of Seed"
//           type="text"
//           name="seed_common_name"
//           value={value.seed_common_name || ""}
//           onChange={handleChange}
//           placeholder="Enter Seed Common Name"
//         />

//         <DropdownField
//           label="Variety of Seed"
//           id="seed_variety_id"
//           name="seed_variety_id"
//           value={value.seed_variety_id ?? ""}
//           onChange={handleChange}
//           options={seedVarietyOptions}
//         />

//         <InputField
//           id="seed_company_name"
//           label="Name of the Seed Company"
//           type="text"
//           name="seed_company_name"
//           value={value.seed_company_name || ""}
//           onChange={handleChange}
//           placeholder="Ex: Local Open Market or Own Stock Conserved"
//         />

//         <DropdownField
//           label="Seed Company Type"
//           id="seed_company_type_id"
//           name="seed_company_type_id"
//           value={value.seed_company_type_id ?? ""}
//           onChange={handleChange}
//           options={seedCompanyTypeOptions}
//         />

//         <DropdownField
//           label="Type of the Seed Used"
//           id="seed_type_id"
//           name="seed_type_id"
//           value={value.seed_type_id ?? ""}
//           onChange={handleChange}
//           options={seedTypeOptions}
//         />
//       </div>
//     </div>
//   );
// };

// SeedDetails.displayName = "SeedDetails";
// export default SeedDetails;
