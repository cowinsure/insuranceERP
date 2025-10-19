"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, ImageIcon, Trash2, Plus,LocateFixed  } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GoogleMap, Marker, Polygon, InfoWindow, useJsApiLoader } from "@react-google-maps/api"

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
  innerCoordinates?: Coordinate[]
  swMark?: Coordinate | null
  nCorner?: Coordinate | null
  eCorner?: Coordinate | null
  nMark?: Coordinate | null
  eMark?: Coordinate | null
  nMarkDist?: number | null
  eMarkDist?: number | null
  intersection?: Coordinate | null
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
  const [landName, setLandName] = useState("")
  const [plotDescription, setPlotDescription] = useState("")
  const [ownershipType, setOwnershipType] = useState("")
  const [suitabilityReasons, setSuitabilityReasons] = useState<string[]>([])
  const [nonSuitabilityReasons, setNonSuitabilityReasons] = useState<string[]>([])
  const [measureSWSE, setMeasureSWSE] = useState("")
  const [measureSWNW, setMeasureSWNW] = useState("")
  const [measureNWNE, setMeasureNWNE] = useState("")
  const [measureSENE, setMeasureSENE] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [plotData, setPlotData] = useState<PlotData | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [apiPayload, setApiPayload] = useState<any>(null);
  const { toast } = useToast()
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [openInfoFor, setOpenInfoFor] = useState<string | null>(null);

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

  // demo data 
  var apiPayloadDemo = {
    "land_area": [
      {
        "latitude": 23.77059158003182,
        "longitude": 90.4059435510674
      },
      {
        "latitude": 23.768004012086546,
        "longitude": 90.40556006776123
      },
      {
        "latitude": 23.768386947388315,
        "longitude": 90.40291004522925
      },
      {
        "latitude": 23.77093982059538,
        "longitude": 90.40333919867572
      }
    ]
  }

  const generatePlot = async () => {
    if (!plotName.trim()) {
      toast({
        title: "Land name required",
        description: "Please enter a name for your land plot.",
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
      // https://cropploting.dev.insurecow.com/landmap/generate/

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
  const innerAreaRaw = data.data?.inner_area ?? [];
  const imageUrl = data.data?.image ?? "";
  const area = typeof data.area === "number" ? `${data.area.toFixed(2)} acres` : "N/A";

  const sw_mark_raw = data.data?.sw_mark ?? null;
  const n_corner_raw = data.data?.n_corner ?? null;
  const e_corner_raw = data.data?.e_corner ?? null;
  const n_mark_raw = data.data?.n_mark ?? null;
  const e_mark_raw = data.data?.e_mark ?? null;
  const intersection_raw = data.data?.intersection ?? null;
  const n_mark_dist_raw = data.data?.n_mark_dist ?? null;
  const e_mark_dist_raw = data.data?.e_mark_dist ?? null;

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
        innerCoordinates: Array.isArray(innerAreaRaw)
          ? innerAreaRaw.map((coord: { latitude: number, longitude: number }) => ({
              lat: coord.latitude.toString(),
              lng: coord.longitude.toString()
            }))
          : [],
        swMark: sw_mark_raw ? { lat: sw_mark_raw.latitude.toString(), lng: sw_mark_raw.longitude.toString() } : null,
        nCorner: n_corner_raw ? { lat: n_corner_raw.latitude.toString(), lng: n_corner_raw.longitude.toString() } : null,
        eCorner: e_corner_raw ? { lat: e_corner_raw.latitude.toString(), lng: e_corner_raw.longitude.toString() } : null,
        nMark: n_mark_raw ? { lat: n_mark_raw.latitude.toString(), lng: n_mark_raw.longitude.toString() } : null,
  eMark: e_mark_raw ? { lat: e_mark_raw.latitude.toString(), lng: e_mark_raw.longitude.toString() } : null,
  nMarkDist: typeof n_mark_dist_raw === 'number' ? n_mark_dist_raw : null,
  eMarkDist: typeof e_mark_dist_raw === 'number' ? e_mark_dist_raw : null,
        intersection: intersection_raw ? { lat: intersection_raw.latitude.toString(), lng: intersection_raw.longitude.toString() } : null,
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

  function getMarkerIcon(kind: string) {
    // Use Google Maps simple colored dots
    const base = "http://maps.google.com/mapfiles/ms/icons/";
    switch (kind) {
      case "sw":
        return base + "purple-dot.png";
      case "n_corner":
        return base + "yellow-dot.png";
      case "e_corner":
        return base + "orange-dot.png";
      case "n_mark":
        return base + "red-dot.png";
      case "e_mark":
        return base + "pink-dot.png";
      case "intersection":
        return base + "black-dot.png";
      default:
        return base + "blue-dot.png";
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-screen max-w-none max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Create New Land
          </DialogTitle>
          <div className="text-sm text-muted-foreground mt-1">Create and manage land entries for insurance coverage.</div>
        </DialogHeader>

        <div className="space-y-6">
          {!showResults ? (
            <>
              {/* Land Name */}
              {/* <div className="space-y-2">
                <Label htmlFor="landName">Land Name</Label>
                <Input
                  id="landName"
                  placeholder="Enter land name"
                  value={landName}
                  onChange={(e) => setLandName(e.target.value)}
                />
              </div> */}

              {/* Plot Name */}
              <div className="space-y-2">
                <Label htmlFor="plotName">Land Name *</Label>
                <Input
                  id="plotName"
                  placeholder="Enter plot name (e.g., North Field A)"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                />
              </div>

              {/* Land Description */}
              <div className="space-y-2">
                <Label htmlFor="plotDescription">Land Description</Label>
                <Textarea
                  id="plotDescription"
                  placeholder="Enter land description"
                  value={plotDescription}
                  onChange={(e) => setPlotDescription(e.target.value)}
                />
              </div>

              {/* Ownership Type */}
              <div className="space-y-2">
                <Label htmlFor="ownershipType">Ownership Type</Label>
                <Select value={ownershipType} onValueChange={(value: string) => setOwnershipType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ownership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="communal">Communal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Land Suitability */}
              <div className="space-y-2">
                <Label>Land Suitability</Label>
                <div className="text-sm text-muted-foreground">Reasons for Suitability (select all that apply)</div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={suitabilityReasons.includes("good_soil")} onCheckedChange={(checked) => {
                      if (checked) setSuitabilityReasons([...suitabilityReasons, "good_soil"]) ; else setSuitabilityReasons(suitabilityReasons.filter(x=>x!=="good_soil"))
                    }} />
                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">Good soil quality</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={suitabilityReasons.includes("access_water")} onCheckedChange={(checked) => {
                      if (checked) setSuitabilityReasons([...suitabilityReasons, "access_water"]) ; else setSuitabilityReasons(suitabilityReasons.filter(x=>x!=="access_water"))
                    }} />
                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">Access to water</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={suitabilityReasons.includes("favorable_climate")} onCheckedChange={(checked) => {
                      if (checked) setSuitabilityReasons([...suitabilityReasons, "favorable_climate"]) ; else setSuitabilityReasons(suitabilityReasons.filter(x=>x!=="favorable_climate"))
                    }} />
                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">Favorable climate</div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">Reasons for Non-Suitability (select all that apply)</div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={nonSuitabilityReasons.includes("poor_soil")} onCheckedChange={(checked) => {
                      if (checked) setNonSuitabilityReasons([...nonSuitabilityReasons, "poor_soil"]) ; else setNonSuitabilityReasons(nonSuitabilityReasons.filter(x=>x!=="poor_soil"))
                    }} />
                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">Poor soil quality</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={nonSuitabilityReasons.includes("water_scarcity")} onCheckedChange={(checked) => {
                      if (checked) setNonSuitabilityReasons([...nonSuitabilityReasons, "water_scarcity"]) ; else setNonSuitabilityReasons(nonSuitabilityReasons.filter(x=>x!=="water_scarcity"))
                    }} />
                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">Water scarcity</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={nonSuitabilityReasons.includes("risk_flooding")} onCheckedChange={(checked) => {
                      if (checked) setNonSuitabilityReasons([...nonSuitabilityReasons, "risk_flooding"]) ; else setNonSuitabilityReasons(nonSuitabilityReasons.filter(x=>x!=="risk_flooding"))
                    }} />
                    <div className="flex-1 rounded-md bg-muted p-3 text-sm">Risk of flooding</div>
                  </div>
                </div>
              </div>

              {/* Land Measurements */}
              <div className="space-y-2">
                <Label>Land Measurements</Label>
                <div className="text-sm text-muted-foreground">SW → SE (meters)</div>
                <Input placeholder="Enter measurement" value={measureSWSE} onChange={(e)=>setMeasureSWSE(e.target.value)} />
                <div className="text-sm text-muted-foreground">SW → NW (meters)</div>
                <Input placeholder="Enter measurement" value={measureSWNW} onChange={(e)=>setMeasureSWNW(e.target.value)} />
                <div className="text-sm text-muted-foreground">NW → NE (meters)</div>
                <Input placeholder="Enter measurement" value={measureNWNE} onChange={(e)=>setMeasureNWNE(e.target.value)} />
                <div className="text-sm text-muted-foreground">SE → NE (meters)</div>
                <Input placeholder="Enter measurement" value={measureSENE} onChange={(e)=>setMeasureSENE(e.target.value)} />
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
                <Button onClick={savePlot}>Save Land</Button>
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
                    {/* Inner Area Polygon (if available) */}
                    {plotData.innerCoordinates && plotData.innerCoordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plotData.innerCoordinates).map(coord => ({
                          lat: parseFloat(coord.lat),
                          lng: parseFloat(coord.lng),
                        }))}
                        options={{
                          strokeColor: "#6f42c1", // purple
                          strokeOpacity: 1,
                          strokeWeight: 2,
                          fillColor: "#6f42c1",
                          fillOpacity: 0.05,
                          clickable: false,
                          zIndex: 3,
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
                        onClick={() => setOpenInfoFor(`plot-${index}`)}
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
                        onClick={() => setOpenInfoFor(`land-${index}`)}
                      />
                    ))}
                    {/* Special markers */}
                    {plotData.swMark && (
                      <Marker
                        key={`sw_mark`}
                        position={{ lat: parseFloat(plotData.swMark.lat), lng: parseFloat(plotData.swMark.lng) }}
                        icon={{ url: getMarkerIcon('sw') }}
                        onClick={() => setOpenInfoFor('sw_mark')}
                      />
                    )}
                    {plotData.nCorner && (
                      <Marker
                        key={`n_corner`}
                        position={{ lat: parseFloat(plotData.nCorner.lat), lng: parseFloat(plotData.nCorner.lng) }}
                        icon={{ url: getMarkerIcon('n_corner') }}
                        onClick={() => setOpenInfoFor('n_corner')}
                      />
                    )}
                    {plotData.eCorner && (
                      <Marker
                        key={`e_corner`}
                        position={{ lat: parseFloat(plotData.eCorner.lat), lng: parseFloat(plotData.eCorner.lng) }}
                        icon={{ url: getMarkerIcon('e_corner') }}
                        onClick={() => setOpenInfoFor('e_corner')}
                      />
                    )}
                    {plotData.nMark && (
                      <Marker
                        key={`n_mark`}
                        position={{ lat: parseFloat(plotData.nMark.lat), lng: parseFloat(plotData.nMark.lng) }}
                        icon={{ url: getMarkerIcon('n_mark') }}
                        onClick={() => setOpenInfoFor('n_mark')}
                      />
                    )}
                    {plotData.eMark && (
                      <Marker
                        key={`e_mark`}
                        position={{ lat: parseFloat(plotData.eMark.lat), lng: parseFloat(plotData.eMark.lng) }}
                        icon={{ url: getMarkerIcon('e_mark') }}
                        onClick={() => setOpenInfoFor('e_mark')}
                      />
                    )}
                    {plotData.intersection && (
                      <Marker
                        key={`intersection`}
                        position={{ lat: parseFloat(plotData.intersection.lat), lng: parseFloat(plotData.intersection.lng) }}
                        icon={{ url: getMarkerIcon('intersection') }}
                        onClick={() => setOpenInfoFor('intersection')}
                      />
                    )}
                    {/* InfoWindows for generic markers */}
                    {openInfoFor?.startsWith('plot-') && (() => {
                      const idx = Number(openInfoFor.split('-')[1]);
                      const coord = plotData.plotCoordinates?.[idx];
                      if (!coord) return null;
                      return (
                        <InfoWindow
                          position={{ lat: parseFloat(coord.lat), lng: parseFloat(coord.lng) }}
                          onCloseClick={() => setOpenInfoFor(null)}
                        >
                          <div className="text-sm">
                            <div className="font-semibold">Plot Point {idx + 1}</div>
                            <div className="font-mono">{coord.lat}, {coord.lng}</div>
                          </div>
                        </InfoWindow>
                      );
                    })()}
                    {openInfoFor?.startsWith('land-') && (() => {
                      const idx = Number(openInfoFor.split('-')[1]);
                      const coord = plotData.landCoordinates?.[idx];
                      if (!coord) return null;
                      return (
                        <InfoWindow
                          position={{ lat: parseFloat(coord.lat), lng: parseFloat(coord.lng) }}
                          onCloseClick={() => setOpenInfoFor(null)}
                        >
                          <div className="text-sm">
                            <div className="font-semibold">Land Point {idx + 1}</div>
                            <div className="font-mono">{coord.lat}, {coord.lng}</div>
                          </div>
                        </InfoWindow>
                      );
                    })()}
                    {openInfoFor === 'sw_mark' && plotData.swMark && (
                      <InfoWindow
                        position={{ lat: parseFloat(plotData.swMark.lat), lng: parseFloat(plotData.swMark.lng) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">SW Mark</div>
                          <div className="font-mono">{plotData.swMark.lat}, {plotData.swMark.lng}</div>
                        </div>
                      </InfoWindow>
                    )}
                    {openInfoFor === 'n_corner' && plotData.nCorner && (
                      <InfoWindow
                        position={{ lat: parseFloat(plotData.nCorner.lat), lng: parseFloat(plotData.nCorner.lng) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">N Corner</div>
                          <div className="font-mono">{plotData.nCorner.lat}, {plotData.nCorner.lng}</div>
                        </div>
                      </InfoWindow>
                    )}
                    {openInfoFor === 'e_corner' && plotData.eCorner && (
                      <InfoWindow
                        position={{ lat: parseFloat(plotData.eCorner.lat), lng: parseFloat(plotData.eCorner.lng) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">E Corner</div>
                          <div className="font-mono">{plotData.eCorner.lat}, {plotData.eCorner.lng}</div>
                        </div>
                      </InfoWindow>
                    )}
                    {/* Info windows for distances */}
                    {openInfoFor === 'n_mark' && plotData.nMark && (
                      <InfoWindow
                        position={{ lat: parseFloat(plotData.nMark.lat), lng: parseFloat(plotData.nMark.lng) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">N Mark</div>
                          <div>{(plotData.nMarkDist ?? 0).toFixed(2)} meters</div>
                        </div>
                      </InfoWindow>
                    )}
                    {openInfoFor === 'e_mark' && plotData.eMark && (
                      <InfoWindow
                        position={{ lat: parseFloat(plotData.eMark.lat), lng: parseFloat(plotData.eMark.lng) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">E Mark</div>
                          <div>{(plotData.eMarkDist ?? 0).toFixed(2)} meters</div>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Legend for special markers */}
          {showResults && plotData && (
            <div className="mt-3 flex flex-wrap gap-3 items-center justify-center">
              <div className="flex items-center gap-2 text-sm">
                <img src={getMarkerIcon('sw')} alt="sw" className="w-4 h-4" /> <span>SW Mark</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <img src={getMarkerIcon('n_corner')} alt="n_corner" className="w-4 h-4" /> <span>N Corner</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <img src={getMarkerIcon('e_corner')} alt="e_corner" className="w-4 h-4" /> <span>E Corner</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <img src={getMarkerIcon('n_mark')} alt="n_mark" className="w-4 h-4" /> <span>N Mark</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <img src={getMarkerIcon('e_mark')} alt="e_mark" className="w-4 h-4" /> <span>E Mark</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <img src={getMarkerIcon('intersection')} alt="intersection" className="w-4 h-4" /> <span>Intersection</span>
              </div>
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



