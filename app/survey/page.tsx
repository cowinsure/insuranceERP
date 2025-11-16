"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GenericModal from "@/components/ui/GenericModal";
import { Stepper } from "@/components/Stepper";
import { toast, Toaster } from "sonner";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { SurveyTable, Survey as SurveyType } from "@/components/survey-table";
import { SurveySearch } from "@/components/survey-search";
import Survey from "@/components/addCropForms/stageTwoSteps/Survey";
import { SurveyPostPayload } from "@/core/model/SurveyPost";
import useApi from "@/hooks/use_api";

// Type for GET API response
type SurveyApiResponse = {
  survey_master_id: number;
  farmer_id: number;
  farmer_name: string;
  survey_date: string;
  mobile_number?: string;
  plot_id?: string;
  location?: string;
  crop_type?: string;
  remarks?: string;
  avg_production_last_year?: number;
  avg_production_this_year?: number;
  survey_yield_loss_details?: { yield_loss_type_name: string }[];
  survey_weather_event_details?: { weather_event_type_id: number }[];
  survey_pest_attack_details?: { pest_attack_type_id: number }[];
  survey_disease_attack_details?: { disease_attack_type_id: number }[];
  survey_varieties_of_seeds_details?: { survey_varieties_of_seeds: string }[];
};

export default function SurveyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const { get, post } = useApi();

  // ------------------ GET data for table ------------------
  const [surveys, setSurveys] = useState<SurveyType[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<SurveyType[]>([]);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      const res = await get(
        "/sms/farmer-survey-service/?page_size=100&start_record=1&survey_master_id=-1"
      );
      const data: SurveyApiResponse[] = res.data || [];

      // Map API response to SurveyType for table
      const mappedData: SurveyType[] = data.map((item) => ({
        id: item.survey_master_id.toString(),
        farmer_name: item.farmer_name,
        farmer_id: item.farmer_id,
        plot_id: item.plot_id ?? "-",
        location: item.location ?? "-",
        crop_type: item.crop_type ?? "-",
        survey_date: item.survey_date,
        status: "pending", // or derive from backend if available
        top_three_varieties: item.survey_varieties_of_seeds_details?.map(
          (v) => v.survey_varieties_of_seeds
        ),
        avg_production_last_year: item.avg_production_last_year,
        avg_production_this_year: item.avg_production_this_year,
        yield_loss: item.survey_yield_loss_details
          ?.map((y) => y.yield_loss_type_name)
          .join(", "),
        key_reasons_yield_losses: item.survey_yield_loss_details?.map(
          (y) => y.yield_loss_type_name
        ),
        weather_effects: item.survey_weather_event_details?.map((w) =>
          w.weather_event_type_id.toString()
        ),
        pests: item.survey_pest_attack_details?.map((p) =>
          p.pest_attack_type_id.toString()
        ),
        diseases: item.survey_disease_attack_details?.map((d) =>
          d.disease_attack_type_id.toString()
        ),
        remarks: item.remarks ?? "",
      }));

      setSurveys(mappedData);
      setFilteredSurveys(mappedData);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch surveys");
    }
  };

  // ------------------ POST data for modal form ------------------
  const [surveyData, setSurveyData] = useState<SurveyPostPayload>({
    farmer_id: 0,
    avg_prod_last_year: 0,
    avg_prod_current_year: 0,
    survey_date: "",
    survey_varieties_of_seeds_details: [],
    survey_yield_loss_details: [],
    survey_weather_event_details: [],
    survey_pest_attack_details: [],
    survey_disease_attack_details: [],
  });

  const onOpen = () => {
    setIsOpen(true);
    resetForm();
  };
  const onClose = () => setIsOpen(false);

  const resetForm = () => {
    setSurveyData({
      farmer_id: 0,
      avg_prod_last_year: 0,
      avg_prod_current_year: 0,
      survey_date: "",
      survey_varieties_of_seeds_details: [],
      survey_yield_loss_details: [],
      survey_weather_event_details: [],
      survey_pest_attack_details: [],
      survey_disease_attack_details: [],
    });
  };

  const steps = ["Survey Details", "Preview"];

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...surveyData,
        survey_date: new Date().toISOString(),
      };
      await post("/sms/farmer-survey-service/", payload);
      toast.success("Survey submitted!");
      resetForm();
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setIsOpen(false);
        fetchSurveyData(); // refresh table after submit
      }, 1200);
    } catch (error) {
      toast.error("Something went wrong during submission.");
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Survey
              data={[surveyData] as any}
              onChange={(val) => {
                const s = val[0];
                setSurveyData({
                  farmer_id: s.farmer_id,
                  avg_prod_last_year: s.avg_prod_last_year,
                  avg_prod_current_year: s.avg_prod_current_year,
                  survey_date: s.survey_date,
                  survey_varieties_of_seeds_details:
                    s.survey_varieties_of_seeds_details,
                  survey_yield_loss_details: s.survey_yield_loss_details,
                  survey_weather_event_details: s.survey_weather_event_details,
                  survey_pest_attack_details: s.survey_pest_attack_details,
                  survey_disease_attack_details:
                    s.survey_disease_attack_details,
                });
              }}
            />
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto text-gray-700 overflow-y-auto p-6 bg-white rounded-2xl shadow-md border space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Survey Data Preview
            </h2>
            <pre className="bg-gray-100 p-4 rounded-xl text-sm overflow-auto">
              {JSON.stringify(surveyData, null, 2)}
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Survey Management
          </h1>
          <p className="text-gray-600">
            Manage and conduct land surveys for insurance assessment
          </p>
        </div>

        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onOpen}
        >
          <Plus className="w-4 h-4" /> New Survey
        </Button>
      </div>

      {/* Search + Table */}
      <div className="space-y-6">
        <SurveySearch data={surveys} setFilteredData={setFilteredSurveys} />
        <SurveyTable
          data={surveys}
          filteredData={filteredSurveys}
          setFilteredData={setFilteredSurveys}
        />
      </div>

      {/* Modal */}
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
