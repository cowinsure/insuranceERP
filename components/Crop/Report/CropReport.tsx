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
import { TbReportSearch } from "react-icons/tb";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// ================= TYPES =================

export interface CropRow {
  id?: number | string;
  farmer_name: string;
  phone: string;
  kg?: number | null;
  moisture?: number | null;
  district_name?: string | null;
  stage?: string | null;
  date?: string | null;
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
  value: string | number;
  type?:
    | "totalCrops"
    | "totalHarvesting"
    | "totalPlotted"
    | "avgYield"
    | "avgMoisture";
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
  { key: "kg", label: "KG", width: "w-auto", align: "right" },
  { key: "moisture", label: "Moisture (%)", width: "w-auto", align: "right" },
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

// Debounce kept but commented
// function useDebounced<T>(value: T, delay = 350): T {
//   const [v, setV] = useState<T>(value);
//   useEffect(() => {
//     const t = setTimeout(() => setV(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return v;
// }

export default function CropReportingDashboard({
  apiEndpoint,
  pageSize = 25,
  columns = defaultColumns,
  exportFileName = "crop-report.csv",
}: CropReportingDashboardProps) {
  // ---------------- Filters ----------------
  const [district, setDistrict] = useState<string>("");
  const [minKg, setMinKg] = useState<string>("");
  const [maxKg, setMaxKg] = useState<string>("");
  const [minMoisture, setMinMoisture] = useState<string>("");
  const [maxMoisture, setMaxMoisture] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dateTo, setDateTo] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<CropRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

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
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
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
      const payload = {
        filters: {
          district: district || null,
          kg: {
            gte: minKg ? Number(minKg) : null,
            lte: maxKg ? Number(maxKg) : null,
          },
          moisture: {
            gte: minMoisture ? Number(minMoisture) : null,
            lte: maxMoisture ? Number(maxMoisture) : null,
          },
          stage: stage || null,
          date_from: formatDateISO(dateFrom),
          date_to: formatDateISO(dateTo),
        },
        page,
        page_size: pageSize,
        sort: sortBy
          ? `${sortBy.dir === "desc" ? "-" : ""}${sortBy.key}`
          : null,
      };

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const json: ApiResponse = await res.json();
      const data = json.data || json.results || [];
      setRows(data);
      setTotal(json.total ?? json.count ?? data.length);

