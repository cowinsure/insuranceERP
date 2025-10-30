"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, ImageIcon, Trash2, Plus, LocateFixed } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import useApi from "@/hooks/use_api"
import { GoogleMap, Marker, Polygon, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { LandCoordinatePoint, LandSubmissionModel, LandSuitabilityRemark, normalizeLandSubmission } from "@/components/model/Land/LandSubmissionModel"



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
interface LandManualMeasurements {
  sw_se: number,
  se_ne: number,
  ne_nw: number,
  nw_sw: number
}

interface PlotData {
  landCoordinates: Coordinate[]
  plotCoordinates: Coordinate[]
  innerCoordinates: Coordinate[]
  plotManualEntry: Coordinate[] | null
  swMark?: Coordinate | null
  nCorner?: Coordinate | null
  eCorner?: Coordinate | null
  nMark?: Coordinate | null
  eMark?: Coordinate | null
  nMarkDist?: number | null
  eMarkDist?: number | null
  ncornerDist?: number | null
  ecornerDist?: number | null
  intersection?: Coordinate | null
  imageUrl: string
  plotName: string
  area: string
  description: string,
  LandManualMeasurements?: LandManualMeasurements


}

interface CreatePlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlotCreated: (plot: PlotData, plotname: string, description: string) => void
}

interface FarmerProfile {
  user_id: string | number
  farmer_name: string,
  mobile_number: string
}

