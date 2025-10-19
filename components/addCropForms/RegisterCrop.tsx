import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import DropdownField from "../DropDownField";
import { toast, Toaster } from "sonner";
import useApi from "@/hooks/use_api";

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

interface LandData {
  land_name: string;
}

const RegisterCrop: React.FC<RegisterCropProps> = ({
  setCropData,
  closeModal,
}) => {
  const { get } = useApi();
  const [formData, setFormData] = useState<CropData>({
    crop_name: "",
    variety: "",
    plantation_date: "",
    land: "",
  });
  const [isLandData, setIsLandData] = useState<LandData[]>([]);

  useEffect(() => {
    getLandData();
  }, []);

  /**************** Get requests  ****************/
  const getLandData = async () => {
    try {
      const response = await get("/lams/land-info-service", {
        params: { start_record: 1, page_size: 10 },
      });
      console.log(response);

      if (response.status === "success") {
        setIsLandData(response.data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  /**************** ########  ****************/

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
  console.log(isLandData);
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
          options={isLandData.map((land) => ({
            value: land.land_name,
            label: land.land_name,
          }))}
        />

        <button
          type="submit"
          className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 border w-full"
        >
          Submit
        </button>
      </form>
      <Toaster richColors />
    </div>
  );
};

export default RegisterCrop;
