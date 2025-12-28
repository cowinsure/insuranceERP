"use client";
import AddCropDetailsModal from "@/components/AddCropDetailsModal";
import RegisterCrop from "@/components/addCropForms/RegisterCrop";
import AddCropStageTwoModal from "@/components/AddCropStageTwoModal";
import { CropGetData } from "@/components/model/crop/CropGetModel";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import GenericModal from "@/components/ui/GenericModal";
import Loading from "@/components/utils/Loading";
import { SearchFilter } from "@/components/utils/SearchFilter";
import CropStageModalTabs from "@/components/viewCropModal/CropStageModalTabs";
import useApi from "@/hooks/use_api";
import { ClipboardCheck, Eye, FilePlus, Info, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { toast, Toaster } from "sonner";
import { useLocalization } from "@/core/context/LocalizationContext";
import { useAuth } from "@/core/context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import { MoreVertical, X } from "lucide-react";
import Pagination from "@/components/utils/Pagination";

type StageAccess = {
  stage1Enabled: boolean;
  stage2Enabled: boolean;
};

const CropsPage = () => {
  const { get } = useApi();
  const { t } = useLocalization();
  const { userId } = useAuth();

  /************************* Declare states here *************************/
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = React.useState(false);
  const [isStageOneModal, setIsStageOneModal] = React.useState(false);
  const [isStageTwoModal, setIsStageTwoModal] = React.useState(false);
  const [isCropView, setIsCropView] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropGetData>();
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);

  const [pendingModal, setPendingModal] = useState<
    "stage1" | "stage2" | "view" | null
  >(null);
  const [crops, setCrops] = useState<CropGetData[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<CropGetData[]>([]);
  const [stageOnePayloads, setStageOnePayloads] = useState<Record<number, any>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(6);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(filteredCrops.length / (pageSize as number));

  const stageRules: Record<number, StageAccess> = {
    1: { stage1Enabled: true, stage2Enabled: false },
    2: { stage1Enabled: true, stage2Enabled: true },
    3: { stage1Enabled: true, stage2Enabled: true },
  };

  /************************************************************************/

  /************************* GET Data Functions *************************/

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCrops]);

  useEffect(() => {
    setFilteredCrops(crops);
  }, [crops]);

  useEffect(() => {
    fetchCropData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const hasSeen = localStorage.getItem("seen-stage-info");
    const isMobile = window.innerWidth < 1024;

    if (!hasSeen && isMobile) {
      setShowCoach(true);
    }
  }, []);

  // GET all crop data from API
  const fetchCropData = async () => {
    setIsLoading(true);
    try {
      const response = await get("/cms/crop-info-service", {
        params: {
          crop_id: -1,
          page_size: pageSize === "All" ? 999999 : pageSize,
          start_record:
            pageSize === "All"
              ? 1
              : (currentPage - 1) * (pageSize as number) + 1,
        },
      });

      if (response.status === "success") {
        setCrops(response.data);
        setFilteredCrops(response.data);
        setTotalRecords(response.total_records || response.data.length);
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

  // GET single crop by id and set to state
  const fetchSingleCrop = async (cropId: number) => {
    if (!cropId) return null;
    setIsViewLoading(true);
    try {
      const response = await get("/cms/crop-info-service", {
        params: {
          page_size: 10,
          start_record: 1,
          crop_id: cropId,
        },
      });

      if (response.status === "success") {
        // API returns an array of results; pick the first item if present
        const payload = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (payload) {
          setSelectedCrop(payload);
          return payload;
        }
      }
      return null;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch crop.";
      toast.error(message);
      return null;
    } finally {
      setIsViewLoading(false);
    }
  };

  // Fetch single crop whenever selectedCropId changes
  useEffect(() => {
    if (!selectedCropId) return;

    let mounted = true;

    (async () => {
      const payload = await fetchSingleCrop(selectedCropId);
      if (!mounted) return;
      if (payload && pendingModal) {
        // open the modal that was requested
        if (pendingModal === "stage1") setIsStageOneModal(true);
        if (pendingModal === "stage2") setIsStageTwoModal(true);
        if (pendingModal === "view") setIsCropView(true);
        setPendingModal(null);
        setIsFullScreenLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedCropId, pendingModal]);
  /************************************************************************/

  /************************* Handler Functions *************************/
  const handleAddCropDetails = (cropId: number) => {
    if (!cropId) return;
    setIsFullScreenLoading(true);
    setSelectedCropId(cropId);
    setPendingModal("stage1");
  };

  const handleRevisitData = (cropId: number) => {
    if (!cropId) return;
    setIsFullScreenLoading(true);
    setSelectedCropId(cropId);
    setPendingModal("stage2");
  };

  const handleView = (cropId: number) => {
    if (!cropId) return;
    setIsFullScreenLoading(true);
    setSelectedCropId(cropId);
    setPendingModal("view");
  };
  /************************************************************************/

  /************************* Utility Functions *************************/
  const runFunctionOnSuccess = () => {
    fetchCropData();
    setIsStageOneModal(false);
  };

  const runFunctionOnSuccessStageTwo = () => {
    setIsStageTwoModal(false);
    fetchCropData();
  };

  // function for stage one data update
  // Stage 1 modal success callback
  const runOnClose = (updatedPayload?: any) => {
    setIsStageOneModal(false);
    fetchCropData();
  };

  // Stage handler function
  const getStageAccess = (stageId?: number | string): StageAccess => {
    const id = Number(stageId) || 1; // convert string to number, fallback to 1
    return stageRules[id] || stageRules[1];
  };

  /************************************************************************/

  const paginatedCrops =
    pageSize === "All"
      ? filteredCrops
      : filteredCrops.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );

  console.log(crops);

  return (
    <div className="flex-1 lg:space-y-2 p-3 md:px-6 pb-16 lg:pb-0">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <h1 className="hidden lg:inline-block text-xl lg:text-2xl font-bold text-gray-700">
              {t("asset_management")}
            </h1>
            <IoIosArrowForward size={30} className="hidden lg:inline-block" />
            <h1 className="text-[21px] lg:text-2xl font-bold text-gray-700">
              {t("crop_registration")}
            </h1>
          </div>
          <p className="text-gray-400 mt-1 text-sm lg:text-base font-medium lg:tracking-wide">
            {t("register_crop_details")}
          </p>
        </div>
      </div>
      {/* Body */}

      {/* Table */}
      <div className="flex flex-col space-y-2 border bg-white p-4 lg:py-6 lg:px-5 rounded-lg animate__animated animate__fadeIn">
        {/* Table header */}
        <div className="mb-5 grid grid-cols-4">
          <div className="col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg lg:text-xl font-semibold text-gray-700 mb- pt-0">
                {t("registered_crops")}
              </CardTitle>
              <div className="relative flex items-center">
                <button
                  id="stage-info-btn"
                  className={`lg:hidden relative  ${
                    showCoach && "z-50 bg-white rounded-full"
                  }`}
                  onClick={() => {
                    setIsInfoModal(true);
                    localStorage.setItem("seen-stage-info", "true");
                    setShowCoach(false);
                  }}
                >
                  <Info
                    className={`w-5 h-5 ${
                      showCoach
                        ? "animate-pulse text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {showCoach && (
                  <>
                    {/* Dim background */}
                    <div
                      className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-30"
                      onClick={() => setShowCoach(false)}
                    />

                    {/* Tooltip anchored to button */}
                    <div className="absolute z-40 top-full left-3 -translate-x-1/2 mt-3 w-[220px] bg-white rounded-xl shadow-xl p-3 text-sm">
                      <p className="font-semibold text-gray-800">
                        ℹ️ What do these icons mean?
                      </p>
                      <p className="text-gray-600 mt-1">
                        Tap here to understand planting & harvesting stages.
                      </p>

                      {/* Arrow */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                    </div>
                  </>
                )}

                {/* Info Modal */}
                {isInfoModal && (
                  <>
                    {/* Dark background inset */}
                    <div
                      className="fixed inset-0 bg-black/40 z-40"
                      onClick={() => setIsInfoModal(false)}
                    />

                    {/* Info Popover */}
                    <div className="absolute -left-10 top-full mt-3 z-50 w-[240px] rounded-xl bg-white shadow-2xl border border-gray-200 p-4 space-y-4 animate-fade-in">
                      {/* Close button */}
                      <button
                        onClick={() => setIsInfoModal(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Arrow */}
                      <div className="absolute -top-2 left-10 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200" />

                      {/* Content */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">
                            Initialization
                          </span>

                          <span className="text-gray-400">→</span>

                          <img
                            src="/initialization.png"
                            alt="Planting & Cultivation"
                            className="w-14 h-14"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">
                            Stage 1
                          </span>

                          <span className="text-gray-400">→</span>

                          <img
                            src="/seeding.png"
                            alt="Planting & Cultivation"
                            className="w-14 h-14"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">
                            Stage 2
                          </span>

                          <span className="text-gray-400">→</span>

                          <img
                            src="/harvest.png"
                            alt="Harvesting"
                            className="w-14 h-14"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm lg:text-base font-medium text-gray-400">
              {totalRecords} {t("crops_found")}
            </p>
          </div>

          {/* Search and add btn */}
          <div className="lg:col-span-2 flex justify-end gap-5 items-center">
            <div className="flex-1 hidden lg:block">
              <SearchFilter
                placeholder={t("search_farmer_mobile")}
                data={crops}
                setFilteredData={setFilteredCrops}
                searchKeys={["farmer_name", "mobile_number"]}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-400 drop-shadow-md text-white text-sm lg:text-[15px] flex items-center gap-2 px-2 lg:px-4 py-2 rounded-md font-medium cursor-pointer"
                onClick={() => setIsModal(true)}
              >
                <FaPlus className="w- h-" size={16} />
                <span className="hidden lg:inline-block">{t("add_crop")}</span>
                <span className="inline-block lg:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block max-h-[550px] overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  {t("sl")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  {t("crop_name")}
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  {t("current_stage")}
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  {t("planting_date")}
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  {t("land_name")}
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  {t("stage_1")}
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  {t("stage_2")}
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                  {t("view_crop")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : (
                <>
                  {paginatedCrops.map((crop, idx) => {
                    // const seed = crop.crop_asset_seed_details?.[0];
                    const { stage1Enabled, stage2Enabled } = getStageAccess(
                      crop.current_stage_id
                    );
                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50  animate__animated animate__fadeIn"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <td className="py-4 px-4 text-gray-600">
                          {(currentPage - 1) *
                            (pageSize === "All" ? 0 : pageSize) +
                            idx +
                            1}
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {crop?.crop_name || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-2 text-sm text-gray-900">
                            {crop.stage_name || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-2 text-sm text-gray-900">
                            {crop.planting_date || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center items-center gap-2 text-sm text-gray-900 capitalize w-[150px] mx-auto truncate">
                            {crop?.land_name || "N/A"}
                          </div>
                        </td>
                        {/* Stage one */}
                        <td className="text-center py-4 px-4">
                          <Button
                            variant="ghost"
                            className={`bg-white ${
                              stage1Enabled
                                ? "text-blue-900"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              if (!stage1Enabled) {
                                toast.error(t("stage_1_cannot_edit"));
                              } else {
                                handleAddCropDetails(crop.crop_id);
                              }
                            }}
                            title={t("add_planting_details")}
                          >
                            <FilePlus />
                          </Button>
                        </td>
                        {/* Stage two */}
                        <td className="text-center py-4 px-4">
                          <Button
                            variant="ghost"
                            className={`bg-white ${
                              stage2Enabled
                                ? "text-blue-900"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              if (!stage2Enabled) {
                                toast.error(t("complete_stage_1_first"));
                              } else {
                                handleRevisitData(crop.crop_id);
                              }
                            }}
                            title={t("add_revisit_data")}
                          >
                            <ClipboardCheck />
                          </Button>
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

        {/* Search for mobile */}
        <div className="flex-1 block lg:hidden">
          <SearchFilter
            placeholder={t("search_farmer_mobile")}
            data={crops}
            setFilteredData={setFilteredCrops}
            searchKeys={["farmer_name", "mobile_number"]}
          />
        </div>

        {/* MOBILE / TABLET VIEW — CARDS */}
        <div className="grid gap-4 lg:hidden mt-2 max-h-[60vh] overflow-auto">
          {isLoading ? (
            <Loading />
          ) : (
            paginatedCrops.map((crop, idx) => {
              const { stage1Enabled, stage2Enabled } = getStageAccess(
                crop.current_stage_id
              );

              return (
                <div
                  key={idx}
                  className="relative border rounded-lg p-3 shadow-sm bg-linear-to-tl from-gray-100 via-white to-gray-100 overflow-hidden animate__animated animate__fadeIn"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Header */}
                  <div
                    className="flex justify-between items-center"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === crop.crop_id ? null : crop.crop_id
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-semibold text-gray-300 absolute -left-7">
                        {/* {(currentPage - 1) *
                          (pageSize === "All" ? 0 : pageSize) +
                          idx +
                          1} */}

                        <img
                          src={
                            crop.stage_name === "Planting & Cultivation"
                              ? "/seeding.png"
                              : crop.stage_name === "Harvest & Observation"
                              ? "/harvest.png"
                              : ""
                          }
                          alt=""
                          className="w-24 object-cover rotate-y-180"
                        />

                        {crop.stage_name === "Crop Initialization" && (
                          <img
                            src={"/initialization.png"}
                            alt=""
                            className="w-24 object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute -left-7 w-22 h-full -z-10 rounded-r-full" />

                      <div className="ml-16">
                        <h3 className="text-base font-semibold text-gray-900">
                          {crop.crop_name || "N/A"}
                        </h3>

                        <p className="text-[13px] font-medium ">
                          <span className=" text-gray-800">
                            {crop.farmer_name || "N/A"}
                          </span>
                          <span className="mx-1 text-gray-400">-</span>
                          <span className="text-gray-700">
                            {crop.mobile_number || "N/A"}
                          </span>
                        </p>
                        <p className="text-gray-400 font-semibold text-[13px] mt-2">
                          {crop.stage_name}
                        </p>
                      </div>
                    </div>

                    {/* Master Action Button */}
                    <div className="">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === crop.crop_id ? null : crop.crop_id
                          )
                        }
                        className={`relative z-20 ${
                          openMenuId === crop.crop_id
                            ? "bg-white text-red-600 p-2 rounded-lg border border-red-400"
                            : "bg-gray-200 text-black p-2 rounded-lg"
                        }`}
                      >
                        {openMenuId === crop.crop_id ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <MoreVertical className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`absolute inset-0 bg-black/10 backdrop-blur-xs transition-all duration-700 ease-in-out ${
                        openMenuId === crop.crop_id
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none backdrop-blur-0"
                      }`}
                    />
                  </div>

                  {/* Absolute Horizontal Action Tray */}
                  <div
                    className={` absolute right-14 top-1/2 -translate-y-1/2 flex gap-2 bg-white/90 backdrop-blur-sm border rounded-lg shadow-lg p-2 transition-all duration-300 ease-in-out ${
                      openMenuId === crop.crop_id
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-16 pointer-events-none"
                    }
    `}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleView(crop.crop_id);
                        setOpenMenuId(null);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        stage1Enabled
                          ? "text-blue-700"
                          : "text-gray-400 cursor-not-allowed"
                      }
                      onClick={() => {
                        if (!stage1Enabled) {
                          toast.error(t("stage_1_cannot_edit"));
                        } else {
                          handleAddCropDetails(crop.crop_id);
                        }
                        setOpenMenuId(null);
                      }}
                    >
                      <FilePlus className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={
                        stage2Enabled
                          ? "text-blue-700"
                          : "text-gray-400 cursor-not-allowed"
                      }
                      onClick={() => {
                        if (!stage2Enabled) {
                          toast.error(t("complete_stage_1_first"));
                        } else {
                          handleRevisitData(crop.crop_id);
                        }
                        setOpenMenuId(null);
                      }}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Register Crop Modal */}
      {isModal && (
        <GenericModal
          title={t("register_crop")}
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
      {isStageOneModal &&
        (userId === "Farmer" ? (
          <GenericModal
            title={
              <span className="flex flex-col">
                <div className="flex gap-1">
                  <span>{t("add_details_for")}</span>
                  <span className="font-extrabold">
                    {selectedCrop?.crop_asset_seed_details?.[0]?.crop_name ||
                      "Crop"}
                  </span>
                </div>
              </span>
            }
            closeModal={() => setIsStageOneModal(false)}
            widthValue={"w-full md:max-w-3xl"}
          >
            <AddCropDetailsModal crop={selectedCrop!} onClose={runOnClose} />
          </GenericModal>
        ) : (
          <GenericModal closeModal={() => setIsStageOneModal(false)}>
            <div className="w-full mx-auto text-center p-6 space-y-5">
              {/* Icon */}
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">
                Upgrade to Premium
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed">
                Unlock the full power of the app with a{" "}
                <span className="font-bold text-gray-800">
                  Premium subscription
                </span>
                . Enjoy exclusive features, faster performance, and tools
                designed to help you get the most out of your usage.
              </p>
            </div>
          </GenericModal>
        ))}

      {/* Stage Two Modal */}
      {isStageTwoModal &&
        (userId === "Farmer" ? (
          <GenericModal
            title={
              <h1 className="flex flex-col">
                {`${t("revisit_data_for")} ${
                  selectedCrop?.crop_asset_seed_details?.[0]?.crop_name ||
                  "Crop"
                } `}
                <small className="font-medium text-gray-500">
                  {t("variety")}{" "}
                  {selectedCrop?.crop_asset_seed_details?.[0]?.seed_variety ||
                    selectedCrop?.variety}
                </small>
              </h1>
            }
            closeModal={() => setIsStageTwoModal(false)}
            widthValue={"w-full min-w-sm md:max-w-3xl"}
          >
            <AddCropStageTwoModal
              selectedCrop={selectedCrop!}
              onSuccess={runFunctionOnSuccessStageTwo}
            />
          </GenericModal>
        ) : (
          <>
            {isStageTwoModal && (
              <GenericModal closeModal={() => setIsStageTwoModal(false)}>
                <div className="w-full mx-auto text-center p-6 space-y-5">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Upgrade to Premium
                  </h2>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    Unlock the full power of the app with a{" "}
                    <span className="font-bold text-gray-800">
                      Premium subscription
                    </span>
                    . Enjoy exclusive features, faster performance, and tools
                    designed to help you get the most out of your usage.
                  </p>
                </div>
              </GenericModal>
            )}
          </>
        ))}

      {/* Crop View Modal */}
      {isCropView && (
        <GenericModal
          closeModal={() => setIsCropView(false)}
          title={`${t("viewing_details_of")} ${
            selectedCrop?.crop_asset_seed_details?.[0]?.crop_name || "Crop"
          }`}
          height={true}
          widthValue="sm:w-[35%] md:min-w-[90%] lg:min-w-[60%] lg:max-w-[70%]"
        >
          <CropStageModalTabs data={selectedCrop} />
        </GenericModal>
      )}

      {/* Full Screen Loader */}
      {isFullScreenLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <Loading text="Wait a moment" />
        </div>
      )}

      <Toaster richColors />
    </div>
  );
};

export default CropsPage;
