"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Edit, Trash2, User, Phone, Ruler } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api"
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";




// Helper to get custom marker icon URLs by type
function getMarkerIcon(type: string): string {
  switch (type) {
    case 'sw':
      return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    case 'n_corner':
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    case 'e_corner':
      return 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
    case 'n_mark':
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    case 'e_mark':
      return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    case 'intersection':
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    default:
      return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
  }
}

interface Coordinate {
  latitude: string
  longitude: string
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
  length?: string | null
  width?: string | null
  farmer_name: string | null,
  mobile_number: string | null,
}

interface PlotDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plot: Plot | null
  onEdit?: (plot: Plot) => void
  onDelete?: (plotId: string) => void
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
}

 function sortPolygonCoords(coords: Coordinate[]): Coordinate[] {
      if (coords.length < 3) return coords;
      // Calculate centroid
      const centroid = coords.reduce(
        (acc, curr) => ({
          lat: acc.lat + parseFloat(curr.latitude),
          lng: acc.lng + parseFloat(curr.longitude),
        }),
        { lat: 0, lng: 0 }
      );
      centroid.lat /= coords.length;
      centroid.lng /= coords.length;
      // Sort by angle from centroid
      return [...coords].sort((a, b) => {
        const angleA = Math.atan2(parseFloat(a.latitude) - centroid.lat, parseFloat(a.longitude) - centroid.lng);
        const angleB = Math.atan2(parseFloat(b.latitude) - centroid.lat, parseFloat(b.longitude) - centroid.lng);
        return angleA - angleB;
      });
    }

