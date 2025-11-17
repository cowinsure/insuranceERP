"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pagination from "./utils/Pagination";
import { Eye, MapPin } from "lucide-react";
import Loading from "./utils/Loading";
import { Button } from "./ui/button";
import GenericModal from "./ui/GenericModal";
import SurveyView from "./SurveyView";

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
  filteredData?: Survey[];
  setFilteredData?: React.Dispatch<React.SetStateAction<Survey[]>>;
  loading?: boolean;
};

export function SurveyTable({
  data,
  filteredData,
  setFilteredData,
  loading = false,
}: SurveyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(5);
  const [surveyView, setSurveyView] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const dataToPaginate =
    filteredData && filteredData.length > 0 ? filteredData : data ?? [];

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

  console.log(data);

  return (
    <Card className="border border-gray-200 py-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Registered Surveys
        </CardTitle>
        <p className="text-sm text-gray-600">
          {dataToPaginate.length} surveys found
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Avg Last Year
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Avg Current Year
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
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
                        {survey.farmer_name === " "
                          ? "N/A"
                          : survey.farmer_name}
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
                    <td className="py-4 px-4">
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
                    </td>
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
      </CardContent>

      {surveyView && (
        <GenericModal
          closeModal={() => setSurveyView(false)}
          title={"Survey Details"}
          widthValue="w-full lg:w-[50%]"
        >
          <SurveyView survey={selectedSurvey} />
        </GenericModal>
      )}
    </Card>
  );
}
