"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  FaUsers,
  FaSeedling,
  FaLeaf,
  FaWeight,
  FaTint,
  FaFileAlt,
} from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TbReportSearch } from "react-icons/tb";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FormInput } from "lucide-react";
import GenericModal from "@/components/ui/GenericModal";
import { useLocalization } from "@/core/context/LocalizationContext";
import CropStageModalTabs from "@/components/viewCropModal/CropStageModalTabs";
import { CropGetData } from "@/components/model/crop/CropGetModel";
import useApi from "@/hooks/use_api";
import { toast } from "sonner";
import { IoPerson } from "react-icons/io5";
// ================= TYPES =================

export interface CropRow {
  id: number;
  farmer_name: string;
  phone: string;
  kg?: number | null;
  moisture?: number | null;
  district_name?: string | null;
  stage?: string | null;
  date?: string | null;
  cropId: number;
}

interface ColumnDef {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "right" | "center";
}

interface SortState {
  key: string;
  dir: "asc" | "desc";
}

interface ApiResponse {
  data?: CropRow[];
  results?: CropRow[];
  total?: number;
  count?: number;
  meta?: {
    districts?: string[];
  };
}

interface CropReportingDashboardProps {
  apiEndpoint: string;
  pageSize?: number;
  columns?: ColumnDef[];
  exportFileName?: string;
}

interface StatCardProps {
  label: string;
  smallLabel: string;
  value: string | number;
  type?:
    | "totalCrops"
    | "totalHarvesting"
    | "totalPlotted"
    | "avgYield"
    | "avgMoisture";
}

interface StatCardMobileProps {
  value: any;
}

interface SortArrowProps {
  active?: boolean;
  dir?: "asc" | "desc";
}

// =================================================

const defaultColumns: ColumnDef[] = [
  { key: "sl", label: "SL", width: "w-auto" },
  { key: "farmer_name", label: "Farmer Name", width: "w-auto" },
  { key: "phone", label: "Phone", width: "w-auto" },
  { key: "kg", label: "KG", width: "w-auto", align: "center" },
  { key: "moisture", label: "Moisture (%)", width: "w-auto", align: "center" },
  { key: "district_name", label: "District", width: "w-auto" },
  { key: "action", label: "Action", width: "w-auto" },
];

