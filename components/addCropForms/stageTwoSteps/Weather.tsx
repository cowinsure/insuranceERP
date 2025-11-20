"use client";

import React, { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";

interface WeatherProps {
  data: {
    date_from: string | "";
    date_to: string | "";
    remarks: string;
    weather_effects: {
      weather_effect_type_id: number;
      weather_effect_type_name: string;
      remarks: string;
      is_active: boolean;
    }[];
  };
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

  // selected checkboxes ids
  const [selectedWeatherEffects, setSelectedWeatherEffects] = useState<
    number[]
  >(data.weather_effects?.map((w) => w.weather_effect_type_id) || []);

  // Fetch weather options
  useEffect(() => {
    const fetchWeatherOptions = async () => {
      try {
        const response = await get(
          "/cms/crop-adverse-weather-effect-type-service/",
          { params: { page_size: 50, start_record: 1 } }
        );
        if (response.status === "success") setWeatherOptions(response.data);
      } catch (err) {
        console.error("Failed to fetch weather options", err);
      }
    };
    fetchWeatherOptions();
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (id: number) => {
    const updated = selectedWeatherEffects.includes(id)
      ? selectedWeatherEffects.filter((w) => w !== id)
      : [...selectedWeatherEffects, id];

    setSelectedWeatherEffects(updated);

    const updatedWeatherEffects = updated.map((weather_effect_type_id) => {
      const existing = data.weather_effects.find(
        (w) => w.weather_effect_type_id === weather_effect_type_id
      );

      const weatherObj = weatherOptions.find(
        (w) => w.id === weather_effect_type_id
      );

      return {
        weather_effect_type_id,
        weather_effect_type_name: weatherObj?.weather_effect_type_name || "",
        remarks: existing?.remarks || "",
        is_active: true,
      };
    });

    onChange({
      ...data,
      weather_effects: updatedWeatherEffects,
    });
  };

  // Handle date_from, date_to, and remarks
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  return (
    <form className="p-3 max-h-[60vh] overflow-auto space-y-5">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        Weather Details
      </h2>

      {/* Adverse Weather Effects */}
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
                checked={selectedWeatherEffects.includes(w.id)}
                onChange={() => handleCheckboxChange(w.id)}
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

      {/* Period of Adverse Weather */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Period of Adverse Weather</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="From"
            id="date_from"
            name="date_from"
            type="date"
            value={data.date_from || ""}
            onChange={handleChange}
          />
          <InputField
            label="To"
            id="date_to"
            name="date_to"
            type="date"
            value={data.date_to || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* General Remarks */}
      <InputField
        label="Remarks"
        id="remarks"
        name="remarks"
        type="text"
        placeholder="Add remarks if any"
        value={data.remarks || ""}
        onChange={handleChange}
      />
    </form>
  );
};

export default Weather;
