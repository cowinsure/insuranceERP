// "use client";

// import { useState } from "react";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { FaCircleCheck } from "react-icons/fa6";
// import { toast } from "sonner";
// import { Stepper } from "./Stepper";
// import CropDetailsForm from "./AddCropDetails";
// import PreviewSubmit from "./PreviewForm";
// import Cultivation from "./addCropForms/stageOneSteps/Cultivation";
// import History from "./addCropForms/stageOneSteps/History";
// import Weather from "./addCropForms/stageOneSteps/Weather";
// import PestsDisease from "./addCropForms/stageOneSteps/PestsDisease";
// import Chemicals from "./addCropForms/stageOneSteps/Chemicals";
// import { SelectedCropData } from "./addCropForms/StageOne";
// import { CropRegisterData } from "./model/crop/CropRegisterModel";

// const defaultDate = new Date().toISOString();

// // ✅ Default crop data following new interface
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
//   selectedCrop: SelectedCropData;
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

//   const storageKey = `cropFormData_${selectedCrop.crop_id}`;
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
//   const [isLoading, setIsLoading] = useState(false);
//   const [cropData, setCropData] = useState<CropRegisterData>(() => {
//     const saved = localStorage.getItem(`${storageKey}`);
//     return saved ? JSON.parse(saved) : defaultCropData;
//   });
//   /** ✅ Simplified handleNext (no validation) **/
//   const handleNext = () => {
//     setCompletedSteps((prev) => new Set(prev).add(currentStep));
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//   };

//   const handlePrev = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     console.log("Final Submitted Data:", cropData);
//     toast.success("Form submitted successfully!");

//     // ✅ Mark Stage One as completed in localStorage
//     localStorage.setItem(`stageOneCompleted_${selectedCrop.crop_id}`, "true");

//     setTimeout(() => {
//       setIsLoading(false);
//       setCurrentStep(0);
//       // setCompletedSteps(new Set());
//     }, 1500);
//   };

//   /** ✅ Generic handler to merge step updates into full CropData **/
//   // const handleStepUpdate = (
//   //   stepField: keyof CropData,
//   //   updatedData: Partial<SeedDetails | WeatherDetails | ChemicalUsage[]>
//   // ) => {
//   //   setCropData((prev) => {
//   //     let updatedFieldValue;

//   //     if (Array.isArray(prev[stepField])) {
//   //       const existingArray = prev[stepField] as any[];

//   //       // If no first item, initialize it with updatedData
//   //       if (!existingArray[0]) {
//   //         updatedFieldValue = [updatedData];
//   //       } else {
//   //         // Merge the first object with updatedData
//   //         const updatedFirstItem = {
//   //           ...existingArray[0],
//   //           ...updatedData,
//   //         };
//   //         updatedFieldValue = [updatedFirstItem, ...existingArray.slice(1)];
//   //       }
//   //     } else {
//   //       updatedFieldValue = updatedData;
//   //     }

//   //     const newCropData = {
//   //       ...prev,
//   //       [stepField]: updatedFieldValue,
//   //     };

//   //     localStorage.setItem(storageKey, JSON.stringify(newCropData));

//   //     return newCropData;
//   //   });
//   // };

//   const handleStepUpdate = (stepField: keyof CropRegisterData, updatedData: any) => {
//     setCropData((prev) => {
//       let updatedFieldValue;

//       // If updatedData is an array, replace whole array
//       if (Array.isArray(updatedData)) {
//         updatedFieldValue = updatedData;
//       } else if (Array.isArray(prev[stepField])) {
//         const existingArray = prev[stepField] as any[];

//         if (!existingArray[0]) {
//           updatedFieldValue = [updatedData];
//         } else {
//           const updatedFirstItem = {
//             ...existingArray[0],
//             ...updatedData,
//           };
//           updatedFieldValue = [updatedFirstItem, ...existingArray.slice(1)];
//         }
//       } else {
//         updatedFieldValue = updatedData;
//       }

//       const newCropData = {
//         ...prev,
//         [stepField]: updatedFieldValue,
//       };

//       localStorage.setItem(storageKey, JSON.stringify(newCropData));

//       return newCropData;
//     });
//   };

