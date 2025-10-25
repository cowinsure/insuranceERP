// "use client";

// import { useState, useEffect } from "react";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { FaCircleCheck } from "react-icons/fa6";
// import { toast } from "sonner";
// import { Stepper } from "./Stepper";
// import CropDetailsForm from "./SeedDetails";
// import PreviewSubmit from "./PreviewForm";
// import Cultivation from "./addCropForms/stageOneSteps/Cultivation";
// import History from "./addCropForms/stageOneSteps/History";
// import Chemicals from "./addCropForms/stageOneSteps/Chemicals";
// import PestsDisease from "./addCropForms/stageOneSteps/PestsDisease";
// import Weather from "./addCropForms/stageOneSteps/Weather";

// import useApi from "@/hooks/use_api";
// import {
//   CropData,
//   IrrigationCultivation,
//   PreviousSeasonHistory,
//   ChemicalUsage,
//   PestAttack,
//   DiseaseAttack,
// } from "./model/crop/CropCoreModel";
// import { CropRegisterData } from "./model/crop/CropRegisterModel";

// const defaultDate = new Date().toISOString();

// export const defaultCropData: CropRegisterData = {
//   land_id: 0,
//   crop_type_id: 0,
//   variety: "",
//   season: "",
//   planting_date: defaultDate,
//   harvest_date: defaultDate,
//   estimated_yield: 0,
//   created_at: defaultDate,

//   crop_asset_seed_details: [
//     {
//       seed_id: 0,
//       seed_common_name: "",
//       seed_variety_id: 0,
//       seed_company_name: "",
//       seed_company_type_id: 0,
//       seed_type_id: 0,
//       created_at: defaultDate,
//       created_by: 0,
//     },
//   ],
//   crop_asset_chemical_usage_details: [
//     {
//       chemical_type_id: 0,
//       chemical_name: "",
//       qty: 0,
//       qty_unit: "kg",
//       remarks: "",
//       created_at: defaultDate,
//       created_by: 0,
//     },
//   ],
//   crop_asset_disease_attack_details: [
//     {
//       disease_attack_type_id: 0,
//       attack_date: defaultDate,
//       remarks: "",
//       created_at: defaultDate,
//       created_by: 0,
//     },
//   ],
//   crop_asset_irrigation_cultivation_details: [
//     {
//       irrigation_facility_id: 0,
//       irrigation_source_id: 0,
//       cultivation_system_id: 0,
//       land_suitability_id: 0,
//       created_at: defaultDate,
//       created_by: 0,
//     },
//   ],
//   crop_asset_pest_attack_details: [
//     {
//       pest_attack_type_id: 0,
//       attack_date: defaultDate,
//       remarks: "",
//       created_at: defaultDate,
//       created_by: 0,
//     },
//   ],
//   crop_asset_previous_season_history_details: [
//     {
//       immediate_previous_crop: "",
//       harvest_date: defaultDate,
//       last_year_crop_type_id: 0,
//       last_year_production: 0,
//       sowing_date: defaultDate,
//       seed_used_last_year: "",
//       reason_for_changing_seed: "",
//       created_at: defaultDate,
//       created_by: 0,
//     },
//   ],
//   crop_asset_weather_effect_history: [
//     {
//       weather_effect_type_id: 0,
//       remarks: "",
//     },
//   ],
// };

// export default function AddCropDetailsModal({
//   selectedCrop,
// }: {
//   selectedCrop: CropData;
// }) {
//   const steps = [
//     "Seed",
//     "Cultivation",
//     "History",
//     "Weather",
//     "Pest & Disease",
//     "Chemicals",
//     "Preview",
//   ];

//   const { get, put } = useApi();

//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
//   const [isLoading, setIsLoading] = useState(false);
//   const [cropData, setCropData] = useState<CropRegisterData>(defaultCropData);

//   const storageKey = `stageOneCompleted_${selectedCrop.crop_id}`;

//   useEffect(() => {
//     fetchCropData();
//   }, [selectedCrop.crop_id]);

