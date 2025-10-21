"use client";

import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";
import { Stepper } from "./Stepper";
import CropDetailsForm from "./AddCropDetails";
import PreviewSubmit from "./PreviewForm";
import Cultivation from "./addCropForms/stageOneSteps/Cultivation";
import History from "./addCropForms/stageOneSteps/History";
import Weather from "./addCropForms/stageOneSteps/Weather";
import PestsDisease from "./addCropForms/stageOneSteps/PestsDisease";
import Chemicals from "./addCropForms/stageOneSteps/Chemicals";
import { SelectedCropData } from "./addCropForms/StageOne";

// ✅ Import your new interface
import {
  CropData,
  SeedDetails,
  IrrigationCultivation,
  PreviousSeasonHistory,
  PestAttack,
  DiseaseAttack,
  ChemicalUsage,
  StageHistory,
  WeatherDetails,
} from "./model/crop/CropCoreModel";

// ✅ Default crop data following new interface
const defaultCropData: CropData = {
  season: "",
  crop_id: 0,
  land_id: 0,
  variety: "",
  crop_type_id: 0,
  planting_date: "",
  harvest_date: "",
  estimated_yield: 0,

  crop_asset_seed_details: [],
  crop_asset_irrigation_cultivation_details: [],
  crop_asset_previous_season_history_details: [],
  crop_asset_pest_attack_details: [],
  crop_asset_disease_attack_details: [],
  crop_asset_chemical_usage_details: [],
  crop_asset_stage_history_details: [],
  crop_asset_weather_details: [],
};

export default function AddCropDetailsModal({
  selectedCrop,
}: {
  selectedCrop: SelectedCropData;
}) {
  const steps = [
    "Seed",
    "Cultivation",
    "History",
    "Weather",
    "Pest & Disease",
    "Chemicals",
    "Preview",
  ];

  const storageKey = `cropFormData_${selectedCrop.crop_id}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [cropData, setCropData] = useState<CropData>(() => {
    const saved = localStorage.getItem(`${storageKey}`);
    return saved ? JSON.parse(saved) : defaultCropData;
  });
  /** ✅ Simplified handleNext (no validation) **/
  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log("Final Submitted Data:", cropData);
    toast.success("Form submitted successfully!");

    // ✅ Mark Stage One as completed in localStorage
    localStorage.setItem(`stageOneCompleted_${selectedCrop.crop_id}`, "true");

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(0);
      // setCompletedSteps(new Set());
    }, 1500);
  };

  /** ✅ Generic handler to merge step updates into full CropData **/
  const handleStepUpdate = (
    stepField: keyof CropData,
    updatedData: Partial<SeedDetails | WeatherDetails | ChemicalUsage[]>
  ) => {
    setCropData((prev) => {
      let updatedFieldValue;

      if (Array.isArray(prev[stepField])) {
        const existingArray = prev[stepField] as any[];

        // If no first item, initialize it with updatedData
        if (!existingArray[0]) {
          updatedFieldValue = [updatedData];
        } else {
          // Merge the first object with updatedData
          const updatedFirstItem = {
            ...existingArray[0],
            ...updatedData,
          };
          updatedFieldValue = [updatedFirstItem, ...existingArray.slice(1)];
        }
      } else {
        updatedFieldValue = updatedData;
      }

      const newCropData = {
        ...prev,
        [stepField]: updatedFieldValue,
      };

      localStorage.setItem(storageKey, JSON.stringify(newCropData));

      return newCropData;
    });
  };

  /* ✅ Step Rendering */
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CropDetailsForm
            data={cropData.crop_asset_seed_details?.[0] || {}}
            onChange={(updatedSeed: Partial<SeedDetails>) =>
              handleStepUpdate("crop_asset_seed_details", updatedSeed)
            }
            selectedCrop={{ ...selectedCrop }}
          />
        );
      case 1:
        return (
          <Cultivation
            data={cropData.crop_asset_irrigation_cultivation_details?.[0] || {}}
            onChange={(updatedCultivation: Partial<IrrigationCultivation>) =>
              handleStepUpdate(
                "crop_asset_irrigation_cultivation_details",
                updatedCultivation
              )
            }
          />
        );
      case 2:
        return (
          <History
            data={
              cropData.crop_asset_previous_season_history_details?.[0] || {}
            }
            onChange={(updatedHistory: Partial<PreviousSeasonHistory>) =>
              handleStepUpdate(
                "crop_asset_previous_season_history_details",
                updatedHistory
              )
            }
          />
        );
      case 3:
        return (
          <Weather
            data={cropData.crop_asset_weather_details?.[0] || {}}
            onChange={(updatedWeather: Partial<WeatherDetails>) =>
              handleStepUpdate("crop_asset_weather_details", updatedWeather)
            }
          />
        );
      case 4:
        return (
          <PestsDisease
            data={{
              pest: cropData.crop_asset_pest_attack_details?.[0] || {},
              disease: cropData.crop_asset_disease_attack_details?.[0] || {},
            }}
            onChange={(
              updatedPest: Partial<PestAttack>,
              updatedDisease: Partial<DiseaseAttack>
            ) => {
              handleStepUpdate("crop_asset_pest_attack_details", updatedPest);
              handleStepUpdate(
                "crop_asset_disease_attack_details",
                updatedDisease
              );
            }}
          />
        );
      case 5:
        return (
          <Chemicals
            data={cropData} // Pass the full CropData object
            onChange={(updatedChemicals: ChemicalUsage[]) =>
              handleStepUpdate(
                "crop_asset_chemical_usage_details",
                updatedChemicals
              )
            }
          />
        );
      case 6:
        return <PreviewSubmit data={cropData} />;
      default:
        return null;
    }
  };

  // console.log(cropData);
  return (
    <div>
      {/* Stepper */}
      <div className="bg-white rounded-xl mb-4">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Step Content */}
      <div className={`overflow-y-auto bg-white rounded-b-xl`}>
        {renderStep()}
      </div>

      {/* Buttons */}
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
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
          >
            <FaCircleCheck /> {isLoading ? "Submitting..." : "Submit"}
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
    </div>
  );
}