      if (json.meta?.districts) setDistrictOptions(json.meta.districts);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalCrops = total || 0;
    const totalHarvesting = rows.filter((r) =>
      r.stage?.toLowerCase().includes("harvest")
    ).length;
    const totalPlotted = rows.length;
    const avgYield = rows.length
      ? rows.reduce((s, r) => s + (Number(r.kg) || 0), 0) / rows.length
      : 0;
    const avgMoisture = rows.length
      ? rows.reduce((s, r) => s + (Number(r.moisture) || 0), 0) / rows.length
      : 0;
    return { totalCrops, totalHarvesting, totalPlotted, avgYield, avgMoisture };
  }, [rows, total]);

  const handleSort = (key: string) => {
    if (sortBy && sortBy.key === key)
      setSortBy({ key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
    else setSortBy({ key, dir: "asc" });
    setPage(1);
  };

  const visibleCsvRows = useMemo(
    () =>
      rows.map((r, idx) => ({
        sl: (page - 1) * pageSize + idx + 1,
        farmer_name: r.farmer_name,
        phone: r.phone,
        kg: r.kg,
        moisture: r.moisture,
        district_name: r.district_name,
        stage: r.stage,
        date: r.date,
      })),
    [rows, page, pageSize]
  );

  return (
    <MotionConfig transition={{ duration: 0.35 }}>
      <div>
        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          {/* Stats */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard
              label="Total Crops"
              value={stats.totalCrops}
              type="totalCrops"
            />
            <StatCard
              label="Total Harvesting"
              value={stats.totalHarvesting}
              type="totalHarvesting"
            />
            <StatCard
              label="Total Plotted"
              value={stats.totalPlotted}
              type="totalPlotted"
            />
            <StatCard
              label="Avg Yield (kg)"
              value={
                Number.isFinite(stats.avgYield)
                  ? stats.avgYield.toFixed(2)
                  : "0.00"
              }
              type="avgYield"
            />
            <StatCard
              label="Avg Moisture (%)"
              value={
                Number.isFinite(stats.avgMoisture)
                  ? stats.avgMoisture.toFixed(2)
                  : "0.00"
              }
              type="avgMoisture"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3 bg-white p-4 rounded-2xl shadow-inner flex flex-col"
          >
            {/* Export CSV */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-700 pt-0 flex items-center gap-2">
                  <TbReportSearch size={25} /> Harvest Report
                </CardTitle>
              </div>
              <button
                className="px-4 py-2 rounded-md text-gray-500 cursor-pointer bg-gray-50 hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium"
                onClick={() => downloadCSV(visibleCsvRows, exportFileName)}
              >
                <FaDownload />
                Export CSV
              </button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full table-auto bg-white h-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-3 py-3 ${col.width || "w-auto"}`}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            className="flex items-center gap-2"
                            onClick={() => handleSort(col.key)}
                          >
                            <span>{col.label}</span>
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
                    rows.map((r, idx) => (
                      <motion.tr
                        key={r.id || idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-3 py-3 text-sm">
                          {(page - 1) * pageSize + idx + 1}
                        </td>
                        <td className="px-3 py-3 text-sm">{r.farmer_name}</td>
                        <td className="px-3 py-3 text-sm">{r.phone}</td>
                        <td className="px-3 py-3 text-sm text-right">
                          {r.kg ?? "-"}
                        </td>
                        <td className="px-3 py-3 text-sm text-right">
                          {r.moisture ?? "-"}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {r.district_name ?? "-"}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <Button>
                            <Eye />
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} -{" "}
                {Math.min(page * pageSize, total)} of {total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-md border"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <div className="px-3 py-1 border rounded">{page}</div>
                <button
                  className="px-3 py-1 rounded-md border"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * pageSize >= total}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-inner"
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
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  <option value="">All</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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
                  <option value="initialization">Crop Initialization</option>
                  <option value="planting">Planting & Cultivation</option>
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
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === 'previous7days'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      const d = getPrevious7Days();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick('previous7days');
                      setPage(1);
                    }}
                  >
                    Previous 7 days
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === 'currentMonth'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      const d = getCurrentMonth();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick('currentMonth');
                      setPage(1);
                    }}
                  >
                    Current month
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === 'lastMonth'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      const d = getLastMonth();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick('lastMonth');
                      setPage(1);
                    }}
                  >
                    Last month
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md transition text-xs ${
                      selectedQuick === 'lastYear'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      const d = getLastYear();
                      setDateFrom(d.from);
                      setDateTo(d.to);
                      setSelectedQuick('lastYear');
                      setPage(1);
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
                    setDateFrom("");
                    setDateTo("");
                    setPage(1);
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
    </MotionConfig>
  );
}

function StatCard({ label, value, type }: StatCardProps) {
  const iconSize = 20;

  const getIcon = () => {
    switch (type) {
      case "totalCrops":
        return <FaUsers size={iconSize} className="text-indigo-500" />;
      case "totalHarvesting":
        return <FaLeaf size={iconSize} className="text-green-500" />;
      case "totalPlotted":
        return <FaSeedling size={iconSize} className="text-yellow-500" />;
      case "avgYield":
        return <FaWeight size={iconSize} className="text-amber-500" />;
      case "avgMoisture":
        return <FaTint size={iconSize} className="text-blue-500" />;
      default:
        return <FaUsers size={iconSize} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-white/80 to-gray-100 p-5 rounded-2xl shadow-lg flex flex-col transition-transform duration-300"
    >
      <div className="absolute top-4 left-4">{getIcon()}</div>
      <div className="ml-10 text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-bold mt-2">{value}</div>
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
