"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import InputField from "./InputField";

export interface CropDetailsRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

interface CropDetailsFormProps {
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
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

    return (
      <div className="max-w-4xl mx-auto bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Farm Input Related Information
        </h2>

        <div className="space-y-6">
          {/* Seed Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              id="seedName"
              label="Common Name of Seed (AMAN)"
              type="text"
              name="seedName"
              value={data.seedName}
              onChange={handleChange}
              placeholder="Enter seed name (e.g., Local Variety)"
              error={errors.seedName}
            />

            <div>
              <label
                htmlFor="variety"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Variety of Seed
              </label>
              <select
                id="variety"
                name="variety"
                value={data.variety}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
                  errors.variety ? "border-red-600" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Local Variety">
                  Local Variety (স্থানীয় জাত)
                </option>
                <option value="High Yield Variety">
                  High Yield Variety (উচ্চফলনশীল জাত)
                </option>
                <option value="Hybrid">Hybrid (হাইব্রিড)</option>
              </select>
              {errors.variety && (
                <p className="text-red-600 text-sm mt-1">{errors.variety}</p>
              )}
            </div>
          </div>

          {/* Seed Company & Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name of the Seed Company</label>
              <input
                type="text"
                name="seedCompany"
                value={data.seedCompany}
                onChange={handleChange}
                placeholder="Enter seed company or source"
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
                  errors.seedCompany ? "border-red-600" : ""
                }`}
              />
              {errors.seedCompany && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.seedCompany}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Example: Local Open Market or Own Stock Conserved.
              </p>
            </div>

            <div>
              <label className="font-medium">Type of the Seed Used</label>
              <select
                name="seedType"
                value={data.seedType}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
                  errors.seedType ? "border-red-600" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Good">Good – used by most farmers</option>
                <option value="Moderate">
                  Moderate – used by a good number of farmers
                </option>
                <option value="Poor">
                  Poor – locally developed, moderate to low yielding
                </option>
              </select>
              {errors.seedType && (
                <p className="text-red-600 text-sm mt-1">{errors.seedType}</p>
              )}
            </div>
          </div>

          {/* Irrigation */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Irrigation Facility</label>
              <select
                name="irrigationFacility"
                value={data.irrigationFacility}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
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
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
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
          </div>

          {/* Pesticides / Fertilizers */}
          <div className="grid md:grid-cols-2 gap-4">
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
                className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Urea, TSP, Potash/OMOP, DSP, Zink, Bio-fertilizer
              </p>
            </div>
          </div>

          {/* System & Suitability */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">System of Cultivation</label>
              <select
                name="cultivationSystem"
                value={data.cultivationSystem}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
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
                className={`w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none ${
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
          </div>
        </div>
      </div>
    );
  }
);

CropDetailsForm.displayName = "CropDetailsForm";
export default CropDetailsForm;
