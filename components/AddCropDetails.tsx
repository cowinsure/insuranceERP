"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

export interface CropDetailsRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

const CropDetailsForm = forwardRef<CropDetailsRef>((_, ref) => {
  const [formData, setFormData] = useState({
    seedName: "",
    variety: "",
    seedCompany: "",
    seedType: "",
    irrigationFacility: "",
    irrigationSource: "",
    pesticideDose: "",
    fertilizerDose: "",
    cultivationSystem: "",
    landSuitability: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useImperativeHandle(ref, () => ({
    validateFields: () => {
      if (
        !formData.seedName ||
        !formData.variety ||
        !formData.seedCompany ||
        !formData.seedType ||
        !formData.irrigationFacility ||
        !formData.irrigationSource ||
        !formData.cultivationSystem ||
        !formData.landSuitability
      ) {
        alert("Please complete all required fields before proceeding.");
        return false;
      }
      return true;
    },
    getValues: () => formData,
  }));

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Farm Input Related Information
      </h2>

      <div className="space-y-6">
        {/* Seed Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Common Name of Seed (AMAN)</label>
            <input
              type="text"
              name="seedName"
              value={formData.seedName}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter seed name (e.g., Local Variety)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Local variety – tall plants, late maturity, small panicles, thick grains, low yield.
            </p>
          </div>

          <div>
            <label className="font-medium">Variety of Seed</label>
            <select
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Local Variety">Local Variety (স্থানীয় জাত)</option>
              <option value="High Yield Variety">High Yield Variety (উচ্চফলনশীল জাত)</option>
              <option value="Hybrid">Hybrid (হাইব্রিড)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              In improved varieties (HYV), plants are shorter, uniform, have larger panicles and slender grains.
            </p>
          </div>
        </div>

        {/* Seed Company & Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name of the Seed Company</label>
            <input
              type="text"
              name="seedCompany"
              value={formData.seedCompany}
              onChange={handleChange}
              placeholder="Enter seed company or source"
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: Local Open Market or Own Stock Conserved.
            </p>
          </div>

          <div>
            <label className="font-medium">Type of the Seed Used</label>
            <select
              name="seedType"
              value={formData.seedType}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Good">Good – used by most farmers</option>
              <option value="Moderate">Moderate – used by a good number of farmers</option>
              <option value="Poor">Poor – locally developed, moderate to low yielding</option>
            </select>
          </div>
        </div>

        {/* Irrigation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Irrigation Facility</label>
            <select
              name="irrigationFacility"
              value={formData.irrigationFacility}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Very Good">Very Good – Supply available throughout season</option>
              <option value="Moderate">Moderate – Inadequate supply</option>
              <option value="Poor">Poor – Limited or no water supply</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Source of Irrigation</label>
            <select
              name="irrigationSource"
              value={formData.irrigationSource}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Natural">Mostly Natural Water Supply</option>
              <option value="Pump">Mostly Pump-based Water Supply</option>
              <option value="None">No Reliable Source</option>
            </select>
          </div>
        </div>

        {/* Pesticides / Fertilizers */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name and Dose of Pesticides/Fungicides (Litre)</label>
            <input
              type="text"
              name="pesticideDose"
              value={formData.pesticideDose}
              onChange={handleChange}
              placeholder="Enter name and dose"
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">Name and Dose of Fertilizers (kg)</label>
            <input
              type="text"
              name="fertilizerDose"
              value={formData.fertilizerDose}
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
              value={formData.cultivationSystem}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Traditional">Traditional – Manual</option>
              <option value="Improved">Improved – Touch of Mechanization</option>
              <option value="Fully Mechanized">Fully Mechanized</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Land Suitable for Commercial Farming</label>
            <select
              name="landSuitability"
              value={formData.landSuitability}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Suitable">Suitable – land appropriate for commercial use</option>
              <option value="Not Suitable">Not Suitable – not ideal for commercial cultivation</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

CropDetailsForm.displayName = "CropDetailsForm";
export default CropDetailsForm;
