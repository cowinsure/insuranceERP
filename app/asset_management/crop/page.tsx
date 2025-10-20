"use client";
import RegisterCrop from "@/components/addCropForms/RegisterCrop";
import StageOne from "@/components/addCropForms/StageOne";
import StageTwo from "@/components/addCropForms/StageTwo";
// import AddCrop from "@/components/AddCropDetailsModal";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import GenericModal from "@/components/ui/GenericModal";
import CropStageModalTabs from "@/components/viewCropModal/CropStageModalTabs";
import { ClipboardCheck, Eye, FilePlus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { toast, Toaster } from "sonner";

const CropsPage = () => {
  const [isModal, setIsModal] = React.useState(false);
  const [isStageOneModal, setIsStageOneModal] = React.useState(false);
  const [isStageTwoModal, setIsStageTwoModal] = React.useState(false);
  const [isCropView, setIsCropView] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState({
    crop_name: "",
    variety: "",
    plantation_date: "",
    land: "",
  });
  const [crops, setCrops] = useState<
    Array<{
      crop_name: string;
      variety: string;
      plantation_date: string;
      land: string;
    }>
  >([]);

  useEffect(() => {
    const cropData = [
      {
        crop_name: "Rice-1",
        variety: "Aman",
        plantation_date: "9-Dec-2009",
        land: "New land",
      },
      {
        crop_name: "Rice-2",
        variety: "Aman",
        plantation_date: "9-Dec-2009",
        land: "New land",
      },
      {
        crop_name: "Aman",
        variety: "Aman",
        plantation_date: "9-Dec-2009",
        land: "New land",
      },
      {
        crop_name: "Rice-3",
        variety: "Aman",
        plantation_date: "9-Dec-2009",
        land: "New land",
      },
    ];

    setCrops(cropData);
  }, [crops.length]);

  const handleAddCropDetails = (cropName: string) => {
    if (!cropName) return;
    const selectedCrop = crops.find((crop) => crop.crop_name === cropName);
    if (!selectedCrop) return;
    setSelectedCrop(selectedCrop);
    setIsStageOneModal(true);
  };

  const handleRevisitData = (cropName: string) => {
    if (!cropName) return;
    const selectedCrop = crops.find((crop) => crop.crop_name === cropName);
    if (!selectedCrop) return;
    setSelectedCrop(selectedCrop);
    setIsStageTwoModal(true);
  };

  const handleView = (name: string) => {
    if (!name) return;
    const viewCrop = crops.find((crop) => crop.crop_name === name);
    console.log(viewCrop);
    setSelectedCrop({
      crop_name: viewCrop?.crop_name as string,
      plantation_date: viewCrop?.plantation_date as string,
      variety: viewCrop?.variety as string,
      land: viewCrop?.land as string,
    });
    setIsCropView(true);
  };

  // Flag for stage one complete
  const isStageOneCompleted = (cropName: string) => {
    return localStorage.getItem(`stageOneCompleted_${cropName}`) === "true";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
              Asset Management
            </h1>
            <IoIosArrowForward size={30} />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
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
                  Land
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Stage 1
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Stage 2
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  View Crop
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
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center gap-2 text-sm text-gray-900">
                          {crop.land}
                        </div>
                      </td>
                      {/* Stage one */}
                      <td className="flex justify-center items-center py-4 px-4">
                        <Button
                          variant={"ghost"}
                          className="bg-white text-blue-900"
                          title="Add crop details"
                          onClick={() => handleAddCropDetails(crop.crop_name)}
                        >
                          <FilePlus />
                        </Button>
                      </td>
                      {/* Stage two */}
                      <td>
                        <div className="flex items-center justify-center py-4 px-4">
                          <Button
                            variant={"ghost"}
                            className={`bg-white ${
                              isStageOneCompleted(crop.crop_name)
                                ? "text-blue-900"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            title={
                              isStageOneCompleted(crop.crop_name)
                                ? "Add revisit data"
                                : ""
                            }
                            onClick={() => {
                              if (!isStageOneCompleted(crop.crop_name)) {
                                toast.error("Complete Stage one first");
                              } else {
                                handleRevisitData(crop.crop_name);
                              }
                            }}
                          >
                            <ClipboardCheck />
                          </Button>
                        </div>
                      </td>
                      {/* Action btn */}
                      <td>
                        <div className="flex items-center justify-center py-4 px-4">
                          <Button
                            variant={"outline"}
                            onClick={() => handleView(crop.crop_name)}
                          >
                            <Eye />
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
          title={
            <h1 className="flex flex-col">
              {`Add Details for ${selectedCrop.crop_name} `}
              <small className="font-medium text-gray-500">
                Variety: {selectedCrop.variety}
              </small>
            </h1>
          }
          closeModal={() => setIsStageOneModal(false)}
          widthValue={"w-full min-w-sm md:max-w-xl"}
        >
          <StageOne {...(selectedCrop as any)} />
        </GenericModal>
      )}

      {/* Stage Two Modal */}
      {isStageTwoModal && (
        <GenericModal
          title={
            <h1 className="flex flex-col">
              {`Revisit data for ${selectedCrop.crop_name} `}
              <small className="font-medium text-gray-500">
                Variety: {selectedCrop.variety}
              </small>
            </h1>
          }
          closeModal={() => setIsStageTwoModal(false)}
          widthValue={"w-full min-w-sm md:max-w-xl"}
        >
          <StageTwo selectedCrop={selectedCrop} setStageTwoData={() => {}} />
        </GenericModal>
      )}

      {/* Crop View Modal */}
      {isCropView && (
        <GenericModal
          closeModal={() => setIsCropView(false)}
          title={`Viewing details of ${selectedCrop.crop_name}`}
          height={true}
        >
          <CropStageModalTabs stageOneData={selectedCrop} />
        </GenericModal>
      )}

      <Toaster richColors />
    </div>
  );
};

export default CropsPage;
