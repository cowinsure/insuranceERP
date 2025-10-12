"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

export interface LandPreparationRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

const LandPreparationForm = forwardRef<LandPreparationRef>((_, ref) => {
  const [formData, setFormData] = useState({
    length: "",
    width: "",
    randomLength: "",
    randomWidth: "",
    totalLand: "",
    ownership: "",
    landQuality: "",
    suitabilityReasons: [] as string[],
    nonSuitabilityReasons: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(
            (v) => v !== value
          );
      return { ...prev, [field]: updated };
    });
  };

  // ✅ Expose methods for parent form (Step navigation)
  useImperativeHandle(ref, () => ({
    validateFields: () => {
      // basic validation: ensure required fields are filled
      if (
        !formData.length ||
        !formData.width ||
        !formData.totalLand ||
        !formData.ownership ||
        !formData.landQuality
      ) {
        alert("Please fill in all required fields before proceeding.");
        return false;
      }
      return true;
    },
    getValues: () => formData,
  }));

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Land Preparation Related Information
      </h2>

      <div className="space-y-6">
        {/* Numeric Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Length Distance (m)</label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter length from SW to SE corner"
            />
            <p className="text-xs text-gray-500 mt-1">
              দক্ষিণ-পশ্চিম কোণ থেকে দক্ষিণ-পূর্ব কোণ পর্যন্ত দৈর্ঘ্য (মিটার)
            </p>
          </div>

          <div>
            <label className="font-medium">Width Distance (m)</label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter width from SW to NW corner"
            />
            <p className="text-xs text-gray-500 mt-1">
              দক্ষিণ-পশ্চিম কোণ থেকে উত্তর-পশ্চিম কোণ পর্যন্ত প্রস্থ (মিটার)
            </p>
          </div>

          <div>
            <label className="font-medium">
              Random Sampling Number (Length)
            </label>
            <input
              type="number"
              name="randomLength"
              value={formData.randomLength}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">
              Random Sampling Number (Width)
            </label>
            <input
              type="number"
              name="randomWidth"
              value={formData.randomWidth}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">Total Land Size (decimal)</label>
            <input
              type="number"
              name="totalLand"
              value={formData.totalLand}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Size of total land for box plotting"
            />
          </div>
        </div>

        {/* Dropdown Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Own or Lease Land</label>
            <select
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Own Land">Own Land</option>
              <option value="Lease Land">Lease Land</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Land Quality</label>
            <select
              name="landQuality"
              value={formData.landQuality}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Suitable for AMAN - উপযুক্ত জমি">
                Suitable for AMAN - উপযুক্ত জমি
              </option>
              <option value="Not Suitable for AMAN - অনুপযুক্ত জমি">
                Not Suitable for AMAN - অনুপযুক্ত জমি
              </option>
            </select>
          </div>
        </div>

        {/* Suitability Reasons */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            Reason for Land Suitability{" "}
            <span className="text-gray-500">(Multiple Selection)</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Mostly Plain land and less of uneven areas - অধিকাংশ ভূমি সমান এবং কম উঁচুনিচু এলাকা",
              "Adequate water drainage system - পর্যাপ্ত পানি নিষ্কাশন ব্যবস্থার উপস্থিতি",
              "Not many wholes in the land - জমিতে অতিরিক্ত গর্ত কম পরিমাণে রয়েছে",
              "Proper Boundary of the land - জমির সঠিক সীমারেখা রয়েছে",
            ].map((reason, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 border rounded-md p-2 cursor-pointer hover:bg-green-50"
              >
                <input
                  type="checkbox"
                  value={reason}
                  checked={formData.suitabilityReasons.includes(reason)}
                  onChange={(e) => handleCheckbox(e, "suitabilityReasons")}
                  className="mt-1"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Non-suitability Reasons */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            Reason for Land Non-suitability{" "}
            <span className="text-gray-500">(Multiple Selection)</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Mostly uneven land not suitable for cropping - অধিকাংশ অসমান ভূমি চাষাবাদের জন্য উপযুক্ত নয়",
              "Inadequate water drainage system - পর্যাপ্ত পানি নিষ্কাশন ব্যবস্থা নেই",
              "Abundance of wholes in the land - জমিতে গর্তের প্রাচুর্য রয়েছে",
              "Boundary of the land is not well maintained - জমির সীমারেখা সঠিকভাবে রক্ষণাবেক্ষণ করা হয়নি",
            ].map((reason, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 border rounded-md p-2 cursor-pointer hover:bg-red-50"
              >
                <input
                  type="checkbox"
                  value={reason}
                  checked={formData.nonSuitabilityReasons.includes(reason)}
                  onChange={(e) => handleCheckbox(e, "nonSuitabilityReasons")}
                  className="mt-1"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

LandPreparationForm.displayName = "LandPreparationForm";
export default LandPreparationForm;
