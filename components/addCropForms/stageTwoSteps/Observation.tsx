"use client";

import React, { useEffect, useState } from "react";
import DropdownField from "@/components/DropDownField";
import useApi from "@/hooks/use_api";
import { StageTwoData } from "../StageTwo";

interface ObservationProps {
  data: any;
  onChange: (field: keyof StageTwoData, value: any) => void;
}

interface PracticeItem {
  id: number;
  label: string;
}

const Observation: React.FC<ObservationProps> = ({ data, onChange }) => {
  const { get } = useApi();
  const [selectedVariety, setSelectedVariety] = useState("");
  const [goodPracticesList, setGoodPracticesList] = useState<PracticeItem[]>(
    []
  );
  const [harvestSeedVarietyOptions, setHarvestSeedVarietyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [harvestTimingOptions, setHarvestTimingOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [remarks, setRemarks] = useState("");

  /** Fetch all data **/
  useEffect(() => {
    getGoodPracticesOptions();
    getHarvestSeedVarietyOptions();
    getHarvestTimingOptions();
  }, []);

  const getGoodPracticesOptions = async () => {
    try {
      const res = await get(
        "/cms/crop-harvest-good-agricultural-practices-service/",
        {
          params: { page_size: 50, start_record: 1 },
        }
      );

      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          id: item.good_agricultural_practices_type_id,
          label: item.good_agricultural_practices_type_name,
        }));
        setGoodPracticesList(formatted);
      }
    } catch (error) {
      console.error("Error fetching Good Practices:", error);
    }
  };

  const getHarvestSeedVarietyOptions = async () => {
    try {
      const res = await get(
        "/cms/crop-harvest-seed-variety-observation-service/",
        {
          params: { page_size: 50, start_record: 1 },
        }
      );
      console.log(res);

      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          id: item.harvest_seed_variety_observation_id,
          label: item.harvest_seed_variety_observation_type_name,
        }));
        setHarvestSeedVarietyOptions(formatted);
      }
    } catch (error) {
      console.error("Error fetching Seed Varieties:", error);
    }
  };

  /** Fetch Harvest Timing **/
  const getHarvestTimingOptions = async () => {
    try {
      const res = await get("/cms/crop-harvest-harvesting-timing-service/", {
        params: { page_size: 50, start_record: 1 },
      });
      console.log(res);
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          id: item.harvesting_timing_id,
          label: item.harvesting_timing_name,
        }));
        setHarvestTimingOptions(formatted);
      }
    } catch (error) {
      console.error("Error fetching Harvest Timing:", error);
    }
  };

  /** Handlers **/
  const handleVarietyChange = (value: string) => {
    setSelectedVariety(value);
    onChange("observationData", {
      ...data.observationData,
      seedVarietyObservation: value,
    });
  };

  const handleManageableChange = (value: string) => {
    onChange("observationData", {
      ...data.observationData,
      manageable: value,
    });
    if (value === "No") setRemarks("");
  };

  const toggleGoodPractice = (label: string) => {
    const updated = {
      ...data.observationData.goodPractices,
      [label]: !data.observationData.goodPractices?.[label],
    };
    onChange("observationData", {
      ...data.observationData,
      goodPractices: updated,
    });
  };
  console.log("Seed variety", harvestSeedVarietyOptions);

  console.log("Harvest time", harvestTimingOptions);
  console.log("Good Practice", goodPracticesList);
  return (
    <div className="p-3 bg-white rounded-xl space-y-5">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Harvesting Observations
      </h2>

      {/* ✅ Seed Variety Observation Dropdown */}
      <DropdownField
        id="seedVarietyObservation"
        name="seedVarietyObservation"
        label="Seed Variety Observation"
        value={data.observationData.seedVarietyObservation}
        onChange={(e) => handleVarietyChange(e.target.value)}
        options={[...harvestSeedVarietyOptions]}
      />

      {/* ✅ Good Agricultural Practices Checkboxes */}
      <div className="bg-gray-50 p-4 border rounded-lg space-y-2 mt-4">
        <h3 className="font-semibold">
          Good Agricultural Practices{" "}
          <span className="text-sm text-gray-400">(Multiple Selection)</span>
        </h3>

        {goodPracticesList.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Loading options...</p>
        ) : (
          goodPracticesList.map((practice) => (
            <div
              key={practice.id}
              className="flex items-center gap-2 font-semibold text-[15px]"
            >
              <input
                id={`practice-${practice.id}`}
                type="checkbox"
                checked={!!data.observationData.goodPractices?.[practice.label]}
                onChange={() => toggleGoodPractice(practice.label)}
                className="cursor-pointer accent-green-600 custom-checkbox mt-2"
              />
              <label
                htmlFor={`practice-${practice.id}`}
                className="flex items-center gap-2 cursor-pointer"
                title={practice.label}
              >
                {practice.label.length > 90
                  ? practice.label.slice(0, 90) + "..."
                  : practice.label}
              </label>
            </div>
          ))
        )}
      </div>

      {/* ✅ Manageable Radio */}
      <div className="mt-4">
        <label className="mb-2 text-sm font-bold text-gray-400 tracking-wide">
          Was it Manageable?
        </label>
        <div className="flex gap-6">
          {["Yes", "No"].map((val) => (
            <label key={val} className="flex items-center gap-2">
              <input
                type="radio"
                name="manageable"
                value={val}
                checked={data.observationData.manageable === val}
                onChange={(e) => handleManageableChange(e.target.value)}
                className="accent-green-600"
              />
              {val}
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Remarks for "No" */}
      {data.observationData.manageable === "No" && (
        <div className="mt-4">
          <label className="mb-2 text-sm font-bold text-gray-400 tracking-wide">
            Remarks / Comments
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Please provide remarks or comments"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
          />
        </div>
      )}

      {/* ✅ Harvesting Timing Dropdown */}
      <DropdownField
        id="harvestTiming"
        name="harvestTiming"
        label="Harvesting Timing"
        value={data.observationData.harvestingTiming}
        onChange={(e) =>
          onChange("observationData", {
            ...data.observationData,
            harvestingTiming: e.target.value,
          })
        }
        options={[...harvestTimingOptions]}
      />
    </div>
  );
};

export default Observation;
