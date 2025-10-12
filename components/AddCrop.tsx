"use client";

import { useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";
import LandPreparationForm, { LandPreparationRef } from "./LandPreparation";
import { Stepper } from "./Stepper";
import CropDetailsForm, { CropDetailsRef } from "./AddCropDetails";
import PreviewSubmit from "./PreviewForm";

export default function AddCrop() {
  const steps = ["Land Preparation", "Crop Details", "Preview & Submit"];

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const landPrepRef = useRef<LandPreparationRef>(null);
  const cropDetailsRef = useRef<CropDetailsRef>(null);

  const handleNext = () => {
    let valid = false;

    if (currentStep === 0)
      valid = landPrepRef.current?.validateFields() ?? false;
    else if (currentStep === 1)
      valid = cropDetailsRef.current?.validateFields() ?? false;
    else valid = true;

    if (!valid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    const landData = landPrepRef.current?.getValues();
    const cropData = cropDetailsRef.current?.getValues();

    const formData = { ...landData, ...cropData };

    console.log("Final Submitted Data:", formData);
    toast.success("Form submitted successfully!");

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(0);
    }, 1500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <LandPreparationForm ref={landPrepRef} />;
      case 1:
        return <CropDetailsForm ref={cropDetailsRef} />;
      case 2:
        return (
          <PreviewSubmit
            data={{
              ...landPrepRef.current?.getValues(),
              ...cropDetailsRef.current?.getValues(),
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Stepper */}
      <div className="bg-white rounded-xl mb-4">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Step Content */}
      <div className="overflow-y-auto h-[550px] bg-white rounded-b-xl p-5">
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
