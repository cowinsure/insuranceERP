// "use client";

// import { useState } from "react";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { FaCircleCheck } from "react-icons/fa6";
// import { toast } from "sonner";
// import { Stepper } from "../Stepper";
// import PreviewSubmit from "../PreviewForm";
// import Harvest from "./stageTwoSteps/Harvest";
// import Observation from "./stageTwoSteps/Observation";
// import Weather from "./stageTwoSteps/Weather";
// import PestsDisease from "./stageOneSteps/PestsDisease";
// import { CropData } from "../model/crop/CropCoreModel";

// export interface StageTwoData {
//   harvestDate: string;
//   totalProduction: string;
//   moistureContent: string;
//   observationData: {
//     seedVarietyObservation: string;
//     goodPractices: string;
//     manageable: string;
//     harvestingTiming: string;
//   };
//   pestAttack: {
//     stemBorer: boolean;
//     leafFolder: boolean;
//     brownPlanthopper: boolean;
//     greenLeafhopper: boolean;
//     stinkBug: boolean;
//     others: boolean;
//     none: boolean;
//   };
//   diseaseAttack: {
//     leafBlast: boolean;
//     bacterialLeafBlight: boolean;
//     sheathBlight: boolean;
//     bakanae: boolean;
//     brownSpot: boolean;
//     leafScald: boolean;
//     hispa: boolean;
//     tungro: boolean;
//     none: boolean;
//   };
//   adverseWeatherEffects: {
//     flood: boolean;
//     drought: boolean;
//     excessRainfall: boolean;
//     storms: boolean;
//     hailstorm: boolean;
//   };
//   periodFrom: string;
//   periodTo: string;
// }

// const defaultStageTwo: StageTwoData = {
//   harvestDate: "",
//   totalProduction: "",
//   moistureContent: "",
//   observationData: {
//     seedVarietyObservation: "",
//     goodPractices: "",
//     manageable: "",
//     harvestingTiming: "",
//   },
//   pestAttack: {
//     stemBorer: false,
//     leafFolder: false,
//     brownPlanthopper: false,
//     greenLeafhopper: false,
//     stinkBug: false,
//     others: false,
//     none: false,
//   },
//   diseaseAttack: {
//     leafBlast: false,
//     bacterialLeafBlight: false,
//     sheathBlight: false,
//     bakanae: false,
//     brownSpot: false,
//     leafScald: false,
//     hispa: false,
//     tungro: false,
//     none: false,
//   },
//   adverseWeatherEffects: {
//     flood: false,
//     drought: false,
//     excessRainfall: false,
//     storms: false,
//     hailstorm: false,
//   },
//   periodFrom: "",
//   periodTo: "",
// };

// interface StageTwoProps {
//   selectedCrop: CropData;
//   setStageTwoData: React.Dispatch<React.SetStateAction<any>>;
//   onSubmit?: () => void;
// }

// const StageTwo = ({
//   selectedCrop,
//   setStageTwoData,
//   onSubmit,
// }: StageTwoProps) => {
//   const steps = [
//     "Harvest",
//     "Observation",
//     "Pests & Disease",
//     "Weather",
//     "Preview",
//   ];
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState<StageTwoData>(defaultStageTwo);

//   const handleNext = () => {
//     setCompletedSteps((prev) => new Set(prev).add(currentStep));
//     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//   };

//   const handlePrev = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//   };

//   const handleSubmit = () => {
//     setIsLoading(true);
//     toast.success("Stage Two submitted successfully!");

//     // Send data upward
//     // setStageTwoData((prev: any) => ({
//     //   ...prev,
//     //   [selectedCrop.crop_name]: data,
//     // }));

//     // Optional: mark complete in localStorage
//     // localStorage.setItem(`stageTwoCompleted_${selectedCrop.crop_name}`, "true");

//     setTimeout(() => {
//       setIsLoading(false);
//       onSubmit?.();
//     }, 1500);
//   };

//   const handleChange = (field: keyof StageTwoData, value: any) => {
//     setData((prev) => {
//       const updated = { ...prev };

//       if (typeof value === "object" && !Array.isArray(value) && field in prev) {
//         updated[field] = { ...(prev[field] as object), ...value };
//       } else {
//         updated[field] = value;
//       }

