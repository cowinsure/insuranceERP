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
import { CreatePlotDialog } from "@/components/dialogs/crops/CreatePlotDialog";
import { Card, CardContent } from "@/components/ui/card";
import PlotDetailsDialog from "@/components/dialogs/crops/PlotDetailsDialog";
import PlotCoordinatesDialog from "@/components/dialogs/crops/PlotCoordinatesDialog";

interface PlotData {
  landCoordinates: { lat: string; lng: string }[]
  plotCoordinates: { lat: string; lng: string }[]
  imageUrl: string
  plotName: string
  area: string
}
interface Coordinate {
  lat: string;
  lng: string;
}

interface Plot {
  id: string
  plotName: string
  description?: string
  area: string
  coordinates: Coordinate[]
  landArea: Coordinate[]
  imageUrl: string
  createdAt: string
  status: "active" | "pending" | "archived"
  // Advanced map fields for marker/polygon support
  landCoordinates?: Coordinate[]
  plotCoordinates?: Coordinate[]
  innerCoordinates?: Coordinate[]
  swMark?: Coordinate | null
  nCorner?: Coordinate | null
  eCorner?: Coordinate | null
  nMark?: Coordinate | null
  eMark?: Coordinate | null
  nMarkDist?: number | null
  eMarkDist?: number | null
  intersection?: Coordinate | null
}

