"use client";
import RegisterCrop from "@/components/addCropForms/RegisterCrop";
import StageOne from "@/components/addCropForms/StageOne";
// import AddCrop from "@/components/AddCropDetailsModal";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import GenericModal from "@/components/ui/GenericModal";
import { ClipboardCheck, FilePlus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

const CropsPage = () => {
  const [isModal, setIsModal] = React.useState(false);
  const [isStageOneModal, setIsStageOneModal] = React.useState(false);
  const [crops, setCrops] = useState<
    Array<{
      crop_name: string;
      variety: string;
      plantation_date: string;
    }>
  >([]);

  useEffect(() => {
    const cropData = [
      {
        crop_name: "Rice",
        variety: "Aman",
        plantation_date: "9-Dec-2009",
      },
      {
        crop_name: "Rice",
        variety: "Aman",
        plantation_date: "9-Dec-2009",
      },
    ];

    setCrops(cropData);
  }, [crops.length]);
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
              Crop Registration
            </h1>
          </div>
          <p className="text-gray-500 mt-1">
            Register your crop details for tracking and management
          </p>
        </div>
        <div className="flex">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setIsModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Crop
          </Button>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
        <p>Crop details Page</p>
      </div>
      {/* Table */}
      <div className="flex flex-col space-y-2 border bg-white py-6 px-5 rounded-lg animate__animated animate__fadeIn">
        <div className="mb-5">
          <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
            Registered Crops
          </CardTitle>
          <p className="text-sm text-gray-600">{crops.length} crops found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Crop Name
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Variety
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Plantation Date
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Stage 1
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Stage 2
                </th>
              </tr>
            </thead>
            <tbody>
              <>
                {crops &&
                  crops.map((crop, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50  animate__animated animate__fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {crop.crop_name}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
                          {crop.variety}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center gap-2 text-sm text-gray-900">
                          {crop.plantation_date}
                        </div>
                      </td>
                      <td className="flex justify-center items-center py-4 px-4">
                        <Button
                          variant={"ghost"}
                          className="bg-white text-blue-900"
                          title="Add crop details"
                          onClick={() => setIsStageOneModal(true)}
                        >
                          <FilePlus />
                        </Button>
                      </td>
                      <td>
                        <div className="flex items-center justify-center py-4 px-4">
                          <Button
                            variant={"ghost"}
                            className="bg-white text-blue-900"
                            title="Add revisit data"
                            onClick={() => console.log(crop)}
                          >
                            <ClipboardCheck />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </>
            </tbody>
          </table>
          {/* {totalPages > 1 && (
            <div className="">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1); // reset page to 1
                }}
              />
            </div>
          )} */}
        </div>
      </div>
      {isModal && (
        <GenericModal
          title="Register Crop"
          closeModal={() => setIsModal(false)}
          widthValue={"w-full max-w-xl"}
        >
          {/* <AddCrop /> */}
          <RegisterCrop
            setCropData={setCrops}
            closeModal={() => setIsModal(false)}
          />
        </GenericModal>
      )}

      {/* Stage One Modal */}
      {isStageOneModal && (
        <GenericModal
          title="Add Crop Details"
          closeModal={() => setIsStageOneModal(false)}
          widthValue={"w-full max-w-xl"}
        >
          <StageOne />
        </GenericModal>
      )}
    </div>
  );
};

export default CropsPage;