//   const fetchCropData = async () => {
//     try {
//       const res = await get("/cms/crop-info-service/", {
//         params: {
//           start_record: 1,
//           page_size: 10,
//           crop_id: `${selectedCrop.crop_id}`,
//         },
//       });

//       if (res.status === "success" && Array.isArray(res.data?.data)) {
//         const apiData: CropData = res.data.data[0];

//         const converted: CropRegisterData = {
//           ...defaultCropData,
//           land_id: apiData.land_id,
//           crop_type_id: apiData.crop_type_id,
//           variety: apiData.variety,
//           season: apiData.season,
//           planting_date: apiData.planting_date,
//           harvest_date: apiData.harvest_date,
//           estimated_yield: apiData.estimated_yield,
//           created_at: apiData.created_at || defaultDate,

//           crop_asset_seed_details:
//             apiData.crop_asset_seed_details?.map((s) => ({
//               seed_id: s.seed_id,
//               seed_common_name: s.seed_common_name,
//               seed_variety_id: s.seed_variety_id,
//               seed_company_name: s.seed_company_name,
//               seed_company_type_id: s.seed_company_type_id,
//               seed_type_id: s.seed_type_id,
//               created_at: s.created_at || defaultDate,
//               created_by: 0,
//             })) || defaultCropData.crop_asset_seed_details,

//           crop_asset_irrigation_cultivation_details:
//             apiData.crop_asset_irrigation_cultivation_details?.map((i) => ({
//               irrigation_facility_id: i.irrigation_facility_id,
//               irrigation_source_id: i.irrigation_source_id,
//               cultivation_system_id: i.cultivation_system_id,
//               land_suitability_id: i.land_suitability_id,
//               created_at: i.created_at || defaultDate,
//               created_by: 0,
//             })) || defaultCropData.crop_asset_irrigation_cultivation_details,

//           crop_asset_previous_season_history_details:
//             apiData.crop_asset_previous_season_history_details?.map((h) => ({
//               immediate_previous_crop: h.immediate_previous_crop,
//               harvest_date: h.harvest_date,
//               last_year_crop_type_id: h.last_year_crop_type_id,
//               last_year_production: h.last_year_production,
//               sowing_date: h.sowing_date,
//               seed_used_last_year: h.seed_used_last_year,
//               reason_for_changing_seed: h.reason_for_changing_seed,
//               created_at: h.created_at || defaultDate,
//               created_by: 0,
//             })) || defaultCropData.crop_asset_previous_season_history_details,

//           crop_asset_weather_effect_history:
//             apiData.crop_asset_weather_effect_history ||
//             defaultCropData.crop_asset_weather_effect_history,

//           crop_asset_pest_attack_details:
//             apiData.crop_asset_pest_attack_details?.map((p) => ({
//               pest_attack_type_id: p.pest_attack_type_id,
//               attack_date: p.attack_date,
//               remarks: p.remarks,
//               created_at: p.created_at || defaultDate,
//               created_by: 0,
//               pest_attack_observations_type_name:
//                 p.pest_attack_observations_type_name ?? [],
//             })) || defaultCropData.crop_asset_pest_attack_details,

//           crop_asset_disease_attack_details:
//             apiData.crop_asset_disease_attack_details?.map((d) => ({
//               disease_attack_type_id: d.disease_attack_type_id,
//               attack_date: d.attack_date,
//               remarks: d.remarks,
//               created_at: d.created_at || defaultDate,
//               created_by: 0,
//               disease_attack_observations_type_name:
//                 d.disease_attack_observations_type_name ?? [],
//             })) || defaultCropData.crop_asset_disease_attack_details,

//           crop_asset_chemical_usage_details:
//             apiData.crop_asset_chemical_usage_details?.map((c) => ({
//               chemical_type_id: c.chemical_type_id,
//               chemical_name: c.chemical_name,
//               qty: c.qty,
//               qty_unit: c.qty_unit,
//               remarks: c.remarks,
//               created_at: c.created_at || defaultDate,
//               created_by: 0,
//             })) || defaultCropData.crop_asset_chemical_usage_details,
//         };

//         setCropData(converted);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load crop data");
//     }
//   };

