"use client";

import React, { useEffect, useState } from "react";

/* ---------- Props ---------- */
interface StageTwoDataProps {
  cropId?: string | number; // only the ID is needed
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
const StageTwoData: React.FC<StageTwoDataProps> = ({ cropId }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const storageKey = cropId ? `stageTwo_${cropId}` : null;

  useEffect(() => {
    if (!storageKey) return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setData(JSON.parse(saved));
      else setData(null);
    } catch (err) {
      console.error("Error loading Stage 2 data:", err);
      setError("Failed to load Stage 2 data.");
    }
  }, [storageKey]);

  if (error) {
    return <p className="text-red-500 italic">{error}</p>;
  }

  if (!data) {
    return (
      <div className="text-gray-500 italic">
        No Stage Two data available for this crop.
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div className="space-y-6 text-gray-700 overflow-y-auto">
      {/* 🌾 Harvest */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">Harvest</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayField label="Harvest Date" value={data.harvestDate} />
          <DisplayField label="Total Production" value={data.totalProduction} />
          <DisplayField label="Moisture Content" value={data.moistureContent} />
        </div>
      </section>

      {/* 🌱 Observations */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">Observations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayField label="Seed Variety Observation" value={data.observationData?.seedVarietyObservation} />
          <DisplayField label="Good Practices" value={data.observationData?.goodPractices} />
          <DisplayField label="Manageable" value={data.observationData?.manageable} />
          <DisplayField label="Harvesting Timing" value={data.observationData?.harvestingTiming} />
        </div>
      </section>

      {/* 🐛 Pest & Disease */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">Pest & Disease Attacks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Pest Attacks"
            items={Object.entries(data.pestAttack || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: pestLabels[key] || key }))}
          />
          <ArrayDisplay
            title="Disease Attacks"
            items={Object.entries(data.diseaseAttack || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: diseaseLabels[key] || key }))}
          />
        </div>
      </section>

      {/* 🌤 Weather */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-green-800">Adverse Weather Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title="Weather Effects"
            items={Object.entries(data.adverseWeatherEffects || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: weatherLabels[key] || key }))}
          />
          <DisplayField label="Period From" value={data.periodFrom} />
          <DisplayField label="Period To" value={data.periodTo} />
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
            className="text-sm bg-gray-50 border border-gray-200 p-2 rounded"
          >
            {item.name}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 text-sm italic">No data</p>
    )}
  </div>
);

export default StageTwoData;
