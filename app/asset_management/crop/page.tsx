"use client";
import AddCropDetailsModal from "@/components/AddCropDetailsModal";
import RegisterCrop from "@/components/addCropForms/RegisterCrop";
import StageTwo from "@/components/addCropForms/StageTwo";
import { CropGetData } from "@/components/model/crop/CropGetModel";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import GenericModal from "@/components/ui/GenericModal";
import Loading from "@/components/utils/Loading";
import { SearchFilter } from "@/components/utils/SearchFilter";
import CropStageModalTabs from "@/components/viewCropModal/CropStageModalTabs";
import useApi from "@/hooks/use_api";
import { ClipboardCheck, Eye, FilePlus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { toast, Toaster } from "sonner";

const CropsPage = () => {
  const { get } = useApi();

  /************************* Declare states here *************************/
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = React.useState(false);
  const [isStageOneModal, setIsStageOneModal] = React.useState(false);
  const [isStageTwoModal, setIsStageTwoModal] = React.useState(false);
  const [isCropView, setIsCropView] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropGetData>();
  const [crops, setCrops] = useState<CropGetData[]>([]);
  const [filteredCrops, setFilteredCrops] = useState(crops);
  /************************************************************************/

  /************************* GET Data Functions *************************/
  useEffect(() => {
    fetchCropData();
  }, []);

  // GET all crop data from API
  const fetchCropData = async () => {
    setIsLoading(true);
    try {
      const response = await get("/cms/crop-info-service", {
        params: {
          page_size: 10,
          start_record: 1,
          crop_id: -1,
        },
      });

      if (response.status === "success") {
        setCrops(response.data);
        setFilteredCrops(response.data);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch crop data.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  /************************************************************************/

  /************************* Handler Functions *************************/
  const handleAddCropDetails = (cropId: number) => {
    if (!cropId) return;
    const selectedCrop = crops.find((crop) => crop.crop_id === cropId);
    if (!selectedCrop) return;
    setSelectedCrop(selectedCrop);
    setIsStageOneModal(true);
  };

  const handleRevisitData = (cropId: number) => {
    if (!cropId) return;
    const selectedCrop = crops.find((crop) => crop.crop_id === cropId);
    if (!selectedCrop) return;
    setSelectedCrop(selectedCrop);
    setIsStageTwoModal(true);
  };

  const handleView = (cropId: number) => {
    if (!cropId) return;
    const viewCrop = crops.find((crop) => crop.crop_id === cropId);
    if (!viewCrop) return;

    setSelectedCrop(viewCrop);
    setIsCropView(true);
    console.log("View Crop", viewCrop);
  };
  /************************************************************************/

  /************************* Utility Functions *************************/
  const runFunctionOnSuccess = () => {
    fetchCropData();
    setIsStageOneModal(false);
  };

  const runFunctionOnSuccessStageTwo = () => {
    setIsStageTwoModal(false);
  };

  // function for stage one data update
  const runOnClose = () => {
    setIsStageOneModal(false);
    fetchCropData();
  };

  // Flag for stage one complete
  const isStageOneCompleted = (cropId: number) => {
    return localStorage.getItem(`stageOneCompleted_${cropId}`) === "true";
  };
  /************************************************************************/
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
      <SearchFilter
        placeholder="Search by farmer name or mobile number"
        data={crops}
        setFilteredData={setFilteredCrops}
        searchKeys={[
          "crop_asset_seed_details.farmer_name",
          "crop_asset_seed_details.mobile_number",
        ]}
      />

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
                  Planting Date
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  Land Name
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : (
                <>
                  {filteredCrops.map((crop, idx) => {
                    const seed = crop.crop_asset_seed_details?.[0];
                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50  animate__animated animate__fadeIn"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {seed?.crop_name || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
                            {seed?.seed_variety || crop.variety || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-2 text-sm text-gray-900">
                            {crop.planting_date || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-2 text-sm text-gray-900">
                            {seed?.land_name || "N/A"}
                          </div>
                        </td>
                        {/* Stage one */}
                        <td className="flex justify-center items-center py-4 px-4">
                          <Button
                            variant={"ghost"}
                            className="bg-white text-blue-900"
                            title="Add crop details"
                            onClick={() => handleAddCropDetails(crop.crop_id)}
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
                                isStageOneCompleted(crop.crop_id)
                                  ? "text-blue-900"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                              title={
                                isStageOneCompleted(crop.crop_id)
                                  ? "Add revisit data"
                                  : ""
                              }
                              onClick={() => {
                                if (!isStageOneCompleted(crop.crop_id)) {
                                  toast.error("Complete Stage one first");
                                } else {
                                  handleRevisitData(crop.crop_id);
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
                              onClick={() => handleView(crop.crop_id)}
                            >
                              <Eye />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Crop Modal */}
      {isModal && (
        <GenericModal
          title="Register Crop"
          closeModal={() => setIsModal(false)}
          widthValue={"w-full max-w-xl"}
        >
          <RegisterCrop
            onSuccess={() => fetchCropData()}
            closeModal={() => setIsModal(false)}
          />
        </GenericModal>
      )}

      {/* Stage One Modal */}
      {isStageOneModal && (
        <GenericModal
          title={
            <h1 className="flex flex-col">
              {`Add Details for ${
                selectedCrop?.crop_asset_seed_details?.[0]?.crop_name || "Crop"
              } `}
              <small className="font-medium text-gray-500">
                Variety:{" "}
                {selectedCrop?.crop_asset_seed_details?.[0]?.seed_variety ||
                  selectedCrop?.variety}
              </small>
            </h1>
          }
          closeModal={() => setIsStageOneModal(false)}
          widthValue={"w-full min-w-sm md:max-w-3xl"}
        >
          <AddCropDetailsModal crop={selectedCrop!} onClose={runOnClose} />
        </GenericModal>
      )}

      {/* Stage Two Modal */}
      {isStageTwoModal && (
        <GenericModal
          title={
            <h1 className="flex flex-col">
              {`Revisit data for ${
                selectedCrop?.crop_asset_seed_details?.[0]?.crop_name || "Crop"
              } `}
              <small className="font-medium text-gray-500">
                Variety:{" "}
                {selectedCrop?.crop_asset_seed_details?.[0]?.seed_variety ||
                  selectedCrop?.variety}
              </small>
            </h1>
          }
          closeModal={() => setIsStageTwoModal(false)}
          widthValue={"w-full min-w-sm md:max-w-xl"}
        >
          <StageTwo
            selectedCrop={selectedCrop!}
            onSuccess={runFunctionOnSuccessStageTwo}
          />
        </GenericModal>
      )}

      {/* Crop View Modal */}
      {isCropView && (
        <GenericModal
          closeModal={() => setIsCropView(false)}
          title={`Viewing details of ${
            selectedCrop?.crop_asset_seed_details?.[0]?.crop_name || "Crop"
          }`}
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
