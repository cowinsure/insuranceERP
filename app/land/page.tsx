"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ProductStats } from "@/components/policy-stats";
import { ProductFilters } from "@/components/policy-filters";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Plus,
  Sparkles,
  Badge,
  MapPin,
  Eye,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GenericModal from "@/components/ui/GenericModal";
import { useState, useEffect } from "react";
import { ProductsTable } from "@/components/products-table";
import { CreatePlotDialog } from "@/components/dialogs/land/CreatePlotDialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import PlotDetailsDialog from "@/components/dialogs/land/PlotDetailsDialog";
import PlotCoordinatesDialog from "@/components/dialogs/land/PlotCoordinatesDialog";
import useApi from "@/hooks/use_api";
import { group } from "console";
import { useLocalization } from "../../core/context/LocalizationContext";
import { SearchFilter } from "@/components/utils/SearchFilter";
import Loading from "@/components/utils/Loading";
import Pagination from "@/components/utils/Pagination";
import PageHeader from "@/components/PageHeader";

interface LandData {
  image: string | null;
  land_id: number;
  location: string | null;
  farmer_id: number;
  land_code: string | null;
  land_name: string;
  soil_type: string | null;
  farmer_name: string;
  area_in_acre: number;
  mobile_number: string;
  ownership_type: string;
  google_map_link: string | null;
  land_suitability_id: number;
  land_reference_point: any[];
  land_coordinate_point: {
    land_id: number;
    latitude: number;
    land_name: string;
    longitude: number;
    created_at: string;
    created_by: number;
    farmer_name: string;
    modified_at: string | null;
    modified_by: string | null;
    sequence_no: string | null;
    mobile_number: string;
    coordinate_type: string | null;
    land_coordinate_point_id: number;
  }[];
  land_measurement_info: {
    ne_nw: string | null;
    nw_sw: string | null;
    se_ne: string | null;
    sw_se: string | null;
    land_id: number;
    land_name: string;
    created_at: string;
    created_by: number;
    e_mark_dist: number;
    farmer_name: string;
    modified_at: string | null;
    modified_by: string | null;
    n_mark_dist: number;
    e_corner_dist: number;
    mobile_number: string;
    n_corner_dist: number;
  }[];
  land_suitability_name: string;
  land_suitability_details: {
    land_id: number;
    remarks: string;
    is_active: boolean;
    land_name: string;
    created_at: string;
    created_by: number;
    farmer_name: string;
    modified_at: string | null;
    modified_by: string | null;
    mobile_number: string;
    land_suitability_id: number;
    land_suitability_name: string;
    land_suitable_details_id: number;
  }[];
}