function formatDateISO(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function downloadCSV(rows: Record<string, any>[], filename = "report.csv") {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(",")].concat(
    rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    )
  );

  const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CropReportingDashboard({
  apiEndpoint,
  pageSize: initialPageSize = 25,
  columns = defaultColumns,
  exportFileName = "crop-report.csv",
}: CropReportingDashboardProps) {
  const { t } = useLocalization();
  const { get } = useApi();

  // ---------------- Filters ----------------
  const [district, setDistrict] = useState<string>("");
  const [minKg, setMinKg] = useState<string>("");
  const [maxKg, setMaxKg] = useState<string>("");
  const [minMoisture, setMinMoisture] = useState<string>("");
  const [maxMoisture, setMaxMoisture] = useState<string>("");
  const [stage, setStage] = useState<string>("harvesting");
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [dateFrom, setDateFrom] = useState<string>(
    firstOfMonth.toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [selectedQuick, setSelectedQuick] = useState<string | null>(
    "currentMonth"
  );

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [sortBy, setSortBy] = useState<SortState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<CropRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [summary, setSummary] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isCropView, setIsCropView] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropGetData>();
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchDistricts = async () => {
    try {
      const response = await get("/coms/geography-service", {
        params: {
          page_size: 10,
          start_record: 1,
          division_id: -1,
          district_id: -1,
          ps_id: -1,
          village_or_area_id: -1,
        },
      });
      if (response.status === "success") {
        setDistricts(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch districts", error);
    }
  };

  // Initial data fetch on mount
  useEffect(() => {
    fetchData();
    fetchDistricts();
  }, []);

  // Fetch data when page or pageSize changes
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  useEffect(() => {
    if (selectedCropId !== null) {
      fetchSingleCrop(selectedCropId);
    }
  }, [selectedCropId]);

  // Helper functions for quick date selections
  const getPrevious7Days = () => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 7);
    return {
      from: from.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  };

  const getCurrentMonth = () => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: from.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  };

  const getLastMonth = () => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const to = new Date(today.getFullYear(), today.getMonth(), 0);
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  };

  const getLastYear = () => {
    const today = new Date();
    const from = new Date(today.getFullYear() - 1, 0, 1);
    const to = new Date(today.getFullYear() - 1, 11, 31);
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  };

  // ---------------- Fetch Function ----------------
  const fetchData = async () => {
    if (!apiEndpoint) {
      setError("Missing apiEndpoint prop");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = new URL(apiEndpoint, process.env.NEXT_PUBLIC_API_BASE_URL);
      if (pageSize !== -1) {
        url.searchParams.set("page_size", pageSize.toString());
      }
      url.searchParams.set("start_record", (page - 1 + 1).toString());
      if (minKg) url.searchParams.set("min_weight", minKg);
      if (maxKg) url.searchParams.set("max_weight", maxKg);
      if (minMoisture) url.searchParams.set("min_moisture", minMoisture);
      if (maxMoisture) url.searchParams.set("max_moisture", maxMoisture);
      if (dateFrom) url.searchParams.set("date_from", dateFrom);
      if (dateTo) url.searchParams.set("date_to", dateTo);
      if (district) url.searchParams.set("district", district);
      if (stage === "harvesting") url.searchParams.set("stage_id", "3");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const json = await res.json();
      if (json.status === "success") {
        const list = json.data.list;
        const apiSummary = json.data.summary;
        const mappedRows = list.map((item: any) => ({
          id: item.harvest_info_id,
          farmer_name: item.farmer_name,
          phone: item.mobile_number,
          kg: item.total_production_kg,
          moisture: item.moisture_content_percentage,
          district_name: item.zilla,
          stage: item.stage_name,
          date: item.harvest_date,
          cropId: item.crop_id,
        }));
        setRows(mappedRows);
        setTotal(list.length);
        setSummary(apiSummary);
        setHasMore(pageSize === -1 ? false : list.length === pageSize);
      } else {
        setError(json.message || "Failed to fetch");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;
    return [...rows].sort((a, b) => {
      const key = sortBy.key as keyof CropRow;
      let aVal = a[key];
      let bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortBy.dir === "asc" ? -1 : 1;
      if (bVal == null) return sortBy.dir === "asc" ? 1 : -1;
      const aStr = String(aVal);
      const bStr = String(bVal);
      if (sortBy.dir === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [rows, sortBy]);

  // GET single crop by id and set to state for view modal
  const fetchSingleCrop = async (cropId: number) => {
    if (!cropId) return null;
    // setIsViewLoading(true);
    try {
      const response = await get("/cms/crop-info-service", {
        params: {
          page_size: 10,
          start_record: 1,
          crop_id: cropId,
        },
      });

      if (response.status === "success") {
        // API returns an array of results; pick the first item if present
        const payload = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (payload) {
          setSelectedCrop(payload);
          return payload;
        }
      }
      return null;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch crop.";
      toast.error(message);
      return null;
    } finally {
      // setIsViewLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalCrops = summary?.total_harvests || 0;
    const totalHarvesting = summary?.total_harvests || 0;
    const totalPlotted = summary?.total_crops_plotted || 0;
    const avgYield = summary?.avg_production_kg || 0;
    const avgMoisture = summary?.avg_moisture_percent || 0;
    return { totalCrops, totalHarvesting, totalPlotted, avgYield, avgMoisture };
  }, [summary]);

  const handleSort = (key: string) => {
    if (sortBy && sortBy.key === key)
      setSortBy({ key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
    else setSortBy({ key, dir: "asc" });
    setPage(1);
  };

  const visibleCsvRows = useMemo(
    () =>
      sortedRows.map((r, idx) => ({
        sl: (page - 1) * pageSize + idx + 1,
        farmer_name: r.farmer_name,
        phone: r.phone,
        kg: r.kg,
        moisture: r.moisture,
        district_name: r.district_name,
        stage: r.stage,
        date: r.date,
      })),
    [sortedRows, page, pageSize]
  );

  const handleView = (cropId: number) => {
    if (!cropId) return;
    setSelectedCropId(cropId);
    setIsCropView(true);
  };

  return (
    <MotionConfig transition={{ duration: 0.35 }}>
      <div className="pb-20 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          <div className="lg:col-span-3 flex flex-col">
            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {/* Stats */}
              <div className="md:col-span-4 hidden lg:grid grid-cols-4 md:grid-cols-4 gap-2">
                <StatCard
                  label="Total Harvesting"
                  smallLabel="Harvesting"
                  value={stats.totalHarvesting}
                  type="totalHarvesting"
                />
                <StatCard
                  label="Total Plotted"
                  smallLabel="Plotted"
                  value={stats.totalPlotted}
                  type="totalPlotted"
                />
                <StatCard
                  label="Avg Yield (kg)"
                  smallLabel="Yield (kg)"
                  value={
                    Number.isFinite(stats.avgYield)
                      ? stats.avgYield.toFixed(2)
                      : "0.00"
                  }
                  type="avgYield"
                />
                <StatCard
                  label="Avg Moisture (%)"
                  smallLabel="Moisture (%)"
                  value={
                    Number.isFinite(stats.avgMoisture)
                      ? stats.avgMoisture.toFixed(2)
                      : "0.00"
                  }
                  type="avgMoisture"
                />
              </div>

              <div>
                <StatCardMobile value={stats} />
              </div>
            </motion.div>

            {/* Data Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3 bg-white p-3 md:p-4 rounded-lg md:rounded-2xl shadow-inner flex flex-col h-[85vh] lg:h-[73vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 lg:mb-5">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-700 pt-0 flex items-center gap-2">
                    <TbReportSearch size={25} /> Harvest Report
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center p-2 lg:px-4 lg:py-2 rounded-md border border-gray-300 text-gray-400 hover:bg-gray-200 transition text-sm cursor-pointer"
                    onClick={() => downloadCSV(visibleCsvRows, exportFileName)}
                  >
                    <FaDownload />
                    <span className="ml-0 md:ml-2 hidden md:block">
                      Export CSV
                    </span>
                  </button>
                  <button
                    className="lg:hidden flex items-center p-2 rounded-md border border-gray-300 text-gray-400 hover:bg-gray-200 transition text-sm cursor-pointer"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <MdOutlineFilterAlt />
                  </button>
                </div>
              </div>

              {/* Cards for mobile (sm to lg) */}
              <div className="block lg:hidden min-h-[500px] space-y-4 p-2 overflow-auto">
                {loading ? (
                  <div className="text-center p-6 text-sm text-gray-500">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-center p-6 text-sm text-red-500">
                    {error}
                  </div>
                ) : rows.length === 0 ? (
                  <div className="text-center p-6 text-sm text-gray-500">
                    No records found
                  </div>
                ) : (
                  sortedRows.map((r, idx) => (
                    <CropCard
                      key={r.id || idx}
                      r={r}
                      idx={idx}
                      page={page}
                      pageSize={pageSize}
                      handleView={handleView}
                    />
                  ))
                )}
              </div>

              {/* Table for desktop (lg and up) */}
              <div className="hidden lg:block overflow-x-auto min-h-[400px]">
                <table className="min-w-full table-auto bg-white ">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className={`px-3 py-3 ${col.width || "w-auto"}`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="flex items-center gap-2"
                              onClick={() => handleSort(col.key)}
                            >
                              <span className="">{col.label}</span>
                              <SortArrow
                                active={sortBy?.key === col.key}
                                dir={sortBy?.dir}
                              />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="p-6 text-center text-sm text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="p-6 text-center text-sm text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="p-6 text-center text-sm text-gray-500"
                        >
                          No records found
                        </td>
                      </tr>
                    ) : (
                      sortedRows.map((r, idx) => (
                        <motion.tr
                          key={r.id || idx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28 }}
                          className="border-b hover:bg-gray-50 *:p-2"
                        >
                          <td className="  text-sm text-center">
                            {(page - 1) * pageSize + idx + 1}
                          </td>
                          <td className="  text-sm text-center">
                            {r.farmer_name}
                          </td>
                          <td className="  text-sm text-center">{r.phone}</td>
                          <td className="  text-sm text-center">
                            {r.kg ?? "-"}
                          </td>
                          <td className="  text-sm text-center">
                            {r.moisture ?? "-"}
                          </td>
                          <td className="  text-sm text-center">
                            {r.district_name ?? "-"}
                          </td>
                          <td className="  text-sm flex items-center justify-center">
                            <Button
                              variant={"outline"}
                              onClick={() => handleView(Number(r.cropId))}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {summary?.total_harvests &&
                summary?.total_harvests >= 10 &&
                pageSize !== -1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
                    <div className="text-xs text-gray-600">
                      Showing {(page - 1) * pageSize + 1} -{" "}
                      {Math.min(page * pageSize, summary?.total_harvests || 0)}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="px-3 text-sm py-1 rounded-md border"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Prev
                      </button>
                      <div className="px-3 py-1 ">{page}</div>
                      <button
                        className="px-3 text-sm py-1 rounded-md border"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!hasMore}
                      >
                        Next
                      </button>
                    </div>
                    <button
                      className="px-3 text-sm py-1 rounded-md border "
                      onClick={() => {
                        setPageSize(-1);
                        setPage(1);
                      }}
                    >
                      Show All
                    </button>
                  </div>
                )}
              {pageSize === -1 && summary?.total_harvests && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
                  <div className="text-sm text-gray-600">
                    Showing all {summary.total_harvests} records
                  </div>
                  <button
                    className="px-3 py-1 rounded-md border bg-gray-600 text-white hover:bg-gray-700"
                    onClick={() => {
                      setPageSize(25);
                      setPage(1);
                    }}
                  >
                    Paginate
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Filters Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-inner hidden lg:block"
          >
            <CardTitle className="text-lg font-semibold text-gray-700 pt-0 flex items-center gap-1 mb-5">
              <MdOutlineFilterAlt size={25} /> Filters
            </CardTitle>

            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* District */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  District
                </label>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  list="district-list"
                  placeholder="Search district"
                  className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
                <datalist id="district-list">
                  <option value="" />
                  {districts.map((d: any) => (
                    <option key={d.id} value={d.district_name} />
                  ))}
                </datalist>
              </div>
              {/* KG */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    KG (min)
                  </label>
                  <input
                    value={minKg}
                    onChange={(e) => setMinKg(e.target.value)}
                    placeholder="0"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    KG (max)
                  </label>
                  <input
                    value={maxKg}
                    onChange={(e) => setMaxKg(e.target.value)}
                    placeholder="1000"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Moisture */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Moisture (min %)
                  </label>
                  <input
                    value={minMoisture}
                    onChange={(e) => setMinMoisture(e.target.value)}
                    placeholder="0"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Moisture (max %)
                  </label>
                  <input
                    value={maxMoisture}
                    onChange={(e) => setMaxMoisture(e.target.value)}
                    placeholder="30"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  <option value="">Select</option>
                  {/* <option value="initialization">Crop Initialization</option>
                  <option value="planting">Planting & Cultivation</option> */}
                  <option value="harvesting">Harvesting</option>
                </select>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom || new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setSelectedQuick(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={dateTo || new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setSelectedQuick(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Quick Date Selections */}
              <div className="">
                <label className="block text-sm text-gray-500 mb-1">
                  Show crop for
                </label>
                <div className="flex flex-wrap gap-2 px-2 py-2 border rounded-md border-gray-200">
                  <button
                    className={`px-3 py-1 rounded-sm transition text-xs ${
                      selectedQuick === "previous7days"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getPrevious7Days();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("previous7days");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Previous 7 days
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === "currentMonth"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getCurrentMonth();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("currentMonth");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Current month
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === "lastMonth"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getLastMonth();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("lastMonth");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Last month
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === "lastYear"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getLastYear();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("lastYear");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Last year
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-7 h-40">
              <div className="flex gap-2 items-end justify-between h-full">
                {/* Reset Button */}
                <button
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                  onClick={() => {
                    setDistrict("");
                    setMinKg("");
                    setMaxKg("");
                    setMinMoisture("");
                    setMaxMoisture("");
                    setStage("");
                    setDateFrom(new Date().toISOString().split("T")[0]);
                    setDateTo(new Date().toISOString().split("T")[0]);
                    setSelectedQuick(null);
                    setPage(1);
                    fetchData();
                  }}
                >
                  Reset
                </button>

                {/* Apply Button */}
                <button
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition text-sm"
                  onClick={() => {
                    setPage(1);
                    fetchData();
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Drawer for Mobile */}
      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-1">
              <MdOutlineFilterAlt size={25} /> Filters
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* District */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  District
                </label>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  list="district-list-mobile"
                  placeholder="Search district"
                  className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
                <datalist id="district-list-mobile">
                  <option value="" />
                  {districts.map((d: any) => (
                    <option key={d.id} value={d.district_name} />
                  ))}
                </datalist>
              </div>
              {/* KG */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    KG (min)
                  </label>
                  <input
                    value={minKg}
                    onChange={(e) => setMinKg(e.target.value)}
                    placeholder="0"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    KG (max)
                  </label>
                  <input
                    value={maxKg}
                    onChange={(e) => setMaxKg(e.target.value)}
                    placeholder="1000"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Moisture */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Moisture (min %)
                  </label>
                  <input
                    value={minMoisture}
                    onChange={(e) => setMinMoisture(e.target.value)}
                    placeholder="0"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Moisture (max %)
                  </label>
                  <input
                    value={maxMoisture}
                    onChange={(e) => setMaxMoisture(e.target.value)}
                    placeholder="30"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  <option value="">Select</option>
                  <option value="harvesting">Harvesting</option>
                </select>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom || new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setSelectedQuick(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={dateTo || new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setSelectedQuick(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* Quick Date Selections */}
              <div className="">
                <label className="block text-sm text-gray-500 mb-1">
                  Show crop for
                </label>
                <div className="flex flex-wrap gap-2 px-2 py-2 border rounded-md border-gray-200">
                  <button
                    className={`px-3 py-1 rounded-sm transition text-xs ${
                      selectedQuick === "previous7days"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getPrevious7Days();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("previous7days");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Previous 7 days
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === "currentMonth"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getCurrentMonth();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("currentMonth");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Current month
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === "lastMonth"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getLastMonth();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("lastMonth");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Last month
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === "lastYear"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      const d = getLastYear();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick("lastYear");
                      setPage(1);
                      fetchData();
                    }}
                  >
                    Last year
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-7">
              <div className="flex gap-2 justify-between">
                <button
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                  onClick={() => {
                    setDistrict("");
                    setMinKg("");
                    setMaxKg("");
                    setMinMoisture("");
                    setMaxMoisture("");
                    setStage("");
                    setDateFrom(new Date().toISOString().split("T")[0]);
                    setDateTo(new Date().toISOString().split("T")[0]);
                    setSelectedQuick(null);
                    setPage(1);
                    fetchData();
                    setIsFilterOpen(false);
                  }}
                >
                  Reset
                </button>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition text-sm"
                    onClick={() => {
                      setPage(1);
                      fetchData();
                      setIsFilterOpen(false);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Crop View Modal */}
      {isCropView && (
        <GenericModal
          closeModal={() => setIsCropView(false)}
          title={`${t("viewing_details_of")} ${
            selectedCrop?.crop_asset_seed_details?.[0]?.crop_name || "Crop"
          }`}
          height={true}
          widthValue="sm:w-[35%] md:min-w-[90%] lg:min-w-[60%] lg:max-w-[70%]"
        >
          <CropStageModalTabs data={selectedCrop} />
        </GenericModal>
      )}
    </MotionConfig>
  );
}

function CropCard({
  r,
  idx,
  page,
  pageSize,
  handleView,
}: {
  r: CropRow;
  idx: number;
  page: number;
  pageSize: number;
  handleView: (cropId: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
    >
      {/* Name, Number and btn */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <IoPerson size={30} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base text-gray-800 mb-1">
              {r.farmer_name}
            </h3>
            <p className="text-gray-600 text-sm font-medium">{r.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(Number(r.cropId))}
            className="shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-100 p-1.5 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
            KG
          </p>
          <p className="font-semibold text-gray-800 text-sm">{r.kg ?? "-"}</p>
        </div>
        <div className="bg-gray-100 p-1.5 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
            Moisture (%)
          </p>
          <p className="font-semibold text-gray-800 text-sm">
            {r.moisture ?? "-"}
          </p>
        </div>
        <div className="bg-gray-100 p-1.5 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
            District
          </p>
          <p className="font-semibold text-gray-800 text-sm">
            {r.district_name ?? "-"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, type, smallLabel }: StatCardProps) {
  const iconSize = 30;

  const getIcon = () => {
    switch (type) {
      case "totalCrops":
        return <FaUsers size={iconSize} className="text-indigo-500" />;
      case "totalHarvesting":
        return (
          <FaLeaf
            size={iconSize}
            className="text-green-500 w-[70%] md:w-full"
          />
        );
      case "totalPlotted":
        return (
          <FaSeedling
            size={iconSize}
            className="text-yellow-500 w-[70%] md:w-full"
          />
        );
      case "avgYield":
        return (
          <FaWeight
            size={iconSize}
            className="text-amber-500 w-[70%] md:w-full"
          />
        );
      case "avgMoisture":
        return (
          <FaTint size={iconSize} className="text-blue-500 w-[50%] md:w-full" />
        );
      default:
        return <FaUsers size={iconSize} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-white/80 to-gray-100 p-2 md:p-4 rounded-lg md:rounded-2xl shadow-lg flex items-center justify-between transition-transform duration-300"
    >
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <div className="">{getIcon()}</div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide hidden md:block">
              {label}
            </div>
            <div className="text-lg md:text-2xl font-bold md:mt-2 text-right">
              {value}
            </div>
          </div>
        </div>
        {/* <h3 className="text-[8px] text-gray-400 font-semibold text-center uppercase tracking-wide block md:hidden">
          {smallLabel}
        </h3> */}
      </div>
    </motion.div>
  );
}

function StatCardMobile({ value }: StatCardMobileProps) {
  const statsArray = [
    {
      label: "Harvesting",
      value: value.totalHarvesting,
      icon: <FaLeaf className="text-green-500" />,
    },
    {
      label: "Plotted",
      value: value.totalPlotted,
      icon: <FaSeedling className="text-yellow-500" />,
    },
    {
      label: "Avg Yield (kg)",
      value: Number.isFinite(value.avgYield)
        ? value.avgYield.toFixed(2)
        : "0.00",
      icon: <FaWeight className="text-amber-500" />,
    },
    {
      label: "Avg Moisture (%)",
      value: Number.isFinite(value.avgMoisture)
        ? value.avgMoisture.toFixed(2)
        : "0.00",
      icon: <FaTint className="text-blue-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:hidden bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-md p-3"
    >
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-gray-700">Quick Stats</h1>
      </div>
      <div className="space-y-3">
        {statsArray.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between pb-1 last:pb-0"
          >
            {/* Left: Icon + Label */}
            <div className="flex items-center gap-3">
              <div className="text-lg">{stat.icon}</div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </div>

            {/* Right: Value */}
            <p className="text- font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SortArrow({ active, dir }: SortArrowProps) {
  return (
    <span className="inline-flex flex-col ml-1">
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transform ${
          active && dir === "asc" ? "opacity-100" : "opacity-40"
        }`}
      >
        <path
          d="M1 6L5 2L9 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
