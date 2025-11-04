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
import { Bell, Search, Plus, Sparkles, Badge, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GenericModal from "@/components/ui/GenericModal";
import { useState, useEffect } from "react";
import { ProductsTable } from "@/components/products-table";
import { CreatePlotDialog } from "@/components/dialogs/land/CreatePlotDialog";
import { Card, CardContent } from "@/components/ui/card";
import PlotDetailsDialog from "@/components/dialogs/land/PlotDetailsDialog";
import PlotCoordinatesDialog from "@/components/dialogs/land/PlotCoordinatesDialog";
import useApi from "@/hooks/use_api";
import { group } from "console";

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
  const { get, loading, error } = useApi();

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

  const filteredPlots = landData.filter(
    (plot) =>
      plot.land_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.mobile_number.trim().includes(searchTerm.toLowerCase())
  );
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
   const groupedData= groupByCoordinateType(plot.land_coordinate_point);
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
      createdAt: plot.land_coordinate_point?.[0]?.created_at || new Date().toISOString(),
      status: "active",
      landCoordinates: groupedData?.land_area || [],
      plotCoordinates: groupedData?.plot|| [],
      innerCoordinates:groupedData?.inner_area || [],
      swMark: grouped_ref?.sw_mark?.[0] ?? null,
      nCorner: grouped_ref?.n_corner?.[0] ?? null,
      eCorner:grouped_ref?.e_corner?.[0] ?? null,
      nMark : grouped_ref?.n_mark?.[0] ?? null,
      eMark : grouped_ref?.e_mark?.[0] ?? null,
      nMarkDist: plot?.land_measurement_info?.[0]?.n_mark_dist ?? null,
      eMarkDist: plot?.land_measurement_info?.[0]?.e_mark_dist ?? null,
      ecornerDist: plot?.land_measurement_info?.[0]?.e_corner_dist ?? null,
      ncornerDist: plot?.land_measurement_info?.[0]?.n_corner_dist ?? null,
      intersection: grouped_ref?.intersection?.[0] ?? null,
      mobileNumber: plot?.mobile_number,
      farmerId: plot.farmer_id,
      farmerName: plot.farmer_name,
      suitability: plot.land_suitability_details?.map((d: any) => d.land_suitability_name) || [],
      length: plot?.land_measurement_info?.[0]?.se_ne ?? null,
      width: plot?.land_measurement_info?.[0]?.ne_nw ?? null,
      farmer_name: plot.farmer_name,
      mobile_number: plot.mobile_number,
    }




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
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Land Management
          </h1>
          <p className="text-gray-600">
            Create and manage lands and plots for insurance coverage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Land
          </Button>
        </div>
      </div>

      <div className="animate__animated animate__fadeIn flex flex-col gap-7">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Search</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by land name or farmer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Created Lands
              </h2>
              <span className="text-sm text-gray-500">
                {filteredPlots.length} lands found
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p>Loading...</p>
              </div>
            ) : filteredPlots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No lands found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first land entry to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Land
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile: card list */}
                <div className="space-y-4 md:hidden">
                  {filteredPlots.map((plot) => (
                    <div
                      key={plot.land_id}
                      className="border rounded-lg p-4 bg-white shadow-sm flex items-start gap-3"
                    >
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={'https://insuranceportal-backend.insurecow.com/'+plot.image || '/placeholder.svg'}
                          alt={plot.land_name}
                          className="w-auto object-fit"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{plot.land_name}</div>
                            <div className="text-sm text-gray-600">Owner: {plot.farmer_name}</div>
                          </div>
                          <div className="text-sm text-gray-500">{new Date(plot.land_coordinate_point[0]?.created_at).toLocaleDateString()}</div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm text-gray-600">{plot.mobile_number}</div>
                          <div className="flex flex-col items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(plot)}>
                              View
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // setPlotCoordsTargetId(plot.id)
                                // setIsPlotCoordsDialogOpen(true)
                              }}
                            >
                              <MapPin  />
                              Plot
                            </Button> */}
                          </div>
                        </div>

                        {plot.land_suitability_details && plot.land_suitability_details.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {plot.land_suitability_details.slice(0, 3).map((s) => (
                              <span key={s.land_suitable_details_id} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{s.land_suitability_name}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Land Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Farmer Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Contact Number
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Area (acres)
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Ownership
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlots.map((plot) => (
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
                            View Details
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
          </CardContent>
        </Card>
      </div>
      {isOpen && (
        <GenericModal closeModal={onClose}>
          <div className="w-full mx-auto text-center p-6 space-y-5">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Unlock the full power of the app with a{" "}
              <span className="font-bold text-gray-800">
                Premium subscription
              </span>
              . Enjoy exclusive features, faster performance, and tools
              designed to help you get the most out of your usage.
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

      <PlotDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        plot={selectedPlot}
        onDelete={handleDeletePlot}
      />
    </div>
  );
}