//   /* ✅ Step Rendering */
//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <CropDetailsForm
//             data={cropData.crop_asset_seed_details?.[0] || {}}
//             onChange={(updatedSeed: Partial<SeedDetails>) =>
//               handleStepUpdate("crop_asset_seed_details", updatedSeed)
//             }
//             selectedCrop={{ ...selectedCrop }}
//           />
//         );
//       case 1:
//         return (
//           <Cultivation
//             data={cropData.crop_asset_irrigation_cultivation_details?.[0] || {}}
//             onChange={(updatedCultivation: Partial<IrrigationCultivation>) =>
//               handleStepUpdate(
//                 "crop_asset_irrigation_cultivation_details",
//                 updatedCultivation
//               )
//             }
//           />
//         );
//       case 2:
//         return (
//           <History
//             data={
//               cropData.crop_asset_previous_season_history_details?.[0] || {}
//             }
//             onChange={(updatedHistory: Partial<PreviousSeasonHistory>) =>
//               handleStepUpdate(
//                 "crop_asset_previous_season_history_details",
//                 updatedHistory
//               )
//             }
//           />
//         );
//       case 3:
//         return (
//           <Weather
//             data={cropData.crop_asset_weather_details?.[0] || {}}
//             onChange={(updatedWeather: Partial<WeatherDetails>) =>
//               handleStepUpdate("crop_asset_weather_details", updatedWeather)
//             }
//           />
//         );
//       case 4:
//         return (
//           <PestsDisease
//             data={{
//               pest: cropData.crop_asset_pest_attack_details?.[0] || {},
//               disease: cropData.crop_asset_disease_attack_details?.[0] || {},
//             }}
//             onChange={(
//               updatedPest: Partial<PestAttack>,
//               updatedDisease: Partial<DiseaseAttack>
//             ) => {
//               handleStepUpdate("crop_asset_pest_attack_details", updatedPest);
//               handleStepUpdate(
//                 "crop_asset_disease_attack_details",
//                 updatedDisease
//               );
//             }}
//           />
//         );
//       case 5:
//         return (
//           <Chemicals
//             data={cropData} // Pass the full CropData object
//             onChange={(updatedChemicals: ChemicalUsage[]) =>
//               handleStepUpdate(
//                 "crop_asset_chemical_usage_details",
//                 updatedChemicals
//               )
//             }
//           />
//         );
//       case 6:
//         return <PreviewSubmit data={cropData} />;
//       default:
//         return null;
//     }
//   };

//   // console.log(cropData);
//   return (
//     <div>
//       {/* Stepper */}
//       <div className="bg-white rounded-xl mb-4">
//         <Stepper
//           steps={steps}
//           currentStep={currentStep}
//           completedSteps={completedSteps}
//         />
//       </div>

//       {/* Step Content */}
//       <div className={`overflow-y-auto bg-white rounded-b-xl`}>
//         {renderStep()}
//       </div>

//       {/* Buttons */}
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

"use client";

import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";
import { Stepper } from "./Stepper";
import CropDetailsForm from "./AddCropDetails";
import PreviewSubmit from "./PreviewForm";
import Cultivation from "./addCropForms/stageOneSteps/Cultivation";
import { SelectedCropData } from "./addCropForms/StageOne";
import {
  CropAssetSeedDetail,
  CropRegisterData,
} from "./model/crop/CropRegisterModel";
import {
  ChemicalUsage,
  CropData,
  IrrigationCultivation,
  PreviousSeasonHistory,
} from "./model/crop/CropCoreModel";
import useApi from "@/hooks/use_api";
import History from "./addCropForms/stageOneSteps/History";
import Chemicals from "./addCropForms/stageOneSteps/Chemicals";
import PestsDisease from "./addCropForms/stageOneSteps/PestsDisease";
import Weather from "./addCropForms/stageOneSteps/Weather";

const defaultDate = new Date().toISOString();

