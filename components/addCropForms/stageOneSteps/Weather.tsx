// "use client";

// import InputField from "@/components/InputField";
// import {
//   CropData,
//   WeatherDetails,
// } from "@/components/model/crop/CropCoreModel";
// import React, { useState, useEffect } from "react";

// interface WeatherProps {
//   data: Partial<WeatherDetails>; // <-- Pass only the object, not full CropData
//   onChange: (updatedWeather: Partial<WeatherDetails>) => void; // <-- simple object
// }

// const Weather = ({ data, onChange }: WeatherProps) => {
//   const [errors, setErrors] = useState({
//     adverseWeatherEffects: "",
//     periodFrom: "",
//     periodTo: "",
//   });

//   const weather: WeatherDetails = {
//     weather_id: 0,
//     flood: false,
//     drought: false,
//     excess_rainfall: false,
//     storms: false,
//     hailstorm: false,
//     period_from: "",
//     period_to: "",
//     ...data, // merge incoming data
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, type, checked, value } = e.target;
//     const updatedWeather = {
//       ...weather,
//       [name]: type === "checkbox" ? checked : value,
//     };
//     onChange(updatedWeather); // send object directly
//   };

//   const weatherOptions = [
//     {
//       label: "Flood",
//       name: "flood",
//       desc: "Floods cause full or partial damage.",
//     },
//     {
//       label: "Drought",
//       name: "drought",
//       desc: "Some plants dry up prematurely or lodge down.",
//     },
//     {
//       label: "Excess Rainfall",
//       name: "excess_rainfall",
//       desc: "Some plants dry up prematurely or lodge down.",
//     },
//     {
//       label: "Storms",
//       name: "storms",
//       desc: "Storms cause crop lodging or destruction.",
//     },
//     {
//       label: "Hailstorm",
//       name: "hailstorm",
//       desc: "Hailstorms cause physical damage to grains or panicles.",
//     },
//   ];

//   return (
//     <form className="p-3 max-h-[60vh] overflow-auto space-y-5">
//       <h2 className="text-xl font-semibold mb-5 underline text-center">
//         Weather Details
//       </h2>

//       {/* Adverse Weather Effects */}
//       <div className="space-y-3 bg-gray-50 p-3 border rounded-lg">
//         <p className="ml-1 text-sm">(Multiple Selection)</p>
//         {weatherOptions.map((w) => (
//           <div key={w.name} className="flex items-center">
//             <input
//               type="checkbox"
//               id={w.name}
//               name={w.name}
//               checked={weather[w.name as keyof WeatherDetails] as boolean}
//               onChange={handleChange}
//               className="mr-2 custom-checkbox"
//             />
//             <label htmlFor={w.name} className="flex flex-col text-gray-600">
//               <strong className="text-[15px]">{w.label}</strong>
//               <span className="text-gray-400 text-sm">{w.desc}</span>
//             </label>
//           </div>
//         ))}
//         {errors.adverseWeatherEffects && (
//           <p className="text-red-600 text-sm">{errors.adverseWeatherEffects}</p>
//         )}
//       </div>

//       {/* Period of Adverse Weather */}
//       <div className="space-y-2">
//         <h3 className="text-lg font-semibold">Period of Adverse Weather</h3>
//         <div className="grid md:grid-cols-2 gap-4">
//           <InputField
//             label="From"
//             id="period_from"
//             name="period_from"
//             type="date"
//             value={weather.period_from}
//             onChange={handleChange}
//             error={errors.periodFrom}
//           />
//           <InputField
//             label="To"
//             id="period_to"
//             name="period_to"
//             type="date"
//             value={weather.period_to}
//             onChange={handleChange}
//             error={errors.periodTo}
//           />
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Weather;

// Fresh Start
"use client";

import React, { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import useApi from "@/hooks/use_api";

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
  const { get } = useApi();
  const [weatherOptions, setWeatherOptions] = useState<WeatherOption[]>([]);

  // selected checkboxes ids
  const [selectedWeatherEffects, setSelectedWeatherEffects] = useState<
    number[]
  >(data.weather_effects?.map((w: any) => w.weather_effect_type_id) || []);

  // Fetch weather options from API
  useEffect(() => {
    const fetchWeatherOptions = async () => {
      try {
        const response = await get(
          "/cms/crop-adverse-weather-effect-type-service/",
          {
            params: { page_size: 10, start_record: 1 },
          }
        );
        if (response.status === "success") {
          setWeatherOptions(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch weather options", err);
      }
    };
    fetchWeatherOptions();
  }, []);
console.log(weatherOptions)
  const handleCheckboxChange = (id: number) => {
    let updated: number[] = [];
    if (selectedWeatherEffects.includes(id)) {
      updated = selectedWeatherEffects.filter((w) => w !== id);
    } else {
      updated = [...selectedWeatherEffects, id];
    }
    setSelectedWeatherEffects(updated);

    // Update parent data as an array of objects for API
    const updatedData = {
      ...data,
      weather_effects: updated.map((weather_effect_type_id) => ({
        weather_effect_type_id,
        remarks: "",
        is_active: true,
      })),
    };
    onChange(updatedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <form className="p-3 max-h-[60vh] overflow-auto space-y-5">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        Weather Details
      </h2>

      {/* ✅ Adverse Weather Effects */}
      <div className="space-y-3 bg-gray-50 p-3 border rounded-lg">
        <p className="ml-1 text-sm text-gray-500">(Multiple Selection)</p>
        {weatherOptions.map((w) => (
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
              <strong className="text-[15px] text-gray-700">{w.weather_effect_type_name}</strong>
              {w.desc && (
                <span className="text-gray-400 text-sm">{w.desc}</span>
              )}
            </label>
          </div>
        ))}
      </div>

      {/* ✅ Period of Adverse Weather */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Period of Adverse Weather</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="From"
            id="period_from"
            name="period_from"
            type="date"
            value={data.period_from || ""}
            onChange={handleChange}
          />
          <InputField
            label="To"
            id="period_to"
            name="period_to"
            type="date"
            value={data.period_to || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ✅ Remarks */}
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
