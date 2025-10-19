import React, { useState } from "react";
import InputField from "../InputField";
import DropdownField from "../DropDownField";

interface CropData {
  crop_name: string;
  variety: string;
  plantation_date: string;
  land: string; // ✅ added land property
}

interface RegisterCropProps {
  setCropData: React.Dispatch<React.SetStateAction<CropData[]>>;
  closeModal?: () => void;
}

const RegisterCrop: React.FC<RegisterCropProps> = ({
  setCropData,
  closeModal,
}) => {
  const [formData, setFormData] = useState<CropData>({
    crop_name: "",
    variety: "",
    plantation_date: "",
    land: "",
  });

  // Handles text/date inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handles dropdown input
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add new crop to existing list
    setCropData((prevCrops) => [...prevCrops, formData]);

    // Reset form after submission
    setFormData({
      crop_name: "",
      variety: "",
      plantation_date: "",
      land: "",
    });

    if (closeModal) closeModal();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Crop Name"
          id="crop_name"
          name="crop_name"
          placeholder="Crop Name"
          value={formData.crop_name}
          onChange={handleChange}
          required
        />

        <InputField
          label="Variety"
          id="variety"
          name="variety"
          placeholder="Variety"
          value={formData.variety}
          onChange={handleChange}
          required
        />

        <InputField
          label="Plantation Date"
          id="plantation_date"
          name="plantation_date"
          type="date"
          value={formData.plantation_date}
          onChange={handleChange}
          required
        />

        {/* ✅ Controlled dropdown */}
        <DropdownField
          id="land"
          label="Select Land"
          name="land"
          value={formData.land}
          onChange={handleDropdownChange}
          required
          options={[
            { value: "north_badda_land_a", label: "North Badda Land A" },
            { value: "north_badda_land_b", label: "North Badda Land B" },
            { value: "north_badda_land_c", label: "North Badda Land C" },
            { value: "north_badda_land_d", label: "North Badda Land D" },
            { value: "north_badda_land_e", label: "North Badda Land E" },
          ]}
        />

        <button
          type="submit"
          className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 border w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterCrop;