export default function CropPage() {
  const { t, setLocale, locale } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPlotCoordsDialogOpen, setIsPlotCoordsDialogOpen] = useState(false);
  const [plotCoordsTargetId, setPlotCoordsTargetId] = useState<string | null>(
    null
  );

  const [landData, setLandData] = useState<LandData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlot, setSelectedPlot] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filteredPlots, setFilteredPlots] = useState(landData);
  const [landSuitabilityId, setLandSuitabilityId] = useState<
    string | number | null
  >(null);
  const [openPanel, setOpenPanel] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(6);

  const { get, loading, error } = useApi();

  useEffect(() => {
    setFilteredPlots(landData);
    setCurrentPage(1); // Reset to first page when data changes
  }, [landData]);

  // Pagination logic
  const dataToPaginate = filteredPlots;
  const totalPages =
    pageSize === "All"
      ? 1
      : Math.ceil(dataToPaginate.length / (pageSize as number));
  const paginatedPlots =
    pageSize === "All"
      ? dataToPaginate
      : dataToPaginate.slice(
          (currentPage - 1) * (pageSize as number),
          currentPage * (pageSize as number)
        );

  useEffect(() => {
    const fetchLandData = async () => {
      try {
        const response = await get(
          "lams/land-info-service/?page_size=10&start_record=1&land_id=-1"
        );
        setLandData(response.data);
        //(response.data);
      } catch (error) {
        console.error("Failed to fetch land data", error);
      }
    };

    fetchLandData();
  }, [get]);

  const showSuitabilityReasons = (land: number) => {
    console.log(land);
    if (land) {
      setOpenPanel(true);
      setLandSuitabilityId(land);
    }
  };

  // const filteredPlots = landData.filter(
  //   (plot) =>
  //     plot.land_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     plot.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     plot.mobile_number?.trim().includes(searchTerm.toLowerCase())
  // );
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handlePlotCreated = (
    apiPayload: any,
    plotName: string,
    plotDescription: string
  ) => {
    // This function needs to be adapted to the new data structure
  };

  interface LandCoordinate {
    land_id: number;
    latitude: number;
    longitude: number;
    land_name: string;
    created_at: string;
    created_by: number;
    farmer_name: string;
    modified_at: string | null;
    modified_by: number | null;
    sequence_no: number | null;
    mobile_number: string;
    coordinate_type: "plot" | "inner_area" | string; // allow extra types if needed
    land_coordinate_point_id: number;
  }

  interface GroupedCoordinates {
    [key: string]: LandCoordinate[];
  }

  function groupByCoordinateType(data: LandCoordinate[]): GroupedCoordinates {
    return data.reduce((result, item) => {
      const type = item.coordinate_type;
      if (!result[type]) {
        result[type] = [];
      }
      result[type].push(item);
      return result;
    }, {} as GroupedCoordinates);
  }
  type LandPoint = {
    land_id: number;
    latitude: number;
    land_name: string;
    longitude: number;
    created_at: string;
    created_by: number;
    point_type: string;
    farmer_name: string;
    modified_at: string | null;
    modified_by: number | null;
    mobile_number: string;
    distance_from_base: number | null;
    land_reference_point_id: number;
  };

  function groupByPointType(points: LandPoint[]) {
    return points.reduce((acc, point) => {
      if (!acc[point.point_type]) {
        acc[point.point_type] = [];
      }
      acc[point.point_type].push(point);
      return acc;
    }, {} as Record<string, LandPoint[]>);
  }

  const handleViewDetails = (plot: any) => {
    // Map API land payload to the Plot shape used by the details dialog
    //(plot);
    const groupedData = groupByCoordinateType(plot.land_coordinate_point);
    //(groupedData);

    const grouped_ref = groupByPointType(plot.land_reference_point);
    //(grouped_ref);

    const mapped = {
      id: plot.land_id?.toString() ?? Date.now().toString(),
      plotName: plot.land_name,
      description: `Owner: ${plot.farmer_name}`,
      area: `${plot.area_in_acre}`,
      coordinates: groupedData?.plot || [],
      landArea: groupedData?.land_area || [],
      imageUrl: plot.image,
      createdAt:
        plot.land_coordinate_point?.[0]?.created_at || new Date().toISOString(),
      status: "active",
      landCoordinates: groupedData?.land_area || [],
      plotCoordinates: groupedData?.plot || [],
      innerCoordinates: groupedData?.inner_area || [],
      swMark: grouped_ref?.sw_mark?.[0] ?? null,
      nCorner: grouped_ref?.n_corner?.[0] ?? null,
      eCorner: grouped_ref?.e_corner?.[0] ?? null,
      nMark: grouped_ref?.n_mark?.[0] ?? null,
      eMark: grouped_ref?.e_mark?.[0] ?? null,
      nMarkDist: plot?.land_measurement_info?.[0]?.n_mark_dist ?? null,
      eMarkDist: plot?.land_measurement_info?.[0]?.e_mark_dist ?? null,
      ecornerDist: plot?.land_measurement_info?.[0]?.e_corner_dist ?? null,
      ncornerDist: plot?.land_measurement_info?.[0]?.n_corner_dist ?? null,
      intersection: grouped_ref?.intersection?.[0] ?? null,
      mobileNumber: plot?.mobile_number,
      farmerId: plot.farmer_id,
      farmerName: plot.farmer_name,
      suitability:
        plot.land_suitability_details?.map(
          (d: any) => d.land_suitability_name
        ) || [],
      length: plot?.land_measurement_info?.[0]?.se_ne ?? null,
      width: plot?.land_measurement_info?.[0]?.ne_nw ?? null,
      farmer_name: plot.farmer_name,
      mobile_number: plot.mobile_number,
    };

    setSelectedPlot(mapped);
    setIsDetailsDialogOpen(true);
  };

  const handleEditPlot = (plot: any) => {
    // TODO: Implement edit functionality
    //("Edit plot:", plot);
  };

  const handleSaveCoordinatesPlot = (coords: any[]) => {
    // This function needs to be adapted to the new data structure
  };

  const handleDeletePlot = (plotId: string) => {
    // This function needs to be adapted to the new data structure
  };

  return (
    <div className="flex-1 lg:space-y-2 p-3 md:px-6 pb-16 lg:pb-0">
      {/* Page Header */}
      <PageHeader heading="land_management" description="sub_title" />

      <div className="animate__animated animate__fadeIn">
        <div className="flex flex-col space-y-2 border bg-white p-4 lg:py-6 lg:px-5 rounded-lg">
          {/* Table header */}
          <div className="mb-5 grid grid-cols-4">
            {/* Table name */}
            <div className="col-span-3 lg:col-span-2">
              <CardTitle className="text-lg lg:text-xl font-semibold text-gray-700 mb- pt-0">
                {t("land_list")}
              </CardTitle>
              <p className="text-sm lg:text-base font-medium text-gray-400">
                {dataToPaginate.length} {t("land_found")}
              </p>
            </div>

            {/* Search and add btn */}
            <div className="lg:col-span-2 flex justify-end gap-5 items-center">
              <div className="flex-1 hidden lg:block">
                <SearchFilter
                  placeholder={t("search_placeholder")}
                  data={landData}
                  setFilteredData={setFilteredPlots}
                  searchKeys={["land_name", "farmer_name", "mobile_number"]}
                />
              </div>
              <div className="flex justify-end">
                {" "}
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:block"> {t("create_land")}</span>
                  <span className="block lg:hidden">New Land</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Search for mobile */}
          <div className="flex-1 block lg:hidden">
            <SearchFilter
              placeholder={t("search_placeholder")}
              data={landData}
              setFilteredData={setFilteredPlots}
              searchKeys={["land_name", "farmer_name", "mobile_number"]}
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : filteredPlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("no_lands_found")}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? t("try_adjusting_search")
                  : t("create_first_land_entry")}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("create_land")}
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* MOBILE/TABLET CARD VIEW ---- */}
              <div className="space-y-4 lg:hidden">
                {paginatedPlots.map((plot, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl bg-blue-50 shadow-md hover:shadow-xl transition-all duration-300 animate__animated animate__fadeIn"
                    style={{ animationDelay: `${idx * 80}ms` }}
                    onClick={() => {
                      setOpenPanel(!openPanel);
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={
                          plot.image
                            ? `${process.env.NEXT_PUBLIC_API_ATTACHMENT_IMAGE_URL}${plot.image}`
                            : "/placeholder.svg"
                        }
                        alt={plot.land_name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex items-center justify-between p-4">
                      <div className="space-y-2">
                        {/* Title */}
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {plot.land_name}
                        </h3>

                        {/* Owner */}
                        <p className="text-sm text-gray-600 truncate">
                          👤 {plot.farmer_name}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          {/* Phone */}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{plot.mobile_number}</span>
                          </div>
                        </div>
                      </div>
                      {/* View action */}
                      <button
                        onClick={() => handleViewDetails(plot)}
                        className=" bg-white/90 backdrop-blur-md rounded-lg p-2 shadow hover:bg-white z-20"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* ---------------- Suitability Pull Tab ---------------- */}
                    {plot.land_suitability_details?.length > 0 && (
                      <>
                        {/* Pull Button */}
                        <button
                          onClick={() => showSuitabilityReasons(plot.land_id)}
                          className={`absolute top-1/3 -translate-y-1/2 right-0 z-30 bg-amber-500 text-white px-1 py-1 rounded-l-md shadow-md text-xs font-semibold ${
                            openPanel && landSuitabilityId === plot.land_id
                              ? "hidden"
                              : "animate__animated animate__slideInRight "
                          }`}
                          style={{ writingMode: "vertical-rl" }}
                        >
                          Suitability
                        </button>

                        {/* Slide Panel */}
                        {openPanel && (
                          <div
                            className={`absolute top-0 right-0 h-full bg-white border-l shadow-xl transition-all duration-300 z-20 overflow-hidden ${
                              landSuitabilityId === plot.land_id
                                ? "w-52 animate__animated animate__slideInRight"
                                : "w-0"
                            }`}
                          >
                            {landSuitabilityId === plot.land_id && (
                              <div className="p-4 space-y-2">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                  Suitability
                                </h4>

                                {plot.land_suitability_details.map((s) => (
                                  <div
                                    key={s.land_suitable_details_id}
                                    className="text-xs px-2 py-1 rounded-md bg-amber-100 text-amber-800"
                                  >
                                    {s.land_suitability_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE VIEW --------- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {t("land_name")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {t("farmer_name")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {t("contact_number")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {t("area_acres")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {t("ownership")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPlots.map((plot) => (
                      <tr
                        key={plot.land_id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {plot.land_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {plot.farmer_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {plot.mobile_number}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {plot.area_in_acre}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {plot.ownership_type}
                          </div>
                        </td>

                        <td className="py-4 px-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(plot)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // setPlotCoordsTargetId(plot.id)
                                setIsPlotCoordsDialogOpen(true)
                              }}
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              Plot Entry
                            </Button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
        </div>
      </div>

      {isOpen && (
        <GenericModal closeModal={onClose}>
          <div className="w-full mx-auto text-center p-6 space-y-5">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("upgrade_to_premium")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t("premium_description")}
            </p>
          </div>
        </GenericModal>
      )}

      <CreatePlotDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onPlotCreated={handlePlotCreated}
      />

      <PlotCoordinatesDialog
        landData={landData}
        open={isPlotCoordsDialogOpen}
        onOpenChange={setIsPlotCoordsDialogOpen}
        onSave={handleSaveCoordinatesPlot}
      />

      {isDetailsDialogOpen && (
        <GenericModal
          closeModal={() => setIsDetailsDialogOpen(false)}
          title={`${selectedPlot.plotName}`}
          height={true}
        >
          <PlotDetailsDialog plot={selectedPlot} onDelete={handleDeletePlot} />
        </GenericModal>
      )}
    </div>
  );
}
