"use client";
import AddCrop from "@/components/AddCrop";
import { Button } from "@/components/ui/button";
import GenericModal from "@/components/ui/GenericModal";
import { Plus } from "lucide-react";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

const CropsPage = () => {
  const [isModal, setIsModal] = React.useState(false);
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Asset Management
            </h1>
            <IoIosArrowForward size={30} />
            <h1 className="text-2xl font-bold text-gray-800">
              Land & Crop Registration
            </h1>
          </div>
          <p className="text-gray-500 mt-1">
            Register your land and crop details for tracking and management.
          </p>
        </div>
        <div className="flex">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setIsModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
        <p>Land and Crop details Page</p>
      </div>
      {isModal && (
        <GenericModal
          title="Add Land & Crop"
          closeModal={() => setIsModal(false)}
        >
          <AddCrop />
        </GenericModal>
      )}
    </div>
  );
};

export default CropsPage;
