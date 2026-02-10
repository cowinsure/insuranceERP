"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pagination from "./utils/Pagination";
import { Calendar, Eye, MapPin, Phone, Plus } from "lucide-react";
import Loading from "./utils/Loading";
import { Button } from "./ui/button";
import GenericModal from "./ui/GenericModal";
import SurveyView from "./SurveyView";
import { SurveyPostPayload } from "@/core/model/SurveyPost";
import Survey from "./addCropForms/stageTwoSteps/Survey";
import SurveyPreview from "./surveyForms/SurveyPreview";
import { toast, Toaster } from "sonner";
import useApi from "@/hooks/use_api";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Stepper } from "./Stepper";
import { FaCircleCheck } from "react-icons/fa6";
import { SurveySearch } from "./survey-search";
import { SearchFilter } from "./utils/SearchFilter";

export type SurveyYieldLoss = {
  survey_yield_loss_details_id: number;
  survey_master_id: number;
  yield_loss_type_id: number;
  yield_loss_type_name: string;
  remarks?: string | null;
};

export type SurveyPestAttack = {
  survey_pest_attack_details_id: number;
  survey_master_id: number;
  pest_attack_type_id: number;
  remarks?: string | null;
};

export type SurveyWeatherEvent = {
  survey_weather_event_details_id: number;
  survey_master_id: number;
  weather_event_type_id: number;
  remarks?: string | null;
};

export type SurveyDiseaseAttack = {
  survey_disease_attack_details_id: number;
  survey_master_id: number;
  disease_attack_type_id: number;
  remarks?: string | null;
};

export type SurveySeedVariety = {
  survey_varieties_of_seeds_details_id: number;
  survey_master_id: number;
  survey_varieties_of_seeds: string;
  remarks?: string | null;
};

export type Survey = {
  remarks?: string | null;
  farmer_id: number;
  farmer_name: string;
  mobile_number?: string;
  survey_master_id?: number;
  survey_date: string;
  plot_id?: string;
  location?: string;
  crop_type?: string;
  avg_prod_last_year?: number;
  avg_prod_current_year?: number;
  status?: "pending" | "completed" | "in-progress";
  survey_yield_loss_details?: SurveyYieldLoss[];
  survey_pest_attack_details?: SurveyPestAttack[];
  survey_weather_event_details?: SurveyWeatherEvent[];
  survey_disease_attack_details?: SurveyDiseaseAttack[];
  survey_varieties_of_seeds_details?: SurveySeedVariety[];
};

type SurveyTableProps = {
  data?: Survey[];
  loading?: boolean;
};

