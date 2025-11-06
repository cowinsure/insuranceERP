"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GenericModal from "@/components/ui/GenericModal";
import { Stepper } from "@/components/Stepper";
import { toast, Toaster } from "sonner";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { SurveyTable, initialSurveys } from "@/components/survey-table";
import { SurveySearch } from "@/components/survey-search";
import BasicInfoForm, {
  BasicInfoRef,
} from "@/components/surveyForms/BasicInfoForm";
import { SurveyFormData } from "@/components/model/survey/types";
import Survey from "@/components/addCropForms/stageTwoSteps/Survey";

export default function SurveyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Survey form data
  const [surveyData, setSurveyData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("surveyFormData");
      return saved
        ? JSON.parse(saved)
        : {
            farmer_id: "",
            farmer_name: "",
            top_three_varieties: [],
            avg_production_this_year: "",
            avg_production_last_year: "",
            yield_loss: "",
            key_reasons_yield_losses: [],
            weather_effects: [],
            pests: [],
            diseases: [],
            remarks: "",
          };
    }
    return {
      farmer_id: "",
      farmer_name: "",
      plot_id: "",
      survey_date: "",
      crop_type: "",
      soil_type: "",
      irrigation_source: "",
      land_preparation_status: "",
      expected_sowing_date: "",
      fertilizer_requirements: "",
      pest_risk_assessment: "",
      additional_notes: "",
      top_three_varieties: [],
      avg_production_this_year: "",
      avg_production_last_year: "",
      yield_loss: "",
      key_reasons_yield_losses: [],
      weather_effects: [],
      pests: [],
      diseases: [],
      remarks: "",
    };
  });

  const onOpen = () => {
    setIsOpen(true);
    resetForm();
  };
  const onClose = () => setIsOpen(false);

  const steps = ["Survey Details", "Preview"];

  const resetForm = () => {
    setSurveyData({
      farmer_id: "",
      farmer_name: "",
      top_three_varieties: [],
      avg_production_this_year: "",
      avg_production_last_year: "",
      yield_loss: "",
      key_reasons_yield_losses: [],
      weather_effects: [],
      pests: [],
      diseases: [],
      remarks: "",
    });
    localStorage.removeItem("surveyFormData");
  };

  const handleNext = () => {
    // Add validation logic here
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Add API call logic here
      toast.success("Survey submitted successfully!");
      console.log(surveyData);
      resetForm();

      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong during submission.");
      setIsLoading(false);
    }
  };

  const basicInfoRef = useRef<BasicInfoRef>(null);

  // table/search data (lifted to page so SurveySearch can control filtering)
  const [surveys, setSurveys] = useState(() => initialSurveys);
  const [filteredSurveys, setFilteredSurveys] = useState<typeof initialSurveys>(
    []
  );

  // Effect to save form data to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("surveyFormData", JSON.stringify(surveyData));
    }
  }, [surveyData]);

  const handleSurveyDataChange = (
    field: keyof SurveyFormData,
    value: string
  ) => {
    setSurveyData((prev: SurveyFormData) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("surveyFormData", JSON.stringify(updated));
      return updated;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Survey
              data={[
                {
                  top_three_varieties: surveyData.top_three_varieties || [],
                  avg_production_this_year:
                    surveyData.avg_production_this_year === ""
                      ? ""
                      : Number(surveyData.avg_production_this_year),
                  avg_production_last_year:
                    surveyData.avg_production_last_year === ""
                      ? ""
                      : Number(surveyData.avg_production_last_year),
                  yield_loss:
                    (surveyData.yield_loss as "" | "yes" | "no") || "",
                  key_reasons_yield_losses:
                    surveyData.key_reasons_yield_losses || [],
                  weather_effects: surveyData.weather_effects || [],
                  pests: (surveyData.pests || []).map(
                    (name: string, idx: number) => ({
                      id: idx + 1,
                      name,
                    })
                  ),
                  diseases: (surveyData.diseases || []).map(
                    (name: string, idx: number) => ({
                      id: idx + 1,
                      name,
                    })
                  ),
                  remarks: surveyData.remarks || "",
                },
              ]}
              onChange={(val) => {
                const s = val[0];
                setSurveyData((prev: SurveyFormData) => ({
                  ...prev,
                  farmer_id: s.farmer_id || prev.farmer_id,
                  farmer_name: s.farmer_name || prev.farmer_name,
                  top_three_varieties: s.top_three_varieties,
                  avg_production_this_year:
                    s.avg_production_this_year === ""
                      ? ""
                      : String(s.avg_production_this_year),
                  avg_production_last_year:
                    s.avg_production_last_year === ""
                      ? ""
                      : String(s.avg_production_last_year),
                  yield_loss: s.yield_loss,
                  key_reasons_yield_losses: s.key_reasons_yield_losses || [],
                  weather_effects: s.weather_effects || [],
                  pests: (s.pests || []).map(
                    (p: { id: number; name: string }) => p.name
                  ),
                  diseases: (s.diseases || []).map(
                    (d: { id: number; name: string }) => d.name
                  ),
                  remarks: s.remarks || "",
                }));
              }}
            />
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto text-gray-700  overflow-y-auto p-6 bg-white rounded-2xl shadow-md border space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Survey Data Preview
            </h2>

            {/* Basic Information */}
            <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
              <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                Basic Information
              </h3>
              <div className="rounded-lg bg-white shadow-sm p-3 space-y-2">
                <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                  <span className="font-medium text-gray-600">Farmer ID</span>
                  <span className="text-gray-800 font-semibold tracking-wide col-span-2 text-right">
                    {surveyData.farmer_id || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                  <span className="font-medium text-gray-600">Farmer Name</span>
                  <span className="text-gray-800 font-semibold tracking-wide col-span-2 text-right">
                    {surveyData.farmer_name || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* Crop Production Data */}
            <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
              <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                Crop Production Data
              </h3>
              <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
                {surveyData.top_three_varieties?.length > 0 && (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Top Three Varieties
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {surveyData.top_three_varieties.map(
                        (variety: string, idx: number) => (
                          <li key={idx}>{variety}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                  <span className="font-medium text-gray-600">
                    Average Production This Year
                  </span>
                  <span className="text-gray-800 font-semibold tracking-wide col-span-2 text-right">
                    {surveyData.avg_production_this_year ? (
                      `${surveyData.avg_production_this_year} kg`
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                  <span className="font-medium text-gray-600">
                    Average Production Last Year
                  </span>
                  <span className="text-gray-800 font-semibold tracking-wide col-span-2 text-right">
                    {surveyData.avg_production_last_year ? (
                      `${surveyData.avg_production_last_year} kg`
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                  <span className="font-medium text-gray-600">Yield Loss</span>
                  <span className="text-gray-800 font-semibold tracking-wide col-span-2 text-right">
                    {surveyData.yield_loss ? (
                      surveyData.yield_loss === "yes" ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                  <div className="col-span-3 mt-7">
                    {surveyData.key_reasons_yield_losses?.length > 0 && (
                      <div className="border rounded-lg p-2 bg-gray-50">
                        <span className="font-semibold text-gray-700">
                          Key Reasons for Yield Loss
                        </span>
                        <ul className="list-disc list-inside text-gray-600 mt-1">
                          {surveyData.key_reasons_yield_losses.map(
                            (reason: string, idx: number) => (
                              <li key={idx}>{reason}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Factors */}
            <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
              <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                Risk Factors
              </h3>
              <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
                {surveyData.weather_effects?.length > 0 && (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Weather Effects
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {surveyData.weather_effects.map(
                        (effect: string, idx: number) => (
                          <li key={idx}>{effect}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Pest and Disease Information */}
            <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
              <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                Pests & Diseases
              </h3>
              <div className="rounded-lg bg-white shadow-sm p-3">
                {surveyData.pests?.length > 0 && (
                  <div className="border rounded-lg p-2 bg-gray-50 mb-2">
                    <span className="font-semibold text-gray-700">Pests</span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {surveyData.pests.map((pest: string, idx: number) => (
                        <li key={idx}>{pest}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {surveyData.diseases?.length > 0 && (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Diseases
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {surveyData.diseases.map(
                        (disease: string, idx: number) => (
                          <li key={idx}>{disease}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {surveyData.remarks && (
              <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                  Additional Remarks
                </h3>
                <div className="rounded-lg bg-white shadow-sm p-3">
                  <p className="text-gray-600">{surveyData.remarks}</p>
                </div>
              </section>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
              Please review all information carefully before submitting.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  console.log("Survey from child:", surveyData);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Survey Management
          </h1>
          <p className="text-gray-600">
            Manage and conduct land surveys for insurance assessment
          </p>
        </div>
        <div className="flex">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onOpen}
          >
            <Plus className="w-4 h-4" />
            New Survey
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="animate__animated animate__fadeIn">
          <SurveySearch data={surveys} setFilteredData={setFilteredSurveys} />
        </div>
        <div className="animate__animated animate__fadeIn">
          <SurveyTable
            data={surveys}
            filteredData={filteredSurveys}
            setFilteredData={setFilteredSurveys}
          />
        </div>
      </div>

      {isOpen && (
        <GenericModal closeModal={onClose} title={"Add New Survey"}>
          <div>
            <div className="bg-white rounded-xl mb-4">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>

            <div className="overflow-y-auto h-[550px] bg-white rounded-b-xl p-5 rounded-lg">
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
        </GenericModal>
      )}
      <Toaster richColors />
    </div>
  );
}
