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
import PreviewSubmit from "./PreviewForm";
import useApi from "@/hooks/use_api";

interface AddCropStageTwoModalProps {
  selectedCrop: any;
  stageOneData?: any;
  onSuccess: () => void;
}

interface HarvestData {
  harvest_date: string;
  total_production_kg: number;
  moisture_content_percentage: number;
  harvest_seed_variety_observation_id: number;
  harvesting_timing_id: number;
  is_manageable_harvest: boolean;
  reason_for_is_manageable_harvest: string;
  crop_harvest_details: { good_agricultural_practices_type_id: number }[]; // <- required nested array
  // observation fields
  seedVarietyObservation?: string;
  harvestingTiming?: string;
  goodPractices?: Record<string, boolean>;
  manageable?: string;
  remarks?: string;
}

interface PestsDiseaseData {
  pestIds: number[];
  diseaseIds: number[];
}

interface StageTwoData {
  harvest: HarvestData;
  pestsDisease: PestsDiseaseData; // <-- use object, not array
  weather: any[];
}

const AddCropStageTwoModal = ({
  selectedCrop,
  onSuccess,
  stageOneData,
}: AddCropStageTwoModalProps) => {
  const steps = [
    "Harvest",
    "Observation",
    "Pests & Disease",
    "Weather",
    "Preview",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const { put } = useApi();

  const defaultHarvest: HarvestData = {
    harvest_date: "",
    total_production_kg: 0,
    moisture_content_percentage: 0,
    harvest_seed_variety_observation_id: 0,
    harvesting_timing_id: 0,
    is_manageable_harvest: true,
    reason_for_is_manageable_harvest: "",
    crop_harvest_details: [],
    seedVarietyObservation: "",
    harvestingTiming: "",
    goodPractices: {},
    manageable: "Yes",
    remarks: "",
  };

  // const [stageTwoData, setStageTwoData] = useState<StageTwoData>({
  //   harvest: defaultHarvest,
  //   pestsDisease: {
  //     pestIds:
  //       stageOneData?.crop_asset_pest_attack_details?.map(
  //         (p: any) => p.pest_attack_type_id
  //       ) || [],
  //     diseaseIds:
  //       stageOneData?.crop_asset_disease_attack_details?.map(
  //         (d: any) => d.disease_attack_type_id
  //       ) || [],
  //   },
  //   weather: stageOneData?.crop_asset_weather_effect_history || [],
  // });

  const [stageTwoData, setStageTwoData] = useState<StageTwoData>({
    harvest: defaultHarvest,
    pestsDisease: { pestIds: [], diseaseIds: [] }, // only Stage 2 IDs
    weather: [], // only Stage 2 weather
  });

  useEffect(() => {
    if (stageOneData) {
      setStageTwoData({
        harvest: {
          ...defaultHarvest,
          ...(stageOneData.crop_harvest_info || {}),
        },
        pestsDisease: { pestIds: [], diseaseIds: [] }, // empty! Stage 2 only
        weather: [], // empty! Stage 2 only
      });
    }
  }, [stageOneData]);

  // const mapPestsDisease = (data: any) => {
  //   const { pestIds, diseaseIds } = data || { pestIds: [], diseaseIds: [] };

  //   const pests = Array.isArray(pestIds)
  //     ? pestIds.filter(Boolean).map((id) => ({
  //         crop_pest_attack_id: 0,
  //         pest_attack_type_id: id,
  //         attack_date: null,
  //         remarks: "",
  //         stage_name: "Harvest and Observation",
  //       }))
  //     : [];

  //   const diseases = Array.isArray(diseaseIds)
  //     ? diseaseIds.filter(Boolean).map((id) => ({
  //         crop_disease_attack_id: 0,
  //         disease_attack_type_id: id,
  //         attack_date: null,
  //         remarks: "",
  //         stage_name: "Harvest and Observation",
  //       }))
  //     : [];

  //   return { pests, diseases };
  // };

  const mapPestsDisease = (data: any) => {
    const { pestIds, diseaseIds } = data || { pestIds: [], diseaseIds: [] };

    const pests = Array.isArray(pestIds)
      ? pestIds.filter(Boolean).map((id) => ({
          crop_pest_attack_id: 0,
          pest_attack_type_id: id,
          attack_date: null,
          remarks: "",
          stage_name: "Harvest and Observation", // ONLY for Stage 2
        }))
      : [];

    const diseases = Array.isArray(diseaseIds)
      ? diseaseIds.filter(Boolean).map((id) => ({
          crop_disease_attack_id: 0,
          disease_attack_type_id: id,
          attack_date: null,
          remarks: "",
          stage_name: "Harvest and Observation", // ONLY for Stage 2
        }))
      : [];

    return { pests, diseases };
  };

  const mapWeather = (data: any) => {
    if (!Array.isArray(data)) return [];

    return data
      .filter((w) => w && w.weather_effect_type_id)
      .map((w) => ({
        land_weather_effect_history_id: 0,
        weather_effect_type_id: w.weather_effect_type_id,
        remarks: w.remarks || "",
        is_active: true,
        date_from: w.date_from || null,
        date_to: w.date_to || null,
        stage_name: "Harvest and Observation",
      }));
  };

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

  const handleSubmit = async () => {
    try {
      if (!stageOneData) return;

      const { pests, diseases } = mapPestsDisease(stageTwoData.pestsDisease);
      const weather = mapWeather(stageTwoData.weather);

      // Merge with existing Stage 1 arrays (preserve stage 1 records)
      const mergedPests = [
        ...(stageOneData.crop_asset_pest_attack_details || []),
        ...pests,
      ];
      const mergedDiseases = [
        ...(stageOneData.crop_asset_disease_attack_details || []),
        ...diseases,
      ];
      const mergedWeather = [
        ...(stageOneData.crop_asset_weather_effect_history || []),
        ...weather,
      ];

      const payload = {
        ...stageOneData,
        stage_id: 3,
        crop_harvest_info: {
          harvest_date: stageTwoData.harvest.harvest_date,
          total_production_kg: stageTwoData.harvest.total_production_kg,
          moisture_content_percentage:
            stageTwoData.harvest.moisture_content_percentage,
          harvest_seed_variety_observation_id:
            stageTwoData.harvest.harvest_seed_variety_observation_id,
          harvesting_timing_id: stageTwoData.harvest.harvesting_timing_id,
          is_manageable_harvest: stageTwoData.harvest.is_manageable_harvest,
          reason_for_is_manageable_harvest:
            stageTwoData.harvest.reason_for_is_manageable_harvest,
          // <-- Use crop_harvest_details directly (exact backend structure).
          // If children provide crop_harvest_details, use them. Otherwise fallback to mapping goodPractices.
          crop_harvest_details:
            stageTwoData.harvest.crop_harvest_details &&
            stageTwoData.harvest.crop_harvest_details.length > 0
              ? stageTwoData.harvest.crop_harvest_details
              : Object.entries(stageTwoData.harvest.goodPractices || {})
                  .filter(([_, v]) => v)
                  .map(([label]) => ({
                    good_agricultural_practices_type_id: Number(label),
                  })),
        },
        crop_asset_pest_attack_details: mergedPests,
        crop_asset_disease_attack_details: mergedDiseases,
        crop_asset_weather_effect_history: mergedWeather,
      };

      console.log("Final PUT Payload:", payload);

      // Call API here
      await put("/cms/crop-info-service/", payload, {
        params: { crop_id: stageOneData?.crop_id },
      });

      toast.success("Stage Two data saved successfully!");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Stage Two data.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Harvest
            data={[stageTwoData.harvest]}
            onChange={(val) => handleChange("harvest", val[0])} // unwrap when updating
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
            onChange={(val) => handleChange("pestsDisease", val)}
          />
        );
      case 3:
        return (
          <Weather
            data={stageTwoData.weather}
            onChange={(val) => handleChange("weather", val)}
          />
        );
      case 4:
        return <PreviewSubmit data={stageTwoData} />;
      default:
        return null;
    }
  };

  console.log("Stage one data received in stage 2", stageOneData);
  return (
    <div>
      <div className="bg-white rounded-xl mb-4">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="overflow-y-auto bg-white rounded-b-xl p-4">
        {renderStep()}
      </div>

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
            <FaCircleCheck /> Save
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

      <Toaster richColors />
    </div>
  );
};

export default AddCropStageTwoModal;