export const defaultCropData: CropRegisterData = {
  land_id: 0,
  crop_type_id: 0,
  variety: "",
  season: "",
  planting_date: defaultDate,
  harvest_date: defaultDate,
  estimated_yield: 0,
  created_at: defaultDate,

  crop_asset_seed_details: [
    {
      seed_id: 0,
      seed_common_name: "",
      seed_variety_id: 0,
      seed_company_name: "",
      seed_company_type_id: 0,
      seed_type_id: 0,
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_chemical_usage_details: [
    {
      chemical_type_id: 0,
      chemical_name: "",
      qty: 0,
      qty_unit: "kg",
      remarks: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_disease_attack_details: [
    {
      disease_attack_type_id: 0,
      attack_date: defaultDate,
      remarks: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_irrigation_cultivation_details: [
    {
      irrigation_facility_id: 0,
      irrigation_source_id: 0,
      cultivation_system_id: 0,
      land_suitability_id: 0,
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_pest_attack_details: [
    {
      pest_attack_type_id: 0,
      attack_date: defaultDate,
      remarks: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_previous_season_history_details: [
    {
      immediate_previous_crop: "",
      harvest_date: defaultDate,
      last_year_crop_type_id: 0,
      last_year_production: 0,
      sowing_date: defaultDate,
      seed_used_last_year: "",
      reason_for_changing_seed: "",
      created_at: defaultDate,
      created_by: 0,
    },
  ],
  crop_asset_weather_effect_history: [
    {
      weather_effect_type_id: 0,
      remarks: "",
    },
  ],
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

  const { get } = useApi();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [cropData, setCropData] = useState<CropRegisterData>(defaultCropData);

  const storageKey = `stageOneCompleted_${selectedCrop.crop_id}`;

  // GET cropData
  useEffect(() => {
    fetchCropData();
  }, [selectedCrop.crop_id]);

  const fetchCropData = async () => {
    try {
      const res = await get("/cms/crop-info-service/", {
        params: {
          start_record: 1,
          page_size: 10,
          crop_id: `${selectedCrop.crop_id}`,
        },
      });

      if (res.status === "success" && Array.isArray(res.data?.data)) {
        const apiData: CropData = res.data.data[0];

        const converted: CropRegisterData = {
          ...defaultCropData,
          land_id: apiData.land_id,
          crop_type_id: apiData.crop_type_id,
          variety: apiData.variety,
          season: apiData.season,
          planting_date: apiData.planting_date,
          harvest_date: apiData.harvest_date,
          estimated_yield: apiData.estimated_yield,
          created_at: apiData.created_at || defaultDate,

          crop_asset_seed_details:
            apiData.crop_asset_seed_details?.map((s) => ({
              seed_id: s.seed_id,
              seed_common_name: s.seed_common_name,
              seed_variety_id: s.seed_variety_id,
              seed_company_name: s.seed_company_name,
              seed_company_type_id: s.seed_company_type_id,
              seed_type_id: s.seed_type_id,
              created_at: s.created_at || defaultDate,
              created_by: 0, // default
            })) || defaultCropData.crop_asset_seed_details,

          crop_asset_irrigation_cultivation_details:
            apiData.crop_asset_irrigation_cultivation_details?.map((i) => ({
              irrigation_facility_id: i.irrigation_facility_id,
              irrigation_source_id: i.irrigation_source_id,
              cultivation_system_id: i.cultivation_system_id,
              land_suitability_id: i.land_suitability_id,
              created_at: i.created_at || defaultDate,
              created_by: 0,
            })) || defaultCropData.crop_asset_irrigation_cultivation_details,

          crop_asset_previous_season_history_details:
            apiData.crop_asset_previous_season_history_details?.map((h) => ({
              immediate_previous_crop: h.immediate_previous_crop,
              harvest_date: h.harvest_date,
              last_year_crop_type_id: h.last_year_crop_type_id,
              last_year_production: h.last_year_production,
              sowing_date: h.sowing_date,
              seed_used_last_year: h.seed_used_last_year,
              reason_for_changing_seed: h.reason_for_changing_seed,
              created_at: h.created_at || defaultDate,
              created_by: 0,
            })) || defaultCropData.crop_asset_previous_season_history_details,

          crop_asset_weather_effect_history:
            defaultCropData.crop_asset_weather_effect_history, // fill default since CropData doesn’t have it

          crop_asset_pest_attack_details:
            apiData.crop_asset_pest_attack_details?.map((p) => ({
              pest_attack_type_id: p.pest_attack_type_id,
              attack_date: p.attack_date,
              remarks: p.remarks,
              created_at: p.created_at || defaultDate,
              created_by: 0, // default
            })) || defaultCropData.crop_asset_pest_attack_details,

          crop_asset_disease_attack_details:
            apiData.crop_asset_disease_attack_details?.map((d) => ({
              disease_attack_type_id: d.disease_attack_type_id,
              attack_date: d.attack_date,
              remarks: d.remarks,
              created_at: d.created_at || defaultDate,
              created_by: 0,
            })) || defaultCropData.crop_asset_disease_attack_details,

          crop_asset_chemical_usage_details:
            apiData.crop_asset_chemical_usage_details?.map((c) => ({
              chemical_type_id: c.chemical_type_id,
              chemical_name: c.chemical_name,
              qty: c.qty,
              qty_unit: c.qty_unit,
              remarks: c.remarks,
              created_at: c.created_at || defaultDate,
              created_by: 0,
            })) || defaultCropData.crop_asset_chemical_usage_details,
        };

        setCropData(converted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load crop data");
    }
  };

  /** ✅ Step control **/
  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  /** ✅ Only store completion flag, no crop data in localStorage **/
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("Final Submitted Data:", cropData);

      // Your POST request here
      // await fetch(`/api/crop/register`, { method: "POST", body: JSON.stringify(cropData) });

      localStorage.setItem(storageKey, "true");
      toast.success("Crop data submitted successfully!");
    } catch {
      toast.error("Submission failed");
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  /** ✅ Merge step data with existing state **/
  const handleStepUpdate = (
    stepField: keyof CropRegisterData,
    updatedData: any
  ) => {
    setCropData((prev) => {
      if (!prev || typeof prev !== "object") return prev;

      const prevValue = prev[stepField];

      let updatedFieldValue: any;

      if (Array.isArray(prevValue)) {
        if (Array.isArray(updatedData)) {
          updatedFieldValue = updatedData;
        } else if (prevValue.length === 0) {
          updatedFieldValue = [updatedData];
        } else {
          const base =
            typeof prevValue[0] === "object" && prevValue[0] !== null
              ? prevValue[0]
              : {};
          const patch =
            typeof updatedData === "object" && updatedData !== null
              ? updatedData
              : {};
          updatedFieldValue = [{ ...base, ...patch }];
        }
      } else {
        const base =
          typeof prevValue === "object" && prevValue !== null ? prevValue : {};
        const patch =
          typeof updatedData === "object" && updatedData !== null
            ? updatedData
            : {};
        updatedFieldValue = { ...base, ...patch };
      }

      return { ...prev, [stepField]: updatedFieldValue };
    });
  };

  /** ✅ Step renderer **/
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Seed
        return (
          <CropDetailsForm
            data={cropData.crop_asset_seed_details[0]}
            onChange={(updatedSeed) =>
              handleStepUpdate("crop_asset_seed_details", updatedSeed)
            }
            selectedCrop={selectedCrop}
          />
        );

      case 1: // Cultivation
        const cultivationData: IrrigationCultivation = {
          crop_id: selectedCrop.crop_id,
          crop_name: selectedCrop.crop_name || "",
          land_name: selectedCrop.land_name || null,
          stage_name: null,
          farmer_name: null,
          modified_at: null,
          mobile_number: null,
          irrigation_cultivation_id: 0,
          irrigation_source: "",
          irrigation_facility: "",
          crop_land_suitability_name: null,
          crop_cultivation_system_name: "",
          ...cropData.crop_asset_irrigation_cultivation_details[0],
        };
        return (
          <Cultivation
            data={cultivationData}
            onChange={(updated) =>
              handleStepUpdate(
                "crop_asset_irrigation_cultivation_details",
                updated
              )
            }
          />
        );

      case 2: // History
        const historyData: PreviousSeasonHistory = {
          crop_id: selectedCrop.crop_id,
          crop_name: selectedCrop.crop_name || "",
          land_name: selectedCrop.land_name || null,
          stage_name: null,
          farmer_name: null,
          modified_at: null,
          mobile_number: null,
          previous_season_history_id: 0,
          last_year_crop_type_name: "",
          ...cropData.crop_asset_previous_season_history_details[0],
        };
        return (
          <History
            data={historyData}
            onChange={(updatedHistory) =>
              handleStepUpdate(
                "crop_asset_previous_season_history_details",
                updatedHistory
              )
            }
          />
        );

      case 3: // Chemicals
        const chemicalData: ChemicalUsage = {
          crop_id: selectedCrop.crop_id,
          crop_name: selectedCrop.crop_name || "",
          land_name: selectedCrop.land_name || null,
          stage_name: null,
          farmer_name: null,
          modified_at: null,
          mobile_number: null,
          chemical_usage_id: 0,
          ...cropData.crop_asset_chemical_usage_details[0],
        };
        return (
          <Chemicals
            chemicals={cropData.crop_asset_chemical_usage_details}
            cropMeta={{
              crop_name: selectedCrop.crop_name || "",
              land_name: selectedCrop.land_name || "",
              farmer_name: selectedCrop.farmer_name || "",
              mobile_number: selectedCrop.mobile_number || "",
            }}
            onChange={(updatedChemicals) =>
              handleStepUpdate(
                "crop_asset_chemical_usage_details",
                updatedChemicals
              )
            }
          />
        );

      case 4: // Pests & Disease
        return (
          <PestsDisease
            data={{
              pest: cropData.crop_asset_pest_attack_details[0] || {},
              disease: cropData.crop_asset_disease_attack_details[0] || {},
            }}
            onChange={(updatedPest, updatedDisease) => {
              // Wrap in array if your state expects an array
              handleStepUpdate("crop_asset_pest_attack_details", [updatedPest]);
              handleStepUpdate("crop_asset_disease_attack_details", [
                updatedDisease,
              ]);
            }}
          />
        );

      case 5: // Weather
        return (
          <Weather
            data={cropData.crop_asset_weather_effect_history[0]}
            onChange={(updatedWeather) =>
              handleStepUpdate(
                "crop_asset_weather_effect_history",
                updatedWeather
              )
            }
          />
        );

      case 6: // Preview
        return <PreviewSubmit data={cropData} />;

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
