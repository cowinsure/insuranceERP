"use client";

import React, { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";

interface WeatherProps {
  data: any;
  onChange: (updatedData: any) => void;
}

interface WeatherOption {
  id: number;
  weather_effect_type_name: string;
  desc?: string;
}

const Weather = ({ data, onChange }: WeatherProps) => {
  const { get, loading } = useApi();
  const [weatherOptions, setWeatherOptions] = useState<WeatherOption[]>([]);

  // Local state for selected weather effects (objects with id, name, remarks)
  const [selectedWeatherEffects, setSelectedWeatherEffects] = useState<any[]>(
    data?.weather_effects_full || [] // Stage 2 full objects for preview
  );

  // Sync local state with parent data when coming back to this step
  useEffect(() => {
    setSelectedWeatherEffects(data?.weather_effects_full || []);
  }, [data?.weather_effects_full]);

  // Fetch weather options from API
  useEffect(() => {
    const fetchWeatherOptions = async () => {
      try {
        const response = await get(
          "/cms/crop-adverse-weather-effect-type-service/",
          { params: { page_size: 10, start_record: 1 } }
        );

        if (response.status === "success" && Array.isArray(response.data)) {
          setWeatherOptions(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch weather options", err);
      }
    };
    fetchWeatherOptions();
  }, [get]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // Toggle weather effect selection
  const toggleWeatherEffect = (id: number) => {
    const exists = selectedWeatherEffects.find(
      (w) => w.weather_effect_type_id === id
    );

    let updatedEffects;
    if (exists) {
      updatedEffects = selectedWeatherEffects.filter(
        (w) => w.weather_effect_type_id !== id
      );
    } else {
      const option = weatherOptions.find((w) => w.id === id);
      updatedEffects = [
        ...selectedWeatherEffects,
        {
          weather_effect_type_id: id,
          weather_effect_type_name: option?.weather_effect_type_name || "",
          remarks: "",
        },
      ];
    }

    setSelectedWeatherEffects(updatedEffects);

    // Send both IDs and full objects for preview to parent
    onChange({
      ...data,
      weather_effects: updatedEffects.map((w) => w.weather_effect_type_id),
      weather_effects_full: updatedEffects,
    });
  };

  return (
    <form className="max-h-[60vh] overflow-auto space-y-5">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        Weather Details
      </h2>

      {/* ✅ Adverse Weather Effects */}
      <div className="space-y-3 bg-gray-50 p-3 border rounded-lg">
        <h3 className="font-semibold">
          Adverse Weather Type{" "}
          <span className="text-sm text-gray-400">(Multiple Selection)</span>
        </h3>

        {loading ? (
          <Loading />
        ) : (
          weatherOptions.map((w) => (
            <div key={w.id} className="flex items-start space-x-2">
              <input
                type="checkbox"
                id={`weather_${w.id}`}
                checked={selectedWeatherEffects.some(
                  (we) => we.weather_effect_type_id === w.id
                )}
                onChange={() => toggleWeatherEffect(w.id)}
                className="mt-1 accent-green-600 custom-checkbox"
              />
              <label
                htmlFor={`weather_${w.id}`}
                className="flex flex-col cursor-pointer"
              >
                <strong className="text-[15px] text-gray-700">
                  {w.weather_effect_type_name}
                </strong>
                {w.desc && (
                  <span className="text-gray-400 text-sm">{w.desc}</span>
                )}
              </label>
            </div>
          ))
        )}
      </div>

      {/* ✅ Period of Adverse Weather */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Period of Adverse Weather</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="From"
            id="date_from"
            name="date_from"
            type="date"
            value={data?.date_from || ""}
            onChange={handleChange}
          />
          <InputField
            label="To"
            id="date_to"
            name="date_to"
            type="date"
            value={data?.date_to || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ✅ Remarks per weather effect */}
      {/* {selectedWeatherEffects.map((we, idx) => (
        <div
          key={we.weather_effect_type_id}
          className="border rounded-lg bg-gray-50 p-2 shadow-sm space-y-1"
        >
          <p className="font-semibold text-gray-700">
            {we.weather_effect_type_name} Remarks
          </p>
          <InputField
          id="Rea"
            label="Remarks"
            name={`remarks_${we.weather_effect_type_id}`}
            type="text"
            value={we.remarks || ""}
            onChange={(e: any) => {
              const updated = [...selectedWeatherEffects];
              updated[idx].remarks = e.target.value;
              setSelectedWeatherEffects(updated);
              onChange({
                ...data,
                weather_effects: updated.map((w) => w.weather_effect_type_id),
                weather_effects_full: updated,
              });
            }}
          />
        </div>
      ))} */}

      {/* ✅ General Remarks */}
      <InputField
        label="General Remarks"
        id="remarks"
        name="remarks"
        type="text"
        placeholder="Add remarks if any"
        value={data?.remarks || ""}
        onChange={handleChange}
      />
    </form>
  );
};

export default Weather;
