import InputField from "@/components/InputField";
import React, { useState } from "react";

const History = () => {
  const [data, setData] = useState({
    immediatePreviousCrop: "",
    harvestDate: "",
    lastYearsCrop: "",
    lastYearProduction: "",
    sowingDate: "",
    seedUsedLastYear: "",
    reasonForChangingSeed: "",
  });

  const [errors, setErrors] = useState({
    immediatePreviousCrop: "",
    harvestDate: "",
    lastYearsCrop: "",
    lastYearProduction: "",
    sowingDate: "",
    seedUsedLastYear: "",
    reasonForChangingSeed: "",
  });

  // Handle change for all form fields (Input and Select)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      immediatePreviousCrop: "",
      harvestDate: "",
      lastYearsCrop: "",
      lastYearProduction: "",
      sowingDate: "",
      seedUsedLastYear: "",
      reasonForChangingSeed: "",
    };
    // Example validation checks (you can customize)
    if (!data.immediatePreviousCrop)
      newErrors.immediatePreviousCrop = "This field is required";
    if (!data.harvestDate) newErrors.harvestDate = "This field is required";
    if (!data.lastYearsCrop) newErrors.lastYearsCrop = "This field is required";
    if (!data.lastYearProduction)
      newErrors.lastYearProduction = "This field is required";
    if (!data.sowingDate) newErrors.sowingDate = "This field is required";
    if (!data.seedUsedLastYear)
      newErrors.seedUsedLastYear = "This field is required";
    if (!data.reasonForChangingSeed)
      newErrors.reasonForChangingSeed = "This field is required";

    setErrors(newErrors);
  };

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        History
      </h2>
      <div className="space-y-5">
        {/* Immediate Previous Crop */}
        <InputField
          placeholder="Ex - Boro Rice"
          label="Immediate Previous Crop"
          id="immediatePreviousCrop"
          name="immediatePreviousCrop"
          value={data.immediatePreviousCrop}
          onChange={handleChange}
          error={errors.immediatePreviousCrop}
        />

        {/* Last Year's Crop */}
        <InputField
          placeholder="Ex - Aman"
          label="Last Year's Crop"
          id="lastYearsCrop"
          name="lastYearsCrop"
          value={data.lastYearsCrop}
          onChange={handleChange}
          error={errors.lastYearsCrop}
        />

        {/* Last Year Production */}
        <InputField
          placeholder="Enter the number of production"
          label="Last Year Production (mound/33 decimal)"
          id="lastYearProduction"
          name="lastYearProduction"
          value={data.lastYearProduction}
          onChange={handleChange}
          error={errors.lastYearProduction}
        />

        <div className="grid md:grid-cols-2 gap-5">
          {/* Sowing Date */}
          <InputField
            label="Sowing Date (Aman)"
            id="sowingDate"
            name="sowingDate"
            type="date"
            value={data.sowingDate}
            onChange={handleChange}
            error={errors.sowingDate}
          />
          {/* Harvest Date */}
          <InputField
            label="Harvest Date"
            id="harvestDate"
            name="harvestDate"
            type="date"
            value={data.harvestDate}
            onChange={handleChange}
            error={errors.harvestDate}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Seed Used Last Year */}
          <InputField
            label="Seed Used Last Year"
            id="seedUsedLastYear"
            name="seedUsedLastYear"
            placeholder="e.g., BRRI dhan49"
            value={data.seedUsedLastYear}
            onChange={handleChange}
            error={errors.seedUsedLastYear}
          />

          {/* Reason for Changing Seed */}
          <InputField
            label="Reason for Changing Seed (if any)"
            id="reasonForChangingSeed"
            name="reasonForChangingSeed"
            placeholder="e.g., Low yield, disease issues"
            value={data.reasonForChangingSeed}
            onChange={handleChange}
            error={errors.reasonForChangingSeed}
          />
        </div>
      </div>
    </form>
  );
};

export default History;