const PlotDetailsDialog = ({ open, onOpenChange, plot, onEdit, onDelete }: PlotDetailsDialogProps) => {

  //(plot);

  const [mapError, setMapError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [showMyLocation, setShowMyLocation] = useState<boolean>(false)
  const [openInfoFor, setOpenInfoFor] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    if (open && plot && apiKey) {
      setMapError(null)
    }
  }, [open, plot, apiKey])

  // Real-time location tracking — only active when user enables the toggle
  useEffect(() => {
    if (open && navigator.geolocation && showMyLocation) {
      // get current position once
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => setUserLocation(null)
      )

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        () => {
          setUserLocation(null)
        },
        { enableHighAccuracy: true }
      )
      setWatchId(id)
      return () => {
        try {
          navigator.geolocation.clearWatch(id)
        } catch (e) {
          /* ignore */
        }
        setWatchId(null)
      }
    }

    // if toggle is off or dialog closed, clear any existing watch and userLocation
    if (!showMyLocation) {
      setUserLocation(null)
      if (watchId !== null && navigator.geolocation) {
        try {
          navigator.geolocation.clearWatch(watchId)
        } catch (e) {
          /* ignore */
        }
        setWatchId(null)
      }
    }
  }, [open, showMyLocation])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-white"
      case "pending":
        return "bg-warning text-white"
      case "archived":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false)
      
    }
  }

  if (!plot) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              {plot.plotName}
            </DialogTitle>
            <Badge className={getStatusColor(plot.status)}>{plot.status}</Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Plot Image */}
          <div className="aspect-video relative overflow-hidden rounded-lg border">
            <Zoom>
              <img
                src={'https://insuranceportal-backend.insurecow.com/'+plot.imageUrl || "/placeholder.svg"}
                alt={plot.plotName}
                className="w-full h-full object-cover"
              />
            </Zoom>
            {/* <img src={plot.imageUrl || "/placeholder.svg"} alt={plot.plotName} className="w-full h-full object-cover" /> */}
          </div>

          {/* Land Information */}
          <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Land Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Farmer</span>
                    </div>
                    <span className="font-medium">{plot.farmer_name ?? "-"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone</span>
                    </div>
                    <span className="font-medium">{plot.mobile_number ?? "-"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Length</span>
                    </div>
                    <span className="font-medium">{plot.length ?? "-"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Width</span>
                    </div>
                    <span className="font-medium">{plot.width ?? "-"}</span>
                  </div>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-medium">{plot.coordinates.length}</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(plot.createdAt).toLocaleDateString()}
                  </span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Plot ID:</span>
                  <span className="font-medium">{plot.id}</span>
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coordinates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {plot.plotCoordinates?.map((coord, index) => (
                    
                    <div key={index} className="text-sm p-2 bg-muted rounded-md">
                      <div className="font-medium">Point {index + 1}</div>
                      <div className="text-muted-foreground">
                        Lat: {coord.latitude}, Lng: {coord?.longitude}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps Preview (from CreatePlotDialog) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Plot Location</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show my location</span>
                <Switch checked={showMyLocation} onCheckedChange={(v) => setShowMyLocation(Boolean(v))} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoaded ? (
                <div className="space-y-2">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      userLocation
                        ? userLocation
                        : plot.plotCoordinates && plot.plotCoordinates.length > 0
                          ? {
                            lat: parseFloat(plot.plotCoordinates[0].latitude),
                            lng: parseFloat(plot.plotCoordinates[0].longitude),
                          }
                          : defaultCenter
                    }
                    zoom={15}
                  >
                    {/* User real-time GPS marker */}
                    {showMyLocation && userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                      />
                    )}
                    {/* Plot Coordinates Polygon */}
                    {plot.plotCoordinates && plot.plotCoordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plot.plotCoordinates).map(coord => ({
                          lat: parseFloat(coord.latitude),
                          lng: parseFloat(coord.longitude),
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
                    {plot.innerCoordinates && plot.innerCoordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plot.innerCoordinates).map(coord => ({
                          lat: parseFloat(coord.latitude),
                          lng: parseFloat(coord.longitude),
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
                    {plot.landCoordinates && plot.landCoordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plot.landCoordinates).map(coord => ({
                          lat: parseFloat(coord.latitude),
                          lng: parseFloat(coord.longitude),
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
                    {(plot.plotCoordinates ?? []).map((coord, index) => (
                      <Marker
                        key={`plot-${index}`}
                        position={{
                          lat: parseFloat(coord.latitude),
                          lng: parseFloat(coord.longitude),
                        }}
                        
                        onClick={() => setOpenInfoFor(`plot-${index}`)}
                      />
                    ))}
                    {/* Markers for land coordinates */}
                    {(plot.landCoordinates ?? []).map((coord, index) => (
                      <Marker
                        key={`land-${index}`}
                        position={{
                          lat: parseFloat(coord.latitude),
                          lng: parseFloat(coord.longitude),
                        }}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }}
                        onClick={() => setOpenInfoFor(`land-${index}`)}
                      />
                    ))}
                    {/* Special markers */}
                    {plot.swMark && (
                      <Marker
                        key={`sw_mark`}
                        position={{ lat: parseFloat(plot.swMark.latitude), lng: parseFloat(plot.swMark.longitude) }}
                        icon={{ url: getMarkerIcon('sw') }}
                        onClick={() => setOpenInfoFor('sw_mark')}
                      />
                    )}
                    {plot.nCorner && (
                      <Marker
                        key={`n_corner`}
                        position={{ lat: parseFloat(plot.nCorner.latitude), lng: parseFloat(plot.nCorner.longitude) }}
                        icon={{ url: getMarkerIcon('n_corner') }}
                        onClick={() => setOpenInfoFor('n_corner')}
                      />
                    )}
                    {plot.eCorner && (
                      <Marker
                        key={`e_corner`}
                        position={{ lat: parseFloat(plot.eCorner.latitude), lng: parseFloat(plot.eCorner.longitude) }}
                        icon={{ url: getMarkerIcon('e_corner') }}
                        onClick={() => setOpenInfoFor('e_corner')}
                      />
                    )}
                    {plot.nMark && (
                      <Marker
                        key={`n_mark`}
                        position={{ lat: parseFloat(plot.nMark.latitude), lng: parseFloat(plot.nMark.longitude) }}
                        icon={{ url: getMarkerIcon('n_mark') }}
                        onClick={() => setOpenInfoFor('n_mark')}
                      />
                    )}
                    {plot.eMark && (
                      <Marker
                        key={`e_mark`}
                        position={{ lat: parseFloat(plot.eMark.latitude), lng: parseFloat(plot.eMark.longitude) }}
                        icon={{ url: getMarkerIcon('e_mark') }}
                        onClick={() => setOpenInfoFor('e_mark')}
                      />
                    )}
                    {plot.intersection && (
                      <Marker
                        key={`intersection`}
                        position={{ lat: parseFloat(plot.intersection.latitude), lng: parseFloat(plot.intersection.longitude) }}
                        icon={{ url: getMarkerIcon('intersection') }}
                        onClick={() => setOpenInfoFor('intersection')}
                      />
                    )}
                    {/* InfoWindows for generic markers */}
                    {openInfoFor?.startsWith('plot-') && (() => {
                      const idx = Number(openInfoFor.split('-')[1]);
                      const coord = plot.plotCoordinates?.[idx];
                      if (!coord) return null;
                      return (
                        <InfoWindow
                          position={{ lat: parseFloat(coord.latitude), lng: parseFloat(coord.longitude) }}
                          onCloseClick={() => setOpenInfoFor(null)}
                        >
                          <div className="text-sm">
                            <div className="font-semibold">Plot Point {idx + 1}</div>
                            <div className="font-mono">{coord.latitude}, {coord.longitude}</div>
                          </div>
                        </InfoWindow>
                      );
                    })()}
                    {openInfoFor?.startsWith('land-') && (() => {
                      const idx = Number(openInfoFor.split('-')[1]);
                      const coord = plot.landCoordinates?.[idx];
                      if (!coord) return null;
                      return (
                        <InfoWindow
                          position={{ lat: parseFloat(coord.latitude), lng: parseFloat(coord.longitude) }}
                          onCloseClick={() => setOpenInfoFor(null)}
                        >
                          <div className="text-sm">
                            <div className="font-semibold">Land Point {idx + 1}</div>
                            <div className="font-mono">{coord.latitude}, {coord.longitude}</div>
                          </div>
                        </InfoWindow>
                      );
                    })()}
                    {openInfoFor === 'sw_mark' && plot.swMark && (
                      <InfoWindow
                        position={{ lat: parseFloat(plot.swMark.latitude), lng: parseFloat(plot.swMark.longitude) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">SW Mark</div>
                          <div className="font-mono">{plot.swMark.latitude}, {plot.swMark.longitude}</div>
                        </div>
                      </InfoWindow>
                    )}
                    {openInfoFor === 'n_corner' && plot.nCorner && (
                      <InfoWindow
                        position={{ lat: parseFloat(plot.nCorner.latitude), lng: parseFloat(plot.nCorner.longitude) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">N Corner</div>
                          <div className="font-mono">{plot.nCorner.latitude}, {plot.nCorner.longitude}</div>
                        </div>
                      </InfoWindow>
                    )}
                    {openInfoFor === 'e_corner' && plot.eCorner && (
                      <InfoWindow
                        position={{ lat: parseFloat(plot.eCorner.latitude), lng: parseFloat(plot.eCorner.longitude) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">E Corner</div>
                          <div className="font-mono">{plot.eCorner.latitude}, {plot.eCorner.longitude}</div>
                        </div>
                      </InfoWindow>
                    )}
                    {/* Info windows for distances */}
                    {openInfoFor === 'n_mark' && plot.nMark && (
                      <InfoWindow
                        position={{ lat: parseFloat(plot.nMark.latitude), lng: parseFloat(plot.nMark.longitude) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">N Mark</div>
                          <div>{(plot.nMarkDist ?? 0).toFixed(2)} meters</div>
                        </div>
                      </InfoWindow>
                    )}
                    {openInfoFor === 'e_mark' && plot.eMark && (
                      <InfoWindow
                        position={{ lat: parseFloat(plot.eMark.latitude), lng: parseFloat(plot.eMark.longitude) }}
                        onCloseClick={() => setOpenInfoFor(null)}
                      >
                        <div className="text-sm">
                          <div className="font-semibold">E Mark</div>
                          <div>{(plot.eMarkDist ?? 0).toFixed(2)} meters</div>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Loading map...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>



        <Separator />

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

                 <div className="flex items-center gap-2 text-sm">
                  <img src={getMarkerIcon('intersection')} alt="intersection" className="w-4 h-4" /> <span>Land Outer area</span>
                </div>
              </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(plot)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Plot
              </Button>
            )}
            {/* {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(plot.id)}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Plot
              </Button>
            )} */}
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}



export default PlotDetailsDialog
