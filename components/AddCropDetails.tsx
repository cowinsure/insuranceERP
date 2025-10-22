"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import InputField from "./InputField";
import DropdownField from "./DropDownField";
import { SelectedCropData } from "./addCropForms/StageOne";
import { CropAssetSeedDetail } from "./model/crop/CropRegisterModel";

export interface CropDetailsRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

interface CropDetailsFormProps {
  data: CropAssetSeedDetail;
  onChange: (updated: Partial<CropAssetSeedDetail>) => void;
  selectedCrop: SelectedCropData;
}

const CropDetailsForm = forwardRef<CropDetailsRef, CropDetailsFormProps>(
  ({ data, onChange, selectedCrop }, ref) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    /** 🔹 Handle change for both text and dropdown fields */
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      onChange({ [name]: value });
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /** 🔹 Optional validation support for external trigger */
    useImperativeHandle(ref, () => ({
      validateFields: () => {
        const newErrors: { [key: string]: string } = {};

        if (!data.seed_common_name?.trim())
          newErrors.seed_common_name = "Seed common name is required";
        if (!data.seed_variety_id)
          newErrors.seed_variety_id = "Seed variety is required";
        if (!data.seed_company_name?.trim())
          newErrors.seed_company_name = "Seed company name is required";
        if (!data.seed_type_id)
          newErrors.seed_type_id = "Seed type is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },
      getValues: () => data,
    }));

    /** 🔹 Dropdown options (example static data — will likely come from API) */
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
            value={data.seed_common_name || ""}
            onChange={handleChange}
            placeholder="Enter seed name (e.g., Local Variety)"
            error={errors.seed_common_name}
          />

          {/* ✅ Variety of Seed */}
          <DropdownField
            label="Variety of Seed"
            id="seed_variety_id"
            name="seed_variety_id"
            value={data.seed_variety_id?.toString() || ""}
            onChange={handleChange}
            options={seedVarietyOptions}
            error={errors.seed_variety_id}
          />

          {/* ✅ Seed Company Name */}
          <InputField
            id="seed_company_name"
            label="Name of the Seed Company"
            type="text"
            name="seed_company_name"
            value={data.seed_company_name || ""}
            onChange={handleChange}
            placeholder="Ex: Local Open Market or Own Stock Conserved"
            error={errors.seed_company_name}
          />

          {/* ✅ Seed Company Type */}
          <DropdownField
            label="Seed Company Type"
            id="seed_company_type_id"
            name="seed_company_type_id"
            value={data.seed_company_type_id?.toString() || ""}
            onChange={handleChange}
            options={seedCompanyTypeOptions}
          />

          {/* ✅ Seed Type */}
          <DropdownField
            label="Type of the Seed Used"
            id="seed_type_id"
            name="seed_type_id"
            value={data.seed_type_id?.toString() || ""}
            onChange={handleChange}
            options={seedTypeOptions}
            error={errors.seed_type_id}
          />
        </div>
      </div>
    );
  }
);

CropDetailsForm.displayName = "CropDetailsForm";
export default CropDetailsForm;
