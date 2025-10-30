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

interface AddCropStageTwoModalProps {
  selectedCrop: any;
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
  crop_harvest_details: { good_agricultural_practices_type_id: number }[];
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

  const [stageTwoData, setStageTwoData] = useState<StageTwoData>({
    harvest: selectedCrop?.crop_harvest_info || defaultHarvest,
    pestsDisease: { pestIds: [], diseaseIds: [] }, // <-- object
    weather: selectedCrop?.crop_asset_weather_effect_history || [],
  });

  useEffect(() => {
    if (selectedCrop) {
      setStageTwoData({
        harvest: selectedCrop.crop_harvest_info
          ? { ...defaultHarvest, ...selectedCrop.crop_harvest_info }
          : defaultHarvest,
        pestsDisease: selectedCrop.crop_asset_pest_attack_details || [],
        weather: selectedCrop.crop_asset_weather_effect_history || [],
      });
    }
  }, [selectedCrop]);

  useEffect(() => {
    if (selectedCrop) {
      setStageTwoData({
        harvest: selectedCrop.crop_harvest_info
          ? { ...defaultHarvest, ...selectedCrop.crop_harvest_info }
          : defaultHarvest,
        pestsDisease: {
          pestIds:
            selectedCrop.crop_asset_pest_attack_details?.map(
              (p: any) => p.pest_attack_type_id
            ) || [],
          diseaseIds:
            selectedCrop.crop_asset_disease_attack_details?.map(
              (d: any) => d.disease_attack_type_id
            ) || [],
        },
        weather: selectedCrop.crop_asset_weather_effect_history || [],
      });
    }
  }, [selectedCrop]);

  const mapPestsDisease = (data: any) => {
    const { pestIds, diseaseIds } = data || { pestIds: [], diseaseIds: [] };

    const pests = Array.isArray(pestIds)
      ? pestIds.filter(Boolean).map((id) => ({
          crop_pest_attack_id: 0,
          pest_attack_type_id: id,
          attack_date: null,
          remarks: "",
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
      if (!selectedCrop) return;

      const { pests, diseases } = mapPestsDisease(stageTwoData.pestsDisease);
      const weather = mapWeather(stageTwoData.weather);

      const payload = {
        ...selectedCrop, // preserve Stage 1 data
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
          crop_harvest_details: Object.entries(
            stageTwoData.harvest.goodPractices || {}
          )
            .filter(([_, v]) => v)
            .map(([label]) => ({
              good_agricultural_practices_type_id: Number(label),
            })),
        },
        crop_asset_pest_attack_details: pests,
        crop_asset_disease_attack_details: diseases,
        crop_asset_weather_effect_history: weather,
      };

      console.log("Final PUT Payload:", payload);

      // Call API here
      // await put("/your-api-endpoint", payload);

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
