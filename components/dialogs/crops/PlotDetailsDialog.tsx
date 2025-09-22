"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api"

interface Coordinate {
  lat: string
  lng: string
}

interface Plot {
  id: string
  plotName: string
  area: string
  coordinates: Coordinate[]
  landArea?: Coordinate[] // <-- add optional landCoordinates
  imageUrl: string
  createdAt: string
  status: "active" | "pending" | "archived"
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
  if (coords.length < 3) return coords
  const centroid = coords.reduce(
    (acc, curr) => ({
      lat: acc.lat + parseFloat(curr.lat),
      lng: acc.lng + parseFloat(curr.lng),
    }),
    { lat: 0, lng: 0 }
  )
  centroid.lat /= coords.length
  centroid.lng /= coords.length
  return [...coords].sort((a, b) => {
    const angleA = Math.atan2(parseFloat(a.lat) - centroid.lat, parseFloat(a.lng) - centroid.lng)
    const angleB = Math.atan2(parseFloat(b.lat) - centroid.lat, parseFloat(b.lng) - centroid.lng)
    return angleA - angleB
  })
}

const PlotDetailsDialog = ({ open, onOpenChange, plot, onEdit, onDelete }: PlotDetailsDialogProps) => {
  const [mapError, setMapError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    if (open && plot && apiKey) {
      setMapError(null)
    }
  }, [open, plot, apiKey])

  // Real-time location tracking
  useEffect(() => {
    if (open && navigator.geolocation) {
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
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId)
        }
      }
    }
  }, [open])

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
            <img src={plot.imageUrl || "/placeholder.svg"} alt={plot.plotName} className="w-full h-full object-cover" />
          </div>

          {/* Plot Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plot Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{plot.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-medium">{plot.coordinates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(plot.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plot ID:</span>
                  <span className="font-medium">{plot.id}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coordinates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {plot.coordinates.map((coord, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded-md">
                      <div className="font-medium">Point {index + 1}</div>
                      <div className="text-muted-foreground">
                        Lat: {coord.lat}, Lng: {coord.lng}
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
            </CardHeader>
            <CardContent>
              {isLoaded ? (
                <div className="space-y-2">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      userLocation
                        ? userLocation
                        : plot.coordinates && plot.coordinates.length > 0
                          ? {
                              lat: parseFloat(plot.coordinates[0].lat),
                              lng: parseFloat(plot.coordinates[0].lng),
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
                    {/* Polygon for plot coordinates */}
                    {plot.coordinates && plot.coordinates.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plot.coordinates).map((coord) => ({
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
                    {/* Polygon for land coordinates */}
                    {plot.landArea && plot.landArea.length > 2 && (
                      <Polygon
                        path={sortPolygonCoords(plot.landArea).map((coord) => ({
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
                    {(plot.coordinates ?? []).map((coord, index) => (
                      <Marker
                        key={`plot-${index}`}
                        position={{
                          lat: parseFloat(coord.lat),
                          lng: parseFloat(coord.lng),
                        }}
                      />
                    ))}
                    {/* Markers for land coordinates */}
                    {(plot.landArea ?? []).map((coord, index) => (
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

        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(plot)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Plot
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(plot.id)}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Plot
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}



export default PlotDetailsDialog
