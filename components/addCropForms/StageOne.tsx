import React from "react";
import AddCropDetailsModal from "../AddCropDetailsModal";

export interface SelectedCropData {
  crop_name: string;
  variety: string;
  plantation_date: string;
}

const StageOne = (selectedCropData: SelectedCropData) => {
  return (
    <div>
      <AddCropDetailsModal selectedCrop={{ ...selectedCropData }} />
    </div>
  );
};

export default StageOne;
