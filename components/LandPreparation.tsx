"use client";

import { Info } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { toast, Toaster } from "sonner";

export interface LandPreparationRef {
  validateFields: () => boolean;
  getValues: () => Record<string, any>;
}

const sustainableReasons = [
  {
    en: "Mostly Plain land and less of uneven areas",
    bn: "অধিকাংশ ভূমি সমান এবং কম উঁচুনিচু এলাকা",
  },
  {
    en: "Adequate water drainage system",
    bn: "পর্যাপ্ত পানি নিষ্কাশন ব্যবস্থার উপস্থিতি",
  },
  {
    en: "Not many wholes in the land",
    bn: "জমিতে অতিরিক্ত গর্ত কম পরিমাণে রয়েছে",
  },
  {
    en: "Proper Boundary of the land",
    bn: "জমির সঠিক সীমারেখা রয়েছে",
  },
];

const nonSuitabilityReasons = [
  {
    en: "Mostly uneven land not suitable for cropping",
    bn: "অধিকাংশ অসমান ভূমি চাষাবাদের জন্য উপযুক্ত নয়",
  },
  {
    en: "Inadequate water drainage system",
    bn: "পর্যাপ্ত পানি নিষ্কাশন ব্যবস্থা নেই",
  },
  {
    en: "Abundance of wholes in the land",
    bn: "জমিতে গর্তের প্রাচুর্য রয়েছে",
  },
  {
    en: "Boundary of the land is not well maintained",
    bn: "জমির সীমারেখা সঠিকভাবে রক্ষণাবেক্ষণ করা হয়নি",
  },
];

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
        // toast.error("Please fill in all required fields before proceeding.");
        return false;
      }
      return true;
    },
    getValues: () => formData,
  }));

  return (
    <div className="mx-auto bg-white w-full border px-8 py-4 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-9 text-gray-800 underline">
        Land Preparation
      </h2>

      <div className="space-y-6">
        {/* Numeric Inputs */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <label className="font-medium">
              Length Distance (m) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter length from SW to SE corner"
            />
            <div className="absolute top-9 right-2 group">
              <Info size={18} className="text-gray-500" />
              <p className="text-xs text-gray-500 mt-1 hidden group-hover:block absolute w-64 bg-gray-50 border p-2 rounded shadow-lg z-10 -left-60">
                দক্ষিণ-পশ্চিম কোণ থেকে দক্ষিণ-পূর্ব কোণ পর্যন্ত দৈর্ঘ্য (মিটার)
              </p>
            </div>
          </div>

          <div className="relative">
            <label className="font-medium">
              Width Distance (m) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter width from SW to NW corner"
            />
            <div className="absolute top-9 right-2 group">
              <Info size={18} className="text-gray-500" />
              <p className="text-xs text-gray-500 mt-1 hidden group-hover:block absolute w-64 bg-gray-50 border p-2 rounded shadow-lg z-10 -left-60">
                দক্ষিণ-পশ্চিম কোণ থেকে উত্তর-পশ্চিম কোণ পর্যন্ত প্রস্থ (মিটার)
              </p>
            </div>
          </div>

          <div>
            <label className="font-medium">
              Random Sampling Number (Length){" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="randomLength"
              value={formData.randomLength}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">
              Random Sampling Number (Width){" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="randomWidth"
              value={formData.randomWidth}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">
              Total Land Size (decimal) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="totalLand"
              value={formData.totalLand}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Size of total land for box plotting"
            />
          </div>
        </div>

        {/* Dropdown Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="font-medium">
              Land Type <span className="text-red-600">*</span>
            </label>
            <select
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Own Land">Own Land</option>
              <option value="Lease Land">Lease Land</option>
            </select>
          </div>

          <div>
            <label className="font-medium">
              Land Quality <span className="text-red-600">*</span>
            </label>
            <select
              name="landQuality"
              value={formData.landQuality}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
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
            <span className="text-gray-500 text-xs">(Multiple Selection)</span>{" "}
            <span className="text-red-600">*</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {sustainableReasons.map((reason, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 border rounded-md p-2 cursor-pointer hover:bg-blue-50 relative"
              >
                <input
                  type="checkbox"
                  value={reason.en}
                  checked={formData.suitabilityReasons.includes(reason.en)}
                  onChange={(e) => handleCheckbox(e, "suitabilityReasons")}
                  className="mt-1"
                />
                <div className="flex justify-between w-full items-center gap-1">
                  <span className="text-sm text-gray-800">{reason.en}</span>
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-500 mt-0.5 cursor-pointer" />
                    <div className="text-xs text-gray-500 hidden group-hover:block absolute w-64 bg-gray-50 border p-2 rounded shadow-lg z-10 -left-60 text-center">
                      {reason.bn}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Non-suitability Reasons */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            Reason for Land Non-suitability{" "}
            <span className="text-gray-500 text-xs">(Multiple Selection)</span>{" "}
            <span className="text-red-600">*</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {nonSuitabilityReasons.map((reason, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 border rounded-md p-2 cursor-pointer hover:bg-red-50 relative"
              >
                <input
                  type="checkbox"
                  value={reason.en}
                  checked={formData.nonSuitabilityReasons.includes(reason.en)}
                  onChange={(e) => handleCheckbox(e, "nonSuitabilityReasons")}
                  className="mt-1"
                />
                <div className="flex items-center justify-between w-full gap-1">
                  <span className="text-sm text-gray-800">{reason.en}</span>
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-500 mt-0.5 cursor-pointer" />
                    <div className="text-xs text-gray-500 hidden group-hover:block absolute w-64 text-center bg-gray-50 border p-2 rounded shadow-lg z-10 -left-60">
                      {reason.bn}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
});

LandPreparationForm.displayName = "LandPreparationForm";
export default LandPreparationForm;
