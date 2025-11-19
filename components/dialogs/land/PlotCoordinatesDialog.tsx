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
import { toast } from "@/hooks/use-toast"
import { useLocalization } from "@/core/context/LocalizationContext"

interface Coordinate {
  lat: string
  lng: string
}

export interface LandCoordinatePoint {
    coordinate_type: 'plot_manual';
    latitude: string;
    longitude: string;
}

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

interface PlotCoordinatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (coords: Coordinate[]) => void
  landData: LandData[];
}

export default function PlotCoordinatesDialog({ open, onOpenChange, onSave,landData }: PlotCoordinatesDialogProps) {
  const { t } = useLocalization()
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

  // Allow adding/removing coordinate slots
  const addCoordinate = () => {
    setCoordinates((prev) => [...prev, { lat: "", lng: "" }])
  }
  const removeCoordinate = (index: number) => {
    setCoordinates((prev) => prev.filter((_, i) => i !== index))
  }

  const updateCoordinate = (index: number, field: "lat" | "lng", value: string) => {
    const updated = [...coordinates]
    updated[index][field] = value
    setCoordinates(updated)
  }

  const getCurrentLocation = (index: number) => {
    if (!navigator.geolocation) {
      alert(t('geolocation_not_supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateCoordinate(index, "lat", position.coords.latitude.toFixed(6))
        updateCoordinate(index, "lng", position.coords.longitude.toFixed(6))
      },
      () => alert(t('unable_retrieve_location')),
      { enableHighAccuracy: true }
    )
  }

  const handleSave = () => {
    // Validate all coordinate slots
    if (coordinates.length === 0) {
      alert(t('please_add_at_least_one_coordinate'))
      return
    }
    for (let i = 0; i < coordinates.length; i++) {
      const c = coordinates[i]
      if (!c.lat || !c.lng) {
        alert(t('please_fill_lat_lng_for_point') + (i + 1))
        return
      }
      const lat = Number.parseFloat(c.lat)
      const lng = Number.parseFloat(c.lng)
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert(t('please_enter_valid_numeric_coordinates') + (i + 1))
        return
      }
    }


    //             //inner land  coordinate mapping
    //    const innerCoordinates: LandCoordinatePoint[] = coordinates.map(coord => ({
    //               coordinate_type: 'inner_area',
    //               latitude: coord.lat,
    //               longitude: coord.lng
    //             })) || []


    // const updatedLandData = {
    //   ...landData,
    //   land_coordinate_point: [
    //     ...landData.land_coordinate_point, // keep existing points
    //     ...innerCoordinates,                 // add new ones
    //   ],
    // };

    toast({ title: t('plot_saved'), description: t('plot_saved_successfully') })

    // onSave(coordinates)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen max-w-none max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('plot_coordinates')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('coordinates_lat_lng')}</Label>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {coordinates.map((coord, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <Badge variant="outline">{index + 1}</Badge>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder={t('latitude_example')}
                      value={coord.lat}
                      onChange={(e) => updateCoordinate(index, "lat", e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder={t('longitude_example')}
                      value={coord.lng}
                      onChange={(e) => updateCoordinate(index, "lng", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => getCurrentLocation(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <LocateFixed className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCoordinate(index)}
                    className="text-destructive hover:text-destructive"
                    title={t('remove_coordinate')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={addCoordinate} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t('add_coordinate')}
              </Button>
            </div>
          </div>

          {/* Map preview */}
          {isLoaded && (
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('map_preview')}
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
                        // place into first empty slot if any; otherwise append a new coordinate
                        const emptyIndex = coordinates.findIndex((c) => !c.lat || !c.lng)
                        if (emptyIndex !== -1) {
                          updateCoordinate(emptyIndex, "lat", newLat)
                          updateCoordinate(emptyIndex, "lng", newLng)
                        } else {
                          // append a new coordinate with clicked location
                          setCoordinates((prev) => [...prev, { lat: newLat, lng: newLng }])
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
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>{t('save_coordinates')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
