import InputField from "@/components/InputField";
import React, { useState } from "react";

const Weather = () => {
  const [data, setData] = useState({
    adverseWeatherEffects: {
      flood: false,
      drought: false,
      excessRainfall: false,
      storms: false,
      hailstorm: false,
    },
    periodFrom: "",
    periodTo: "",
  });

  const [errors, setErrors] = useState({
    adverseWeatherEffects: "",
    periodFrom: "",
    periodTo: "",
  });

  // Handle change for all form fields (Checkbox and Date)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setData((prevData) => ({
        ...prevData,
        adverseWeatherEffects: {
          ...prevData.adverseWeatherEffects,
          [name]: checked,
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {
      adverseWeatherEffects: "",
      periodFrom: "",
      periodTo: "",
    };

    // Example validation checks (you can customize)
    if (
      !data.adverseWeatherEffects.flood &&
      !data.adverseWeatherEffects.drought &&
      !data.adverseWeatherEffects.excessRainfall &&
      !data.adverseWeatherEffects.storms &&
      !data.adverseWeatherEffects.hailstorm
    ) {
      newErrors.adverseWeatherEffects =
        "Please select at least one adverse weather effect";
    }

    if (!data.periodFrom) newErrors.periodFrom = "This field is required";
    if (!data.periodTo) newErrors.periodTo = "This field is required";

    setErrors(newErrors);
  };

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 underline text-center">Weather Details</h2>
      <div className="space-y-5">
        {/* Adverse Weather Effects (Checkboxes) */}
        <div className="space-y-5">
          <div className="space-y-3 bg-gray-50 p-2 border rounded-lg">
            <p className="ml-1">(Multiple Selection)</p>
            {[
              {
                label: "Flood",
                name: "flood",
                description: "Floods cause full or partial damage.",
              },
              {
                label: "Drought",
                name: "drought",
                description: "Some plants dry up prematurely or lodge down.",
              },
              {
                label: "Excess Rainfall",
                name: "excessRainfall",
                description: "Some plants dry up prematurely or lodge down.",
              },
              {
                label: "Storms",
                name: "storms",
                description: "Storms cause crop lodging or destruction.",
              },
              {
                label: "Hailstorm",
                name: "hailstorm",
                description:
                  "Hailstorms cause physical damage to grains or panicles.",
              },
            ].map((effect) => (
              <div key={effect.name} className="flex items-center">
                <input
                  type="checkbox"
                  id={effect.name}
                  name={effect.name}
                  checked={
                    data.adverseWeatherEffects[
                      effect.name as keyof typeof data.adverseWeatherEffects
                    ]
                  }
                  onChange={handleChange}
                  className="mr-2 custom-checkbox"
                />
                <label
                  htmlFor={effect.name}
                  className="text-gray-600 flex flex-col"
                >
                  <strong className="text-[15px]">{effect.label}</strong>
                  <span className="text-gray-400"> {effect.description}</span>
                </label>
              </div>
            ))}
          </div>
          {errors.adverseWeatherEffects && (
            <p className="text-red-600 text-sm mt-1">
              {errors.adverseWeatherEffects}
            </p>
          )}
        </div>

        {/* Period of Adverse Weather (Date Inputs) */}
        <div>
          <h1 className="text-lg font-semibold mb-1">Period of Adverse Weather</h1>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="From"
              id="periodFrom"
              name="periodFrom"
              type="date"
              value={data.periodFrom}
              onChange={handleChange}
              error={errors.periodFrom}
            />

            <InputField
              label="To"
              id="periodTo"
              name="periodTo"
              type="date"
              value={data.periodTo}
              onChange={handleChange}
              error={errors.periodTo}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Weather;