//   const handleStepSave = async () => {
//     try {
//       const payload = {
//         crop_id: selectedCrop.crop_id,
//         land_id: selectedCrop.land_id,
//         crop_type_id: selectedCrop.crop_type_id,
//         variety: selectedCrop.variety || cropData.variety,
//         season: cropData.season,
//         planting_date: cropData.planting_date,
//         harvest_date: cropData.harvest_date,
//         estimated_yield: cropData.estimated_yield,
//         by_user_id: 0,

//         crop_asset_seed_details: cropData.crop_asset_seed_details,
//         crop_asset_irrigation_cultivation_details:
//           cropData.crop_asset_irrigation_cultivation_details,
//         crop_asset_previous_season_history_details:
//           cropData.crop_asset_previous_season_history_details,
//         crop_asset_weather_effect_history:
//           cropData.crop_asset_weather_effect_history,
//         crop_asset_pest_attack_details: cropData.crop_asset_pest_attack_details,
//         crop_asset_disease_attack_details:
//           cropData.crop_asset_disease_attack_details,
//         crop_asset_chemical_usage_details:
//           cropData.crop_asset_chemical_usage_details,
//       };

//       // console.log("Saving full payload:", payload);
//       const res = await put(`/cms/crop-info-service`, payload, {
//         params: { crop_id: `${selectedCrop.crop_id}` },
//       });

//       if (res.status === "success") toast.success("Data saved successfully!");
//       else toast.error("Failed to save data");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error while saving data");
//     }
//   };

//   const handleNext = async () => {
//     await handleStepSave();
//     setCompletedSteps((prev) => new Set(prev).add(currentStep));
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//   };

//   const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       await handleStepSave();
//       toast.success("Crop data submitted successfully!");
//       localStorage.setItem(storageKey, "true");
//     } catch {
//       toast.error("Submission failed");
//     } finally {
//       setIsLoading(false);
//       setCurrentStep(0);
//     }
//   };

//   const handleStepUpdate = (
//     stepField: keyof CropRegisterData,
//     updatedData: any
//   ) => {
//     setCropData((prev) => ({
//       ...prev,
//       [stepField]: Array.isArray(updatedData) ? updatedData : [updatedData],
//     }));
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <CropDetailsForm
//             data={cropData.crop_asset_seed_details[0]}
//             onChange={(u) => handleStepUpdate("crop_asset_seed_details", u)}
//             selectedCrop={selectedCrop}
//           />
//         );

//       case 1:
//         const cultivation: IrrigationCultivation = {
//           crop_id: selectedCrop.crop_id,
//           crop_name: selectedCrop.crop_asset_irrigation_cultivation_details?.[0]?.crop_name || "",
//           land_name: selectedCrop.crop_asset_irrigation_cultivation_details?.[0]?.land_name || "",
//           stage_name: "",
//           farmer_name: "",
//           modified_at: "",
//           mobile_number: "",
//           irrigation_cultivation_id: 0,
//           irrigation_source: "",
//           irrigation_facility: "",
//           crop_land_suitability_name: "",
//           crop_cultivation_system_name: "",
//           ...cropData.crop_asset_irrigation_cultivation_details[0],
//           created_at: defaultDate,
//         };
//         return (
//           <Cultivation
//             data={cultivation}
//             onChange={(u) =>
//               handleStepUpdate("crop_asset_irrigation_cultivation_details", u)
//             }
//           />
//         );

//       case 2:
//         const history: PreviousSeasonHistory = {
//           crop_id: selectedCrop.crop_id,
//           crop_name: selectedCrop.crop_asset_previous_season_history_details?.[0]?.crop_name || "",
//           land_name: selectedCrop.crop_asset_previous_season_history_details?.[0]?.land_name || "",
//           stage_name: "",
//           farmer_name: "",
//           modified_at: "",
//           mobile_number: "",
//           previous_season_history_id: 0,
//           last_year_crop_type_name: "",
//           ...cropData.crop_asset_previous_season_history_details[0],
//         };
//         return (
//           <History
//             data={history}
//             onChange={(u) =>
//               handleStepUpdate("crop_asset_previous_season_history_details", u)
//             }
//           />
//         );