export function SurveyTable({ data, loading = false }: SurveyTableProps) {
  const { get, post } = useApi();
  const [filteredData, setFilteredData] = useState<Survey[]>(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(5);

  useEffect(() => {
    setFilteredData(data || []);
  }, [data]);
  const [surveyView, setSurveyView] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [lat_long, setLatLong] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  // ------------------ POST data for modal form ------------------
  const [surveyData, setSurveyData] = useState<SurveyPostPayload>({
    farmer_id: 0,
    avg_prod_last_year: 0,
    avg_prod_current_year: 0,
    survey_date: "",
    location_lat: 0,
    location_long: 0,
    survey_varieties_of_seeds_details: [],
    survey_yield_loss_details: [],
    survey_weather_event_details: [],
    survey_pest_attack_details: [],
    survey_disease_attack_details: [],
  });
  // Additional state for preview
  const [surveyPreview, setSurveyPreview] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
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
      location_lat: 0,
      location_long: 0,
      survey_varieties_of_seeds_details: [],
      survey_yield_loss_details: [],
      survey_weather_event_details: [],
      survey_pest_attack_details: [],
      survey_disease_attack_details: [],
    });
    setSurveyPreview({});
  };

  const steps = ["Survey Details", "Preview"];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.warning("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatLong({ latitude, longitude });
      },
      (error) => {
        console.error(error);
        toast.error(
          "Unable to retrieve location. Please allow location access."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    getCurrentLocation();
    setIsLoading(true);

    try {
      const payload = {
        farmer_id: Number(surveyData.farmer_id) || 0,
        avg_prod_last_year: Number(surveyData.avg_prod_last_year) || 0,
        avg_prod_current_year: Number(surveyData.avg_prod_current_year) || 0,
        survey_date: surveyData.survey_date
          ? new Date(surveyData.survey_date).toISOString()
          : new Date().toISOString(),
        survey_varieties_of_seeds_details:
          surveyData.survey_varieties_of_seeds_details || [],
        survey_yield_loss_details: surveyData.survey_yield_loss_details || [],
        survey_weather_event_details:
          surveyData.survey_weather_event_details || [],
        survey_pest_attack_details: surveyData.survey_pest_attack_details || [],
        survey_disease_attack_details:
          surveyData.survey_disease_attack_details || [],
        location_lat: lat_long.latitude,
        location_long: lat_long.longitude,
        // remarks: surveyData.remarks || "",s
      };
      const res = await post("/sms/farmer-survey-service/", payload);
      console.log(res);
      if (res.status === "success") {
        toast.success(res.message);
      } else {
        toast.error(res.error || res.message);
      }
      resetForm();
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setIsOpen(false);
        //fetchSurveyData(); // refresh table after submit
      }, 1200);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong during submission.");
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Survey
              data={[surveyData]}
              onChange={(val) => {
                // val[0] is the raw survey data, val[1] is optional preview
                setSurveyData(val[0]);
                if (val[1]) setSurveyPreview(val[1]); // store preview for step 2
              }}
            />
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto">
            <SurveyPreview data={surveyPreview || surveyData} />
          </div>
        );

      default:
        return null;
    }
  };

  const dataToPaginate = filteredData;

  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(dataToPaginate.length / (pageSize as number));

  const paginatedSurveys =
    pageSize === "All"
      ? dataToPaginate
      : dataToPaginate.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );

  const handleSurveyiew = (data: any) => {
    setSurveyView(true);
    setSelectedSurvey(data);
  };

  return (
    <div className="flex flex-col space-y-2 border bg-white p-4 lg:py-6 lg:px-5 rounded-lg">
      {/* Table Header */}
      <div className="mb-5 grid grid-cols-4">
        {/* Table name */}
        <div className="col-span-3 lg:col-span-2">
          <CardTitle className="text-lg lg:text-xl font-semibold text-gray-700 mb- pt-0">
            Registered Surveys
          </CardTitle>

          <p className="text-sm lg:text-base font-medium text-gray-400">
            {filteredData.length} surveys found
          </p>
        </div>

        <div className="lg:col-span-2 flex justify-end gap-5 items-center">
          <div className="flex-1 hidden lg:block">
            <SearchFilter
              placeholder="Search farmers by Name, Location or Phone"
              data={data || []}
              setFilteredData={setFilteredData}
              searchKeys={["farmer_name", "location", "mobile_number"]}
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => onOpen()}
            >
              <Plus className="w-4 h-4" /> New Survey
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 block lg:hidden">
        <SearchFilter
          placeholder="Search farmers by Name, Location or Phone"
          data={data || []}
          setFilteredData={setFilteredData}
          searchKeys={["farmer_name", "location", "mobile_number"]}
        />
      </div>

      {/* MOBILE VIEW — CARD LIST */}
      <div className="lg:hidden space-y-4">
        {loading || paginatedSurveys.length === 0 ? (
          <Loading />
        ) : (
          paginatedSurveys.map((survey, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm bg-white animate__animated animate__fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  {survey.farmer_name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSurveyiew(survey)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <Phone className="w-4 h-4" /> {survey.mobile_number || "N/A"}
              </p>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {survey.survey_date}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-500 text-xs">Avg Last Year</p>
                  <p className="font-medium">
                    {survey.avg_prod_last_year ?? "-"}
                  </p>
                </div>

                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-500 text-xs">Avg Current Year</p>
                  <p className="font-medium">
                    {survey.avg_prod_current_year ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="overflow-x-auto hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Farmer Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Mobile
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Survey Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 lg:w-[150px]">
                Avg Last Year
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 lg:w-[180px]">
                Avg Current Year
              </th>
              {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th> */}
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading || paginatedSurveys.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center">
                  <Loading />
                </td>
              </tr>
            ) : (
              paginatedSurveys.map((survey, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 animate__animated animate__fadeIn"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 text-sm">
                      {survey.farmer_name === " " ? "N/A" : survey.farmer_name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {survey.mobile_number}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {survey.survey_date}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {survey.avg_prod_last_year ?? "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {survey.avg_prod_current_year ?? "-"}
                    </span>
                  </td>
                  {/* <td className="py-4 px-4">
                      <Badge
                        className={
                          survey.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : survey.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {survey.status ?? "pending"}
                      </Badge>
                    </td> */}
                  <td>
                    <div className="flex items-center justify-center py-4 px-4">
                      <Button
                        variant={"outline"}
                        onClick={() => handleSurveyiew(survey)}
                      >
                        <Eye />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size: number | "All") => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
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

            <div className="overflow-y-auto h-[550px] bg-white rounded-lg">
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

      {surveyView && (
        <GenericModal
          closeModal={() => setSurveyView(false)}
          title={"Survey Details"}
          widthValue="w-[20%] lg:w-[50%]"
        >
          <SurveyView survey={selectedSurvey} />
        </GenericModal>
      )}
    </div>
  );
}
