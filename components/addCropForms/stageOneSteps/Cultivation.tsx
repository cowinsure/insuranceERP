import DropdownField from "@/components/DropDownField";
import React, { useState } from "react";

const Cultivation = () => {
  const [data, setData] = useState({
    irrigationFacility: "",
    irrigationSource: "",
    cultivationSystem: "",
    landSuitability: "",
  });

  const [errors, setErrors] = useState({
    irrigationFacility: "",
    irrigationSource: "",
    cultivationSystem: "",
    landSuitability: "",
  });

  // Handle change for all form fields (Input and Select)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation not in use currently
  // const validateForm = () => {
  //   const newErrors = {
  //     irrigationFacility: "",
  //     irrigationSource: "",
  //     cultivationSystem: "",
  //     landSuitability: "",
  //   };
  //   // Example validation checks (you can customize)
  //   if (!data.irrigationFacility)
  //     newErrors.irrigationFacility = "This field is required";
  //   if (!data.irrigationSource)
  //     newErrors.irrigationSource = "This field is required";
  //   if (!data.cultivationSystem)
  //     newErrors.cultivationSystem = "This field is required";
  //   if (!data.landSuitability)
  //     newErrors.landSuitability = "This field is required";

  //   setErrors(newErrors);
  // };

  // Dropdown options for each select field
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
        {/* Irrigation Facility */}
        <DropdownField
          label="Irrigation Facility"
          id="irrigationFacility"
          name="irrigationFacility"
          value={data.irrigationFacility}
          onChange={handleChange}
          options={irrigationFacilityOptions}
          error={errors.irrigationFacility}
        />

        {/* Irrigation Source */}
        <DropdownField
          label="Irrigation Source"
          id="irrigationSource"
          name="irrigationSource"
          value={data.irrigationSource}
          onChange={handleChange}
          options={irrigationSourceOptions}
          error={errors.irrigationSource}
        />

        {/* Cultivation System */}
        <DropdownField
          label="Cultivation System"
          id="cultivationSystem"
          name="cultivationSystem"
          value={data.cultivationSystem}
          onChange={handleChange}
          options={cultivationSystemOptions}
          error={errors.cultivationSystem}
        />

        {/* Land Suitability for Commercial */}
        <DropdownField
          label="Land Suitability for Commercial"
          id="landSuitability"
          name="landSuitability"
          value={data.landSuitability}
          onChange={handleChange}
          options={landSuitabilityOptions}
          error={errors.landSuitability}
        />
      </div>
    </form>
  );
};

export default Cultivation;
