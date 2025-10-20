"use client";
import React, { useEffect, useState } from "react";
import { CropData } from "../AddCropDetailsModal";

interface StageOneDataProps {
  data: Record<string, any>;
}

const StageOneData: React.FC<StageOneDataProps> = ({ data }) => {
  const [isCrop, setIsCrop] = useState<CropData>(() => {
    const crop = localStorage.getItem(`cropFormData_${data.crop_name}`);
    return crop ? JSON.parse(crop) : {};
  });

  if (!data) return <p className="text-gray-500">No data available</p>;

  return (
    <div className="space-y-6 text-gray-700 max-h-[400px]">
      {/* Basic Info */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Seed Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Seed Name" value={isCrop.seedName} />
          <InputField label="Variety" value={isCrop.variety} />
          <InputField label="Seed Company" value={isCrop.seedCompany} />
          <InputField label="Seed Type" value={isCrop.seedType} />
        </div>
      </section>

      {/* Land & Irrigation */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Land & Irrigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Irrigation Facility"
            value={isCrop.irrigationFacility}
          />
          <InputField
            label="Irrigation Source"
            value={isCrop.irrigationSource}
          />
          <InputField
            label="Cultivation System"
            value={isCrop.cultivationSystem}
          />
          <InputField label="Land Suitability" value={isCrop.landSuitability} />
        </div>
      </section>

      {/* Crop History */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Previous Crop Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Immediate Previous Crop"
            value={isCrop.immediatePreviousCrop}
          />
          <InputField label="Harvest Date" value={isCrop.harvestDate} />
          <InputField label="Last Year's Crop" value={isCrop.lastYearsCrop} />
          <InputField
            label="Last Year Production"
            value={isCrop.lastYearProduction}
          />
          <InputField label="Sowing Date" value={isCrop.sowingDate} />
          <InputField
            label="Seed Used Last Year"
            value={isCrop.seedUsedLastYear}
          />
          <InputField
            label="Reason For Changing Seed"
            value={isCrop.reasonForChangingSeed}
          />
        </div>
      </section>

      {/* Weather & Pests */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Environmental Conditions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxGroup
            title="Adverse Weather Effects"
            options={isCrop.adverseWeatherEffects || ""}
          />
          <CheckboxGroup
            title="Pest Attack"
            options={isCrop.pestAttack || ""}
          />
          <CheckboxGroup
            title="Disease Attack"
            options={isCrop.diseaseAttack || ""}
          />
        </div>
      </section>

      {/* Fertilizers & Pesticides */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Inputs Used
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay title="Fertilizers" items={isCrop.fertilizers} />
          <ArrayDisplay title="Pesticides" items={isCrop.pesticides} />
        </div>
      </section>
    </div>
  );
};

const InputField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </div>
  </div>
);

const CheckboxGroup = ({
  title,
  options,
}: {
  title: string;
  options: Record<string, boolean>;
}) => (
  <div>
    <h3 className="font-medium mb-2 text-gray-600">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {Object &&
        Object.entries(options).map(([key, val]) => (
          <div
            key={key}
            className={`px-2 py-1 rounded border capitalize ${
              val ? "bg-green-50 border-green-400 text-green-700" : "bg-gray-50"
            } text-sm`}
          >
            {key.replace(/([A-Z])/g, " $1")}
          </div>
        ))}
    </div>
  </div>
);

const ArrayDisplay = ({
  title,
  items,
}: {
  title: string;
  items: { name: string; quantity: string }[];
}) => (
  <div>
    <h3 className="font-medium mb-2 text-gray-600">{title}</h3>
    {items && items.length > 0 ? (
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm bg-gray-50 border border-gray-200 p-2 rounded"
          >
            {item.name} — {item.quantity}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 text-sm italic">No data</p>
    )}
  </div>
);

export default StageOneData;
