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

import { useState } from "react";
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
  PestAttack,
  DiseaseAttack,
  ChemicalUsage,
} from "./model/crop/CropCoreModel";
import { Select } from "react-day-picker";

interface AddCropDetailsModalProps {
  selectedCrop: CropData;
}

export default function AddCropDetailsModal({
  selectedCrop,
}: AddCropDetailsModalProps) {
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

  // ✅ Use Partial<> for editable form state
  const [cropData, setCropData] = useState<{
    crop_asset_seed_details?: Partial<SeedDetailsType>[];
    crop_asset_irrigation_cultivation_details?: Partial<IrrigationCultivation>[];
    crop_asset_previous_season_history_details?: Partial<PreviousSeasonHistory>[];
    crop_asset_weather_effect_history?: Partial<CropAssetWeatherEffectHistory>[];
    crop_asset_pest_attack_details?: Partial<PestAttack>[];
    crop_asset_disease_attack_details?: Partial<DiseaseAttack>[];
    crop_asset_chemical_usage_details?: Partial<ChemicalUsage>[];
    season?: string;
    crop_id?: number;
    land_id?: number;
    variety?: string;
    planting_date?: string;
    harvest_date?: string;
    estimated_yield?: number;
    crop_type_id?: number;
  }>({
    crop_asset_seed_details: selectedCrop.crop_asset_seed_details || [],
    crop_asset_irrigation_cultivation_details:
      selectedCrop.crop_asset_irrigation_cultivation_details || [],
    crop_asset_previous_season_history_details:
      selectedCrop.crop_asset_previous_season_history_details || [],
    crop_asset_weather_effect_history:
      selectedCrop.crop_asset_weather_effect_history || [],
    crop_asset_pest_attack_details:
      selectedCrop.crop_asset_pest_attack_details || [],
    crop_asset_disease_attack_details:
      selectedCrop.crop_asset_disease_attack_details || [],
    crop_asset_chemical_usage_details:
      selectedCrop.crop_asset_chemical_usage_details || [],
    season: selectedCrop.season,
    crop_id: selectedCrop.crop_id,
    land_id: selectedCrop.land_id,
    variety: selectedCrop.variety,
    planting_date: selectedCrop.planting_date,
    harvest_date: selectedCrop.harvest_date,
    estimated_yield: selectedCrop.estimated_yield,
    crop_type_id: selectedCrop.crop_type_id,
  });

  const storageKey = `stageOneCompleted_${selectedCrop.crop_id}`;

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      // Normally, API call goes here
      toast.success("Crop data submitted successfully!");
      localStorage.setItem(storageKey, "true");
    } catch {
      toast.error("Submission failed");
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  console.log("CropData", cropData);
  console.log("SelectedCrop", selectedCrop);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SeedDetails
            selectedCrop={selectedCrop}
            value={cropData.crop_asset_seed_details?.[0] || {}}
            onChange={(newData: Partial<SeedDetailsType>) =>
              setCropData((prev) => ({
                ...prev,
                crop_asset_seed_details: [newData],
              }))
            }
          />
        );

      case 1:
        return (
          <Cultivation
            selectedCrop={selectedCrop}
            value={cropData.crop_asset_irrigation_cultivation_details || []}
            onChange={(newData) =>
              setCropData((prev) => ({
                ...prev,
                crop_asset_irrigation_cultivation_details: newData,
              }))
            }
          />
        );

      case 2:
        return (
          <History
            selectedCrop={selectedCrop}
            value={cropData.crop_asset_previous_season_history_details || []}
            onChange={(newData) =>
              setCropData((prev) => ({
                ...prev,
                crop_asset_previous_season_history_details: newData,
              }))
            }
          />
        );

      case 3:
        return (
          <Weather
            value={cropData.crop_asset_weather_effect_history?.[0] || {}}
            onChange={(newData) =>
              setCropData((prev) => ({
                ...prev,
                crop_asset_weather_effect_history: [newData],
              }))
            }
          />
        );

      case 4:
        return (
          <PestsDisease
            value={{
              pests:
                (cropData.crop_asset_pest_attack_details
                  ?.map((p) => p.pest_attack_observations_type_name)
                  .filter(Boolean) as string[]) || [],
              diseases:
                (cropData.crop_asset_disease_attack_details
                  ?.map((d) => d.disease_attack_observations_type_name)
                  .filter(Boolean) as string[]) || [],
            }}
            onChange={({ pests, diseases }) =>
              setCropData((prev) => ({
                ...prev,
                crop_asset_pest_attack_details: pests.map((name) => ({
                  pest_attack_observations_type_name: name,
                })),
                crop_asset_disease_attack_details: diseases.map((name) => ({
                  disease_attack_observations_type_name: name,
                })),
              }))
            }
          />
        );

      case 5:
        return (
          <Chemicals
            value={{
              fertilizers:
                cropData.crop_asset_chemical_usage_details
                  ?.filter((c) => c.chemical_type_id === 1)
                  .map((c) => ({
                    ...c,
                    qty: typeof c.qty === "number" ? c.qty : undefined,
                    chemical_name: c.chemical_name || "",
                    qty_unit: c.qty_unit || "",
                    remarks: c.remarks || "",
                  })) || [],
              pesticides:
                cropData.crop_asset_chemical_usage_details
                  ?.filter((c) => c.chemical_type_id === 2)
                  .map((c) => ({
                    ...c,
                    qty: typeof c.qty === "number" ? c.qty : undefined,
                    chemical_name: c.chemical_name || "",
                    qty_unit: c.qty_unit || "",
                    remarks: c.remarks || "",
                  })) || [],
            }}
            onChange={({ fertilizers, pesticides }) =>
              setCropData((prev) => ({
                ...prev,
                crop_asset_chemical_usage_details: [
                  ...fertilizers.map((f) => ({
                    ...f,
                    chemical_type_id: 1,
                    qty:
                      typeof f.qty === "number"
                        ? f.qty
                        : f.qty === "" || f.qty === undefined
                        ? undefined
                        : Number(f.qty),
                  })),
                  ...pesticides.map((p) => ({
                    ...p,
                    chemical_type_id: 2,
                    qty:
                      typeof p.qty === "number"
                        ? p.qty
                        : p.qty === "" || p.qty === undefined
                        ? undefined
                        : Number(p.qty),
                  })),
                ] as Partial<ChemicalUsage>[],
              }))
            }
          />
        );

      case 6:
        return (
          <PreviewSubmit
            data={{
              seed: {
                seed_common_name:
                  cropData.crop_asset_seed_details?.[0]?.seed_common_name || "",
                seed_variety:
                  cropData.crop_asset_seed_details?.[0]?.seed_variety || "",
                seed_company_name:
                  cropData.crop_asset_seed_details?.[0]?.seed_company_name ||
                  "",
                seed_company_typ_ide:
                  cropData.crop_asset_seed_details?.[0]?.seed_company_type_id ||
                  "",
                seed_type_id:
                  cropData.crop_asset_seed_details?.[0]?.seed_type_id || "",
              },
              cultivation:
                cropData.crop_asset_irrigation_cultivation_details?.map(
                  (c) => ({
                    irrigation_facility: c.irrigation_facility || "",
                    irrigation_source: c.irrigation_source || "",
                    crop_cultivation_system_name:
                      c.crop_cultivation_system_name || "",
                    crop_land_suitability_name:
                      c.crop_land_suitability_name || "",
                  })
                ) || [],
              history:
                cropData.crop_asset_previous_season_history_details?.map(
                  (h) => ({
                    immediate_previous_crop: h.immediate_previous_crop || "",
                    last_year_crop_type_name: h.last_year_crop_type_name || "",
                    last_year_production: h.last_year_production || "",
                    sowing_date: h.sowing_date || "",
                    harvest_date: h.harvest_date || "",
                    seed_used_last_year: h.seed_used_last_year || "",
                    reason_for_changing_seed: h.reason_for_changing_seed || "",
                  })
                ) || [],
              weather: {
                rainfall:
                  (cropData.crop_asset_weather_effect_history?.[0] as any)
                    ?.rainfall || "",
                temperature:
                  (cropData.crop_asset_weather_effect_history?.[0] as any)
                    ?.temperature || "",
                humidity:
                  (cropData.crop_asset_weather_effect_history?.[0] as any)
                    ?.humidity || "",
                notes:
                  (cropData.crop_asset_weather_effect_history?.[0] as any)
                    ?.notes || "",
              },

              pests_disease: {
                pests:
                  (cropData.crop_asset_pest_attack_details
                    ?.map((p) => p.pest_attack_observations_type_name)
                    .filter(Boolean) as string[]) || [],
                diseases:
                  (cropData.crop_asset_disease_attack_details
                    ?.map((d) => d.disease_attack_observations_type_name)
                    .filter(Boolean) as string[]) || [],
              },
              chemicals: {
                fertilizers:
                  cropData.crop_asset_chemical_usage_details
                    ?.filter((c) => c.chemical_type_id === 1)
                    .map((f) => ({
                      chemical_name: f.chemical_name || "",
                      qty: typeof f.qty === "number" ? f.qty : "",
                      qty_unit: f.qty_unit || "",
                      remarks: f.remarks || "",
                    })) || [],
                pesticides:
                  cropData.crop_asset_chemical_usage_details
                    ?.filter((c) => c.chemical_type_id === 2)
                    .map((p) => ({
                      chemical_name: p.chemical_name || "",
                      qty: typeof p.qty === "number" ? p.qty : "",
                      qty_unit: p.qty_unit || "",
                      remarks: p.remarks || "",
                    })) || [],
              },
            }}
          />
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
