"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import InputField from "./InputField";
import DropdownField from "./DropDownField";
import { CropData } from "./AddCropDetailsModal";

export interface CropDetailsRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

interface CropDetailsFormProps {
  data: CropData;
  onChange: (field: string, value: string | boolean) => void;
}

const CropDetailsForm = forwardRef<CropDetailsRef, CropDetailsFormProps>(
  ({ data, onChange }, ref) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      onChange(name, value);
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

    useImperativeHandle(ref, () => ({
      validateFields: () => {
        const newErrors: { [key: string]: string } = {};

        if (!data.seedName?.trim())
          newErrors.seedName = "Seed name is required";
        if (!data.variety) newErrors.variety = "Variety is required";
        if (!data.seedCompany?.trim())
          newErrors.seedCompany = "Seed company is required";
        if (!data.seedType) newErrors.seedType = "Seed type is required";
        if (!data.irrigationFacility)
          newErrors.irrigationFacility = "Irrigation facility is required";
        if (!data.irrigationSource)
          newErrors.irrigationSource = "Irrigation source is required";
        if (!data.cultivationSystem)
          newErrors.cultivationSystem = "Cultivation system is required";
        if (!data.landSuitability)
          newErrors.landSuitability = "Land suitability is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },
      getValues: () => data,
    }));

    // Seed type options array
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

    // Variety options array
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
          {/* Seed Info */}
          <InputField
            id="seedName"
            label="Common Name of Seed"
            type="text"
            name="seedName"
            value={data.seedName}
            onChange={handleChange}
            placeholder="Enter seed name (e.g., Local Variety)"
            error={errors.seedName}
          />

          <DropdownField
            label="Variety of Seed"
            id="variety"
            name="variety"
            value={data.variety}
            onChange={handleChange}
            options={varietyOptions}
            error={errors.variety}
          />

          {/* Seed Company & Type */}
          <div>
            <InputField
              id="seedCompany"
              label="Name of the seed company"
              type="text"
              name="seedCompany"
              value={data.seedCompany}
              onChange={handleChange}
              placeholder="Ex: Local Open Market or Own Stock Conserved"
            />
            {/* {errors.seedCompany && (
              <p className="text-red-600 text-sm mt-1">{errors.seedCompany}</p>
            )} */}
          </div>

          <DropdownField
            label="Type of the Seed Used"
            id="seedType"
            name="seedType"
            value={data.seedType}
            onChange={handleChange}
            options={seedTypeOptions}
            error={errors.seedType}
          />

          {/* Irrigation */}
          {/* <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Irrigation Facility</label>
              <select
                name="irrigationFacility"
                value={data.irrigationFacility}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.irrigationFacility ? "border-red-600" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Very Good">
                  Very Good – Supply available throughout season
                </option>
                <option value="Moderate">Moderate – Inadequate supply</option>
                <option value="Poor">Poor – Limited or no water supply</option>
              </select>
              {errors.irrigationFacility && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.irrigationFacility}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Source of Irrigation</label>
              <select
                name="irrigationSource"
                value={data.irrigationSource}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.irrigationSource ? "border-red-600" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Natural">Mostly Natural Water Supply</option>
                <option value="Pump">Mostly Pump-based Water Supply</option>
                <option value="None">No Reliable Source</option>
              </select>
              {errors.irrigationSource && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.irrigationSource}
                </p>
              )}
            </div>
          </div> */}

          {/* Pesticides / Fertilizers */}
          {/* <div className="grid md:grid-cols-2 gap-4">
            <InputField
              id="pesticideDose"
              label="Name and Dose of Pesticides/Fungicides (Litre)"
              name="pesticideDose"
              value={data.pesticideDose}
              onChange={handleChange}
              placeholder="Enter name and dose"
              error={errors.pesticideDose}
            />

            <div>
              <label className="font-medium">
                Name and Dose of Fertilizers (kg)
              </label>
              <input
                type="text"
                name="fertilizerDose"
                value={data.fertilizerDose}
                onChange={handleChange}
                placeholder="Enter name and dose"
                className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Urea, TSP, Potash/OMOP, DSP, Zink, Bio-fertilizer
              </p>
            </div>
          </div> */}

          {/* System & Suitability */}
          {/* <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">System of Cultivation</label>
              <select
                name="cultivationSystem"
                value={data.cultivationSystem}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.cultivationSystem ? "border-red-600" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Traditional">Traditional – Manual</option>
                <option value="Improved">Improved – Some Mechanization</option>
                <option value="Fully Mechanized">Fully Mechanized</option>
              </select>
              {errors.cultivationSystem && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.cultivationSystem}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">
                Land Suitable for Commercial Farming
              </label>
              <select
                name="landSuitability"
                value={data.landSuitability}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.landSuitability ? "border-red-600" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Suitable">
                  Suitable – land appropriate for commercial use
                </option>
                <option value="Not Suitable">
                  Not Suitable – not ideal for commercial cultivation
                </option>
              </select>
              {errors.landSuitability && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.landSuitability}
                </p>
              )}
            </div>
          </div> */}
        </div>
      </div>
    );
  }
);

CropDetailsForm.displayName = "CropDetailsForm";
export default CropDetailsForm;
