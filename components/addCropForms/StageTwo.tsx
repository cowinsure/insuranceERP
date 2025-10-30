"use client";

import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { Stepper } from "../Stepper";
import PreviewSubmit from "../PreviewForm";
import Harvest from "./stageTwoSteps/Harvest";
import Observation from "./stageTwoSteps/Observation";
import Weather from "./stageTwoSteps/Weather";
import { CropGetData } from "../model/crop/CropGetModel";
import PestsDisease from "./stageTwoSteps/PestsDisease";
import { toast, Toaster } from "sonner";

interface StageTwoProps {
  selectedCrop: CropGetData;
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

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [data, setData] = useState();

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // const renderStep = () => {

  //   switch (currentStep) {
  //     case 0:
  //       return <Harvest data={data} onChange={handleChange} />;
  //     case 1:
  //       return <Observation data={data} onChange={handleChange} />;
  //     case 2: {
  //       // Convert boolean object to ObservationItem[]
  //       const toArray = (obj: Record<string, boolean>) =>
  //         Object.entries(obj)
  //           .filter(([_, v]) => v)
  //           .map(([key], index) => ({ id: index + 1, label: key }));

  //       return <PestsDisease data={data} onChange={handleChange} />;
  //     }
  //     case 3:
  //       return <Weather data={data} onChange={handleChange} />;
  //     case 4:
  //       return <PreviewSubmit data={data} />;
  //     default:
  //       return null;
  //   }
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Harvest data={data} onChange={() => {}} />;
      case 1:
        return <Observation data={data} onChange={() => {}} />;
      case 2:
        return <PestsDisease data={data} onChange={() => {}} />;
      case 3:
        return <Weather data={data} onChange={() => {}} />;
      case 4:
        return <PreviewSubmit data={data} />;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // Final save before submission
    toast.success("Stage Two data saved successfully!");
    onSuccess?.();
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
