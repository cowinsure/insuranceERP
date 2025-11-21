"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import InputField from "@/components/InputField";
import keyReasons from "../../../public/key_reasons_yield_losses.json";
import useApi from "@/hooks/use_api";
import { MdArrowRight } from "react-icons/md";
import { Label } from "@/components/ui/label";
import {
  SurveyPostPayload,
  SurveyDiseaseAttackDetail,
  SurveyPestAttackDetail,
  SurveyVarietyDetail,
  SurveyWeatherEventDetail,
  SurveyYieldLossDetail,
} from "@/core/model/SurveyPost";
import { toast, Toaster } from "sonner";

interface FarmerProfile {
  user_id: number;
  farmer_name: string;
  mobile_number: string;
}

interface SurveyProps {
  data: SurveyPostPayload[];
  onChange: (val: SurveyPostPayload[]) => void;
}

const Survey = ({ data, onChange }: SurveyProps) => {
  const { get } = useApi();
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** -------------------------
   * 🔸 Survey Local State
   * ------------------------- */
  const [survey, setSurvey] = useState<SurveyPostPayload>({
    farmer_id: 0,
    avg_prod_last_year: 0,
    avg_prod_current_year: 0,
    survey_date: "",
    location_lat: 0,
    location_long: 0,
    survey_varieties_of_seeds_details: [],
    survey_yield_loss_details: [],
    survey_weather_event_details: [],
    survey_pest_attack_details: [],
    survey_disease_attack_details: [],
  });

  /** -------------------------
   * 🔸 Farmer Selector States
   * ------------------------- */
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [farmerQuery, setFarmerQuery] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  // Add this state
  const [hasYieldLoss, setHasYieldLoss] = useState(false);

  /** -------------------------
   * 🔸 Seed Variety Input
   * ------------------------- */
  const [varietyInput, setVarietyInput] = useState("");

  /** -------------------------
   * 🔸 Weather, Pest, Disease Options
   * ------------------------- */
  const [weatherOptions, setWeatherOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [pestOptions, setPestOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [diseaseOptions, setDiseaseOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [yieldLossOptions, setYieldLossOptions] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setSurvey(data[0]); // restore parent state into child
    }
  }, []);

  /** ###############################################
   *  🚀 Fetch all dropdown options (farmers, weather, pest, disease)
   * ############################################### */

  // Fetch Farmers
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setFarmersLoading(true);
      try {
        const resp = await get(`/ims/farmer-service`, {
          params: { start_record: 1 },
        });

        if (!cancelled && resp?.status === "success")
          setFarmers(resp.data ?? []);
      } catch (_) {
      } finally {
        if (!cancelled) setFarmersLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [get]);

  // Fetch Weather, Pest, Disease
  useEffect(() => {
    const load = async () => {
      try {
        const [weatherRes, pestRes, diseaseRes, yieldLossRes] =
          await Promise.all([
            get("/cms/crop-adverse-weather-effect-type-service/", {
              params: { page_size: 10, start_record: 1 },
            }),
            get("/cms/crop-pest-attack-observations-type-service/", {
              params: { page_size: 50, start_record: 1 },
            }),
            get("/cms/crop-disease-attack-observations-type-service/", {
              params: { page_size: 50, start_record: 1 },
            }),
            get("/sms/survey-yield-loss-type-service/", {
              params: { page_size: 10, start_record: 1 },
            }),
          ]);

        if (weatherRes.status === "success" && Array.isArray(weatherRes.data)) {
          setWeatherOptions(
            weatherRes.data.map((w: any) => ({
              id: w.id,
              name: w.weather_effect_type_name,
            }))
          );
        }

        if (pestRes.status === "success" && Array.isArray(pestRes.data)) {
          setPestOptions(
            pestRes.data.map((p: any) => ({
              id: p.id,
              name: p.pest_attack_observations_type_name,
            }))
          );
        }

        if (diseaseRes.status === "success" && Array.isArray(diseaseRes.data)) {
          setDiseaseOptions(
            diseaseRes.data.map((d: any) => ({
              id: d.id,
              name: d.disease_attack_observations_type_name,
            }))
          );
        }

        if (
          yieldLossRes.status === "success" &&
          Array.isArray(yieldLossRes.data)
        ) {
          setYieldLossOptions(
            yieldLossRes.data.map((d: any) => ({
              id: d.yield_loss_type_id,
              name: d.yield_loss_type_name,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [get]);

  /** -------------------------
   * 🔸 Filter Farmers
   * ------------------------- */
  const filteredFarmers = useMemo(() => {
    const q = farmerQuery.trim().toLowerCase();
    if (!q) return farmers;
    return farmers.filter(
      (f) =>
        String(f.user_id).includes(q) ||
        f.farmer_name.toLowerCase().includes(q) ||
        f.mobile_number.toLowerCase().includes(q)
    );
  }, [farmers, farmerQuery]);

  /** -------------------------
   * 🔸 Update Parent Component Whenever Survey Changes
   * ------------------------- */
  // useEffect(() => {
  //   const preview = buildPreview(survey);
  //   console.log(preview);
  //   onChange([survey, buildPreview(survey)]);
  // }, [survey, weatherOptions, pestOptions, diseaseOptions, yieldLossOptions]);

  /** -------------------------
   * 🔸 Handlers
   * ------------------------- */
  const handleVarietyAdd = () => {
    // limit 3 items
    if (survey.survey_varieties_of_seeds_details.length >= 3) {
      toast.warning("Maximum 3 varieties allowed");
      return;
    }

    if (!varietyInput.trim()) return;

    const item: SurveyVarietyDetail = {
      survey_varieties_of_seeds: varietyInput.trim(),
    };

    setSurvey((prev) => ({
      ...prev,
      survey_varieties_of_seeds_details: [
        ...prev.survey_varieties_of_seeds_details,
        item,
      ],
    }));

    setVarietyInput("");
  };

  const handleRemoveVariety = (index: number) => {
    setSurvey((prev) => ({
      ...prev,
      survey_varieties_of_seeds_details:
        prev.survey_varieties_of_seeds_details.filter((_, i) => i !== index),
    }));
  };

  const toggleYieldLoss = (reasonId: number) => {
    setSurvey((prev) => {
      const exists = prev.survey_yield_loss_details.some(
        (r) => r.yield_loss_type_id === reasonId
      );

      return {
        ...prev,
        survey_yield_loss_details: exists
          ? prev.survey_yield_loss_details.filter(
              (r) => r.yield_loss_type_id !== reasonId
            )
          : [
              ...prev.survey_yield_loss_details,
              { yield_loss_type_id: reasonId },
            ],
      };
    });
  };

  const toggleWeather = (id: number) => {
    setSurvey((prev) => {
      const exists = prev.survey_weather_event_details.some(
        (w) => w.weather_event_type_id === id
      );

      return {
        ...prev,
        survey_weather_event_details: exists
          ? prev.survey_weather_event_details.filter(
              (w) => w.weather_event_type_id !== id
            )
          : [
              ...prev.survey_weather_event_details,
              { weather_event_type_id: id },
            ],
      };
    });
  };

  const togglePest = (id: number) => {
    setSurvey((prev) => {
      const exists = prev.survey_pest_attack_details.some(
        (p) => p.pest_attack_type_id === id
      );

      return {
        ...prev,
        survey_pest_attack_details: exists
          ? prev.survey_pest_attack_details.filter(
              (p) => p.pest_attack_type_id !== id
            )
          : [...prev.survey_pest_attack_details, { pest_attack_type_id: id }],
      };
    });
  };

  const toggleDisease = (id: number) => {
    setSurvey((prev) => {
      const exists = prev.survey_disease_attack_details.some(
        (d) => d.disease_attack_type_id === id
      );

      return {
        ...prev,
        survey_disease_attack_details: exists
          ? prev.survey_disease_attack_details.filter(
              (d) => d.disease_attack_type_id !== id
            )
          : [
              ...prev.survey_disease_attack_details,
              { disease_attack_type_id: id },
            ],
      };
    });
  };

  const selectFarmer = (farmer: FarmerProfile) => {
    setFarmerQuery(`${farmer.farmer_name} - ${farmer.mobile_number}`);
    setComboboxOpen(false);
    setSurvey((prev) => ({
      ...prev,
      farmer_id: farmer.user_id,
    }));
  };

  // Build preview labels
  const buildPreview = (s: SurveyPostPayload) => ({
    ...s,
    yield_loss_labels: s.survey_yield_loss_details
      .map(
        (item) =>
          yieldLossOptions.find((o) => o.id === item.yield_loss_type_id)?.name
      )
      .filter(Boolean),
    weather_event_labels: s.survey_weather_event_details
      .map(
        (item) =>
          weatherOptions.find((o) => o.id === item.weather_event_type_id)?.name
      )
      .filter(Boolean),
    pest_attack_labels: s.survey_pest_attack_details
      .map(
        (item) =>
          pestOptions.find((o) => o.id === item.pest_attack_type_id)?.name
      )
      .filter(Boolean),
    disease_attack_labels: s.survey_disease_attack_details
      .map(
        (item) =>
          diseaseOptions.find((o) => o.id === item.disease_attack_type_id)?.name
      )
      .filter(Boolean),
    variety_labels: s.survey_varieties_of_seeds_details.map(
      (item) => item.survey_varieties_of_seeds
    ),
  });

  // Whenever survey state changes, notify parent with both raw data and preview
  useEffect(() => {
    const preview = buildPreview(survey);
    onChange([survey, preview]);
  }, [survey, weatherOptions, pestOptions, diseaseOptions, yieldLossOptions]);

  console.log(survey);
  return (
    <div className="space-y-6 bg-white rounded-lg w-[90%] mx-auto">
      <h2 className="text-xl font-semibold text-center underline">
        Add details for survey
      </h2>

      {/* Farmer Selector */}
      <div className="space-y-2">
        <Label className="font-bold text-gray-400">Farmer</Label>
        <div className="relative" ref={containerRef}>
          <InputField
            id="search"
            name="searchFarmer"
            placeholder={farmersLoading ? "Loading..." : "Search farmer"}
            value={farmerQuery}
            onChange={(e) => {
              setFarmerQuery(e.target.value);
              setComboboxOpen(true);
            }}
            onFocus={() => setComboboxOpen(true)}
          />

          {comboboxOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md max-h-48 overflow-auto">
              {filteredFarmers.length === 0 ? (
                <div className="p-2">No results</div>
              ) : (
                filteredFarmers.map((f, i) => (
                  <div
                    key={f.user_id}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectFarmer(f)}
                  >
                    <div className="font-medium">{f.farmer_name}</div>
                    <div className="text-xs text-gray-500">
                      {f.mobile_number}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Varieties */}
      <div>
        <label className="font-bold text-gray-400">Top Three Varieties</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 flex-1"
            value={varietyInput}
            onChange={(e) => setVarietyInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleVarietyAdd}
            disabled={
              !varietyInput.trim() ||
              survey.survey_varieties_of_seeds_details.length >= 3
            }
            className="bg-[#003846] text-white px-4 py-2 rounded-md hover:bg-[#005464] cursor-pointer"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 flex gap-3 flex-wrap">
          {survey.survey_varieties_of_seeds_details.map((v, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-md"
            >
              <span className="font-semibold">
                {v.survey_varieties_of_seeds}
              </span>
              <button
                onClick={() => handleRemoveVariety(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Average Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="avgProductionThisYear"
          id="avgProductionThisYear"
          label="Average Production (This Year)"
          type="number"
          value={survey.avg_prod_current_year || ""}
          onChange={(e) =>
            setSurvey((prev) => ({
              ...prev,
              avg_prod_current_year: Number(e.target.value),
            }))
          }
        />
        <InputField
          name="avgProductionLastYear"
          id="avgProductionLastYear"
          label="Average Production (Last Year)"
          type="number"
          value={survey.avg_prod_last_year || ""}
          onChange={(e) =>
            setSurvey((prev) => ({
              ...prev,
              avg_prod_last_year: Number(e.target.value),
            }))
          }
        />
      </div>

      {/* Yield Loss */}
      <div>
        <label className="font-bold text-gray-400">
          Possibility of Yield Loss
        </label>
        <div className="flex gap-5 mt-2">
          {/* No */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="yieldLoss"
              checked={!hasYieldLoss}
              onChange={() => {
                setHasYieldLoss(false);
                setSurvey((prev) => ({
                  ...prev,
                  survey_yield_loss_details: [], // clear all reasons
                }));
              }}
            />
            No
          </label>

          {/* Yes */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="yieldLoss"
              checked={hasYieldLoss}
              onChange={() => {
                setHasYieldLoss(true);
                setSurvey((prev) => ({
                  ...prev,
                  survey_yield_loss_details:
                    prev.survey_yield_loss_details.length === 0
                      ? []
                      : prev.survey_yield_loss_details, // keep existing reasons
                }));
              }}
            />
            Yes
          </label>
        </div>
      </div>

      {/* Show checkboxes only if Yes selected */}
      {hasYieldLoss && (
        <div className="bg-gray-50 p-4 rounded-lg border animate__animated animate__fadeIn">
          <label className="font-bold text-gray-500 flex items-center text-[15px]">
            <MdArrowRight size={25} /> Key Reasons for Yield Loss
          </label>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {yieldLossOptions.map((r: any) => (
              <label
                key={r.id}
                className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
              >
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  checked={survey.survey_yield_loss_details.some(
                    (item) => item.yield_loss_type_id === r.id
                  )}
                  onChange={() => toggleYieldLoss(r.id)}
                />
                {r.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Weather */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <label className="font-bold text-gray-500 flex items-center text-[15px]">
          <MdArrowRight size={25} /> Extreme Weather Events
        </label>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {weatherOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 text-sm font-semibold cursor-pointer"
            >
              <input
                className="custom-checkbox"
                type="checkbox"
                checked={survey.survey_weather_event_details.some(
                  (w) => w.weather_event_type_id === opt.id
                )}
                onChange={() => toggleWeather(opt.id)}
              />
              {opt.name}
            </label>
          ))}
        </div>
      </div>

      {/* Pests */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <label className="font-bold text-gray-500 flex items-center text-[15px]">
          <MdArrowRight size={25} /> Pest Attacks
        </label>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {pestOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 text-sm cursor-pointer font-semibold"
            >
              <input
                className="custom-checkbox"
                type="checkbox"
                checked={survey.survey_pest_attack_details.some(
                  (p) => p.pest_attack_type_id === opt.id
                )}
                onChange={() => togglePest(opt.id)}
              />
              {opt.name}
            </label>
          ))}
        </div>

        {/* Diseases */}
        <div className="mt-6">
          <h3 className="text-[15px] font-semibold mb-2 underline">
            Disease Attacks
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {diseaseOptions.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 text-sm cursor-pointer font-semibold"
              >
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  checked={survey.survey_disease_attack_details.some(
                    (d) => d.disease_attack_type_id === opt.id
                  )}
                  onChange={() => toggleDisease(opt.id)}
                />
                {opt.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Survey;
