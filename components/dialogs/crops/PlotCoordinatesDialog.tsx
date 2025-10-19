"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, LocateFixed, MapPin } from "lucide-react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Coordinate {
  lat: string
  lng: string
}

interface PlotCoordinatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (coords: Coordinate[]) => void
}

export default function PlotCoordinatesDialog({ open, onOpenChange, onSave }: PlotCoordinatesDialogProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([
    { lat: "", lng: "" },
    { lat: "", lng: "" },
    { lat: "", lng: "" },
    { lat: "", lng: "" },
  ])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const mapContainerStyle = {
    width: "100%",
    height: "320px",
  }

  const defaultCenter = {
    lat: 23.8103,
    lng: 90.4125,
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const mapOptions: google.maps.MapOptions = {
    gestureHandling: 'cooperative',
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  }

  // preview current user location when dialog opens
  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      )
    }
  }, [open])

  // We enforce exactly 4 coordinate slots; no add/remove
  const addCoordinate = () => {}
  const removeCoordinate = (_index: number) => {}

  const updateCoordinate = (index: number, field: "lat" | "lng", value: string) => {
    const updated = [...coordinates]
    updated[index][field] = value
    setCoordinates(updated)
  }

  const getCurrentLocation = (index: number) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateCoordinate(index, "lat", position.coords.latitude.toFixed(6))
        updateCoordinate(index, "lng", position.coords.longitude.toFixed(6))
      },
      () => alert("Unable to retrieve location. Please allow location access."),
      { enableHighAccuracy: true }
    )
  }

  const handleSave = () => {
    // Validate the four coordinate slots
    const coordsToSave = coordinates.slice(0, 4)
    for (let i = 0; i < coordsToSave.length; i++) {
      const c = coordsToSave[i]
      if (!c.lat || !c.lng) {
        alert(`Please fill latitude and longitude for point ${i + 1}`)
        return
      }
      const lat = Number.parseFloat(c.lat)
      const lng = Number.parseFloat(c.lng)
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert(`Please enter valid numeric coordinates for point ${i + 1}`)
        return
      }
    }
    onSave(coordsToSave)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen max-w-none max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plot Coordinates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Coordinates (Latitude, Longitude)</Label>
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
              </div>
            ))}
          </div>

          {/* Map preview */}
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
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    options={mapOptions}
                    center={
                      coordinates.length > 0 && coordinates[0].lat && coordinates[0].lng
                        ? { lat: parseFloat(coordinates[0].lat), lng: parseFloat(coordinates[0].lng) }
                        : userLocation
                        ? userLocation
                        : defaultCenter
                    }
                    zoom={15}
                    onClick={(e) => {
                      const newLat = e.latLng?.lat().toString() || ""
                      const newLng = e.latLng?.lng().toString() || ""
                      if (newLat && newLng) {
                        // place into first empty slot if any; otherwise replace the last (4th) slot
                        const emptyIndex = coordinates.findIndex((c) => !c.lat || !c.lng)
                        if (emptyIndex !== -1) {
                          updateCoordinate(emptyIndex, "lat", newLat)
                          updateCoordinate(emptyIndex, "lng", newLng)
                        } else {
                          updateCoordinate(3, "lat", newLat)
                          updateCoordinate(3, "lng", newLng)
                        }
                      }
                    }}
                  >
                    {coordinates
                      .filter((c) => c.lat && c.lng)
                      .map((c, idx) => (
                        <Marker key={idx} position={{ lat: parseFloat(c.lat), lng: parseFloat(c.lng) }} />
                      ))}
                  </GoogleMap>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Coordinates</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
