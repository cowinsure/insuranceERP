"use client";

import { useEffect, useState } from "react";

interface ObservationItem {
  id: number;
  label: string;
}

interface PestsDiseaseProps {
  pests: Record<string, boolean>; // boolean object from StageTwo
  diseases: Record<string, boolean>;
  onChange: (data: {
    pests: Record<string, boolean>;
    diseases: Record<string, boolean>;
  }) => void;
}

const PestsDisease = ({ pests, diseases, onChange }: PestsDiseaseProps) => {
  // Dummy options
  const pestOptions: ObservationItem[] = [
    { id: 1, label: "Stem Borer" },
    { id: 2, label: "Leaf Folder" },
    { id: 3, label: "Brown Planthopper" },
    { id: 4, label: "Green Leafhopper" },
    { id: 5, label: "Stink Bug" },
    { id: 6, label: "Others" },
    { id: 7, label: "None" },
  ];

  const diseaseOptions: ObservationItem[] = [
    { id: 1, label: "Leaf Blast" },
    { id: 2, label: "Bacterial Leaf Blight" },
    { id: 3, label: "Sheath Blight" },
    { id: 4, label: "Bakanae" },
    { id: 5, label: "Brown Spot" },
    { id: 6, label: "Leaf Scald" },
    { id: 7, label: "Hispa" },
    { id: 8, label: "Tungro" },
    { id: 9, label: "None" },
  ];

  const toggleCheckbox = (type: "pest" | "disease", label: string) => {
    if (type === "pest") {
      const updated = { ...pests, [label]: !pests[label] };
      onChange({ pests: updated, diseases });
    } else {
      const updated = { ...diseases, [label]: !diseases[label] };
      onChange({ pests, diseases: updated });
    }
  };

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        Pest & Disease Observations
      </h2>

      <div className="space-y-6 max-h-[500px] overflow-auto">
        {/* Pest Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold text-base">
            Pest Attack Observations (Multiple Selection)
          </h3>
          {pestOptions.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!pests[p.label]}
                onChange={() => toggleCheckbox("pest", p.label)}
                className="accent-blue-600 custom-checkbox"
              />
              {p.label}
            </label>
          ))}
        </div>

        {/* Disease Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold text-base">
            Disease Attack Observations (Multiple Selection)
          </h3>
          {diseaseOptions.map((d) => (
            <label
              key={d.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!diseases[d.label]}
                onChange={() => toggleCheckbox("disease", d.label)}
                className="accent-green-600 custom-checkbox"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PestsDisease;