export function CreatePlotDialog({ open, onOpenChange, onPlotCreated }: CreatePlotDialogProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([{ lat: "", lng: "" }])
  const [plotName, setPlotName] = useState("")
  const [landName, setLandName] = useState("")
  const [plotDescription, setPlotDescription] = useState("")
  const [ownershipType, setOwnershipType] = useState("")
  const [suitabilityReasons, setSuitabilityReasons] = useState<LandSuitabilityRemark[]>([]);
  const [nonSuitabilityReasons, setNonSuitabilityReasons] = useState<LandSuitabilityRemark[]>([]);
  // overall suitability selection: '', 'suitable', 'not_suitable'
  const [overallSuitability, setOverallSuitability] = useState<string>("")
  // land suitability options will be fetched from API

  console.log(suitabilityReasons);

  interface LandSuitability {
    type: string
    is_active: boolean
    created_at?: string | null
    created_by?: number | null
    modified_at?: string | null
    modified_by?: number | null
    land_suitability_id: number
    land_suitability_name: string
  }

  const [landSuitabilities, setLandSuitabilities] = useState<LandSuitability[]>([])
  const [lsLoading, setLsLoading] = useState(false)

  // derive suitable / not suitable lists for the UI
  const SUITABILITY_OPTIONS = useMemo(() =>
    landSuitabilities
      .filter((s) => String(s.type).toLowerCase().includes("suit"))
      .filter((s) => s.type === "Suitable")
      .map((s) => ({ id: String(s.land_suitability_id), text: s.land_suitability_name })),
    [landSuitabilities]
  )

  const NON_SUITABILITY_OPTIONS = useMemo(() =>
    landSuitabilities
      .filter((s) => s.type === "Not Suitable")
      .map((s) => ({ id: String(s.land_suitability_id), text: s.land_suitability_name })),
    [landSuitabilities]
  )
  const [measureSWSE, setMeasureSWSE] = useState("")
  const [measureSWNW, setMeasureSWNW] = useState("")
  const [measureNWNE, setMeasureNWNE] = useState("randomly generated width")
  const [measureSENE, setMeasureSENE] = useState("randomly generated length")
  const [isGenerating, setIsGenerating] = useState(false)
  // farmers list and selection
  const [farmers, setFarmers] = useState<FarmerProfile[]>([])
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null)
  const [farmersLoading, setFarmersLoading] = useState(false)
  const [farmerQuery, setFarmerQuery] = useState("")
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const filteredFarmers = useMemo(() => {
    const q = farmerQuery.trim().toLowerCase()
    if (!q) return farmers
    return farmers.filter((f) =>
      String(f.user_id).toLowerCase().includes(q) ||
      f.farmer_name.toLowerCase().includes(q) ||
      f.mobile_number.toLowerCase().includes(q)
    )
  }, [farmers, farmerQuery])


  

  useEffect(()=>{
function generateRandomNumber(maxNumber: number): number {
  if (maxNumber <= 0) return 0;

  const range = Math.floor(maxNumber * 0.5); // 50% of the limit
  return Math.floor(Math.random() * range) + 1; // between 1 and range
}
    // create random number and asignt it to random length field
    const randomLength = generateRandomNumber(parseInt(measureSWSE)) + 7;
    setMeasureSENE(randomLength.toString());
    console.log("measuring lenght" + randomLength);
    

  },[measureSWSE]);


  useEffect(()=>{
function generateRandomNumber(maxNumber: number): number {
   if (maxNumber <= 0) return 0;

  const range = Math.floor(maxNumber * 0.5); // 50% of the limit
  return Math.floor(Math.random() * range) + 1; // between 1 and range
}
    // create random number and asignt it to random length field
    const randomWidth = generateRandomNumber(parseInt(measureSWNW))+7;

    setMeasureNWNE(randomWidth.toString());
    console.log("measuring width" + randomWidth);
    

  },[measureSWNW]);

  useEffect(() => {
    // reset focused index when query changes
    setFocusedIndex(filteredFarmers.length > 0 ? 0 : -1)
  }, [farmerQuery, filteredFarmers.length])

  useEffect(() => {
    if (!comboboxOpen) setFocusedIndex(-1)
  }, [comboboxOpen])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setComboboxOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  function selectFarmer(f: FarmerProfile) {
    setSelectedFarmerId(String(f.user_id))
    setFarmerQuery(`${f.farmer_name} - ${f.mobile_number}`)
    setComboboxOpen(false)
  }
  const [plotData, setPlotData] = useState<PlotData | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [showMyLocation, setShowMyLocation] = useState<boolean>(false);
  const [apiPayload, setApiPayload] = useState<any>(null);
  const { toast } = useToast()
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [openInfoFor, setOpenInfoFor] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const { get } = useApi()
  const { post: landSubmissionAPi } = useApi()

  useEffect(() => {
    // fetch farmers when dialog opens
    if (!open) return
    let cancelled = false
    const fetchFarmers = async () => {
      setFarmersLoading(true)
      try {
        const resp = await get(`ims/farmer-service`, { params: { start_record: 1 } })
        console.log(resp);

        if (!cancelled && resp?.status === 'success' && Array.isArray(resp.data)) {
          setFarmers(resp.data)
        }
      } catch (err) {
        // ignore silently; toast could be added
      } finally {
        if (!cancelled) setFarmersLoading(false)
      }
    }
    fetchFarmers()
    return () => { cancelled = true }
  }, [open, get])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    const fetchSuitability = async () => {
      setLsLoading(true)
      try {
        const resp = await get(`lams/land-suitability-service/`, { params: { page_size: 10, start_record: 1 } })
        if (!cancelled && resp?.status === 'success' && Array.isArray(resp.data)) {
          setLandSuitabilities(resp.data)
        }
      } catch (err) {
        // ignore for now
      } finally {
        if (!cancelled) setLsLoading(false)
      }
    }
    fetchSuitability()
    return () => { cancelled = true }
  }, [open, get])

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
    // Only fetch once when dialog is open and user enabled the location toggle
    if (open && navigator.geolocation && showMyLocation) {
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
    if (!showMyLocation) {
      // If the toggle is off, clear any stored location
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
  }, [open, showMyLocation]);

  // Real-time location tracking for Plot Location map (only when user enabled the toggle)
  useEffect(() => {
    if (showResults && showMyLocation && navigator.geolocation) {
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
    // if conditions not met, ensure any existing watch is cleared
    return () => {
      if (watchId !== null && navigator.geolocation) {
        try {
          navigator.geolocation.clearWatch(watchId);
        } catch (e) {
          /* ignore */
        }
        setWatchId(null);
      }
    };
  }, [showResults, showMyLocation]);

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
        variant: "default",
      })
      return
    }

    // Validate manual measurements SW->SE and SW->NW
    const swseVal = Number(measureSWSE)
    const swnwVal = Number(measureSWNW)
    if (!measureSWSE.trim() || isNaN(swseVal) || swseVal <= 0) {
      toast({
        title: "Invalid measurement",
        description: "Please enter a valid numeric value (meters) for SW → SE.",
        variant: "default",
      })
      return
    }
    if (!measureSWNW.trim() || isNaN(swnwVal) || swnwVal <= 0) {
      toast({
        title: "Invalid measurement",
        description: "Please enter a valid numeric value (meters) for SW → NW.",
        variant: "default",
      })
      return
    }

    if(farmerQuery.trim() === "" || selectedFarmerId === null){
      toast({
        title: "Please select a farmer",
        description: "Please select a farmer from the dropdown list to proceed.",
        variant: "default",
      })
      return
    }

    

    if (!validateCoordinates()) {
      toast({
        title: "Invalid coordinates",
        description: "Please check that all coordinates are valid (lat: -90 to 90, lng: -180 to 180).",
        variant: "default",
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
        } catch { }
        setApiErrorMessage(errorMsg);
        toast({
          title: "Generation failed",
          description: errorMsg,
          variant: "default",
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
      const n_corner_dist = data.data?.n_corner_dist ?? null;
      const e_corner_dist = data.data?.e_corner_dist ?? null;

      setApiPayload(data); // Save full API payload

      const apiPlotData: PlotData = {
        plotName: plotName,
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
        ncornerDist: typeof n_corner_dist === 'number' ? n_corner_dist : null,
        ecornerDist: typeof e_corner_dist === 'number' ? e_corner_dist : null,
        intersection: intersection_raw ? { lat: intersection_raw.latitude.toString(), lng: intersection_raw.longitude.toString() } : null,
        imageUrl,
        area,
        description: plotDescription,
        LandManualMeasurements: {
          sw_se: parseInt(measureSWSE),
          se_ne: parseInt(measureSENE),
          ne_nw: parseInt(measureNWNE),
          nw_sw: parseInt(measureSWNW),
        },
        plotManualEntry: null
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
        variant: "default",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const savePlot = async () => {


    if (apiPayload) {
      onPlotCreated(apiPayload, plotName, plotDescription);
      toast({
        title: "Plot saved!",
        description: `${plotData?.plotName ?? ""} has been added to your plots.`,
      });

        //plot coordinate mapping
        const coordinates: LandCoordinatePoint[] = plotData?.plotCoordinates.map(coord => ({
          coordinate_type: 'plot',
          latitude: coord.lat,
          longitude: coord.lng
        })) || []


        //inner land  coordinate mapping
        const innerCoordinates: LandCoordinatePoint[] = plotData?.innerCoordinates.map(coord => ({
          coordinate_type: 'inner_area',
          latitude: coord.lat,
          longitude: coord.lng
        })) || []

        //inner land  coordinate mapping
        const landCoordinates: LandCoordinatePoint[] = plotData?.landCoordinates.map(coord => ({
          coordinate_type: 'land_area',
          latitude: coord.lat,
          longitude: coord.lng
        })) || []

        // reference point mapping
        const sw_mark = plotData?.swMark ? { latitude: plotData.swMark.lat, longitude: plotData.swMark.lng } : null;
        const n_corner = plotData?.nCorner ? { latitude: plotData.nCorner.lat, longitude: plotData.nCorner.lng } : null;
        const e_corner = plotData?.eCorner ? { latitude: plotData.eCorner.lat, longitude: plotData.eCorner.lng } : null;
        const n_mark = plotData?.nMark ? { latitude: plotData.nMark.lat, longitude: plotData.nMark.lng } : null;
        const e_mark = plotData?.eMark ? { latitude: plotData.eMark.lat, longitude: plotData.eMark.lng } : null;
        const intersection = plotData?.intersection ? { latitude: plotData.intersection.lat, longitude: plotData.intersection.lng } : null;

        // suitability mapping


        //arrange payload here 
        const landSubmissionModel: LandSubmissionModel =
        {
          farmer_id: selectedFarmerId ? Number(selectedFarmerId) : 0,
          land_name: plotName,
          ownership_type: ownershipType || "",
          land_suitability_details: overallSuitability === 'suitable' ? suitabilityReasons : nonSuitabilityReasons,

          area_in_acre: plotData?.area ? parseFloat(plotData.area) : 0,
          image: plotData?.imageUrl || null,
          land_measurement_info: {
            sw_se: plotData?.LandManualMeasurements?.sw_se || 0,
            se_ne: plotData?.LandManualMeasurements?.se_ne || 0,
            ne_nw: plotData?.LandManualMeasurements?.ne_nw || 0,
            nw_sw: plotData?.LandManualMeasurements?.nw_sw || 0,
            n_mark_dist: plotData?.nMarkDist || null,
            e_mark_dist: plotData?.eMarkDist || null,
            n_corner_dist: plotData?.ncornerDist || null,
            e_corner_dist: plotData?.ecornerDist || null,

          },


          land_coordinate_point: [
            ...coordinates,
            ...innerCoordinates,
            ...landCoordinates
          ],
          land_reference_point: [
            {
              point_type: 'sw_mark',
              latitude: sw_mark ? sw_mark.latitude : "",
              longitude: sw_mark ? sw_mark.longitude : ""
            },

            {
              point_type: 'n_corner',
              latitude: n_corner ? n_corner.latitude : "",
              longitude: n_corner ? n_corner.longitude : ""
            },
            {
              point_type: 'e_corner',
              latitude: e_corner ? e_corner.latitude : "",
              longitude: e_corner ? e_corner.longitude : ""
            },
            {
              point_type: 'n_mark',
              latitude: n_mark ? n_mark.latitude : "",
              longitude: n_mark ? n_mark.longitude : ""
            },
            {
              point_type: 'e_mark',
              latitude: e_mark ? e_mark.latitude : "",
              longitude: e_mark ? e_mark.longitude : ""
            },
            {
              point_type: 'intersection',
              latitude: intersection ? intersection.latitude : "",
              longitude: intersection ? intersection.longitude : ""
            }
          ],


        }

        console.log(landSubmissionModel);





        const payload = normalizeLandSubmission(apiPayload);

        // make api call here to save plot data to server
        try {
          const resp = await landSubmissionAPi(`lams/land-info-service/`, landSubmissionModel)
          // Expected success shape: { status: 'success', message: '...', data: { land_id: 31 } }
          if (resp?.status === 'success') {
            const landId = resp.data?.land_id ?? null
            toast({ title: 'Land saved', description: `Land saved successfully (ID: ${landId})` })
            // close dialog and reset
            handleClose()
          } else {
            // API returned a failure status - resp.message may contain reason
            const errMsg = resp?.message || 'Failed to save land'
            toast({ title: 'Save failed', description: errMsg, variant: 'default' })
          }
        } catch (err: any) {
          console.error('Error saving land submission:', err)
          const msg = err?.message || 'Network or server error while saving land'
          toast({ title: 'Save failed', description: msg, variant: 'default' })
        }
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
          return base + "green-dot.png";
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
                <div className="space-y-2">
                  <Label htmlFor="plotName">Land Name *</Label>
                  <Input
                    id="plotName"
                    placeholder="Enter plot name (e.g., North Field A)"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                  />
                </div>

                {/* Farmer selector (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="plotFarmer">Farmer</Label>
                  <div className="relative" ref={containerRef}>
                    {/* Combobox input (acts like trigger) */}
                    <Input
                      id="plotFarmer"
                      placeholder={farmersLoading ? "Loading farmers..." : "Search or select a farmer "}
                      value={farmerQuery}
                      onChange={(e) => {
                        setFarmerQuery(e.target.value)
                        setComboboxOpen(true)
                      }}
                      onFocus={() => setComboboxOpen(true)}
                      onKeyDown={(e) => {
                        const filtered = filteredFarmers
                        if (e.key === "ArrowDown") {
                          e.preventDefault()
                          setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1))
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault()
                          setFocusedIndex((i) => Math.max(i - 1, 0))
                        } else if (e.key === "Enter") {
                          e.preventDefault()
                          if (filtered.length > 0 && focusedIndex >= 0) {
                            const f = filtered[focusedIndex]
                            if (f) selectFarmer(f)
                          } else if (filtered.length === 1) {
                            selectFarmer(filtered[0])
                          }
                        } else if (e.key === "Escape") {
                          setComboboxOpen(false)
                        }
                      }}
                    />

                    {/* Dropdown list */}
                    <div
                      className={`absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-auto ${comboboxOpen ? "block" : "hidden"}`}
                    >
                      <div className="p-2 text-sm text-muted-foreground">Search results</div>
                      <div className="divide-y">
                        {filteredFarmers.length === 0 ? (
                          <div className="p-2 text-sm">No results</div>
                        ) : (
                          filteredFarmers.map((f, idx) => (
                            <div
                              key={String(f.user_id)}
                              role="option"
                              aria-selected={selectedFarmerId === String(f.user_id)}
                              className={`px-3 py-2 cursor-pointer hover:bg-accent/20 ${idx === focusedIndex ? "bg-accent/25" : ""}`}
                              onMouseEnter={() => setFocusedIndex(idx)}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectFarmer(f)}
                            >
                              <div className="font-medium">{f.farmer_name}</div>
                              <div className="text-xs text-muted-foreground">{f.mobile_number}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
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
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>

                    </SelectContent>
                  </Select>
                </div>

                {/* Land Suitability */}
                <div className="space-y-2">
                  <Label>Land Suitability</Label>
                  <div className="text-sm text-muted-foreground">Is this land suitable?</div>
                  <div className="pt-2">
                    <Select value={overallSuitability} onValueChange={(val: string) => {
                      // when switching modes, clear the opposite selections
                      if (val === 'suitable') {
                        setNonSuitabilityReasons([])
                      } else if (val === 'not_suitable') {
                        setSuitabilityReasons([])
                      }
                      setOverallSuitability(val)
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select suitability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suitable">Suitable</SelectItem>
                        <SelectItem value="not_suitable">Not suitable</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditional option lists based on overallSuitability */}
                  {overallSuitability === 'suitable' && (
                    <div className="space-y-2 pt-2">
                      {SUITABILITY_OPTIONS.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={suitabilityReasons.some(
                              (item) => item.land_suitability_id.toString() === opt.id
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) setSuitabilityReasons((s) => Array.from(new Set([...s, { land_suitability_id: opt.id, remarks: opt.text }])));
                              else setSuitabilityReasons((s) => s.filter((x) => x.land_suitability_id !== opt.id));
                            }}
                          />
                          <div className="flex-1 rounded-md bg-muted p-3 text-sm">{opt.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {overallSuitability === 'not_suitable' && (
                    <div className="space-y-2 pt-2">
                      {NON_SUITABILITY_OPTIONS.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={nonSuitabilityReasons.some(
                              (item) => item.land_suitability_id.toString() === opt.id
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) setNonSuitabilityReasons((s) => Array.from(new Set([...s,{land_suitability_id:opt.id,remarks:opt.text}])));
                              else setNonSuitabilityReasons((s) => s.filter((x) => x.land_suitability_id !== opt.id));
                            }}
                          />
                          <div className="flex-1 rounded-md bg-muted p-3 text-sm">{opt.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* <div className="mt-3 text-sm text-muted-foreground">Reasons for Non-Suitability (select all that apply)</div>
                <div className="space-y-2 pt-2">
                  {NON_SUITABILITY_OPTIONS.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={nonSuitabilityReasons.includes(opt.id)}
                        onCheckedChange={(checked) => {
                          if (checked) setNonSuitabilityReasons((s) => Array.from(new Set([...s, opt.id])));
                          else setNonSuitabilityReasons((s) => s.filter((x) => x !== opt.id));
                        }}
                      />
                      <div className="flex-1 rounded-md bg-muted p-3 text-sm">{opt.text}</div>
                    </div>
                  ))}
                </div> */}
                </div>

                {/* Land Measurements */}
                <div className="space-y-2">
                  <Label>Land Measurements</Label>
                  
                  <div className="flex flex-row gap-4">


                 
                  <div className="">
                  <div className="text-sm text-muted-foreground">SW → SE (meters)</div>
                  <Input placeholder="Enter measurement" value={measureSWSE} onChange={(e) =>
                   {
                        setMeasureSWSE(e.target.value)
                     
                    }
                  } />
                  </div>

                   <div>
                  <div className="text-sm text-muted-foreground">Length (meters)</div>
                  <Input placeholder="Random Length" disabled value={measureSENE} onChange={(e) => setMeasureSENE(e.target.value)} />
                  </div>

                   </div>
                  
                 
                  {/* <div className="text-sm text-muted-foreground">SE → NE (meters)</div>
                  <Input placeholder="Enter measurement" value={measureSENE} onChange={(e) => setMeasureSENE(e.target.value)} />
                  
                  <div className="text-sm text-muted-foreground"> NE → NW (meters)</div>
                  <Input placeholder="Enter measurement" value={measureNWNE} onChange={(e) => setMeasureNWNE(e.target.value)} /> */}
                    

                    <div className="flex flex-row gap-4">

<div>
                  <div className="text-sm text-muted-foreground">SW  → NW (meters)</div>
                  <Input placeholder="Enter measurement" value={measureSWNW} onChange={(e) => setMeasureSWNW(e.target.value)} />
</div>

                  <div>
                   <div className="text-sm text-muted-foreground"> Width (meters)</div>
                  <Input placeholder="Random Width" disabled value={measureNWNE} onChange={(e) => setMeasureNWNE(e.target.value)} />
                  </div>
                  </div>
                  
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
                      <CardHeader className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Map Preview
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Show my location</span>
                          <Switch checked={showMyLocation} onCheckedChange={(v) => setShowMyLocation(Boolean(v))} />
                        </div>
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
                          src={'https://insuranceportal-backend.insurecow.com/'+plotData?.imageUrl || "/placeholder.svg"}
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



