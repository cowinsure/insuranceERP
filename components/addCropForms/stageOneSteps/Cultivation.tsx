import DropdownField from "@/components/DropDownField";
import React from "react";
import { IrrigationCultivation } from "@/components/model/crop/CropCoreModel";

interface CultivationProps {
  data: IrrigationCultivation;
  onChange: (updated: Partial<IrrigationCultivation>) => void;
}

const Cultivation = ({ data, onChange }: CultivationProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const irrigationFacilityOptions = [
    { value: "Good", label: "Good – Utilized by most farm" },
    { value: "Moderate", label: "Moderate – Used by a good number of farmers" },
    {
      value: "Poor",
      label: "Poor – Locally developed, moderate to low yielding",
    },
  ];

  const irrigationSourceOptions = [
    {
      value: "Mostly Natural Water Supply",
      label: "Mostly Natural Water Supply",
    },
    { value: "canal", label: "Canal" },
    { value: "well", label: "Well" },
  ];

  const cultivationSystemOptions = [
    { value: "Traditional - Manual", label: "Traditional - Manual" },
    { value: "Modern - Mechanized", label: "Modern - Mechanized" },
  ];

  const landSuitabilityOptions = [
    {
      value: "Land Suitable",
      label: "Land Suitable – অ্যামানর ফসলের জন্য উপযোগী",
    },
    { value: "Land Unsuitable", label: "Land Unsuitable" },
  ];

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Cultivation Details
      </h2>
      <div className="space-y-5">
        <DropdownField
          label="Irrigation Facility"
          id="irrigationFacility"
          name="irrigationFacility"
          value={data.irrigation_facility}
          onChange={handleChange}
          options={irrigationFacilityOptions}
        />
        <DropdownField
          label="Irrigation Source"
          id="irrigationSource"
          name="irrigationSource"
          value={data.irrigation_source}
          onChange={handleChange}
          options={irrigationSourceOptions}
        />
        <DropdownField
          label="Cultivation System"
          id="cultivationSystem"
          name="cultivationSystem"
          value={data.crop_cultivation_system_name}
          onChange={handleChange}
          options={cultivationSystemOptions}
        />
        <DropdownField
          label="Land Suitability for Commercial"
          id="landSuitability"
          name="landSuitability"
          value={data.crop_land_suitability_name}
          onChange={handleChange}
          options={landSuitabilityOptions}
        />
      </div>
    </form>
  );
};

export default Cultivation;
