"use client";

import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";
import useApi from "@/hooks/use_api";
import { Stepper } from "./Stepper";
import CropDetailsForm from "./SeedDetails";
import IrrigationCultivation from "./addCropForms/stageOneSteps/IrrigationCultivation";
import History from "./addCropForms/stageOneSteps/History";
import Weather from "./addCropForms/stageOneSteps/Weather";
import PestsDisease from "./addCropForms/stageOneSteps/PestsDisease";
import Chemicals from "./addCropForms/stageOneSteps/Chemicals";
import CropDetailsPreview from "./CropDetailsPreview";
import { useLocalization } from "@/core/context/LocalizationContext";
import AttachmentStepOne from "./addCropForms/stageOneSteps/AttachmentStepOne";
import { Loading } from "./ui/loading";
import {
  AddCropData,
  AddCropDetailsModalProps,
} from "@/core/model/CropDetails/StageOneModels/interfaces";
import { FormSkeleton } from "./ui/form-skeleton";

export default function AddCropDetailsModal({
  crop: {
    crop_id: cropId,
    land_id: landId,
    crop_type_id: cropTypeId,
    estimated_yield: estimatedYield,
    planting_date: plantingDate,
    harvest_date: harvestDate,
    current_stage_id: currentStageId,
  },
  onClose,
}: AddCropDetailsModalProps) {
  const { get, put } = useApi();
  const { t } = useLocalization();
    const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ✅ Step data state with proper chemical structure
  const [cropData, setCropData] = useState<AddCropData>({
    seed: [],
    cultivation: {},
    history: {},
    weather: {
      remarks: "",
      weather_effects: [],
      date_from: "",
      date_to: "",
    },
    pests: [],
    diseases: [],
    chemicals: { fertilizers: [], pesticides: [] },
    attachments: [],
    pestDetails: [],
    diseaseDetails: [],
    // 🆕
    diseaseControlId: null,
    neighbourFieldStatusId: null,
  });

  // This function fetchs and puts data on the forms for selected crop
  useEffect(() => {
    const fetchExistingCropData = async () => {
      if (!cropId) return;

      setIsInitialLoading(true);
      try {
        const res = await get(`/cms/crop-info-service/?crop_id=${cropId}`);
        if (res.status === "success" && res.data) {
          const d = res.data[0];

          // -----------------------------
          // 🌾 FILTER PESTS (stage_id = 2)
          // -----------------------------
          const stage2Pests =
            d.crop_asset_pest_attack_details
              ?.filter((p: any) => p.stage_id === 2)
              .map((p: any) => ({
                id: Number(p.pest_attack_type_id),
                name: p.pest_attack_observations_type_name || "",
              })) || [];

          // Only IDs
          const stage2PestIds = stage2Pests.map((p: any) => p.id);

          // ------------------------------
          // 🌿 FILTER DISEASES (stage_id=2)
          // ------------------------------
          const stage2Diseases =
            d.crop_asset_disease_attack_details
              ?.filter((dd: any) => dd.stage_id === 2)
              .map((dd: any) => ({
                id: Number(dd.disease_attack_type_id),
                name: dd.disease_attack_observations_type_name || "",
              })) || [];

          const stage2DiseaseIds = stage2Diseases.map((d: any) => d.id);

          // ------------------------------
          // WEATHER (unchanged)
          // ------------------------------
          const weatherEffects =
            d.crop_asset_weather_effect_history
              ?.filter((w: any) => w.stage_id === 2)
              .map((w: any) => ({
                weather_effect_type_id: w.weather_effect_type_id,
                weather_effect_type_name: w.weather_effect_type_name,
                remarks: w.remarks || "",
                is_active: true,
                date_from: w.date_from,
                date_to: w.date_to,
              })) || [];
          // ------------------------------
          // SET NORMALIZED DATA
          // ------------------------------
          setCropData({
            seed: d.crop_asset_seed_details || [],

            cultivation: d.crop_asset_irrigation_cultivation_details?.[0] || {},

            history: d.crop_asset_previous_season_history_details?.[0] || {},

            weather: {
              remarks: d.crop_asset_weather_effect_history?.[0]?.remarks || "",
              weather_effects: weatherEffects,
              date_from:
                d.crop_asset_weather_effect_history?.[0]?.date_from || "",
              date_to: d.crop_asset_weather_effect_history?.[0]?.date_to || "",
            },

            // 🐛 pests filtered by stage 2
            pests: stage2PestIds,
            pestDetails: stage2Pests,

            // 🦠 diseases filtered by stage 2
            diseases: stage2DiseaseIds,
            diseaseDetails: stage2Diseases,

            chemicals: {
              fertilizers:
                d.crop_asset_chemical_usage_details?.filter(
                  (c: any) => c.chemical_type_id === 1,
                ) || [],
              pesticides:
                d.crop_asset_chemical_usage_details?.filter(
                  (c: any) => c.chemical_type_id === 2,
                ) || [],
            },
            attachments: d.crop_asset_attachment_details || [],
          });
        } else {
          console.warn("⚠️ No existing data found for crop:", cropId);
        }
      } catch (err) {
        console.error("❌ Failed to fetch crop data:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchExistingCropData();
  }, [cropId]);

  const steps = [
    t("seed"),
    t("cultivation"),
    t("history"),
    t("weather"),
    t("pest_disease"),
    t("chemicals"),
    t("attachments"),
    t("preview"),
  ];



  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // new payload with filtering for ids 0 and "Not Provided"
      const payload = {
        crop_id: cropId,
        land_id: landId, // replace with actual land_id if available
        crop_type_id: cropTypeId, // replace with actual crop_type_id
        variety: "",
        season: "",
        stage_id: 2,
        planting_date: plantingDate,
        harvest_date: harvestDate,
        estimated_yield: estimatedYield,

        // Keep seeds as-is (no filtering applied here)
        crop_asset_seed_details: Array.isArray(cropData.seed)
          ? cropData.seed.map((s: any) => ({
              seed_id: s.seed_id || 0,
              seed_common_name: s.seed_common_name,
              seed_variety_id: s.seed_variety_id,
              seed_company_name: s.seed_company_name,
              seed_company_type_id: s.seed_company_type_id,
              seed_type_id: s.seed_type_id,
            }))
          : [],

        // Keep irrigation/cultivation object structure (preserve fields)
        crop_asset_irrigation_cultivation_details: [
          {
            irrigation_cultivation_id: 0,
            irrigation_facility_id:
              cropData.cultivation?.irrigation_facility_id ?? null,
            irrigation_source_id:
              cropData.cultivation?.irrigation_source_id ?? null,
            cultivation_system_id:
              cropData.cultivation?.cultivation_system_id ?? null,
            land_suitability_id:
              cropData.cultivation?.land_suitability_id ?? null,
            // new propertyies added
            irrigation_status_id: cropData.cultivation.irrigation_status_id,
            earthing_up_type_id: cropData.cultivation.earthing_up_id,
            number_of_irrigations: cropData.cultivation.number_of_irrigations,
            weed_presence_type_id: cropData.cultivation.weed_presence_id,
          },
        ],

        // Previous season history — single object kept as provided
        crop_asset_previous_season_history_details: [
          {
            previous_season_history_id: 0,
            immediate_previous_crop: cropData.history?.immediate_previous_crop,
            harvest_date: cropData.history?.harvest_date,
            last_year_crop_type_id: cropData.history?.last_year_crop_type_id,
            last_year_production: cropData.history?.last_year_production,
            sowing_date: cropData.history?.sowing_date,
            seed_used_last_year: cropData.history?.seed_used_last_year,
            reason_for_changing_seed:
              cropData.history?.reason_for_changing_seed,
          },
        ],

        // WEATHER: filter out placeholder / "not provided" entries (id===0 / falsy / name === "Not Provided")
        crop_asset_weather_effect_history: Array.isArray(
          cropData.weather?.weather_effects,
        )
          ? cropData.weather.weather_effects
              .filter((w: any) => {
                if (!w) return false;
                const id = w.weather_effect_type_id ?? w.id ?? null;
                const name = (
                  w.name ??
                  w.weather_effect_type_name ??
                  ""
                ).toString();
                if (!id) return false; // exclude 0 / null / undefined
                if (name.trim().toLowerCase() === "not provided") return false;
                return true;
              })
              .map((w: any) => ({
                date_from: cropData.weather?.date_from || null,
                date_to: cropData.weather?.date_to || null,
                land_weather_effect_history_id: 0,
                weather_effect_type_id: w.weather_effect_type_id ?? w.id,
                remarks: cropData.weather?.remarks || w.remarks || "",
                is_active: true,
              }))
          : [],

        // PESTS: filter out falsy/0 ids (preserve original field names)
        crop_asset_pest_attack_details: Array.isArray(cropData.pests)
          ? cropData.pests
              .filter((idOrObj: any) => {
                if (idOrObj == null) return false;
                // if pest stored as object with id or name, handle both shapes
                if (typeof idOrObj === "object") {
                  const id = idOrObj.pest_attack_type_id ?? idOrObj.id ?? null;
                  const name = (idOrObj.name ?? "").toString();
                  if (!id) return false;
                  if (name.trim().toLowerCase() === "not provided")
                    return false;
                  return true;
                }
                // if stored as id (number/string)
                return Boolean(idOrObj) && Number(idOrObj) !== 0;
              })
              .map((idOrObj: any) => {
                const id =
                  typeof idOrObj === "object"
                    ? (idOrObj.pest_attack_type_id ?? idOrObj.id)
                    : idOrObj;
                const date =
                  typeof idOrObj === "object"
                    ? (idOrObj.attack_date ?? idOrObj.date ?? null)
                    : null;
                const remarks =
                  typeof idOrObj === "object" ? (idOrObj.remarks ?? "") : "";
                return {
                  crop_pest_attack_id: 0,
                  pest_attack_type_id: id,
                  attack_date: date,
                  remarks: remarks,
                };
              })
          : [],

        // DISEASES: same treatment as pests
        crop_asset_disease_attack_details: Array.isArray(cropData.diseases)
          ? cropData.diseases
              .filter((id: any) => Boolean(id) && Number(id) !== 0)
              .map((diseaseId: number, index: number) => {
                const detail = cropData.diseaseDetails?.[index] ?? {};

                return {
                  
                  crop_disease_attack_id: 0,
                  disease_attack_type_id: diseaseId,
                  disease_control_type_id: cropData.diseaseControlId ?? null,
                  neighbour_field_status_id:
                    cropData.neighbourFieldStatusId ?? null,
                  // attack_date: detail?.date ?? null,
                  // remarks: detail?.remarks ?? "",
                };
              })
          : [],

        // CHEMICALS: map fertilizers & pesticides; remove entries missing a chemical_name or with falsy qty when appropriate
        crop_asset_chemical_usage_details: [
          ...(Array.isArray(cropData.chemicals?.fertilizers)
            ? cropData.chemicals.fertilizers
                .filter((c: any) => c && (c.chemical_name || c.chemical_id))
                .map((c: any) => ({
                  chemical_usage_id: 0,
                  chemical_type_id: 1,
                  chemical_name: c.chemical_name,
                  qty: c.qty,
                  qty_unit: c.qty_unit,
                  remarks: c.remarks,
                }))
            : []),
          ...(Array.isArray(cropData.chemicals?.pesticides)
            ? cropData.chemicals.pesticides
                .filter((c: any) => c && (c.chemical_name || c.chemical_id))
                .map((c: any) => ({
                  chemical_usage_id: 0,
                  chemical_type_id: 2,
                  chemical_name: c.chemical_name,
                  qty: c.qty,
                  qty_unit: c.qty_unit,
                  remarks: c.remarks,
                }))
            : []),
        ],

        // ATTACHMENTS
        crop_asset_attachment_details: Array.isArray(cropData.attachments)
          ? cropData.attachments
          : [],
      };

      console.log("Payload submittion", payload);

      const res = await put("/cms/crop-info-service/", payload, {
        params: { crop_id: cropId },
      });
      if (res.status === "success") {
        toast.success(t("crop_data_submitted_successfully"));
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(t("failed_to_submit_crop_data"));
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  const renderStep = () => {
    // Show skeleton for all steps during initial load
    if (isInitialLoading) {
      return <FormSkeleton type="form-with-dropdowns" />;
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="animate-fadeIn">
            <CropDetailsForm
              selectedCropId={cropId}
              data={cropData.seed}
              onChange={(d) => setCropData({ ...cropData, seed: d })}
            />
          </div>
        );
      case 1:
        return (
          <div className="animate-fadeIn">
            <IrrigationCultivation
              data={cropData.cultivation}
              onChange={(d) => setCropData({ ...cropData, cultivation: d })}
            />
          </div>
        );
      case 2:
        return (
          <div className="animate-fadeIn">
            <History
              data={cropData.history}
              onChange={(d) => setCropData({ ...cropData, history: d })}
            />
          </div>
        );
      case 3:
        return (
          <div className="animate-fadeIn">
            <Weather
              data={cropData.weather}
              onChange={(d) => setCropData({ ...cropData, weather: d })}
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fadeIn">
            <PestsDisease
              data={{
                pestIds: cropData.pests,
                diseaseIds: cropData.diseases,
                diseaseControlId: cropData.diseaseControlId ?? undefined,
                neighbourFieldStatusId:
                  cropData.neighbourFieldStatusId ?? undefined,
              }}
              onChange={(
                p,
                d,
                pestDetails,
                diseaseDetails,
                diseaseControlId,
                neighbourFieldStatusId,
              ) => {
                setCropData({
                  ...cropData,
                  pests: p,
                  diseases: d,
                  pestDetails,
                  diseaseDetails,
                  diseaseControlId,
                  neighbourFieldStatusId,
                });
              }}
            />
          </div>
        );

      case 5:
        return (
          <div className="animate-fadeIn">
            <Chemicals
              data={cropData.chemicals}
              onChange={(d) => setCropData({ ...cropData, chemicals: d })}
            />
          </div>
        );
      case 6:
        return (
          <div className="animate-fadeIn">
            <AttachmentStepOne
              stageId={2}
              data={cropData.attachments}
              onChange={(d) => setCropData({ ...cropData, attachments: d })}
            />
          </div>
        );

      case 7:
        return (
          <div className="animate-fadeIn">
            <CropDetailsPreview
              data={cropData}
              attachments={cropData.attachments.filter((att: any) =>
                att.attachment_path.startsWith("data:"),
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl mb-4">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className=" bg-white rounded-b-xl">{renderStep()}</div>

      <div
        className={`flex mt-4 ${
          currentStep === 0 ? "justify-end" : "justify-between"
        }`}
      >
        {currentStep !== 0 && (
          <button
            onClick={handlePrev}
            className="cursor-pointer px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1"
          >
            <IoIosArrowBack /> {t("prev")}
          </button>
        )}

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
          >
            <FaCircleCheck /> {isLoading ? t("submitting") : t("submit")}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
          >
            {t("next")} <IoIosArrowForward />
          </button>
        )}
      </div>

      {/* FULL SCREEN LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black to-transparent">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center shadow-2xl animate-fadeIn">
            <Loading />
            <p className="mt-4 text-gray-700 font-medium text-base">
              Submitting crop data...
            </p>
            <span className="text-sm text-gray-500 mt-1">
              This may take a few moments. Please don’t close this window.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
