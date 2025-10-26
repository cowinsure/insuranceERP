"use client";

import { useState } from "react";
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
import PreviewSubmit from "./PreviewForm";
import CropDetailsPreview from "./CropDetailsPreview";

// Define ChemicalItem for consistency
interface ChemicalItem {
  chemical_usage_id?: number;
  chemical_type_id?: number;
  chemical_name: string;
  qty: number;
  qty_unit?: string;
  remarks?: string;
}

interface WeatherEffect {
  weather_effect_type_id: number;
  remarks: string;
  is_active: boolean;
}

interface WeatherData {
  remarks?: string;
  weather_effects: WeatherEffect[];
  period_from?: string;
  period_to?: string;
}

interface AddCropData {
  seed: any[];
  cultivation: any;
  history: any;
  weather: WeatherData;
  pests: any[];
  diseases: any[];
  chemicals: {
    fertilizers: ChemicalItem[];
    pesticides: ChemicalItem[];
  };
  // 🆕 Optional preview-only fields
  pestDetails?: { id: number; name: string }[];
  diseaseDetails?: { id: number; name: string }[];
}

interface AddCropDetailsModalProps {
  crop: any;
  onClose: () => void;
}

export default function AddCropDetailsModal({
  crop: {
    crop_id: cropId,
    land_id: landId,
    crop_type_id: cropTypeId,
    estimated_yield: estimatedYield,
    planting_date: plantingDate,
    harvest_date: harvestDate,
  },
  onClose,
}: AddCropDetailsModalProps) {
  const { put } = useApi();

  const steps = [
    "Seed",
    "Cultivation",
    "History",
    "Weather",
    "Pest & Disease",
    "Chemicals",
    "Preview",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Step data state with proper chemical structure
  const [cropData, setCropData] = useState<AddCropData>({
    seed: [],
    cultivation: {},
    history: {},
    weather: {
      remarks: "",
      weather_effects: [],
      period_from: "",
      period_to: "",
    },
    pests: [],
    diseases: [],
    chemicals: { fertilizers: [], pesticides: [] },
  });

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Build payload
      const payload = {
        crop_id: cropId,
        land_id: landId, // replace with actual land_id if available
        crop_type_id: cropTypeId, // replace with actual crop_type_id
        variety: "",
        season: "",
        planting_date: plantingDate,
        harvest_date: harvestDate,
        estimated_yield: estimatedYield,

        crop_asset_seed_details: cropData.seed.map((s) => ({
          seed_id: s.seed_id || 0,
          seed_common_name: s.seed_common_name,
          seed_variety_id: s.seed_variety_id,
          seed_company_name: s.seed_company_name,
          seed_company_type_id: s.seed_company_type_id,
          seed_type_id: s.seed_type_id,
        })),

        crop_asset_irrigation_cultivation_details: [
          {
            irrigation_cultivation_id: 0,
            irrigation_facility_id: cropData.cultivation.irrigation_facility_id,
            irrigation_source_id: cropData.cultivation.irrigation_source_id,
            cultivation_system_id: cropData.cultivation.cultivation_system_id,
            land_suitability_id: cropData.cultivation.land_suitability_id,
          },
        ],

        crop_asset_previous_season_history_details: [
          {
            previous_season_history_id: 0,
            immediate_previous_crop: cropData.history.immediate_previous_crop,
            harvest_date: cropData.history.harvest_date,
            last_year_crop_type_id: cropData.history.last_year_crop_type_id,
            last_year_production: cropData.history.last_year_production,
            sowing_date: cropData.history.sowing_date,
            seed_used_last_year: cropData.history.seed_used_last_year,
            reason_for_changing_seed: cropData.history.reason_for_changing_seed,
          },
        ],
        crop_asset_weather_effect_history: Array.isArray(
          cropData.weather.weather_effects
        )
          ? cropData.weather.weather_effects.map((w: WeatherEffect) => ({
              land_weather_effect_history_id: 0,
              weather_effect_type_id: w.weather_effect_type_id,
              remarks: cropData.weather.remarks || w.remarks || "",
              is_active: true,
            }))
          : [],

        crop_asset_pest_attack_details: cropData.pests.map((id) => ({
          crop_pest_attack_id: 0,
          pest_attack_type_id: id,
          attack_date: null,
          remarks: "",
        })),

        crop_asset_disease_attack_details: cropData.diseases.map((id) => ({
          crop_disease_attack_id: 0,
          disease_attack_type_id: id,
          attack_date: null,
          remarks: "",
        })),

        crop_asset_chemical_usage_details: [
          ...(cropData.chemicals.fertilizers || []).map((c) => ({
            chemical_usage_id: 0,
            chemical_type_id: 1,
            chemical_name: c.chemical_name,
            qty: c.qty,
            qty_unit: c.qty_unit,
            remarks: c.remarks,
          })),
          ...(cropData.chemicals.pesticides || []).map((c) => ({
            chemical_usage_id: 0,
            chemical_type_id: 2,
            chemical_name: c.chemical_name,
            qty: c.qty,
            qty_unit: c.qty_unit,
            remarks: c.remarks,
          })),
        ],
      };
      await put("/cms/crop-info-service/", payload, {
        params: { crop_id: cropId },
      });
      toast.success("Crop data submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit crop data");
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CropDetailsForm
            selectedCropId={cropId}
            data={cropData.seed}
            onChange={(d) => setCropData({ ...cropData, seed: d })}
          />
        );
      case 1:
        return (
          <IrrigationCultivation
            data={cropData.cultivation}
            onChange={(d) => setCropData({ ...cropData, cultivation: d })}
          />
        );
      case 2:
        return (
          <History
            data={cropData.history}
            onChange={(d) => setCropData({ ...cropData, history: d })}
          />
        );
      case 3:
        return (
          <Weather
            data={cropData.weather}
            onChange={(d) => setCropData({ ...cropData, weather: d })}
          />
        );
      case 4:
        return (
          <PestsDisease
            data={{ pestIds: cropData.pests, diseaseIds: cropData.diseases }}
            onChange={(p, d, pestDetails, diseaseDetails) => {
              setCropData({
                ...cropData,
                pests: p,
                diseases: d,
                pestDetails, // optional, for preview
                diseaseDetails, // optional, for preview
              });
            }}
          />
        );

      case 5:
        return (
          <Chemicals
            data={cropData.chemicals} // ✅ always object with 2 arrays
            onChange={(d) => setCropData({ ...cropData, chemicals: d })}
          />
        );

      case 6:
        return <CropDetailsPreview data={cropData} />;
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

      <div className="overflow-y-auto bg-white rounded-b-xl">
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
