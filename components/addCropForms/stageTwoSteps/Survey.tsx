"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import InputField from "@/components/InputField";
import keyReasons from "../../../public/key_reasons_yield_losses.json";
import useApi from "@/hooks/use_api";
import { MdArrowRight, MdArrowRightAlt } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface SurveyData {
  farmer_id?: string;
  farmer_name?: string;
  top_three_varieties: string[];
  avg_production_this_year: number | "";
  avg_production_last_year: number | "";
  yield_loss: "" | "yes" | "no";
  key_reasons_yield_losses?: string[];
  weather_effects: string[];
  pests: { id: number; name: string }[];
  diseases: { id: number; name: string }[];
  remarks?: string;
}

interface SurveyProps {
  data: SurveyData[];
  onChange: (val: SurveyData[]) => void;
}

const weatherOptions = ["Heavy Rain", "Drought", "Storm", "Flood", "Heat Wave"];

const Survey = ({ data, onChange }: SurveyProps) => {
  const { get } = useApi();

  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [farmerQuery, setFarmerQuery] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pestOptions, setPestOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [diseaseOptions, setDiseaseOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [survey, setSurvey] = useState<SurveyData>({
    farmer_id: data[0]?.farmer_id || "",
    farmer_name: data[0]?.farmer_name || "",
    top_three_varieties: data[0]?.top_three_varieties || [],
    avg_production_this_year: data[0]?.avg_production_this_year || "",
    avg_production_last_year: data[0]?.avg_production_last_year || "",
    weather_effects: data[0]?.weather_effects || [],
    pests: data[0]?.pests || [],
    diseases: data[0]?.diseases || [],
    yield_loss: data[0]?.yield_loss || "",
    key_reasons_yield_losses: data[0]?.key_reasons_yield_losses || [],
    remarks: data[0]?.remarks || "",
  });

  const [varietyInput, setVarietyInput] = useState("");

  useEffect(() => {
    onChange([survey]);
  }, [survey]);

  /** Fetch pest & disease options from API */
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [pestRes, diseaseRes] = await Promise.all([
          get("/cms/crop-pest-attack-observations-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/crop-disease-attack-observations-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
        ]);

        if (pestRes.status === "success" && Array.isArray(pestRes.data)) {
          setPestOptions(
            pestRes.data.map((item: any) => ({
              id: item.id,
              name: item.pest_attack_observations_type_name,
            }))
          );
        }

        if (diseaseRes.status === "success" && Array.isArray(diseaseRes.data)) {
          setDiseaseOptions(
            diseaseRes.data.map((item: any) => ({
              id: item.id,
              name: item.disease_attack_observations_type_name,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching pest/disease data:", err);
      }
    };

    fetchOptions();
  }, [get]);

  useEffect(() => {
    // fetch farmers when dialog opens
    if (!open) return;
    let cancelled = false;
    const fetchFarmers = async () => {
      setFarmersLoading(true);
      try {
        const resp = await get(`ims/farmer-service`, {
          params: { start_record: 1 },
        });
        //(resp);

        if (
          !cancelled &&
          resp?.status === "success" &&
          Array.isArray(resp.data)
        ) {
          setFarmers(resp.data);
        }
      } catch (err) {
        // ignore silently; toast could be added
      } finally {
        if (!cancelled) setFarmersLoading(false);
      }
    };
    fetchFarmers();
    return () => {
      cancelled = true;
    };
  }, [open, get]);

  useEffect(() => {
    if (!comboboxOpen) setFocusedIndex(-1);
  }, [comboboxOpen]);

  const filteredFarmers = useMemo(() => {
    const q = farmerQuery.trim().toLowerCase();
    if (!q) return farmers;
    return farmers.filter(
      (f) =>
        String(f.user_id).toLowerCase().includes(q) ||
        f.farmer_name.toLowerCase().includes(q) ||
        f.mobile_number.toLowerCase().includes(q)
    );
  }, [farmers, farmerQuery]);

  function selectFarmer(f: FarmerProfile) {
    setSelectedFarmerId(String(f.user_id));
    setFarmerQuery(`${f.farmer_name} - ${f.mobile_number}`);
    setComboboxOpen(false);
    // 🟢 Update survey data with farmer info
    setSurvey((prev) => ({
      ...prev,
      farmer_id: String(f.user_id),
      farmer_name: f.farmer_name,
    }));
  }

  // ---- Handlers ----
  const handleAddVariety = () => {
    if (!varietyInput.trim() || survey.top_three_varieties.length >= 3) return;
    setSurvey((prev) => ({
      ...prev,
      top_three_varieties: [...prev.top_three_varieties, varietyInput.trim()],
    }));
    setVarietyInput("");
  };

  const handleRemoveVariety = (index: number) => {
    setSurvey((prev) => ({
      ...prev,
      top_three_varieties: prev.top_three_varieties.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCheckboxChange = (
    field: "weather_effects" | "key_reasons_yield_losses",
    value: string
  ) => {
    setSurvey((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handlePestChange = (option: { id: number; name: string }) => {
    setSurvey((prev) => {
      const exists = prev.pests.some((p) => p.id === option.id);
      const updated = exists
        ? prev.pests.filter((p) => p.id !== option.id)
        : [...prev.pests, option];
      return { ...prev, pests: updated };
    });
  };

  const handleDiseaseChange = (option: { id: number; name: string }) => {
    setSurvey((prev) => {
      const exists = prev.diseases.some((d) => d.id === option.id);
      const updated = exists
        ? prev.diseases.filter((d) => d.id !== option.id)
        : [...prev.diseases, option];
      return { ...prev, diseases: updated };
    });
  };

  const handleInputChange = (field: keyof SurveyData, value: any) => {
    setSurvey((prev) => ({ ...prev, [field]: value }));
  };

  const handleYieldLossChange = (value: "yes" | "no") => {
    setSurvey((prev) => ({
      ...prev,
      yield_loss: value,
      key_reasons_yield_losses:
        value === "no" ? [] : prev.key_reasons_yield_losses,
    }));
  };
  console.log(selectedFarmerId);
  console.log(farmerQuery);
  console.log(survey);
  return (
    <div className="space-y-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold text-center underline">
        Survey Information
      </h2>

      {/* Farmer selector*/}
      <div className="space-y-2">
        <Label htmlFor="plotFarmer" className="font-bold text-gray-400">
          Farmer
        </Label>
        <div className="relative" ref={containerRef}>
          {/* Combobox input (acts like trigger) */}
          <Input
            id="plotFarmer"
            placeholder={
              farmersLoading
                ? "Loading farmers..."
                : "Search or select a farmer "
            }
            value={farmerQuery}
            onChange={(e) => {
              setFarmerQuery(e.target.value);
              setComboboxOpen(true);
            }}
            onFocus={() => setComboboxOpen(true)}
            onKeyDown={(e) => {
              const filtered = filteredFarmers;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (filtered.length > 0 && focusedIndex >= 0) {
                  const f = filtered[focusedIndex];
                  if (f) selectFarmer(f);
                } else if (filtered.length === 1) {
                  selectFarmer(filtered[0]);
                }
              } else if (e.key === "Escape") {
                setComboboxOpen(false);
              }
            }}
          />

          {/* Dropdown list */}
          <div
            className={`absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-auto ${
              comboboxOpen ? "block" : "hidden"
            }`}
          >
            <div className="p-2 text-sm text-muted-foreground">
              Search results
            </div>
            <div className="divide-y">
              {filteredFarmers.length === 0 ? (
                <div className="p-2 text-sm">No results</div>
              ) : (
                filteredFarmers.map((f, idx) => (
                  <div
                    key={String(f.user_id)}
                    role="option"
                    aria-selected={selectedFarmerId === String(f.user_id)}
                    className={`px-3 py-2 cursor-pointer hover:bg-accent/20 ${
                      idx === focusedIndex ? "bg-accent/25" : ""
                    }`}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectFarmer(f)}
                  >
                    <div className="font-medium">{f.farmer_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {f.mobile_number}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Three Varieties */}
      <div>
        <label className="font-bold text-gray-400">
          Top Three Varieties of Seeds
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 flex-1"
            placeholder="Enter a seed variety and click Add"
            value={varietyInput}
            onChange={(e) => setVarietyInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddVariety}
            disabled={
              !varietyInput.trim() || survey.top_three_varieties.length >= 3
            }
            className="bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex flex-col md:flex-row sm:items-start md:items-center gap-3 md:gap-8">
          {survey.top_three_varieties.map((val, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md md:w-[20%] animate__animated animate__fadeIn"
            >
              <span className="font-semibold">{val}</span>
              <button
                onClick={() => handleRemoveVariety(idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>

        {survey.top_three_varieties.length >= 3 && (
          <p className="text-sm text-orange-500 mt-1">
            Maximum of 3 seed varieties reached.
          </p>
        )}
      </div>

      {/* Average Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="avgProductionThisYear"
          name="avgProductionThisYear"
          type="number"
          label="Average Production (This Year in kg)"
          placeholder="e.g. 42.5"
          value={survey.avg_production_this_year}
          onChange={(e) =>
            handleInputChange(
              "avg_production_this_year",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <InputField
          id="avgProductionLastYear"
          name="avgProductionLastYear"
          type="number"
          label="Average Production (Last Year in kg)"
          placeholder="e.g. 40.8"
          value={survey.avg_production_last_year}
          onChange={(e) =>
            handleInputChange(
              "avg_production_last_year",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* Yield Loss */}
      <div>
        <label className="font-bold text-gray-400">
          Possibility of Yield Loss
        </label>
        <div className="flex gap-5 mt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="yieldLoss"
              checked={survey.yield_loss === "yes"}
              onChange={() => handleYieldLossChange("yes")}
              className="cursor-pointer"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="yieldLoss"
              checked={survey.yield_loss === "no"}
              onChange={() => handleYieldLossChange("no")}
              className="cursor-pointer"
            />
            No
          </label>
        </div>
      </div>

      {/* Yield Loss Reasons */}
      {survey.yield_loss === "yes" && (
        <div className="animate__animated animate__fadeIn bg-gray-50 p-4 rounded-lg border">
          <label className="font-bold text-gray-500 text-[15px] flex items-center">
            <MdArrowRight size={25} /> If "Yes", Key Reasons of Yield Losses in
            this season
          </label>
          <div className="grid grid-cols-2 gap-3 mt-5">
            {keyReasons.key_reasons_yield_losses.map((reason) => (
              <label
                key={reason.id}
                className="flex items-center gap-2 text-sm text-gray-700 font-semibold"
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={survey.key_reasons_yield_losses?.includes(
                    reason.label
                  )}
                  onChange={() =>
                    handleCheckboxChange(
                      "key_reasons_yield_losses",
                      reason.label
                    )
                  }
                />
                {reason.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Weather Effects */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <label className="font-bold text-gray-500 text-[15px] flex items-center">
          <MdArrowRight size={25} /> Was there any extreme weather event last
          year?
        </label>
        <div className="grid grid-cols-2 gap-3 mt-5">
          {weatherOptions.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer"
            >
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={survey.weather_effects.includes(opt)}
                onChange={() => handleCheckboxChange("weather_effects", opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Pest & Disease */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <label className="font-bold text-gray-500 text-[15px] flex items-center">
          <MdArrowRight size={25} /> Was there any widespread pests & disease
          attack last year?
        </label>

        {/* Pests */}
        <div className="mt-4">
          <h3 className="text-[15px] underline underline-offset-3 font-semibold text-gray-600 mb-2">
            Pest Attacks
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {pestOptions.length > 0 ? (
              pestOptions.map((opt) => (
                <label
                  key={`pest-${opt.id}`}
                  className="flex items-center gap-2 text-sm text-gray-600 font-semibold cursor-pointer text-[14px]"
                >
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={survey.pests.some((p) => p.id === opt.id)}
                    onChange={() => handlePestChange(opt)}
                  />
                  {opt.name}
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-2">
                Loading pest options...
              </p>
            )}
          </div>
        </div>

        {/* Diseases */}
        <div className="mt-6">
          <h3 className="text-[15px] underline underline-offset-3 font-semibold text-gray-600 mb-2">
            Disease Attacks
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {diseaseOptions.length > 0 ? (
              diseaseOptions.map((opt) => (
                <label
                  key={`disease-${opt.id}`}
                  className="flex items-center gap-2 text-sm text-gray-600 font-semibold cursor-pointer text-[14px]"
                >
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={survey.diseases.some((d) => d.id === opt.id)}
                    onChange={() => handleDiseaseChange(opt)}
                  />
                  {opt.name}
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-2">
                Loading disease options...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
