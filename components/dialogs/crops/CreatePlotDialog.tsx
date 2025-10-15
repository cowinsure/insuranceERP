"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, ImageIcon, Trash2, Plus,LocateFixed  } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api"

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const defaultCenter = {
  lat: 23.8103, // Dhaka, Bangladesh
  lng: 90.4125,
}

interface Coordinate {
  lat: string
  lng: string
}

interface PlotData {
  landCoordinates: Coordinate[]
  plotCoordinates: Coordinate[]
  imageUrl: string
  plotName: string
  area: string
  description: string
}

interface CreatePlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlotCreated: (plot: PlotData , plotname:string,description:string) => void
}

export function CreatePlotDialog({ open, onOpenChange, onPlotCreated }: CreatePlotDialogProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([{ lat: "", lng: "" }])
  const [plotName, setPlotName] = useState("")
  const [plotDescription, setPlotDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [plotData, setPlotData] = useState<PlotData | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [apiPayload, setApiPayload] = useState<any>(null);
  const { toast } = useToast()
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const getCurrentLocation = (index: number) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateCoordinate(index, "lat", latitude.toFixed(6));
        updateCoordinate(index, "lng", longitude.toFixed(6));
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (open && navigator.geolocation) {
      // Preview map: get current position once
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  }, [open]);

  // Real-time location tracking for Plot Location map
  useEffect(() => {
    if (showResults && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setUserLocation(null);
        },
        { enableHighAccuracy: true }
      );
      setWatchId(id);
      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, [showResults]);

  const addCoordinate = () => {
    setCoordinates([...coordinates, { lat: "", lng: "" }])
  }

  const removeCoordinate = (index: number) => {
    if (coordinates.length > 1) {
      setCoordinates(coordinates.filter((_, i) => i !== index))
    }
  }

  const updateCoordinate = (index: number, field: "lat" | "lng", value: string) => {
    const updated = [...coordinates]
    updated[index][field] = value
    setCoordinates(updated)
  }

  const validateCoordinates = () => {
    return coordinates.every((coord) => {
      const lat = Number.parseFloat(coord.lat)
      const lng = Number.parseFloat(coord.lng)
      return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    })
  }

  const generatePlot = async () => {
    if (!plotName.trim()) {
      toast({
        title: "Plot name required",
        description: "Please enter a name for your plot.",
        variant: "destructive",
      })
      return
    }

    if (!validateCoordinates()) {
      toast({
        title: "Invalid coordinates",
        description: "Please check that all coordinates are valid (lat: -90 to 90, lng: -180 to 180).",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
 setApiErrorMessage(null);
    try {
      // Prepare the request body with land area coordinates
      const requestBody = {
        land_area: coordinates.map(coord => ({
          latitude: parseFloat(coord.lat),
          longitude: parseFloat(coord.lng)
        }))
      };

      console.log(requestBody);
      

      // Make the API call
      const response = await fetch("https://cropploting.dev.insurecow.com/landmap/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTb21lLXRlc3QtdXNlci0xMjM0NSIsInJvbGUiOiJBZG1pbl9UZXN0IiwiZXhwIjo4ODE1ODAyMjI4N30.EKD2bGCZ4KzaVrxjtf2wWE9XYIzbS_V-VKGPQIHsuyY"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
         let errorMsg = "Failed to generate plot. Please try again.";
        let errorJson: any = null;
        try {
          errorJson = await response.json();
          if (errorJson?.message) {
            errorMsg = errorJson.message;
          }
        } catch {}
        setApiErrorMessage(errorMsg);
        toast({
          title: "Generation failed",
          description: errorMsg,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const data = await response.json();
      console.log(data);

      // Extract fields from the correct structure
      const plotCoordinatesRaw = data.data?.plot_coordinate ?? [];
      const landAreaRaw = data.data?.land_area ?? [];
      const imageUrl = data.data?.image ?? "";
      const area = typeof data.area === "number" ? `${data.area.toFixed(2)} acres` : "N/A";

      setApiPayload(data); // Save full API payload

      const apiPlotData: PlotData = {
        plotName,
        landCoordinates: Array.isArray(landAreaRaw)
          ? landAreaRaw.map((coord: { latitude: number, longitude: number }) => ({
              lat: coord.latitude.toString(),
              lng: coord.longitude.toString()
            }))
          : [],
        plotCoordinates: Array.isArray(plotCoordinatesRaw)
          ? plotCoordinatesRaw.map((coord: { latitude: number, longitude: number }) => ({
              lat: coord.latitude.toString(),
              lng: coord.longitude.toString()
            }))
          : [],
        imageUrl,
        area,
        description: plotDescription,
      };

      setPlotData(apiPlotData);
      setShowResults(true);

      toast({
        title: "Plot generated successfully!",
        description: "Your crop plot has been processed and is ready for review.",
      });
    } catch (error) {
      console.error("Error generating plot:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate plot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const savePlot = () => {
    if (apiPayload) {
      onPlotCreated(apiPayload,plotName,plotDescription);
      toast({
        title: "Plot saved!",
        description: `${plotData?.plotName ?? ""} has been added to your plots.`,
      });
      handleClose();
    }
  }

  const handleClose = () => {
    setCoordinates([{ lat: "", lng: "" }])
    setPlotName("")
    setPlotDescription("")
    setIsGenerating(false)
    setShowResults(false)
    setPlotData(null)
    onOpenChange(false)
  }

  function sortPolygonCoords(coords: Coordinate[]): Coordinate[] {
    if (coords.length < 3) return coords;
    // Calculate centroid
    const centroid = coords.reduce(
      (acc, curr) => ({
        lat: acc.lat + parseFloat(curr.lat),
        lng: acc.lng + parseFloat(curr.lng),
      }),
      { lat: 0, lng: 0 }
    );
    centroid.lat /= coords.length;
    centroid.lng /= coords.length;
    // Sort by angle from centroid
    return [...coords].sort((a, b) => {
      const angleA = Math.atan2(parseFloat(a.lat) - centroid.lat, parseFloat(a.lng) - centroid.lng);
      const angleB = Math.atan2(parseFloat(b.lat) - centroid.lat, parseFloat(b.lng) - centroid.lng);
      return angleA - angleB;
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-screen max-w-none max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Create New Crop Plot
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showResults ? (
            <>
              {/* Plot Name */}
              <div className="space-y-2">
                <Label htmlFor="plotName">Plot Name *</Label>
                <Input
                  id="plotName"
                  placeholder="Enter plot name (e.g., North Field A)"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                />
              </div>

              {/* Plot Description */}
              <div className="space-y-2">
                <Label htmlFor="plotDescription">Plot Description</Label>
                <Textarea
                  id="plotDescription"
                  placeholder="Enter plot description"
                  value={plotDescription}
                  onChange={(e) => setPlotDescription(e.target.value)}
                />
              </div>

              {/* Coordinates Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Coordinates (Latitude, Longitude)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCoordinate}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Point
                  </Button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {coordinates.map((coord, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            placeholder="Latitude (e.g., 40.7128)"
                            value={coord.lat}
                            onChange={(e) => updateCoordinate(index, "lat", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Longitude (e.g., -74.0060)"
                            value={coord.lng}
                            onChange={(e) => updateCoordinate(index, "lng", e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => getCurrentLocation(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <LocateFixed className="h-4 w-4" />
                        </Button>
                      {coordinates.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCoordinate(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Map preview and coordinate selection */}
              {isLoaded && (
                <div className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Map Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={
                          coordinates.length > 0 && coordinates[0].lat && coordinates[0].lng
                            ? {
                                lat: parseFloat(coordinates[0].lat),
                                lng: parseFloat(coordinates[0].lng),
                              }
                            : userLocation
                              ? userLocation
                              : defaultCenter
                        }
                        zoom={15}
                        onClick={(e) => {
                          const newLat = e.latLng?.lat().toString() || "";
                          const newLng = e.latLng?.lng().toString() || "";
                          if (newLat && newLng) {
                            // Only add if not already present
                            if (!coordinates.some(coord => coord.lat === newLat && coord.lng === newLng)) {
                              setCoordinates([...coordinates, { lat: newLat, lng: newLng }]);
                            }
                          }
                        }}
                      >
                        {/* User GPS marker */}
                        {userLocation && (
                          <Marker
                            position={userLocation}
                            icon={{
                              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            }}
                          />
                        )}
                        {/* ...existing code for coordinate markers... */}
                        {coordinates
                          .filter(coord => coord.lat && coord.lng)
                          .map((coord, index) => (
                            <Marker
                              key={index}
                              position={{
                                lat: parseFloat(coord.lat),
                                lng: parseFloat(coord.lng),
                              }}
                            />
                          ))}
                      </GoogleMap>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={generatePlot} disabled={isGenerating}>
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Plot
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Results Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Plot Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Plot Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video w-full overflow-hidden rounded-lg border">
                      <img
                        src={plotData?.imageUrl || "/placeholder.svg"}
                        alt="Generated plot"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      <p>
                        <strong>Area:</strong> {plotData?.area}
                      </p>
                      <p>
                        <strong>Points:</strong> {plotData?.plotCoordinates?.length ?? 0} coordinates
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Coordinates Data */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Land Coordinates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {plotData?.landCoordinates.map((coord, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className="w-8 h-6 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-mono">
                              {coord.lat}, {coord.lng}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Plot Coordinates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {plotData?.plotCoordinates.map((coord, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="w-8 h-6 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-mono">
                              {coord.lat}, {coord.lng}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plot Description */}
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>Plot Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">{plotData?.description}</div>
                    </CardContent>
                  </Card> */}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={savePlot}>Save Plot</Button>
              </div>
            </>
          )}
          
          {/* Google Map */}
          {isLoaded && showResults && plotData && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Plot Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      userLocation
                        ? userLocation
                        : plotData.plotCoordinates && plotData.plotCoordinates.length > 0
                          ? {
                              lat: parseFloat(plotData.plotCoordinates[0].lat),
                              lng: parseFloat(plotData.plotCoordinates[0].lng),
                            }
                          : defaultCenter
                    }
                    zoom={15}
                  >
                    {/* User real-time GPS marker */}
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                      />
                    )}
                    {/* Plot Coordinates Polygon */}
                    {plotData.plotCoordinates && plotData.plotCoordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plotData.plotCoordinates).map(coord => ({
                          lat: parseFloat(coord.lat),
                          lng: parseFloat(coord.lng),
                        }))}
                        options={{
                          strokeColor: "#007bff",
                          strokeOpacity: 1,
                          strokeWeight: 3,
                          fillColor: "#007bff",
                          fillOpacity: 0,
                          clickable: false,
                          zIndex: 2,
                        }}
                      />
                    )}
                    {/* Land Coordinates Polygon */}
                    {plotData.landCoordinates && plotData.landCoordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plotData.landCoordinates).map(coord => ({
                          lat: parseFloat(coord.lat),
                          lng: parseFloat(coord.lng),
                        }))}
                        options={{
                          strokeColor: "#28a745",
                          strokeOpacity: 1,
                          strokeWeight: 3,
                          fillColor: "#28a745",
                          fillOpacity: 0,
                          clickable: false,
                          zIndex: 1,
                        }}
                      />
                    )}
                    {/* Markers for plot coordinates */}
                    {(plotData.plotCoordinates ?? []).map((coord, index) => (
                      <Marker
                        key={`plot-${index}`}
                        position={{
                          lat: parseFloat(coord.lat),
                          lng: parseFloat(coord.lng),
                        }}
                      />
                    ))}
                    {/* Markers for land coordinates */}
                    {(plotData.landCoordinates ?? []).map((coord, index) => (
                      <Marker
                        key={`land-${index}`}
                        position={{
                          lat: parseFloat(coord.lat),
                          lng: parseFloat(coord.lng),
                        }}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                      />
                    ))}
                  </GoogleMap>
                </CardContent>
              </Card>
            </div>
          )}
          {/* API error message */}
          {apiErrorMessage && (
            <div className="mt-4 text-center text-sm text-red-600">
              {apiErrorMessage}
            </div>
          )}
          {/* Area message at bottom */}
          {plotData?.area && (
            <div className="mt-2 text-center text-sm text-blue-700 font-semibold">
              Area: {plotData.area}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



