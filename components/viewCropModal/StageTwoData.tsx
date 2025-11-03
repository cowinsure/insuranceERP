"use client";

import useApi from "@/hooks/use_api";
import React, { useEffect, useState } from "react";

/* ---------- Props ---------- */
interface StageTwoDataProps {
  cropData?: any;
}

/* ---------- Labels for display ---------- */
const pestLabels: Record<string, string> = {
  stemBorer: "Stem Borer",
  leafFolder: "Leaf Folder",
  brownPlanthopper: "Brown Planthopper",
  greenLeafhopper: "Green Leafhopper",
  stinkBug: "Stink Bug",
  others: "Others",
  none: "None",
};

const diseaseLabels: Record<string, string> = {
  leafBlast: "Leaf Blast",
  bacterialLeafBlight: "Bacterial Leaf Blight",
  sheathBlight: "Sheath Blight",
  bakanae: "Bakanae",
  brownSpot: "Brown Spot",
  leafScald: "Leaf Scald",
  hispa: "Hispa",
  tungro: "Tungro",
  none: "None",
};

const weatherLabels: Record<string, string> = {
  flood: "Flood",
  drought: "Drought",
  excessRainfall: "Excess Rainfall",
  storms: "Storms",
  hailstorm: "Hailstorm",
};

/* ---------- Component ---------- */
const StageTwoData: React.FC<StageTwoDataProps> = ({ cropData }) => {
  const { get } = useApi();

  const [harvestSeedVarietyOptions, setHarvestSeedVarietyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [harvestTimingOptions, setHarvestTimingOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [goodPracticesList, setGoodPracticesList] = useState<
    { id: number; label: string }[]
  >([]);

  // Call the type api
  useEffect(() => {
    getHarvestSeedVarietyOptions();
    getHarvestTimingOptions();
    getGoodPracticesOptions();
  }, []);

  // Get harvest seed variety options
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

  if (!cropData) {
    return (
      <div className="text-gray-500 italic">
        No Stage Two cropData available for this crop.
      </div>
    );
  }
  const crop = cropData.crop_harvest_info[0];

  // Get the seed variety name using id
  const seedVarietyName = crop?.harvest_seed_variety_observation_id
    ? harvestSeedVarietyOptions?.find(
        (option) => option?.value === crop?.harvest_seed_variety_observation_id
      )?.label
    : "";

  // Get the harvest timing names
  const harvestingTimingName = crop?.harvesting_timing_id
    ? harvestTimingOptions?.find(
        (option) => option?.value === crop?.harvesting_timing_id
      )?.label
    : "";

  // Get the good practices
  const goodPracticeNames =
    crop?.crop_harvest_details && crop?.crop_harvest_details.length > 0
      ? crop?.crop_harvest_details
          .map((detail: any) => {
            const match = goodPracticesList?.find(
              (p) => p?.id === detail?.good_agricultural_practices_type_id
            );
            return match ? match.label : null;
          })
          .filter(Boolean) // remove nulls
      : [];

  console.log("View crop for stage 2", cropData);
  console.log(goodPracticesList);
  /* ---------- Render ---------- */
  return (
    <div className="space-y-6 text-gray-700 overflow-y-auto">
      {/* 🌾 Harvest */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">Harvest</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayField label="Harvest Date" value={crop?.harvest_date} />
          <DisplayField
            label="Total Production"
            value={`${
              crop?.total_production_kg === undefined
                ? ""
                : `${crop?.total_production_kg} kg`
            }`}
          />
          <DisplayField
            label="Moisture Content"
            value={`${
              crop?.moisture_content_percentage === undefined
                ? ""
                : `${crop?.moisture_content_percentage} %`
            }`}
          />
        </div>
      </section>

      {/* 🌱 Observations */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Observations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayField
            label="Seed Variety Observation"
            value={seedVarietyName}
          />
          <DisplayField
            label="Harvesting Timing"
            value={harvestingTimingName}
          />
          <DisplayField
            label="Manageable"
            value={
              crop?.is_manageable_harvest === true ? "It was manageable" : "No"
            }
          />
          <DisplayField
            label="Remarks"
            value={crop?.reason_for_is_manageable_harvest}
          />
          <div className="col-span-2">
            <ArrayDisplay
              title="Good Practices"
              items={goodPracticeNames.map((name: string) => ({ name }))}
            />
          </div>
        </div>
      </section>

      {/* 🐛 Pest & Disease */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Pest & Disease Attacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Pest Attacks"
            items={Object.entries(cropData.pestAttack || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: pestLabels[key] || key }))}
          />
          <ArrayDisplay
            title="Disease Attacks"
            items={Object.entries(cropData.diseaseAttack || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: diseaseLabels[key] || key }))}
          />
        </div>
      </section>

      {/* 🌤 Weather */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          Adverse Weather Effects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Weather Effects"
            items={Object.entries(cropData.adverseWeatherEffects || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: weatherLabels[key] || key }))}
          />
          <DisplayField label="Period From" value={cropData.periodFrom} />
          <DisplayField label="Period To" value={cropData.periodTo} />
        </div>
      </section>
    </div>
  );
};

/* ---------- Reusable Components ---------- */
const DisplayField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <div className="border border-gray-200 rounded-md p-2 bg-gray-50 text-wrap">
      {value !== undefined && value !== null && value !== "" ? (
        value
      ) : (
        <span className="text-gray-400 italic">Not provided</span>
      )}
    </div>
  </div>
);

const ArrayDisplay = ({
  title,
  items,
}: {
  title: string;
  items: { name: string }[];
}) => (
  <div>
    <h3 className="font-medium mb-2 text-gray-600">{title}</h3>
    {items && items.length > 0 ? (
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm bg-blue-50 border border-gray-200 p-2 rounded"
          >
            {item.name}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 text-sm italic">Not Provided</p>
    )}
  </div>
);

export default StageTwoData;