//       return updated;
//     });
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return <Harvest data={data} onChange={handleChange} />;
//       case 1:
//         return <Observation data={data} onChange={handleChange} />;
//       case 2:
//         return (
//           <PestsDisease
//             value={{
//               pests: data.pestAttack || [],
//               diseases: data.diseaseAttack || [],
//             }}
//             onChange={({ pests, diseases }) => {
//               setCropData((prev) => ({
//                 ...prev,
//                 pests,
//                 diseases,
//               }));
//             }}
//           />
//         );
//       case 3:
//         return <Weather data={data} onChange={handleChange} />;
//       case 4:
//         return <PreviewSubmit data={{ data }} />;
//       default:
//         return null;
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
// };

// export default StageTwo;

// Data for training
"use client";

import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { Stepper } from "../Stepper";
import PreviewSubmit from "../PreviewForm";
import Harvest from "./stageTwoSteps/Harvest";
import Observation from "./stageTwoSteps/Observation";
import Weather from "./stageTwoSteps/Weather";
import { CropData } from "../model/crop/CropGetModel";
import PestsDisease from "./stageTwoSteps/PestsDisease";
import { toast, Toaster } from "sonner";

export interface StageTwoData {
  harvestDate: string;
  totalProduction: string;
  moistureContent: string;
  observationData: {
    seedVarietyObservation: string;
    goodPractices: string;
    manageable: string;
    harvestingTiming: string;
  };
  pestAttack: Record<string, boolean>;
  diseaseAttack: Record<string, boolean>;
  adverseWeatherEffects: Record<string, boolean>;
  periodFrom: string;
  periodTo: string;
}

const defaultStageTwo: StageTwoData = {
  harvestDate: "",
  totalProduction: "",
  moistureContent: "",
  observationData: {
    seedVarietyObservation: "",
    goodPractices: "",
    manageable: "",
    harvestingTiming: "",
  },
  pestAttack: {
    stemBorer: false,
    leafFolder: false,
    brownPlanthopper: false,
    greenLeafhopper: false,
    stinkBug: false,
    others: false,
    none: false,
  },
  diseaseAttack: {
    leafBlast: false,
    bacterialLeafBlight: false,
    sheathBlight: false,
    bakanae: false,
    brownSpot: false,
    leafScald: false,
    hispa: false,
    tungro: false,
    none: false,
  },
  adverseWeatherEffects: {
    flood: false,
    drought: false,
    excessRainfall: false,
    storms: false,
    hailstorm: false,
  },
  periodFrom: "",
  periodTo: "",
};

interface StageTwoProps {
  selectedCrop: CropData;
  onSuccess: () => void;
}

const StageTwo = ({ selectedCrop, onSuccess }: StageTwoProps) => {
  const steps = [
    "Harvest",
    "Observation",
    "Pests & Disease",
    "Weather",
    "Preview",
  ];

  const storageKey = `stageTwo_${selectedCrop.crop_id}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [data, setData] = useState<StageTwoData>(defaultStageTwo);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setData(JSON.parse(saved));
  }, [selectedCrop.crop_id]);

  const saveData = (updated: StageTwoData) => {
    setData(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleChange = (field: keyof StageTwoData, value: any) => {
    const updated = { ...data };
    if (typeof value === "object" && !Array.isArray(value) && field in data) {
      updated[field] = { ...(data[field] as object), ...value };
    } else {
      updated[field] = value;
    }
    setData(updated);
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    saveData(data);
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Harvest data={data} onChange={handleChange} />;
      case 1:
        return <Observation data={data} onChange={handleChange} />;
      case 2: {
        // Convert boolean object to ObservationItem[]
        const toArray = (obj: Record<string, boolean>) =>
          Object.entries(obj)
            .filter(([_, v]) => v)
            .map(([key], index) => ({ id: index + 1, label: key }));

        return (
          <PestsDisease
            pests={data.pestAttack}
            diseases={data.diseaseAttack}
            onChange={({ pests, diseases }) => {
              handleChange("pestAttack", pests);
              handleChange("diseaseAttack", diseases);
              saveData({ ...data, pestAttack: pests, diseaseAttack: diseases });
            }}
          />
        );
      }
      case 3:
        return <Weather data={data} onChange={handleChange} />;
      case 4:
        return <PreviewSubmit data={data} />;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // Final save before submission
    saveData(data);
    toast.success("Stage Two data saved successfully!");
    onSuccess?.()
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

export default StageTwo;
