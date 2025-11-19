import { Check } from "lucide-react";
import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  completedSteps: Set<number>;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  const progressPercent =
    steps.length === 1 ? 100 : (currentStep / (steps.length - 1)) * 100;

  const nextStep = currentStep < steps.length - 1 ? currentStep + 1 : null;

  return (
    <>
      {/* ======== DESKTOP VERSION (unchanged) ======== */}
      <div className="relative w-[80%] my-5 md:w-[90%] mx-auto h-16 hidden md:block">
        <div className="absolute top-2 left-0 right-0 h-5 bg-gray-300 rounded-full z-0 px-1" />

        <div
          className="absolute top-2 left-0 h-5 bg-gradient-to-r from-blue-500 to-blue-900 rounded-full z-10 transition-all duration-300 px-1"
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const leftPercent = (index / (steps.length - 1)) * 100;

          return (
            <div
              key={index}
              className="absolute top-0 flex flex-col items-center text-center z-50"
              style={{ left: `${leftPercent}%`, transform: "translateX(-50%)" }}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors custom-hover ${
                  isCompleted ? "bg-blue-400 text-white" : ""
                } ${
                  isCurrent
                    ? "bg-blue-100 text-blue-800 font-bold scale-125 border-4 border-blue-400"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {isCompleted ? (
                  <Check
                    size={30}
                    className={`${
                      isCurrent ? "" : "bg-blue-900 rounded-full w-9 h-9 p-1"
                    }`}
                  />
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={`text-xs mt-2 ${
                  isCurrent || isCompleted
                    ? "font-semibold text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {/* ======== MOBILE & TABLET VERSION (NEW) ======== */}
      <div className="md:hidden w-full px-4 my-5">
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm">
          {(() => {
            const nextStep =
              currentStep < steps.length - 1 ? currentStep + 1 : null;
            const nextNextStep =
              currentStep < steps.length - 2 ? currentStep + 2 : null;

            return (
              <>
                {/* CURRENT STEP */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {currentStep + 1}
                  </div>
                  <p className="text-[11px] mt-1 font-semibold text-gray-800 text-center">
                    {steps[currentStep]}
                  </p>
                </div>

                {/* ARROW */}
                {nextStep !== null && (
                  <div className="mx-2 text-gray-400 font-bold text-lg">→</div>
                )}

                {/* NEXT STEP */}
                {nextStep !== null && (
                  <div className="flex-1 flex flex-col items-center opacity-90">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">
                      {nextStep + 1}
                    </div>
                    <p className="text-[11px] mt-1 text-gray-600 text-center">
                      {steps[nextStep]}
                    </p>
                  </div>
                )}

                {/* ARROW */}
                {nextNextStep !== null && (
                  <div className="mx-2 text-gray-400 font-bold text-lg">→</div>
                )}

                {/* NEXT-NEXT STEP */}
                {nextNextStep !== null && (
                  <div className="flex-1 flex flex-col items-center opacity-60">
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      {nextNextStep + 1}
                    </div>
                    <p className="text-[11px] mt-1 text-gray-500 text-center">
                      {steps[nextNextStep]}
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
};
