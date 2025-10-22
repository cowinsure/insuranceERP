import React from "react";
import AddCropDetailsModal from "../AddCropDetailsModal";
export interface SelectedCropData {
  crop_id: number;
  variety: string;
  plantation_date: string;
  crop_name?: string;
  land_name?: string;
  farmer_name?: string;
  mobile_number?: string;
  stage_name?: string | null;
  modified_at?: string | null;
}

const StageOne = (selectedCropData: SelectedCropData) => {
  return (
    <div>
      <AddCropDetailsModal
        selectedCrop={{
          ...selectedCropData,
          crop_name: selectedCropData.variety, // fallback if crop_name not provided
          land_name: "", // optional default
          farmer_name: "",
          mobile_number: "",
          stage_name: null,
          modified_at: null,
        }}
      />
    </div>
  );
};

export default StageOne;
