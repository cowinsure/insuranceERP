"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Mail, Phone, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import GenericModal from "./ui/GenericModal";
import useApi from "@/hooks/use_api";
import Pagination from "./utils/Pagination";
import { SearchFilter } from "./utils/SearchFilter";
import Loading from "./utils/Loading";

const getStatusBadge = (status: string) => {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    inactive: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  };
  return (
    variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  );
};

export function FarmersTable() {
  const [selectedFarmer, setSelectedFarmer] = useState<
    (typeof farmers)[0] | null
  >(null);

  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<FarmerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const { get } = useApi();

  // =============================
  // Pagination functions
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(5);

  const dataToPaginate = filteredFarmers.length > 0 ? filteredFarmers : farmers;

  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(dataToPaginate.length / (pageSize as number));

  const paginatedFarmers =
    pageSize === "All"
      ? dataToPaginate
      : dataToPaginate.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await get(`ims/farmer-service`, {
          params: { start_record: 1 },
        });
        if (response.status === "success") {
          setFarmers(response.data);
          setFilteredFarmers(response.data);
        }
      } catch (error) {
        console.log("Error fetching applications from API...");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mb-4">
        <SearchFilter
          placeholder="Search farmers by Name, Location or Phone"
          data={farmers}
          setFilteredData={setFilteredFarmers}
          searchKeys={["farmer_name", "location", "mobile_number"]}
        />
      </div>

      <Card className="border border-gray-200 py-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 pt-0">
            Registered Farmers
          </CardTitle>
          <p className="text-sm text-gray-600">
            {dataToPaginate.length} farmers found
          </p>
        </CardHeader>
        <CardContent>
          {/* MOBILE/TABLET CARD VIEW ---- */}
          <div className="lg:hidden space-y-4">
            {loading || paginatedFarmers.length === 0 ? (
              <Loading />
            ) : (
              paginatedFarmers.map((farmer, idx) => (
                <div
                  key={farmer.user_id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white animate__animated animate__fadeIn"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 w-20 h-20 flex items-center justify-center rounded-xl">
                      <User size={45} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {!farmer.farmer_name || farmer.farmer_name.trim() === ""
                          ? "Name Not found"
                          : farmer.farmer_name}
                      </div>

                      <div className="">
                        <div className="mt-1 text-sm flex items-center gap-2 text-gray-700 font-medium">
                          <Phone className="w-4 h-4" />
                          {farmer.mobile_number}
                        </div>
                        <div className="mt-1 text-sm flex items-center gap-2 text-gray-700 font-medium">
                          <MapPin className="w-4 h-4" />
                          {farmer.location === null
                            ? "Not found"
                            : farmer.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5 *:bg-gray-100 *:px-3 *:py-1 *:rounded-full">
                    <div className=" text-sm font-medium text-gray-700">
                      Assets:{" "}
                      <span className="text-gray-700">{farmer.assets}</span>
                    </div>

                    <div className=" text-sm font-medium text-gray-700">
                      Policies:{" "}
                      <span
                        className={`${
                          farmer.policies > 0
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {farmer.policies}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP TABLE VIEW --------- */}
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Farmer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Assets
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Policies
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading || paginatedFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginatedFarmers.map((farmer, idx) => (
                      <tr
                        key={farmer.user_id}
                        className="border-b border-gray-100 hover:bg-gray-50 animate__animated animate__fadeIn"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <td className="py-4 px-4">
                          <div className="text-base font-semibold text-gray-900">
                            {!farmer.farmer_name ||
                            farmer.farmer_name.trim() === ""
                              ? "Name Not found"
                              : farmer.farmer_name}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            {farmer.mobile_number}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm flex items-center gap-2 text-gray-900">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {farmer.location}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {farmer.assets}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`text-sm font-medium ${
                              farmer.policies > 0
                                ? "text-blue-600"
                                : "text-gray-900"
                            }`}
                          >
                            {farmer.policies}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="w-[250px] mx-auto md:w-full">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
