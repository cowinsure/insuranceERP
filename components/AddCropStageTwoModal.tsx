"use client";
import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { toast, Toaster } from "sonner";
import { Stepper } from "./Stepper";
import Harvest from "./addCropForms/stageTwoSteps/Harvest";
import Observation from "./addCropForms/stageTwoSteps/Observation";
import PestsDisease from "./addCropForms/stageTwoSteps/PestsDisease";
import Weather from "./addCropForms/stageTwoSteps/Weather";
import StageTwoPreview from "./StageTwoPreview";
import useApi from "@/hooks/use_api";
import StageTwoData from "./viewCropModal/StageTwoData";
import AttachmentStepOne from "./addCropForms/stageOneSteps/AttachmentStepOne";
import { Loading } from "./ui/loading";
import { useLocalization } from "@/core/context/LocalizationContext";

interface AddCropStageTwoModalProps {
  selectedCrop: any;
  onSuccess: () => void;
}

interface HarvestProductionDetail {
  harvest_production_id: number;
  production_no: number;
  production_kg: number;
  remarks: string;
}

interface HarvestMoistureDetail {
  harvest_moisture_content_id: number;
  production_no: number;
  moisture_content_per: number;
  remarks: string;
}

interface HarvestData {
  harvest_date: string;
  total_production_kg: number;
  harvest_seed_variety_observation_id: number;
  harvesting_timing_id: number;
  crop_harvest_details: { good_agricultural_practices_type_id: number }[];
  crop_harvest_production_details: HarvestProductionDetail[];
  crop_harvest_moisture_content_details: HarvestMoistureDetail[];
  seedVarietyObservation?: string;
  moisture_content_percentage: number;
  harvestingTiming?: string;
  goodPractices?: Record<string, boolean>;
  reason_for_is_manageable_harvest?: string;
}

interface PestsDiseaseData {
  pestIds: number[];
  diseaseIds: number[];
  is_manageable_harvest?: boolean;
  reason_for_is_manageable_harvest?: string;
}

interface WeatherData {
  land_weather_effect_history_id: number;
  weather_effect_type_id: number;
  weather_effect_type_name: string;
  remarks: string;
  date_from: string | "";
  date_to: string | "";
}

interface AttachmentItem {
  attachment_details_id: number;
  stage_id: number | null;
  attachment_path: string;
  remarks: string;
}

interface StageTwoData {
  harvest: HarvestData;
  pestsDisease: PestsDiseaseData;
  weather: WeatherData[];
  attachments: AttachmentItem[];
}

