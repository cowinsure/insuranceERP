"use client";

import InputField from "@/components/InputField";
import DropdownField from "@/components/DropDownField";
import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";
import { useLocalization } from "@/core/context/LocalizationContext";

interface ObservationProps {
  data: {
    harvest_seed_variety_observation_id?: number;
    harvest_seed_variety_observation_name?: string; // preview name
    harvesting_timing_id?: number;
    harvesting_timing_name?: string; // preview name
    crop_harvest_details?: {
      good_agricultural_practices_type_id: number;
      good_agricultural_practices_type_name?: string; // preview name
    }[];
  };
  onChange: (updatedData: any) => void; // send updated harvest to parent
}

interface PracticeItem {
  id: number;
  label: string;
}

const Observation: React.FC<ObservationProps> = ({ data, onChange }) => {
  const { get } = useApi();
  const { t } = useLocalization();

  const [goodPracticesList, setGoodPracticesList] = useState<PracticeItem[]>(
    [],
  );
  const [harvestSeedVarietyOptions, setHarvestSeedVarietyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [harvestTimingOptions, setHarvestTimingOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    getGoodPracticesOptions();
    getHarvestSeedVarietyOptions();
    getHarvestTimingOptions();
  }, []);

  const getGoodPracticesOptions = async () => {
    try {
      const res = await get(
        "/cms/crop-harvest-good-agricultural-practices-service/",
        { params: { page_size: 50, start_record: 1 } },
      );
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          id: item.good_agricultural_practices_type_id,
          label: item.good_agricultural_practices_type_name,
        }));
        setGoodPracticesList(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHarvestSeedVarietyOptions = async () => {
    try {
      const res = await get(
        "/cms/crop-harvest-seed-variety-observation-service/",
        { params: { page_size: 50, start_record: 1 } },
      );
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          value: item.harvest_seed_variety_observation_id,
          label: item.harvest_seed_variety_observation_type_name,
        }));
        setHarvestSeedVarietyOptions(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHarvestTimingOptions = async () => {
    try {
      const res = await get("/cms/crop-harvest-harvesting-timing-service/", {
        params: { page_size: 50, start_record: 1 },
      });
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          value: item.harvesting_timing_id,
          label: item.harvesting_timing_name,
        }));
        setHarvestTimingOptions(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /** Handlers */
  const handleVarietyChange = (value: number) => {
    const selected = harvestSeedVarietyOptions.find(
      (opt) => Number(opt.value) === value,
    );
    onChange({
      ...data,
      harvest_seed_variety_observation_id: value,
      harvest_seed_variety_observation_name: selected?.label || "",
    });
  };

  const toggleGoodPractice = (id: number) => {
    const practice = goodPracticesList.find((p) => p.id === id);
    const exists = data.crop_harvest_details?.some(
      (d) => d.good_agricultural_practices_type_id === id,
    );
    let updated = data.crop_harvest_details
      ? [...data.crop_harvest_details]
      : [];
    if (exists) {
      updated = updated.filter(
        (d) => d.good_agricultural_practices_type_id !== id,
      );
    } else {
      updated.push({
        good_agricultural_practices_type_id: id,
        good_agricultural_practices_type_name: practice?.label || "",
      });
    }
    onChange({ ...data, crop_harvest_details: updated });
  };

  const handleTimingChange = (value: number) => {
    const selected = harvestTimingOptions.find(
      (opt) => Number(opt.value) === value,
    );
    onChange({
      ...data,
      harvesting_timing_id: value,
      harvesting_timing_name: selected?.label || "",
    });
  };

  return (
    <div className="bg-white rounded-xl space-y-5">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        {t("harvesting_observations")}
      </h2>

      <DropdownField
        id="seedVarietyObservation"
        name="seedVarietyObservation"
        label={t("seed_variety_observation")}
        value={data.harvest_seed_variety_observation_id || ""}
        onChange={(e) => handleVarietyChange(Number(e.target.value))}
        options={harvestSeedVarietyOptions}
      />

      <div className="bg-gray-50 p-4 border rounded-lg space-y-2 mt-4">
        <h3 className="font-semibold">
          {t("good_agricultural_practices")}{" "}
          <span className="text-sm text-gray-400">
            {t("multiple_selection")}
          </span>
        </h3>
        {goodPracticesList.length === 0 ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {goodPracticesList.map((practice) => {
              const checked = data.crop_harvest_details?.some(
                (d) => d.good_agricultural_practices_type_id === practice.id,
              );
              return (
                <div
                  key={practice.id}
                  className="flex items-center gap-2 font-semibold text-[15px]"
                >
                  <input
                    id={`practice-${practice.id}`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleGoodPractice(practice.id)}
                    className="cursor-pointer accent-green-600 custom-checkbox "
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
              );
            })}
          </div>
        )}
      </div>

      <DropdownField
        id="harvestTiming"
        name="harvestTiming"
        label={t("harvesting_timing")}
        value={data.harvesting_timing_id || ""}
        onChange={(e) => handleTimingChange(Number(e.target.value))}
        options={harvestTimingOptions}
      />
    </div>
  );
};

export default Observation;
