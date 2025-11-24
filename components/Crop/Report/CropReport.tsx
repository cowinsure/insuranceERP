"use client"

import React, { useEffect, useMemo, useState } from "react";
import { MotionConfig, motion } from "framer-motion";

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
}

interface SortArrowProps {
  active?: boolean;
  dir?: "asc" | "desc";
}

// =================================================

const defaultColumns: ColumnDef[] = [
  { key: "sl", label: "SL", width: "w-12" },
  { key: "farmer_name", label: "Farmer Name", width: "w-56" },
  { key: "phone", label: "Phone", width: "w-40" },
  { key: "kg", label: "KG", width: "w-32", align: "right" },
  { key: "moisture", label: "Moisture (%)", width: "w-32", align: "right" },
  { key: "district_name", label: "District", width: "w-48" },
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

function useDebounced<T>(value: T, delay = 350): T {
  const [v, setV] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function CropReportingDashboard({
  apiEndpoint,
  pageSize = 25,
  columns = defaultColumns,
  exportFileName = "crop-report.csv",
}: CropReportingDashboardProps) {
  const [district, setDistrict] = useState<string>("");
  const [minKg, setMinKg] = useState<string>("");
  const [maxKg, setMaxKg] = useState<string>("");
  const [minMoisture, setMinMoisture] = useState<string>("");
  const [maxMoisture, setMaxMoisture] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<CropRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);

  const debouncedFilters = useDebounced(
    {
      district,
      minKg,
      maxKg,
      minMoisture,
      maxMoisture,
      stage,
      dateFrom,
      dateTo,
      search,
      page,
      sortBy,
    },
    300
  );

  useEffect(() => {
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
            district: debouncedFilters.district || null,
            kg: {
              gte: debouncedFilters.minKg
                ? Number(debouncedFilters.minKg)
                : null,
              lte: debouncedFilters.maxKg
                ? Number(debouncedFilters.maxKg)
                : null,
            },
            moisture: {
              gte: debouncedFilters.minMoisture
                ? Number(debouncedFilters.minMoisture)
                : null,
              lte: debouncedFilters.maxMoisture
                ? Number(debouncedFilters.maxMoisture)
                : null,
            },
            stage: debouncedFilters.stage || null,
            date_from: formatDateISO(debouncedFilters.dateFrom),
            date_to: formatDateISO(debouncedFilters.dateTo),
            search: debouncedFilters.search || null,
          },
          page: debouncedFilters.page || 1,
          page_size: pageSize,
          sort: debouncedFilters.sortBy
            ? `${debouncedFilters.sortBy.dir === "desc" ? "-" : ""}${
                debouncedFilters.sortBy.key
              }`
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

    fetchData();
  }, [debouncedFilters, apiEndpoint, pageSize]);

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
      <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          {/* Stats */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard label="Total Crops" value={stats.totalCrops} />
            <StatCard label="Total Harvesting" value={stats.totalHarvesting} />
            <StatCard label="Total Plotted" value={stats.totalPlotted} />
            <StatCard
              label="Avg Yield (kg)"
              value={
                Number.isFinite(stats.avgYield)
                  ? stats.avgYield.toFixed(2)
                  : "0.00"
              }
            />
            <StatCard
              label="Avg Moisture (%)"
              value={
                Number.isFinite(stats.avgMoisture)
                  ? stats.avgMoisture.toFixed(2)
                  : "0.00"
              }
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-4 rounded-2xl shadow-inner"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                placeholder="Search farmer or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border rounded-md w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <button
                className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 shadow-sm"
                onClick={() => {
                  setPage(1);
                }}
              >
                Apply
              </button>

              <button
                className="px-3 py-2 rounded-md bg-gray-100 text-sm hover:bg-gray-200"
                onClick={() => {
                  // reset
                  setDistrict("");
                  setMinKg("");
                  setMaxKg("");
                  setMinMoisture("");
                  setMaxMoisture("");
                  setStage("");
                  setDateFrom("");
                  setDateTo("");
                  setSearch("");
                  setPage(1);
                }}
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 rounded-md bg-white border text-sm hover:bg-gray-50"
                onClick={() => downloadCSV(visibleCsvRows, exportFileName)}
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters panel */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
            <div className="col-span-1 md:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">
                District
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  KG (min)
                </label>
                <input
                  value={minKg}
                  onChange={(e) => setMinKg(e.target.value)}
                  placeholder="0"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  KG (max)
                </label>
                <input
                  value={maxKg}
                  onChange={(e) => setMaxKg(e.target.value)}
                  placeholder="1000"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Moisture (min %)
                </label>
                <input
                  value={minMoisture}
                  onChange={(e) => setMinMoisture(e.target.value)}
                  placeholder="0"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Moisture (max %)
                </label>
                <input
                  value={maxMoisture}
                  onChange={(e) => setMaxMoisture(e.target.value)}
                  placeholder="30"
                  type="number"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => {
                  setStage(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="initialization">Crop Initialization</option>
                <option value="planting">Planting & Cultivation</option>
                <option value="harvesting">Harvesting</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white">
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
              <tbody>
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
      </div>
    </MotionConfig>
  );
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-xl shadow-sm flex flex-col"
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
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
