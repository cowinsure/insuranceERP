"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import InputField from "./InputField";
import DropdownField from "./DropDownField";
import { SelectedCropData } from "./addCropForms/StageOne";
import { SeedDetails } from "./model/crop/CropCoreModel";

export interface CropDetailsRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

interface CropDetailsFormProps {
  data: SeedDetails;
  onChange: (updated: Partial<SeedDetails>) => void;
  selectedCrop: SelectedCropData;
}

const CropDetailsForm = forwardRef<CropDetailsRef, CropDetailsFormProps>(
  ({ data, onChange, selectedCrop }, ref) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      onChange({ [name]: value });
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // useImperativeHandle(ref, () => ({
    //   validateFields: () => {
    //     const newErrors: { [key: string]: string } = {};
    //     if (!data.seedName?.trim())
    //       newErrors.seedName = "Seed name is required";
    //     if (!data.variety) newErrors.variety = "Variety is required";
    //     if (!data.seedCompany?.trim())
    //       newErrors.seedCompany = "Seed company is required";
    //     if (!data.seedType) newErrors.seedType = "Seed type is required";
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    //   },
    //   getValues: () => data,
    // }));

    const seedTypeOptions = [
      { value: "Good", label: "Good – used by most farmers" },
      {
        value: "Moderate",
        label: "Moderate – used by a good number of farmers",
      },
      {
        value: "Poor",
        label: "Poor – locally developed, moderate to low yielding",
      },
    ];

    const varietyOptions = [
      { value: "Local Variety", label: "Local Variety (স্থানীয় জাত)" },
      {
        value: "High Yield Variety",
        label: "High Yield Variety (উচ্চফলনশীল জাত)",
      },
      { value: "Hybrid", label: "Hybrid (হাইব্রিড)" },
    ];

    return (
      <div className="p-3">
        <h2 className="text-xl font-semibold mb-5 text-center underline">
          Seed Details
        </h2>
        <div className="space-y-5">
          <InputField
            id="seed_common_name"
            label="Common Name of Seed"
            type="text"
            name="seed_common_name"
            value={data.seed_common_name}
            onChange={handleChange}
            placeholder="Enter seed name (e.g., Local Variety)"
            error={errors.seedName}
          />

          <DropdownField
            label="Variety of Seed"
            id="variety"
            name="variety"
            value={data.seed_variety as string}
            onChange={handleChange}
            options={varietyOptions}
            error={errors.variety}
          />

          <InputField
            id="seedCompany"
            label="Name of the seed company"
            type="text"
            name="seedCompany"
            value={data.seed_company_name}
            onChange={handleChange}
            placeholder="Ex: Local Open Market or Own Stock Conserved"
          />

          <DropdownField
            label="Type of the Seed Used"
            id="seedType"
            name="seedType"
            value={data.seed_type_name}
            onChange={handleChange}
            options={seedTypeOptions}
            error={errors.seedType}
          />
        </div>
      </div>
    );
  }
);

CropDetailsForm.displayName = "CropDetailsForm";
export default CropDetailsForm;