export default function CropPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPlotCoordsDialogOpen, setIsPlotCoordsDialogOpen] = useState(false)
  const [plotCoordsTargetId, setPlotCoordsTargetId] = useState<string | null>(null)
  const [plots, setPlots] = useState<Plot[]>([])
  const [searchTerm, setSearchTerm] = useState("")
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const filteredPlots = plots.filter(
    (plot) =>
      (plot.plotName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      plot.coordinates?.some((coord) => (coord.lat ?? "").includes(searchTerm) || (coord.lng ?? "").includes(searchTerm)),
  )
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handlePlotCreated = ( apiPayload: any , plotName: string, plotDescription: string) => {

    console.log(apiPayload);
  const plotCoordinatesRaw = apiPayload.data?.plot_coordinate ?? [];
  const innerAreaRaw = apiPayload.data?.inner_area ?? [];
  const landAreaRaw = apiPayload.data?.land_area ?? [];
    
  const sw_mark_raw = apiPayload?.data?.sw_mark ?? null;
  const n_corner_raw = apiPayload?.data?.n_corner ?? null;
  const e_corner_raw = apiPayload?.data?.e_corner ?? null;
  const n_mark_raw = apiPayload?.data?.n_mark ?? null;
  const e_mark_raw = apiPayload?.data?.e_mark ?? null;
  const intersection_raw = apiPayload?.data?.intersection ?? null;
  const n_mark_dist_raw = apiPayload?.data?.n_mark_dist ?? null;
  const e_mark_dist_raw = apiPayload?.data?.e_mark_dist ?? null;
    

  
    const plotCoordinates =
      apiPayload?.data?.plot_coordinate?.map((coord: { latitude: number, longitude: number }) => ({
        lat: coord.latitude.toString(),
        lng: coord.longitude.toString(),
      })) ?? [];

       const landArea =
      apiPayload?.data?.land_area?.map((coord: { latitude: number, longitude: number }) => ({
        lat: coord.latitude.toString(),
        lng: coord.longitude.toString(),
      })) ?? [];
    const area =
      typeof apiPayload?.area === "number"
        ? `${apiPayload.area.toFixed(2)} meters²`
        : "N/A";
    const imageUrl = apiPayload?.data?.image ?? "";
    const newPlot: Plot = {
      id: Date.now().toString(),
      plotName,
      description: plotDescription,
      area,
      coordinates: plotCoordinates,
      plotCoordinates:  Array.isArray(plotCoordinatesRaw)
          ? plotCoordinatesRaw.map((coord: { latitude: number, longitude: number }) => ({
              lat: coord.latitude.toString(),
              lng: coord.longitude.toString()
            }))
          : [],
      innerCoordinates:  Array.isArray(innerAreaRaw)
          ? innerAreaRaw.map((coord: { latitude: number, longitude: number }) => ({
              lat: coord.latitude.toString(),
              lng: coord.longitude.toString()
            }))
          : [],
          landArea:landArea,
          landCoordinates: Array.isArray(landAreaRaw)
          ? landAreaRaw.map((coord: { latitude: number, longitude: number }) => ({
              lat: coord.latitude.toString(),
              lng: coord.longitude.toString()
            }))
          : [],
          imageUrl,
      createdAt: new Date().toISOString(),
      status: "active",
       swMark: sw_mark_raw ? { lat: sw_mark_raw.latitude.toString(), lng: sw_mark_raw.longitude.toString() } : null,
        nCorner: n_corner_raw ? { lat: n_corner_raw.latitude.toString(), lng: n_corner_raw.longitude.toString() } : null,
        eCorner: e_corner_raw ? { lat: e_corner_raw.latitude.toString(), lng: e_corner_raw.longitude.toString() } : null,
        nMark: n_mark_raw ? { lat: n_mark_raw.latitude.toString(), lng: n_mark_raw.longitude.toString() } : null,
  eMark: e_mark_raw ? { lat: e_mark_raw.latitude.toString(), lng: e_mark_raw.longitude.toString() } : null,
  nMarkDist: typeof n_mark_dist_raw === 'number' ? n_mark_dist_raw : null,
  eMarkDist: typeof e_mark_dist_raw === 'number' ? e_mark_dist_raw : null,
        intersection: intersection_raw ? { lat: intersection_raw.latitude.toString(), lng: intersection_raw.longitude.toString() } : null,
       
    };
    setPlots((prev) => [...prev, newPlot]);
  }

  
  const handleViewDetails = (plot: Plot) => {
    setSelectedPlot(plot)
    setIsDetailsDialogOpen(true)
  }

  const handleEditPlot = (plot: Plot) => {
    // TODO: Implement edit functionality
    console.log("Edit plot:", plot)
  }

  const handleSaveCoordinatesPlot = (coords: Coordinate[]) => {
    if (plotCoordsTargetId) {
      // Update existing plot with new coordinates
      setPlots((prev) =>
        prev.map((p) =>
          p.id === plotCoordsTargetId
            ? {
                ...p,
                coordinates: coords,
                plotCoordinates: coords,
                landArea: coords,
              }
            : p
        )
      )
      setPlotCoordsTargetId(null)
    } else {
      // Build a minimal plot from provided coordinates
      const newPlot: Plot = {
        id: Date.now().toString(),
        plotName: `Manual Plot ${plots.length + 1}`,
        description: "Coordinates entered manually",
        area: "N/A",
        coordinates: coords,
        plotCoordinates: coords,
        innerCoordinates: [],
        landArea: coords,
        imageUrl: "",
        createdAt: new Date().toISOString(),
        status: "active",
      }
      setPlots((prev) => [...prev, newPlot])
    }
    setIsPlotCoordsDialogOpen(false)
  }

  const handleDeletePlot = (plotId: string) => {
    setPlots((prev) => prev.filter((plot) => plot.id !== plotId))
    setIsDetailsDialogOpen(false)
  }

  // Load plots from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("plots");
    if (stored) {
      try {
        setPlots(JSON.parse(stored));
      } catch {
        setPlots([]);
      }
    }
  }, []);

  // Save plots to localStorage whenever plots change
  useEffect(() => {

    
    localStorage.setItem("plots", JSON.stringify(plots));
  }, [plots]);

  return (
   

    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Land Management
          </h1>
          <p className="text-gray-600">Create and manage lands and plots for insurance coverage</p>
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
        {/* <ProductStats /> */}
        {/* <ProductFilters />
        <ProductsTable /> */}
          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by plot name or coordinates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Plots List */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Created Plots</h2>
                <span className="text-sm text-gray-500">{filteredPlots.length} plots found</span>
              </div>

              {filteredPlots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No plots found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Create your first land entry to get started"}
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
                      <div key={plot.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{plot.plotName}</div>
                            <div className="text-sm text-gray-600">{plot.area}</div>
                          </div>
                          <div className="text-sm text-gray-500">{new Date(plot.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-gray-600">{plot.coordinates.length} points</div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(plot)}>
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPlotCoordsTargetId(plot.id)
                                setIsPlotCoordsDialogOpen(true)
                              }}
                            >
                              <MapPin className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Plot Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Area</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Points</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlots.map((plot) => (
                          <tr key={plot.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-900">{plot.plotName}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600">{plot.area}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600">{plot.coordinates.length} points</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600">{new Date(plot.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td className="py-4 px-4">
                            </td>
                            <td className="py-4 px-4 flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewDetails(plot)}>
                                View Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setPlotCoordsTargetId(plot.id)
                                  setIsPlotCoordsDialogOpen(true)
                                }}
                              >
                                <MapPin className="w-4 h-4 mr-2" />
                                Plot Coordinates
                              </Button>
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
            {/* Icon */}
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              Unlock the full power of the app with a{" "}
              <span className="font-bold text-gray-800">
                Premium subscription
              </span>
              . Enjoy exclusive features, faster performance, and tools designed
              to help you get the most out of your usage.
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
