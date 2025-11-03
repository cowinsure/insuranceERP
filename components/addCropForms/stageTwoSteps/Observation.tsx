import InputField from "@/components/InputField";
import DropdownField from "@/components/DropDownField";
import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";

interface ObservationProps {
  data: {
    harvest_seed_variety_observation_id?: number;
    harvesting_timing_id?: number;
    crop_harvest_details?: { good_agricultural_practices_type_id: number }[];
    is_manageable_harvest?: boolean;
    reason_for_is_manageable_harvest?: string;
  };
  onChange: (updatedData: any) => void; // send updated harvest to parent
}

interface PracticeItem {
  id: number;
  label: string;
}

const Observation: React.FC<ObservationProps> = ({ data, onChange }) => {
  const { get } = useApi();

  const [goodPracticesList, setGoodPracticesList] = useState<PracticeItem[]>(
    []
  );
  const [harvestSeedVarietyOptions, setHarvestSeedVarietyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [harvestTimingOptions, setHarvestTimingOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [manageable, setManageable] = useState(
    data.is_manageable_harvest ? "Yes" : "No"
  );
  const [remarks, setRemarks] = useState(
    data.reason_for_is_manageable_harvest || ""
  );

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
      console.error(error);
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
    onChange({ ...data, harvest_seed_variety_observation_id: value });
    console.log({ harvest_seed_variety_observation_id: value });
  };

  const toggleGoodPractice = (id: number) => {
    const exists = data.crop_harvest_details?.some(
      (d) => d.good_agricultural_practices_type_id === id
    );
    let updated = data.crop_harvest_details
      ? [...data.crop_harvest_details]
      : [];
    if (exists) {
      updated = updated.filter(
        (d) => d.good_agricultural_practices_type_id !== id
      );
    } else {
      updated.push({ good_agricultural_practices_type_id: id });
    }
    onChange({ ...data, crop_harvest_details: updated });
    console.log({ crop_harvest_details: updated });
  };

  const handleManageableChange = (value: string) => {
    setManageable(value);
    onChange({
      ...data,
      is_manageable_harvest: value === "Yes",
      reason_for_is_manageable_harvest: value === "No" ? remarks : "",
    });
  };

  const handleRemarksChange = (val: string) => {
    setRemarks(val);
    onChange({ ...data, reason_for_is_manageable_harvest: val });
  };

  const handleTimingChange = (value: number) => {
    onChange({ ...data, harvesting_timing_id: value });
  };

  return (
    <div className="bg-white rounded-xl space-y-5">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Harvesting Observations
      </h2>

      <DropdownField
        id="seedVarietyObservation"
        name="seedVarietyObservation"
        label="Seed Variety Observation"
        value={data.harvest_seed_variety_observation_id || ""}
        onChange={(e) => handleVarietyChange(Number(e.target.value))}
        options={harvestSeedVarietyOptions}
      />

      <div className="bg-gray-50 p-4 border rounded-lg space-y-2 mt-4">
        <h3 className="font-semibold">
          Good Agricultural Practices{" "}
          <span className="text-sm text-gray-400">(Multiple Selection)</span>
        </h3>
        {goodPracticesList.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Loading options...</p>
        ) : (
          goodPracticesList.map((practice) => {
            const checked = data.crop_harvest_details?.some(
              (d) => d.good_agricultural_practices_type_id === practice.id
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
            );
          })
        )}
      </div>

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
                checked={manageable === val}
                onChange={(e) => handleManageableChange(e.target.value)}
                className="accent-green-600"
              />
              {val}
            </label>
          ))}
        </div>
      </div>

      {manageable === "No" && (
        <div className="mt-4">
          <label className="mb-2 text-sm font-bold text-gray-400 tracking-wide">
            Remarks / Comments
          </label>
          <textarea
            value={remarks}
            onChange={(e) => handleRemarksChange(e.target.value)}
            placeholder="Please provide remarks or comments"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
          />
        </div>
      )}

      <DropdownField
        id="harvestTiming"
        name="harvestTiming"
        label="Harvesting Timing"
        value={data.harvesting_timing_id || ""}
        onChange={(e) => handleTimingChange(Number(e.target.value))}
        options={harvestTimingOptions}
      />
    </div>
  );
};

export default Observation;