//       case 3:
//         return (
//           <Weather
//             data={cropData.crop_asset_weather_effect_history[0]}
//             onChange={(u) =>
//               handleStepUpdate("crop_asset_weather_effect_history", u)
//             }
//           />
//         );

//       case 4:
//         return (
//           <PestsDisease
//             data={{
//               pest: cropData.crop_asset_pest_attack_details[0] || {},
//               disease: cropData.crop_asset_disease_attack_details[0] || {},
//             }}
//             onChange={(p: Partial<PestAttack>, d: Partial<DiseaseAttack>) => {
//               handleStepUpdate("crop_asset_pest_attack_details", p ? [p] : []);
//               handleStepUpdate("crop_asset_disease_attack_details", d ? [d] : []);
//             }}
//           />
//         );

//       case 5:
//         return (
//           <Chemicals
//             cropMeta={selectedCrop}
//             chemicals={cropData.crop_asset_chemical_usage_details.map((c) => ({
//               ...c,
//               crop_id: selectedCrop.crop_id,
//               crop_name: selectedCrop.crop_asset_chemical_usage_details?.[0].crop_name || "",
//               land_name: selectedCrop.crop_asset_chemical_usage_details?.[0].land_name || "",
//               farmer_name: selectedCrop.crop_asset_chemical_usage_details?.[0].farmer_name || "",
//               mobile_number: selectedCrop.crop_asset_chemical_usage_details?.[0].mobile_number || "",
//               modified_at: c.created_at || "",
//               stage_name: "",
//             }))}
//             onChange={(u) =>
//               handleStepUpdate("crop_asset_chemical_usage_details", u)
//             }
//           />
//         );

//       case 6:
//         return <PreviewSubmit data={cropData} />;

//       default:
//         return "";
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white rounded-xl mb-4">
//         <Stepper
//           steps={steps}
//           currentStep={currentStep}
//           completedSteps={completedSteps}
//         />
//       </div>

//       <div className="overflow-y-auto bg-white rounded-b-xl">
//         {renderStep()}
//       </div>

//       <div
//         className={`flex mt-4 ${
//           currentStep === 0 ? "justify-end" : "justify-between"
//         }`}
//       >
//         {currentStep !== 0 && (
//           <button
//             onClick={handlePrev}
//             className="cursor-pointer px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1"
//           >
//             <IoIosArrowBack /> Prev
//           </button>
//         )}

//         {currentStep === steps.length - 1 ? (
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
//           >
//             <FaCircleCheck /> {isLoading ? "Submitting..." : "Submit"}
//           </button>
//         ) : (
//           <button
//             onClick={handleNext}
//             className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1"
//           >
//             Next <IoIosArrowForward />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// Fresh start
"use client";

import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";

import { Stepper } from "./Stepper";
import SeedDetails from "./SeedDetails";
import Cultivation from "./addCropForms/stageOneSteps/IrrigationCultivation";
import History from "./addCropForms/stageOneSteps/History";
import Chemicals from "./addCropForms/stageOneSteps/Chemicals";
import PestsDisease from "./addCropForms/stageOneSteps/PestsDisease";
import Weather from "./addCropForms/stageOneSteps/Weather";
import PreviewSubmit from "./PreviewForm";

import {
  CropData,
  SeedDetails as SeedDetailsType,
  IrrigationCultivation,
  PreviousSeasonHistory,
  CropAssetWeatherEffectHistory,
  ChemicalUsage,
} from "./model/crop/CropCoreModel";
import useApi from "@/hooks/use_api";

interface AddCropDetailsModalProps {
  selectedCrop: CropData;
  onSuccess?: () => void;
}

interface EditableCropData {
  seed?: Partial<SeedDetailsType>;
  cultivation?: Partial<IrrigationCultivation>[];
  history?: Partial<PreviousSeasonHistory>[];
  weather?: Partial<CropAssetWeatherEffectHistory>;
  pests?: { id: number; label: string }[];
  diseases?: { id: number; label: string }[];
  fertilizers?: (Partial<ChemicalUsage> & { qty?: number | string })[];
  pesticides?: (Partial<ChemicalUsage> & { qty?: number | string })[];
  season?: string;
  crop_id?: number;
  land_id?: number;
  variety?: string;
  planting_date?: string;
  harvest_date?: string;
  estimated_yield?: number | string;
  crop_type_id?: number;
}