const AddCropStageTwoModal = ({
  selectedCrop,
  onSuccess,
}: AddCropStageTwoModalProps) => {
  const steps = [
    "Harvest",
    "Observation",
    "Pests & Disease",
    "Weather",
    "Attachments",
    "Preview",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { put } = useApi();
  const { t } = useLocalization();

  const defaultHarvest: HarvestData = {
    harvest_date: "",
    moisture_content_percentage: 0,
    total_production_kg: 0,
    harvest_seed_variety_observation_id: 0,
    harvesting_timing_id: 0,
    crop_harvest_details: [],
    crop_harvest_production_details: [],
    crop_harvest_moisture_content_details: [],
    seedVarietyObservation: "",
    harvestingTiming: "",
    goodPractices: {},
  };

  const [stageTwoData, setStageTwoData] = useState<StageTwoData>({
    harvest: defaultHarvest,
    pestsDisease: {
      pestIds: [],
      diseaseIds: [],
      is_manageable_harvest: true,
      reason_for_is_manageable_harvest: "",
    },
    weather: [],
    attachments: [],
  });
  const [pestDiseaseTouched, setPestDiseaseTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------------- Prefill Stage 2 data with stage_id validation ----------------
  useEffect(() => {
    if (!selectedCrop) return;

    const stage2Pests = (selectedCrop.crop_asset_pest_attack_details || [])
      .filter((p: any) => p.stage_id === 3)
      .map((p: any) => p.pest_attack_type_id);

    const stage2Diseases = (
      selectedCrop.crop_asset_disease_attack_details || []
    )
      .filter((d: any) => d.stage_id === 3)
      .map((d: any) => d.disease_attack_type_id);

    const stage2Weather = (selectedCrop.crop_asset_weather_effect_history || [])
      .filter((w: any) => w.stage_id === 3)
      .map((w: any) => ({
        weather_effect_type_id: w.weather_effect_type_id,
        weather_effect_type_name: w.weather_effect_type_name,
        remarks: w.remarks || "",
        date_from: w.date_from,
        date_to: w.date_to,
      }));
    console.log(stage2Weather);

    setStageTwoData((prev) => ({
      harvest: {
        ...defaultHarvest,
        ...(selectedCrop.crop_harvest_info?.[0] || {}),
        is_manageable_harvest:
          selectedCrop.crop_harvest_info?.[0]?.is_manageable_harvest ?? true,
        reason_for_is_manageable_harvest:
          selectedCrop.crop_harvest_info?.[0]
            ?.reason_for_is_manageable_harvest || "",
      },
      pestsDisease: {
        pestIds: stage2Pests.length ? stage2Pests : [],
        diseaseIds: stage2Diseases.length ? stage2Diseases : [],
        is_manageable_harvest:
          selectedCrop.crop_harvest_info?.[0]?.is_manageable_harvest ?? true,
        reason_for_is_manageable_harvest:
          selectedCrop.crop_harvest_info?.[0]
            ?.reason_for_is_manageable_harvest || "",
      },
      weather: stage2Weather.length ? stage2Weather : prev.weather || [],
      attachments: selectedCrop.crop_asset_attachment_details || [],
    }));
  }, [selectedCrop]);

  // -------------------------------------------------------------------------------

  const mapPestsDisease = (data: any) => {
    const {
      pestIds,
      diseaseIds,
      is_manageable_harvest,
      reason_for_is_manageable_harvest,
    } = data || {
      pestIds: [],
      diseaseIds: [],
      is_manageable_harvest: true,
      reason_for_is_manageable_harvest: "",
    };

    const pests = Array.isArray(pestIds)
      ? pestIds.filter(Boolean).map((id) => ({
          crop_pest_attack_id: 0,
          pest_attack_type_id: id,
          attack_date: null,
          remarks: "",
          is_manageable_harvest,
          reason_for_is_manageable_harvest,
        }))
      : [];

    const diseases = Array.isArray(diseaseIds)
      ? diseaseIds.filter(Boolean).map((id) => ({
          crop_disease_attack_id: 0,
          disease_attack_type_id: id,
          attack_date: null,
          remarks: "",
        }))
      : [];

    return { pests, diseases };
  };

  // ---------------- Correct Stage 2 weather mapping for PUT request ----------------
  // Maps weather data for PUT request
  const mapWeather = (weatherData: WeatherData[]) => {
    if (!Array.isArray(weatherData)) return [];

    return weatherData.map((w) => ({
      land_weather_effect_history_id: w.land_weather_effect_history_id || 0,
      weather_effect_type_id: w.weather_effect_type_id,
      weather_effect_type_name: w.weather_effect_type_name,
      remarks: w.remarks || "",
      date_from: w.date_from || null,
      date_to: w.date_to || null,
      is_active: true,
    }));
  };

  // -------------------------------------------------------------------------------

  const handleChange = (step: keyof StageTwoData, updatedData: any) => {
    setStageTwoData((prev) => ({ ...prev, [step]: updatedData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  // console.log(selectedCrop);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!selectedCrop) return;

      // Preventing sending name with good practices
      const cleanedHarvestDetails =
        stageTwoData.harvest.crop_harvest_details &&
        stageTwoData.harvest.crop_harvest_details.length > 0
          ? stageTwoData.harvest.crop_harvest_details.map((item) => ({
              good_agricultural_practices_type_id:
                item.good_agricultural_practices_type_id,
            }))
          : Object.entries(stageTwoData.harvest.goodPractices || {})
              .filter(([_, v]) => v)
              .map(([label]) => ({
                good_agricultural_practices_type_id: Number(label),
              }));

      const { pests, diseases } = mapPestsDisease(stageTwoData.pestsDisease);
      const weather = mapWeather(stageTwoData.weather);
      console.log(weather);

      const mergedWeather = [
        // Keep previous records that are NOT stage 3
        ...(selectedCrop.crop_asset_weather_effect_history || []).filter(
          (w: any) => w.stage_id !== 3
        ),
        // Add the current stage 3 weather data (from mapWeather)
        ...weather.map((w) => ({ ...w, stage_id: 3 })), // ensure stage_id is 3
      ];

      const payload = {
        // ...selectedCrop,

        crop_type_id: selectedCrop.crop_type_id,
        variety: selectedCrop.variety,
        season: selectedCrop.season,
        planting_date: selectedCrop.planting_date,
        harvest_date: selectedCrop.harvest_date,
        estimated_yield: 3.5,
        by_user_id: 2,
        crop_id: selectedCrop.crop_id,
        land_id: selectedCrop.land_id,
        stage_id: 3,
        crop_harvest_info: {
          harvest_date: stageTwoData.harvest.harvest_date || null,
          total_production_kg: stageTwoData.harvest.total_production_kg,
          moisture_content_percentage:
            stageTwoData.harvest.moisture_content_percentage,
          harvest_seed_variety_observation_id:
            stageTwoData.harvest.harvest_seed_variety_observation_id,
          harvesting_timing_id: stageTwoData.harvest.harvesting_timing_id,
          crop_harvest_details: cleanedHarvestDetails,
          is_manageable_harvest:
            stageTwoData.pestsDisease.is_manageable_harvest ?? true,
          reason_for_is_manageable_harvest:
            stageTwoData.pestsDisease.reason_for_is_manageable_harvest || "",
          crop_harvest_production_details:
            stageTwoData.harvest.crop_harvest_production_details,
          crop_harvest_moisture_content_details:
            stageTwoData.harvest.crop_harvest_moisture_content_details,
        },
        crop_asset_pest_attack_details: pests.map((p) => ({
          ...p,
          stage_id: 3,
        })),
        crop_asset_disease_attack_details: diseases.map((d) => ({
          ...d,
          stage_id: 3,
        })),
        crop_asset_weather_effect_history: mergedWeather,
        crop_asset_attachment_details: Array.isArray(stageTwoData.attachments)
          ? stageTwoData.attachments
          : [],
      };

      console.log("Final PUT Payload:", payload);
      const res = await put("/cms/crop-info-service/", payload, {
        params: { crop_id: selectedCrop?.crop_id },
      });
      if (res.status === "success") {
        toast.success("Stage Two data saved successfully!");
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Stage Two data.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Harvest
            data={[stageTwoData.harvest]}
            onChange={(val) => handleChange("harvest", val)}
          />
        );
      case 1:
        return (
          <Observation
            data={stageTwoData.harvest}
            onChange={(val) => handleChange("harvest", val)}
          />
        );
      case 2:
        return (
          <PestsDisease
            data={stageTwoData.pestsDisease}
            onChange={(updated) => {
              setStageTwoData((prev) => ({
                ...prev,
                pestsDisease: updated,
              }));
              setPestDiseaseTouched(true); // mark as edited
            }}
          />
        );
      case 3:
        return (
          <Weather
            data={{
              date_from: stageTwoData.weather?.[0]?.date_from || "",
              date_to: stageTwoData.weather?.[0]?.date_to || "",
              remarks: stageTwoData.weather?.[0]?.remarks || "",
              weather_effects: stageTwoData.weather.map((w) => ({
                weather_effect_type_id: w.weather_effect_type_id,
                weather_effect_type_name: w.weather_effect_type_name,
                remarks: w.remarks || "",
                is_active: true, // default true
              })),
            }}
            onChange={(updatedData) =>
              setStageTwoData((prev) => ({
                ...prev,
                weather: updatedData.weather_effects.map((w: any, i: any) => ({
                  ...prev.weather[i],
                  weather_effect_type_id: w.weather_effect_type_id,
                  weather_effect_type_name: w.weather_effect_type_name,
                  remarks: w.remarks,
                  date_from: updatedData.date_from,
                  date_to: updatedData.date_to,
                })),
              }))
            }
          />
        );

      case 4:
        return (
          <AttachmentStepOne
            stageId={3}
            data={stageTwoData.attachments}
            onChange={(d) =>
              setStageTwoData({ ...stageTwoData, attachments: d })
            }
          />
        );

      case 5:
        return (
          <StageTwoPreview
            data={stageTwoData}
            attachments={stageTwoData.attachments.filter((att: any) =>
              att.attachment_path.startsWith("data:")
            )}
          />
        );
      default:
        return null;
    }
  };

  console.log("Stage two data received from childrens", stageTwoData);

  return (
    <div>
      <div className="bg-white rounded-xl mb-4">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="overflow-y-auto bg-white">{renderStep()}</div>

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
            <IoIosArrowBack /> Prev
          </button>
        )}

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
          >
            <FaCircleCheck /> {isLoading ? t("submitting") : t("submit")}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
          >
            Next <IoIosArrowForward />
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
};

export default AddCropStageTwoModal;
