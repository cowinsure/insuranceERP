// "use client";

// import DropdownField from "@/components/DropDownField";
// import React from "react";
// import { IrrigationCultivation } from "@/components/model/crop/CropCoreModel";

// interface CultivationProps {
//   data: IrrigationCultivation;
//   onChange: (updated: Partial<IrrigationCultivation>) => void;
// }

// const Cultivation = ({ data, onChange }: CultivationProps) => {
//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     onChange({ [name]: Number(value) }); // parse to number for ID fields
//   };

//   // ✅ Options using ID values
//   const irrigationFacilityOptions = [
//     { value: 1, label: "Good – Utilized by most farm" },
//     { value: 2, label: "Moderate – Used by a good number of farmers" },
//     { value: 3, label: "Poor – Locally developed, moderate to low yielding" },
//   ];

//   const irrigationSourceOptions = [
//     { value: 1, label: "Mostly Natural Water Supply" },
//     { value: 2, label: "Canal" },
//     { value: 3, label: "Well" },
//   ];

//   const cultivationSystemOptions = [
//     { value: 1, label: "Traditional - Manual" },
//     { value: 2, label: "Modern - Mechanized" },
//   ];

//   const landSuitabilityOptions = [
//     { value: 1, label: "Land Suitable – অ্যামানর ফসলের জন্য উপযোগী" },
//     { value: 2, label: "Land Unsuitable" },
//   ];

//   return (
//     <form className="p-3">
//       <h2 className="text-xl font-semibold mb-5 text-center underline">
//         Cultivation Details
//       </h2>
//       <div className="space-y-5">
//         <DropdownField
//           label="Irrigation Facility"
//           id="irrigationFacility"
//           name="irrigation_facility_id"
//           value={data.irrigation_facility_id}
//           onChange={handleChange}
//           options={irrigationFacilityOptions}
//         />
//         <DropdownField
//           label="Irrigation Source"
//           id="irrigationSource"
//           name="irrigation_source_id"
//           value={data.irrigation_source_id}
//           onChange={handleChange}
//           options={irrigationSourceOptions}
//         />
//         <DropdownField
//           label="Cultivation System"
//           id="cultivationSystem"
//           name="cultivation_system_id"
//           value={data.cultivation_system_id}
//           onChange={handleChange}
//           options={cultivationSystemOptions}
//         />
//         <DropdownField
//           label="Land Suitability for Commercial"
//           id="landSuitability"
//           name="land_suitability_id"
//           value={data.land_suitability_id}
//           onChange={handleChange}
//           options={landSuitabilityOptions}
//         />
//       </div>
//     </form>
//   );
// };

// export default Cultivation;

// Fresh Start
"use client";

import { useState, useEffect } from "react";
import DropdownField from "@/components/DropDownField";
import { CropData, IrrigationCultivation as IrrigationCultivationType } from "@/components/model/crop/CropCoreModel";

interface IrrigationCultivationProps {
  selectedCrop: CropData;
  value: Partial<IrrigationCultivationType>[]; // current step data
  onChange: (data: Partial<IrrigationCultivationType>[]) => void;
}

const IrrigationCultivation = ({
  selectedCrop,
  value,
  onChange,
}: IrrigationCultivationProps) => {
  // Initialize form state from value prop or empty
  const initialData = value?.[0] || {};

  const [formData, setFormData] = useState<Partial<IrrigationCultivationType>>({
    irrigation_facility_id: initialData.irrigation_facility_id || Number(""),
    irrigation_source_id: initialData.irrigation_source_id || Number(""),
    cultivation_system_id: initialData.cultivation_system_id || Number(""),
    land_suitability_id: initialData.land_suitability_id || Number(""),
  });

  // Update form if parent value changes
  useEffect(() => {
    const newData = value?.[0] || {};
    setFormData({
      irrigation_facility_id: newData.irrigation_facility_id || Number(""),
      irrigation_source_id: newData.irrigation_source_id || Number(""),
      cultivation_system_id: newData.cultivation_system_id || Number(""),
      land_suitability_id: newData.land_suitability_id || Number(""),
    });
  }, [value]);

  /** 🔹 Dropdown options (static examples) */
  const irrigationFacilityOptions = [
    { value: 1, label: "Good – Utilized by most farm" },
    { value: 2, label: "Moderate – Used by a good number of farmers" },
    { value: 3, label: "Poor – Locally developed, moderate to low yielding" },
  ];

  const irrigationSourceOptions = [
    { value: 1, label: "Mostly Natural Water Supply" },
    { value: 2, label: "Canal" },
    { value: 3, label: "Well" },
  ];

  const cultivationSystemOptions = [
    { value: 1, label: "Traditional - Manual" },
    { value: 2, label: "Modern - Mechanized" },
  ];

  const landSuitabilityOptions = [
    { value: 1, label: "Land Suitable – অ্যামানর ফসলের জন্য উপযোগী" },
    { value: 2, label: "Land Unsuitable" },
    { value: 3, label: "Unknown / Not Defined" },
  ];

  /** 🔹 Update handler */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: val } = e.target;
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    onChange([updated]); // Send array with single object to parent
  };

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Cultivation Details
      </h2>
      <div className="space-y-5">
        <DropdownField
          label="Irrigation Facility"
          id="irrigationFacility"
          name="irrigation_facility_id"
          value={formData.irrigation_facility_id ?? ""}
          onChange={handleChange}
          options={irrigationFacilityOptions}
        />
        <DropdownField
          label="Irrigation Source"
          id="irrigationSource"
          name="irrigation_source_id"
          value={formData.irrigation_source_id ?? ""}
          onChange={handleChange}
          options={irrigationSourceOptions}
        />
        <DropdownField
          label="Cultivation System"
          id="cultivationSystem"
          name="cultivation_system_id"
          value={formData.cultivation_system_id ?? ""}
          onChange={handleChange}
          options={cultivationSystemOptions}
        />
        <DropdownField
          label="Land Suitability for Commercial"
          id="landSuitability"
          name="land_suitability_id"
          value={formData.land_suitability_id ?? ""}
          onChange={handleChange}
          options={landSuitabilityOptions}
        />
      </div>
    </form>
  );
};

export default IrrigationCultivation;
