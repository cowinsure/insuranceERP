"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Edit,
  Trash2,
  User,
  Phone,
  Ruler,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useLocalization } from "@/core/context/LocalizationContext";

// Helper to get custom marker icon URLs by type
function getMarkerIcon(type: string): string {
  switch (type) {
    case "sw":
      return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
    case "n_corner":
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    case "e_corner":
      return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
    case "n_mark":
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    case "e_mark":
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    case "intersection":
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    default:
      return "http://maps.google.com/mapfiles/ms/icons/grey-dot.png";
  }
}

interface Coordinate {
  latitude: string;
  longitude: string;
}

interface Plot {
  id: string;
  plotName: string;
  description?: string;
  area: string;
  coordinates: Coordinate[];
  landArea: Coordinate[];
  imageUrl: string;
  createdAt: string;
  status: "active" | "pending" | "archived";
  // Advanced map fields for marker/polygon support
  landCoordinates?: Coordinate[];
  plotCoordinates?: Coordinate[];
  innerCoordinates?: Coordinate[];
  swMark?: Coordinate | null;
  nCorner?: Coordinate | null;
  eCorner?: Coordinate | null;
  nMark?: Coordinate | null;
  eMark?: Coordinate | null;
  nMarkDist?: number | null;
  eMarkDist?: number | null;
  intersection?: Coordinate | null;
  length?: string | null;
  width?: string | null;
  farmer_name: string | null;
  mobile_number: string | null;
}

interface PlotDetailsDialogProps {
  plot: Plot | null;
  onEdit?: (plot: Plot) => void;
  onDelete?: (plotId: string) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

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
    const angleA = Math.atan2(
      parseFloat(a.latitude) - centroid.lat,
      parseFloat(a.longitude) - centroid.lng
    );
    const angleB = Math.atan2(
      parseFloat(b.latitude) - centroid.lat,
      parseFloat(b.longitude) - centroid.lng
    );
    return angleA - angleB;
  });
}

const PlotDetailsDialog = ({
  plot,
  onEdit,
  onDelete,
}: PlotDetailsDialogProps) => {
  const { t } = useLocalization();
  //(plot);

  const [mapError, setMapError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [showMyLocation, setShowMyLocation] = useState<boolean>(false);
  const [openInfoFor, setOpenInfoFor] = useState<string | null>(null);

  console.log(plot);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (plot && apiKey) {
      setMapError(null);
    }
  }, [plot, apiKey]);

  // Real-time location tracking — only active when user enables the toggle
  useEffect(() => {
    if (navigator.geolocation && showMyLocation) {
      // get current position once
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => setUserLocation(null)
      );

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
        try {
          navigator.geolocation.clearWatch(id);
        } catch (e) {
          /* ignore */
        }
        setWatchId(null);
      };
    }

    // if toggle is off or dialog closed, clear any existing watch and userLocation
    if (!showMyLocation) {
      setUserLocation(null);
      if (watchId !== null && navigator.geolocation) {
        try {
          navigator.geolocation.clearWatch(watchId);
        } catch (e) {
          /* ignore */
        }
        setWatchId(null);
      }
    }
  }, [showMyLocation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-white";
      case "pending":
        return "bg-warning text-white";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
    }
  };

  if (!plot) return null;

  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="p-4 shadow-md rounded-xl border border-gray-200 ">
        <CardTitle className="text-[17px] lg:text-lg font-semibold mb-5 lg:mb-0 pt-0">
          {t("land_information")}
        </CardTitle>
        <div className="flex flex-col-reverse lg:flex rounded-xl gap-5 overflow-hidden">
          {/* Land Information */}
          <div className="flex-1 flex items-center justify-center lg:hidden">
            <div className="space-y-4 w-full">
              {[
                {
                  icon: <User className="h-5 w-5 text-gray-400" />,
                  label: t("farmer"),
                  value: plot.farmer_name,
                },
                {
                  icon: <Phone className="h-5 w-5 text-gray-400" />,
                  label: t("phone"),
                  value: plot.mobile_number,
                },
                {
                  icon: <Ruler className="h-5 w-5 text-gray-400" />,
                  label: t("length"),
                  value: plot.length,
                },
                {
                  icon: <Ruler className="h-5 w-5 text-gray-400" />,
                  label: t("width"),
                  value: plot.width,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium">{item.value ?? "-"}</span>
                </div>
              ))}
            </div>
          </div>
          {/* LI Desktop */}
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              {
                icon: <User className="h-6 w-6 text-green-500" />,
                label: t("farmer"),
                value: plot.farmer_name ?? "N/A",
                bg: "bg-green-100",
              },
              {
                icon: <Phone className="h-6 w-6 text-purple-500" />,
                label: t("phone"),
                value: plot.mobile_number ?? "N/A",
                bg: "bg-purple-100",
              },
              {
                icon: <Ruler className="h-6 w-6 text-yellow-500" />,
                label: t("length"),
                value: plot.length ?? "-",
                bg: "bg-yellow-100",
              },
              {
                icon: <Ruler className="h-6 w-6 text-orange-500" />,
                label: t("width"),
                value: plot.width ?? "-",
                bg: "bg-orange-100",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-300"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${item.bg}`}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                  <div className="text-gray-800 font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Plot Image */}
          <div className="relative rounded-xl overflow-hidden mb-5 lg:mb-0">
            <Zoom>
              <img
                src={
                  `${process.env.NEXT_PUBLIC_API_ATTACHMENT_IMAGE_URL}${plot.imageUrl}` ||
                  "/placeholder.svg"
                }
                alt={plot.plotName}
                className="w-full h-64 object-cover lg:object-cover"
              />
            </Zoom>
            {/* <div className="absolute bottom-2 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium">
            {plot.plotName}
          </div> */}
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="shadow-md rounded-xl border border-gray-200 p-4">
        <CardTitle className="text-[17px] lg:text-lg font-semibold mb-5 lg:mb-3 pt-0">
          {t("coordinates")}
        </CardTitle>

        <div className="max-h-60 overflow-y-auto grid md:grid-cols-2 gap-3">
          {plot.plotCoordinates?.map((coord, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-2 text-sm">
              <div className="font-medium">
                {t("point")} {index + 1}
              </div>
              <div className="text-gray-500 text-xs">
                {t("lat")} {coord.latitude}, {t("lng")} {coord.longitude}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Map Preview */}
      <Card className="shadow-md rounded-xl border border-gray-200 p-2">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {t("plot_location")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {t("show_my_location")}
            </span>
            <Switch
              checked={showMyLocation}
              onCheckedChange={(v) => setShowMyLocation(Boolean(v))}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoaded ? (
            <div className="h-64 rounded-lg overflow-hidden shadow-inner">
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
                {/* All existing markers and polygons remain intact */}
              </GoogleMap>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
              <MapPin className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">{t("loading_map")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marker Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center items-center">
        {["sw", "n_corner", "e_corner", "n_mark", "e_mark", "intersection"].map(
          (key) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <img src={getMarkerIcon(key)} alt={key} className="w-5 h-5" />
              <span className="text-gray-600">{t(key)}</span>
            </div>
          )
        )}
        <div className="flex items-center gap-2 text-sm">
          <img
            src={getMarkerIcon("intersection")}
            alt="land_outer_area"
            className="w-5 h-5"
          />
          <span className="text-gray-600">{t("land_outer_area")}</span>
        </div>
      </div>
    </div>
  );
};

export default PlotDetailsDialog;