export default function AddCropDetailsModal({
  onSuccess,
  selectedCrop,
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

  const [cropData, setCropData] = useState<EditableCropData>({
    seed: selectedCrop?.crop_asset_seed_details?.[0] || {},
    cultivation: selectedCrop?.crop_asset_irrigation_cultivation_details || [],
    history: selectedCrop?.crop_asset_previous_season_history_details || [],
    weather: selectedCrop?.crop_asset_weather_effect_history?.[0] || {},
    pests:
      selectedCrop?.crop_asset_pest_attack_details?.map((p) => ({
        id: p?.pest_attack_type_id ?? 0,
        // label: p.pest_attack_observations_type_name ?? "",
        label: p?.remarks ?? "", //wrong field used temporarily
      })) || [],
    diseases:
      selectedCrop?.crop_asset_disease_attack_details?.map((d) => ({
        id: d?.disease_attack_type_id ?? 0,
        // label: d.disease_attack_observations_type_name ?? "",
        label: d?.remarks ?? "", //wrong field used temporarily
      })) || [],
    fertilizers:
      selectedCrop?.crop_asset_chemical_usage_details
        ?.filter((c) => c?.chemical_type_id === 1)
        .map((c) => ({ ...c })) || [],
    pesticides:
      selectedCrop?.crop_asset_chemical_usage_details
        ?.filter((c) => c?.chemical_type_id === 2)
        .map((c) => ({ ...c })) || [],
    season: selectedCrop?.season,
    crop_id: selectedCrop?.crop_id,
    land_id: selectedCrop?.land_id,
    variety: selectedCrop?.variety,
    planting_date: selectedCrop?.planting_date,
    harvest_date: selectedCrop?.harvest_date,
    estimated_yield: selectedCrop?.estimated_yield,
    crop_type_id: selectedCrop?.crop_type_id,
  });

  // Helper: builds a clean preview object from cropData (user edits) falling back to selectedCrop (original)
  const buildPreviewData = (data: EditableCropData | undefined) => {
    // safe local references
    const sel = selectedCrop || ({} as CropData);

    const commonName =
      data?.seed?.seed_common_name ??
      sel?.crop_asset_seed_details?.[0]?.seed_common_name ??
      "";
    const variety =
      data?.seed?.seed_variety ??
      sel?.crop_asset_seed_details?.[0]?.seed_variety ??
      "";
    const seedCompanyName =
      data?.seed?.seed_company_name ??
      sel?.crop_asset_seed_details?.[0]?.seed_company_name ??
      "";
    const seedCompanyTypeName =
      data?.seed?.seed_company_type_name ??
      sel?.crop_asset_seed_details?.[0]?.seed_company_type_name ??
      "";
    const seedTypeName =
      data?.seed?.seed_type_name ??
      sel?.crop_asset_seed_details?.[0]?.seed_type_name ??
      "";

    const cultivationArr = data?.cultivation?.length
      ? data.cultivation.map((c) => ({
          irrigation_facility:
            (c as any)?.irrigation_facility ||
            (c as any)?.irrigation_facility_name ||
            "",
          irrigation_source:
            (c as any)?.irrigation_source ||
            (c as any)?.irrigation_source_name ||
            "",
          crop_cultivation_system_name:
            (c as any)?.crop_cultivation_system_name || "",
          crop_land_suitability_name:
            (c as any)?.crop_land_suitability_name || "",
        }))
      : sel?.crop_asset_irrigation_cultivation_details?.map((c) => ({
          irrigation_facility: (c as any)?.irrigation_facility_name || "",
          irrigation_source: (c as any)?.irrigation_source_name || "",
          crop_cultivation_system_name:
            (c as any)?.crop_cultivation_system_name || "",
          crop_land_suitability_name:
            (c as any)?.crop_land_suitability_name || "",
        })) || [];

    const historyArr = data?.history?.length
      ? data.history.map((h) => ({
          immediate_previous_crop: (h as any)?.immediate_previous_crop || "",
          last_year_crop_type_name: (h as any)?.last_year_crop_type_name || "",
          last_year_production: (h as any)?.last_year_production ?? "",
          sowing_date: (h as any)?.sowing_date || "",
          harvest_date: (h as any)?.harvest_date || "",
          seed_used_last_year: (h as any)?.seed_used_last_year || "",
          reason_for_changing_seed: (h as any)?.reason_for_changing_seed || "",
        }))
      : sel?.crop_asset_previous_season_history_details?.map((h) => ({
          immediate_previous_crop: (h as any)?.immediate_previous_crop || "",
          last_year_crop_type_name: (h as any)?.last_year_crop_type_name || "",
          last_year_production: (h as any)?.last_year_production ?? "",
          sowing_date: (h as any)?.sowing_date || "",
          harvest_date: (h as any)?.harvest_date || "",
          seed_used_last_year: (h as any)?.seed_used_last_year || "",
          reason_for_changing_seed: (h as any)?.reason_for_changing_seed || "",
        })) || [];

    const weatherObj = {
      period_from:
        data?.weather?.period_from ??
        sel?.crop_asset_weather_effect_history?.[0]?.period_from ??
        "",
      period_to:
        data?.weather?.period_to ??
        sel?.crop_asset_weather_effect_history?.[0]?.period_to ??
        "",
      weather_effect_type_name:
        data?.weather?.weather_effect_type_name ??
        sel?.crop_asset_weather_effect_history?.[0]?.weather_effect_type_name ??
        "",
      remarks:
        data?.weather?.remarks ??
        sel?.crop_asset_weather_effect_history?.[0]?.remarks ??
        "",
    };

    const pestsArr =
      (data?.pests ?? []).length > 0
        ? (data?.pests ?? []).map((p) => p.label)
        : sel?.crop_asset_pest_attack_details?.map((p) => p?.remarks || "") ||
          [];

    const diseasesArr =
      (data?.diseases ?? []).length > 0
        ? (data?.diseases ?? []).map((d) => d.label)
        : sel?.crop_asset_disease_attack_details?.map(
            (d) => d?.remarks || ""
          ) || [];

    const fertilizersArr =
      (data?.fertilizers ?? []).length > 0
        ? (data?.fertilizers ?? []).map((f) => ({
            chemical_name: f?.chemical_name || "",
            qty: f?.qty ?? "",
            qty_unit: f?.qty_unit || "kg",
            remarks: f?.remarks || "",
          }))
        : sel?.crop_asset_chemical_usage_details
            ?.filter((c) => c?.chemical_type_id === 1)
            .map((c) => ({
              chemical_name: c?.chemical_name || "",
              qty: c?.qty ?? "",
              qty_unit: c?.qty_unit || "kg",
              remarks: c?.remarks || "",
            })) || [];

    const pesticidesArr =
      (data?.pesticides ?? []).length > 0
        ? (data?.pesticides ?? []).map((p) => ({
            chemical_name: p?.chemical_name || "",
            qty: p?.qty ?? "",
            qty_unit: p?.qty_unit || "kg",
            remarks: p?.remarks || "",
          }))
        : sel?.crop_asset_chemical_usage_details
            ?.filter((c) => c?.chemical_type_id === 2)
            .map((c) => ({
              chemical_name: c?.chemical_name || "",
              qty: c?.qty ?? "",
              qty_unit: c?.qty_unit || "kg",
              remarks: c?.remarks || "",
            })) || [];

    return {
      seed: [
        {
          common_name: commonName,
          variety: variety,
          company_name: seedCompanyName,
          company_type_name: seedCompanyTypeName,
          type_name: seedTypeName,
        },
      ],
      cultivation: cultivationArr,
      history: historyArr,
      weather: weatherObj,
      pests: pestsArr,
      diseases: diseasesArr,
      fertilizers: fertilizersArr,
      pesticides: pesticidesArr,
    };
  };

  const [previewData, setPreviewData] = useState(() =>
    buildPreviewData(cropData)
  );

  // Keep previewData in sync whenever cropData or selectedCrop updates
  useEffect(() => {
    setPreviewData(buildPreviewData(cropData));
  }, [cropData, selectedCrop]);

  useEffect(() => {
    if (!selectedCrop) return;

    setCropData({
      seed: selectedCrop.crop_asset_seed_details?.[0] || {},
      cultivation: selectedCrop.crop_asset_irrigation_cultivation_details || [],
      history: selectedCrop.crop_asset_previous_season_history_details || [],
      weather: selectedCrop.crop_asset_weather_effect_history?.[0] || {},
      pests:
        selectedCrop.crop_asset_pest_attack_details?.map((p) => ({
          id: p?.pest_attack_type_id ?? 0,
          // label: p.pest_attack_observations_type_name ?? "",
          label: p?.remarks ?? "", // temporary field
        })) || [],
      diseases:
        selectedCrop.crop_asset_disease_attack_details?.map((d) => ({
          id: d?.disease_attack_type_id ?? 0,
          // label: d.disease_attack_observations_type_name ?? "",
          label: d?.remarks ?? "", // temporary field
        })) || [],
      fertilizers:
        selectedCrop.crop_asset_chemical_usage_details
          ?.filter((c) => c?.chemical_type_id === 1)
          .map((c) => ({ ...c })) || [],
      pesticides:
        selectedCrop.crop_asset_chemical_usage_details
          ?.filter((c) => c?.chemical_type_id === 2)
          .map((c) => ({ ...c })) || [],
      season: selectedCrop.season,
      crop_id: selectedCrop.crop_id,
      land_id: selectedCrop.land_id,
      variety: selectedCrop.variety,
      planting_date: selectedCrop.planting_date,
      harvest_date: selectedCrop.harvest_date,
      estimated_yield: selectedCrop.estimated_yield,
      crop_type_id: selectedCrop.crop_type_id,
    });
  }, [selectedCrop]);

  const storageKey = `stageOneCompleted_${selectedCrop?.crop_id ?? "unknown"}`;

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Start with full backend object, keep master data from selectedCrop
      const payload = {
        crop_id: selectedCrop.crop_id,
        land_id: selectedCrop.land_id,
        crop_type_id: selectedCrop.crop_type_id,
        variety: selectedCrop.variety,
        season: selectedCrop.season,
        planting_date: selectedCrop.planting_date,
        harvest_date: selectedCrop.harvest_date,
        estimated_yield: selectedCrop.estimated_yield,

        // Seed
        crop_asset_seed_details: [
          {
            ...selectedCrop.crop_asset_seed_details?.[0],
            seed_common_name: cropData.seed?.seed_common_name || "",
            seed_variety_id: cropData.seed?.seed_variety_id ?? null,
            seed_company_name: cropData.seed?.seed_company_name || "",
            seed_company_type_id: cropData.seed?.seed_company_type_id
              ? Number(cropData.seed.seed_company_type_id)
              : undefined, // or remove the field if empty

            seed_type_id: cropData.seed?.seed_type_id ?? null,
          },
        ],

        // Cultivation
        crop_asset_irrigation_cultivation_details: cropData.cultivation?.length
          ? cropData.cultivation.map((c) => ({
              ...selectedCrop.crop_asset_irrigation_cultivation_details?.[0],
              ...c,
            }))
          : selectedCrop.crop_asset_irrigation_cultivation_details,

        // Previous Season History
        // crop_asset_previous_season_history_details: cropData.history?.length
        //   ? cropData.history.map((h) => ({
        //       ...selectedCrop.crop_asset_previous_season_history_details?.[0],
        //       ...h,
        //     }))
        //   : selectedCrop.crop_asset_previous_season_history_details,

        // For the moment upper one is the correct one
        crop_asset_previous_season_history_details: cropData.history?.length
          ? cropData.history.map((h) => ({
              ...selectedCrop.crop_asset_previous_season_history_details?.[0],
              immediate_previous_crop: h.immediate_previous_crop || "",
              last_year_crop_type_name:
                h.last_year_crop_type_name ??
                selectedCrop.crop_asset_previous_season_history_details?.[0]
                  ?.last_year_crop_type_name ??
                null,
              last_year_production: h.last_year_production ?? null,
              sowing_date: h.sowing_date || "",
              harvest_date: h.harvest_date || "",
              seed_used_last_year: h.seed_used_last_year || "",
              reason_for_changing_seed: h.reason_for_changing_seed || "",
            }))
          : selectedCrop.crop_asset_previous_season_history_details,

        // Weather
        crop_asset_weather_effect_history: [
          {
            ...selectedCrop.crop_asset_weather_effect_history?.[0],
            ...cropData.weather,
          },
        ],

        // ✅ Pests & Diseases (updated)
        crop_asset_pest_attack_details: cropData.pests?.length
          ? cropData.pests.map((p) => ({
              ...selectedCrop.crop_asset_pest_attack_details?.[0],
              pest_attack_observations_type_name: p.label,
              pest_attack_type_id: p.id,
              remarks: null,
            }))
          : selectedCrop.crop_asset_pest_attack_details,

        crop_asset_disease_attack_details: cropData.diseases?.length
          ? cropData.diseases.map((d) => ({
              ...selectedCrop.crop_asset_disease_attack_details?.[0],
              disease_attack_observations_type_name: d.label,
              disease_attack_type_id: d.id,
              remarks: null,
            }))
          : selectedCrop.crop_asset_disease_attack_details,

        // Chemicals: fertilizers + pesticides
        crop_asset_chemical_usage_details: [
          ...(cropData.fertilizers?.map((f) => ({
            ...f,
            chemical_type_id: 1,
            qty_unit: f.qty_unit ?? "kg",
            qty: f.qty,
          })) || []),
          ...(cropData.pesticides?.map((p) => ({
            ...p,
            chemical_type_id: 2,
            qty_unit: p.qty_unit ?? "kg",
            qty: p.qty,
          })) || []),
        ],
      };

      const res = await put("/cms/crop-info-service", payload, {
        params: { asset_id: `${selectedCrop.crop_id}` },
      });
      if (res.status === "success" && onSuccess) {
        onSuccess();
      }
      toast.success("Crop data submitted successfully!");
      localStorage.setItem(storageKey, "true");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SeedDetails
            value={cropData.seed || {}}
            onChange={(newData) => {
              setCropData((prev) => ({
                ...prev,
                seed: { ...prev.seed, ...newData },
              }));
            }}
          />
        );

      case 1:
        return (
          <Cultivation
            selectedCrop={selectedCrop}
            value={cropData.cultivation || []}
            onChange={(newData) => {
              setCropData((prev) => ({ ...prev, cultivation: newData }));
            }}
          />
        );

      case 2:
        return (
          <History
            selectedCrop={selectedCrop}
            value={cropData.history || []}
            onChange={(newData) => {
              setCropData((prev) => ({ ...prev, history: newData }));
            }}
          />
        );

      case 3:
        return (
          <Weather
            value={cropData.weather || {}}
            onChange={(newData) => {
              setCropData((prev) => ({
                ...prev,
                weather: { ...prev.weather, ...newData },
              }));
            }}
          />
        );

      //  Pests & Diseases Step
      case 4:
        return (
          <PestsDisease
            value={{
              pests: cropData.pests || [],
              diseases: cropData.diseases || [],
            }}
            onChange={({ pests, diseases }) => {
              setCropData((prev) => ({
                ...prev,
                pests,
                diseases,
              }));
            }}
          />
        );

      case 5:
        return (
          <Chemicals
            value={{
              fertilizers: cropData.fertilizers || [],
              pesticides: cropData.pesticides || [],
            }}
            onChange={({ fertilizers, pesticides }) => {
              const updatedFert = fertilizers as (
                | Partial<ChemicalUsage>
                | { qty?: number }
              )[];
              const updatedPest = pesticides as (
                | Partial<ChemicalUsage>
                | { qty?: number }
              )[];

              setCropData((prev) => ({
                ...prev,
                fertilizers: updatedFert.map((f) => ({ ...f })),
                pesticides: updatedPest.map((p) => ({ ...p })),
              }));
            }}
          />
        );

      case 6:
        return <PreviewSubmit data={previewData} />;

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
