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

import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import { CropAssetWeatherEffectHistory as CropAssetWeatherEffectHistory } from "@/components/model/crop/CropCoreModel";

interface WeatherProps {
  value: Partial<CropAssetWeatherEffectHistory>; // single object from parent
  onChange: (data: Partial<CropAssetWeatherEffectHistory>) => void;
}

const Weather = ({ value, onChange }: WeatherProps) => {
  // 🔹 Initial data
  const initialData = value || {};

  const weatherOptions = [
    { id: 1, label: "Flood", desc: "Floods cause full or partial damage." },
    {
      id: 2,
      label: "Drought",
      desc: "Some plants dry up prematurely or lodge down.",
    },
    {
      id: 3,
      label: "Excess Rainfall",
      desc: "Some plants dry up prematurely or lodge down.",
    },
    {
      id: 4,
      label: "Storms",
      desc: "Storms cause crop lodging or destruction.",
    },
    {
      id: 5,
      label: "Hailstorm",
      desc: "Hailstorms cause physical damage to grains or panicles.",
    },
  ];

  // 🔹 Local form state
  const [formData, setFormData] = useState<
    Partial<CropAssetWeatherEffectHistory>
  >({
    weather_effect_type_id: initialData.weather_effect_type_id,
    weather_effect_type_name: initialData.weather_effect_type_name || "",
    period_from: initialData.period_from || "",
    period_to: initialData.period_to || "",
    remarks: initialData.remarks || "",
  });

  // 🔹 Selected weather effects (ids)
  const [selectedWeatherEffects, setSelectedWeatherEffects] = useState<
    number[]
  >(
    initialData.weather_effect_type_id
      ? [initialData.weather_effect_type_id]
      : []
  );

  // 🔹 Sync with parent value when it changes
  useEffect(() => {
    const data = value || {};
    setFormData({
      weather_effect_type_id: data.weather_effect_type_id,
      weather_effect_type_name: data.weather_effect_type_name || "",
      period_from: data.period_from || "",
      period_to: data.period_to || "",
      remarks: data.remarks || "",
    });
    setSelectedWeatherEffects(
      data.weather_effect_type_id ? [data.weather_effect_type_id] : []
    );
  }, [value]);

  // 🔹 Handle checkbox toggle
  const handleCheckboxChange = (id: number) => {
    let updated: number[];
    if (selectedWeatherEffects.includes(id)) {
      updated = selectedWeatherEffects.filter((w) => w !== id);
    } else {
      updated = [...selectedWeatherEffects, id];
    }
    setSelectedWeatherEffects(updated);

    // Update parent with first selected effect only (keeps original UI/format)
    if (updated.length > 0) {
      const firstId = updated[0];
      const label = weatherOptions.find((w) => w.id === firstId)?.label || "";
      const newData = {
        ...formData,
        weather_effect_type_id: firstId,
        weather_effect_type_name: label,
      };
      setFormData(newData);
      onChange(newData);
    } else {
      const newData = {
        ...formData,
        weather_effect_type_id: undefined,
        weather_effect_type_name: "",
      };
      setFormData(newData);
      onChange(newData);
    }
  };

  // 🔹 Handle input change (period & remarks)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onChange(newData);
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
              name="weather_effect"
              checked={selectedWeatherEffects.includes(w.id)}
              onChange={() => handleCheckboxChange(w.id)}
              className="mt-1 accent-green-600 custom-checkbox"
            />
            <label
              htmlFor={`weather_${w.id}`}
              className="flex flex-col cursor-pointer"
            >
              <strong className="text-[15px] text-gray-700">{w.label}</strong>
              <span className="text-gray-400 text-sm">{w.desc}</span>
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
            value={formData.period_from || ""}
            onChange={handleChange}
          />
          <InputField
            label="To"
            id="period_to"
            name="period_to"
            type="date"
            value={formData.period_to || ""}
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
        value={formData.remarks || ""}
        onChange={handleChange}
      />
    </form>
  );
};

export default Weather;
