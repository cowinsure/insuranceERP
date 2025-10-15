"use client";

import React from "react";

export interface PestsDiseaseData {
  pestAttack: {
    stemBorer: boolean;
    leafFolder: boolean;
    brownPlanthopper: boolean;
    greenLeafhopper: boolean;
    stinkBug: boolean;
    others: boolean;
    none: boolean;
  };
  diseaseAttack: {
    leafBlast: boolean;
    bacterialLeafBlight: boolean;
    sheathBlight: boolean;
    bakanae: boolean;
    brownSpot: boolean;
    leafScald: boolean;
    hispa: boolean;
    tungro: boolean;
    none: boolean;
  };
}

interface PestsDiseaseProps {
  data: PestsDiseaseData;
  onChange: (
    group: "pestAttack" | "diseaseAttack",
    value:
      | Partial<PestsDiseaseData["pestAttack"]>
      | Partial<PestsDiseaseData["diseaseAttack"]>
  ) => void;
  errors?: {
    pestAttack?: string;
    diseaseAttack?: string;
  };
}
const PestsDisease = ({ data, onChange, errors }: PestsDiseaseProps) => {
  const pestOptions = [
    {
      label: "Stem Borer infestation (খোদরো পোকার আক্রমণ)",
      name: "stemBorer",
      desc: "In stem borer infestation, panicles turn white and remain empty.",
    },
    {
      label: "Leaf Folder attack (পাতা মড়ি পোকার আক্রমণ)",
      name: "leafFolder",
      desc: "Leaves fold with feeding marks, resulting in smaller panicles.",
    },
    {
      label: "Brown Planthopper (BPH) infestation (বাদামী গাছফড়িং আক্রমণ)",
      name: "brownPlanthopper",
      desc: "BPH infestation causes plants to dry up.",
    },
    {
      label: "Green Leafhopper (GLH) infestation (সবুজ গাছফড়িং আক্রমণ)",
      name: "greenLeafhopper",
      desc: "GLH attacks cause hopper burn, drying leaves and panicles.",
    },
    {
      label: "Stink Bug (গন্ধি পোকা)",
      name: "stinkBug",
      desc: "Sucks the grains, drying them and creating bad odor.",
    },
    {
      label: "Others - Please Specify (অন্যান্য - অনুগ্রহ করে উল্লেখ করুন)",
      name: "others",
      desc: "",
    },
    { label: "None of the above (উপরের কোনোটিই নয়)", name: "none", desc: "" },
  ];

  const diseaseOptions = [
    {
      label: "Leaf blast disease (পাতার পোড়ার রোগ)",
      name: "leafBlast",
      desc: "Burnt spots appear on leaves; panicles dry up and empty grains increase.",
    },
    {
      label: "Bacterial leaf blight (BLB) (পাতার কলাপচলা রোগ)",
      name: "bacterialLeafBlight",
      desc: "Leaf tips burn downwards due to bacterial infection.",
    },
    {
      label: "Sheath blight disease (পাতার গোড়ার পচা রোগ)",
      name: "sheathBlight",
      desc: "Brown spots appear on the stem base; panicles remain empty.",
    },
    {
      label: "Bakanae disease (বাকানাই রোগ)",
      name: "bakanae",
      desc: "Plants grow abnormally tall and weak with hollow panicles.",
    },
    {
      label: "Brown spot disease (বাদামী দাগা রোগ)",
      name: "brownSpot",
      desc: "Brown spots appear on leaves; plants dry up prematurely.",
    },
    {
      label: "Leaf Scald (পাতার স্ক্যাল্ড রোগ)",
      name: "leafScald",
      desc: "Leaves appear burnt or dried.",
    },
    {
      label: "Hispa (হিস্পা পোকার)",
      name: "hispa",
      desc: "Leaves curl due to infestation.",
    },
    {
      label: "Tungro Virus Disease (ধানের টুংগ্রো ভাইরাস রোগ)",
      name: "tungro",
      desc: "Plants become short, leaves turn orange/yellow, and yield decreases.",
    },
    { label: "None of the above (উপরের কোনোটিই নয়)", name: "none", desc: "" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, dataset } = e.target;
    const group = dataset.group as "pestAttack" | "diseaseAttack";

    onChange(group, { [name]: checked }); // ✅ pass object
  };

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        Pest & Disease Observations
      </h2>

      <div className="max-h-[500px] overflow-auto">
        {/* Pest Attack Section */}
        <div className="space-y-4 mb-6 bg-gray-50 p-4 border rounded-lg">
          <h3 className="text-base font-semibold mb-2">
            Pest Attack Observations{" "}
            <span className="text-sm text-gray-400">(Multiple Selection)</span>
          </h3>
          {pestOptions.map((item) => (
            <div key={item.name} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={item.name}
                name={item.name}
                data-group="pestAttack"
                checked={
                  data.pestAttack[item.name as keyof typeof data.pestAttack]
                }
                onChange={handleChange}
                className="mt-1 custom-checkbox"
              />
              <label
                htmlFor={item.name}
                className="flex flex-col text-gray-700"
              >
                <span className="font-semibold text-[15px]">{item.label}</span>
                {item.desc && (
                  <span className="text-gray-500 text-sm">{item.desc}</span>
                )}
              </label>
            </div>
          ))}
          {errors?.pestAttack && (
            <p className="text-red-600 text-sm mt-1">{errors.pestAttack}</p>
          )}
        </div>
        {/* Disease Attack Section */}
        <div className="space-y-4 bg-gray-50 p-4 border rounded-lg">
          <h3 className="text-base font-semibold mb-2">
            Disease Attack Observations{" "}
            <span className="text-sm text-gray-400">(Multiple Selection)</span>
          </h3>
          {diseaseOptions.map((item) => (
            <div key={item.name} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={item.name}
                name={item.name}
                data-group="diseaseAttack"
                checked={
                  data.diseaseAttack[
                    item.name as keyof typeof data.diseaseAttack
                  ]
                }
                onChange={handleChange}
                className="mt-1 custom-checkbox"
              />
              <label
                htmlFor={item.name}
                className="flex flex-col text-gray-700"
              >
                <span className="font-semibold text-[15px]">{item.label}</span>
                {item.desc && (
                  <span className="text-gray-500 text-sm">{item.desc}</span>
                )}
              </label>
            </div>
          ))}
          {errors?.diseaseAttack && (
            <p className="text-red-600 text-sm mt-1">{errors.diseaseAttack}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default PestsDisease;
