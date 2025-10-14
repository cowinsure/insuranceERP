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

export default function AddCropDetailsModal() {
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
  const [cropData, setCropData] = useState({
    seedName: "",
    variety: "",
    seedCompany: "",
    seedType: "",
    irrigationFacility: "",
    irrigationSource: "",
    pesticideDose: "",
    fertilizerDose: "",
    cultivationSystem: "",
    landSuitability: "",
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

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }, 1500);
  };

  const handleCropChange = (field: string, value: string) => {
    setCropData((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("cropFormData", JSON.stringify(updated));
      return updated;
    });
  };

  /** ✅ Step Rendering **/
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CropDetailsForm data={cropData} onChange={handleCropChange} />;
      case 1:
        return <Cultivation />;
      case 2:
        return <History />;
      case 3:
        return <Weather />;
      case 4:
        return <PestsDisease />;
      case 5:
        return <Chemicals />;
      case 6:
        return <PreviewSubmit data={{ cropData }} />;
      default:
        return null;
    }
  };

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
      <div className={`overflow-y-auto  bg-white rounded-b-xl`}>
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
