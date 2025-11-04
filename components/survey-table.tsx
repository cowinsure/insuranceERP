"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Pagination from "./utils/Pagination";
// import { useApi } from "@/hooks/use_api";
import { MapPin } from "lucide-react";
import Loading from "./utils/Loading";

// Temporary type definition - move to models folder later
type Survey = {
  id: string;
  farmer_name: string;
  farmer_id?: string;
  plot_id: string;
  survey_date: string;
  location: string;
  crop_type: string;
  status: "pending" | "completed" | "in-progress";
  // optional extended fields
  top_three_varieties?: string[];
  avg_production_this_year?: string;
  avg_production_last_year?: string;
  yield_loss?: string;
  key_reasons_yield_losses?: string[];
  weather_effects?: string[];
  pests?: string[];
  diseases?: string[];
  remarks?: string;
};

// Temporary data - replace with API call later
export const initialSurveys: Survey[] = [
  {
    id: "SRV001",
    farmer_name: "Md Mustakim",
    farmer_id: "F001",
    plot_id: "PLT001",
    survey_date: "2025-11-01",
    location: "Pabna, Bangladesh",
    crop_type: "Rice",
    status: "completed",
  },
  {
    id: "SRV002",
    farmer_name: "Ali Asgar",
    farmer_id: "F002",
    plot_id: "PLT003",
    survey_date: "2025-11-02",
    location: "Bogura, Bangladesh",
    crop_type: "Wheat",
    status: "in-progress",
  },
  {
    id: "SRV003",
    farmer_name: "Nur Mohammad",
    farmer_id: "F003",
    plot_id: "PLT007",
    survey_date: "2025-11-03",
    location: "Bogura, Bangladesh",
    crop_type: "Corn",
    status: "pending",
  },
  {
    id: "SRV004",
    farmer_name: "MD Rahmat",
    farmer_id: "F004",
    plot_id: "PLT012",
    survey_date: "2025-11-04",
    location: "Shariatpur, Bangladesh",
    crop_type: "Rice",
    status: "completed",
  },
  {
    id: "SRV005",
    farmer_name: "Sagor Bornik",
    farmer_id: "F005",
    plot_id: "PLT015",
    survey_date: "2025-11-05",
    location: "Rajbari, Bangladesh",
    crop_type: "Wheat",
    status: "in-progress",
  },
];

type SurveyTableProps = {
  data?: Survey[];
  filteredData?: Survey[];
  setFilteredData?: React.Dispatch<React.SetStateAction<Survey[]>>;
};

export function SurveyTable({ data, filteredData, setFilteredData }: SurveyTableProps) {
  const [surveys, setSurveys] = useState<Survey[]>(data ?? initialSurveys);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>(filteredData ?? (data ?? initialSurveys));
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(5);

  // prefer externally provided filteredData if present
  const externalFiltered = filteredData ?? (filteredSurveys.length > 0 ? filteredSurveys : undefined);
  const dataToPaginate = externalFiltered && externalFiltered.length > 0 ? externalFiltered : surveys;

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
                  Survey ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Farmer Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Plot ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Location
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Crop Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading || paginatedSurveys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : (
                <>
                  {paginatedSurveys.map((survey, idx) => (
                    <tr
                      key={survey.id}
                      className="border-b border-gray-100 hover:bg-gray-50 animate__animated animate__fadeIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {survey.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 text-sm">
                          {survey.farmer_name}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{survey.plot_id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {survey.location}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{survey.crop_type}</span>
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
                          {survey.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="">
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
    </Card>
  );
}