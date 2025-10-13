import React, { useState } from "react";
import InputField from "../InputField";

interface CropData {
  crop_name: string;
  variety: string;
  plantation_date: string;
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Optionally reset form
    setFormData({
      crop_name: "",
      variety: "",
      plantation_date: "",
    });
    if (closeModal) {
      closeModal();
    }

    // TODO: Close modal — you may need to pass `closeModal` prop too
  };

  return (
    <div className="">
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterCrop;
