// "use client";

// import React from "react";
// import {
//   PestAttack,
//   DiseaseAttack,
// } from "@/components/model/crop/CropCoreModel";

// interface PestsDiseaseProps {
//   data: {
//     pest: Partial<PestAttack>;
//     disease: Partial<DiseaseAttack>;
//   };
//   onChange: (
//     updatedPest: Partial<PestAttack>,
//     updatedDisease: Partial<DiseaseAttack>
//   ) => void;
//   errors?: {
//     pestAttack?: string;
//     diseaseAttack?: string;
//   };
// }

// const PestsDisease = ({ data, onChange, errors }: PestsDiseaseProps) => {
//   // Merge default values with passed data
//   const pestAttack: Partial<PestAttack> = {
//     crop_pest_attack_id: 0,
//     pest_attack_type_id: 0,
//     pest_attack_observations_type_name: [],
//     remarks: "",
//     attack_date: "",
//     ...data.pest,
//   };

//   const diseaseAttack: Partial<DiseaseAttack> = {
//     crop_disease_attack_id: 0,
//     disease_attack_type_id: 0,
//     disease_attack_observations_type_name: [],
//     remarks: "",
//     attack_date: "",
//     ...data.disease,
//   };

//   // Handle checkbox change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked, dataset } = e.target;
//     const group = dataset.group as "pestAttack" | "diseaseAttack";

//     if (group === "pestAttack") {
//       const selected = new Set(pestAttack.pest_attack_observations_type_name);
//       if (checked) selected.add(name);
//       else selected.delete(name);
//       console.log("Pest",selected);

//       onChange(
//         {
//           ...pestAttack,
//           pest_attack_observations_type_name: Array.from(selected),
//         },
//         diseaseAttack
//       );
//     } else {
//       const selected = new Set(
//         diseaseAttack.disease_attack_observations_type_name
//       );
//       if (checked) selected.add(name);
//       else selected.delete(name);
//       console.log("Disease",selected);

//       onChange(pestAttack, {
//         ...diseaseAttack,
//         disease_attack_observations_type_name: Array.from(selected),
//       });
//     }
//   };

//   // ✅ Options (unchanged)
//   const pestOptions = [
//     {
//       label: "Stem Borer infestation (খোদরো পোকার আক্রমণ)",
//       name: "Stem Borer",
//       desc: "In stem borer infestation, panicles turn white and remain empty.",
//     },
//     {
//       label: "Leaf Folder attack (পাতা মড়ি পোকার আক্রমণ)",
//       name: "Leaf Folder",
//       desc: "Leaves fold with feeding marks, resulting in smaller panicles.",
//     },
//     {
//       label: "Brown Planthopper (BPH) infestation (বাদামী গাছফড়িং আক্রমণ)",
//       name: "Brown Planthopper",
//       desc: "BPH infestation causes plants to dry up.",
//     },
//     {
//       label: "Green Leafhopper (GLH) infestation (সবুজ গাছফড়িং আক্রমণ)",
//       name: "Green Leafhopper",
//       desc: "GLH attacks cause hopper burn, drying leaves and panicles.",
//     },
//     {
//       label: "Stink Bug (গন্ধি পোকা)",
//       name: "Stink Bug",
//       desc: "Sucks the grains, drying them and creating bad odor.",
//     },
//     {
//       label: "Others - Please Specify (অন্যান্য - অনুগ্রহ করে উল্লেখ করুন)",
//       name: "Others",
//       desc: "",
//     },
//     { label: "None of the above (উপরের কোনোটিই নয়)", name: "None", desc: "" },
//   ];

//   const diseaseOptions = [
//     {
//       label: "Leaf blast disease (পাতার পোড়ার রোগ)",
//       name: "Leaf Blast",
//       desc: "Burnt spots appear on leaves; panicles dry up and empty grains increase.",
//     },
//     {
//       label: "Bacterial leaf blight (BLB) (পাতার কলাপচলা রোগ)",
//       name: "Bacterial Leaf Blight",
//       desc: "Leaf tips burn downwards due to bacterial infection.",
//     },
//     {
//       label: "Sheath blight disease (পাতার গোড়ার পচা রোগ)",
//       name: "Sheath Blight",
//       desc: "Brown spots appear on the stem base; panicles remain empty.",
//     },
//     {
//       label: "Bakanae disease (বাকানাই রোগ)",
//       name: "Bakanae",
//       desc: "Plants grow abnormally tall and weak with hollow panicles.",
//     },
//     {
//       label: "Brown spot disease (বাদামী দাগা রোগ)",
//       name: "Brown Spot",
//       desc: "Brown spots appear on leaves; plants dry up prematurely.",
//     },
//     {
//       label: "Leaf Scald (পাতার স্ক্যাল্ড রোগ)",
//       name: "Leaf Scald",
//       desc: "Leaves appear burnt or dried.",
//     },
//     {
//       label: "Hispa (হিস্পা পোকার)",
//       name: "Hispa",
//       desc: "Leaves curl due to infestation.",
//     },
//     {
//       label: "Tungro Virus Disease (ধানের টুংগ্রো ভাইরাস রোগ)",
//       name: "Tungro",
//       desc: "Plants become short, leaves turn orange/yellow, and yield decreases.",
//     },
//     { label: "None of the above (উপরের কোনোটিই নয়)", name: "None", desc: "" },
//   ];

//   return (
//     <form className="p-3">
//       <h2 className="text-xl font-semibold mb-5 underline text-center">
//         Pest & Disease Observations
//       </h2>

//       <div className="max-h-[500px] overflow-auto">
//         {/* Pest Attack Section */}
//         <div className="space-y-4 mb-6 bg-gray-50 p-4 border rounded-lg">
//           <h3 className="text-base font-semibold mb-2">
//             Pest Attack Observations{" "}
//             <span className="text-sm text-gray-400">(Multiple Selection)</span>
//           </h3>
//           {pestOptions.map((item) => (
//             <div key={item.name} className="flex items-start gap-2">
//               <input
//                 type="checkbox"
//                 id={item.name}
//                 name={item.name}
//                 data-group="pestAttack"
//                 checked={pestAttack.pest_attack_observations_type_name?.includes(
//                   item.name
//                 )}
//                 onChange={handleChange}
//                 className="mt-1 custom-checkbox"
//               />
//               <label
//                 htmlFor={item.name}
//                 className="flex flex-col text-gray-700"
//               >
//                 <span className="font-semibold text-[15px]">{item.label}</span>
//                 {item.desc && (
//                   <span className="text-gray-500 text-sm">{item.desc}</span>
//                 )}
//               </label>
//             </div>
//           ))}
//           {errors?.pestAttack && (
//             <p className="text-red-600 text-sm mt-1">{errors.pestAttack}</p>
//           )}
//         </div>

//         {/* Disease Attack Section */}
//         <div className="space-y-4 bg-gray-50 p-4 border rounded-lg">
//           <h3 className="text-base font-semibold mb-2">
//             Disease Attack Observations{" "}
//             <span className="text-sm text-gray-400">(Multiple Selection)</span>
//           </h3>
//           {diseaseOptions.map((item) => (
//             <div key={item.name} className="flex items-start gap-2">
//               <input
//                 type="checkbox"
//                 id={item.name}
//                 name={item.name}
//                 data-group="diseaseAttack"
//                 checked={diseaseAttack.disease_attack_observations_type_name?.includes(
//                   item.name
//                 )}
//                 onChange={handleChange}
//                 className="mt-1 custom-checkbox"
//               />
//               <label
//                 htmlFor={item.name}
//                 className="flex flex-col text-gray-700"
//               >
//                 <span className="font-semibold text-[15px]">{item.label}</span>
//                 {item.desc && (
//                   <span className="text-gray-500 text-sm">{item.desc}</span>
//                 )}
//               </label>
//             </div>
//           ))}
//           {errors?.diseaseAttack && (
//             <p className="text-red-600 text-sm mt-1">{errors.diseaseAttack}</p>
//           )}
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PestsDisease;

// Fresh start
"use client";

import useApi from "@/hooks/use_api";
import { useEffect, useState } from "react";

interface ObservationItem {
  id: number;
  label: string;
}

interface PestsDiseaseProps {
  value: {
    pests: ObservationItem[];
    diseases: ObservationItem[];
  };
  onChange: (data: {
    pests: ObservationItem[];
    diseases: ObservationItem[];
  }) => void;
}

const PestsDisease = ({ value, onChange }: PestsDiseaseProps) => {
  const { get } = useApi();
  const [pestOptions, setPestOptions] = useState<ObservationItem[]>([]);
  const [diseaseOptions, setDiseaseOptions] = useState<ObservationItem[]>([]);
  const [selectedPests, setSelectedPests] = useState<ObservationItem[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<ObservationItem[]>(
    []
  );
console.log(value);
  /** 🔄 Sync external values (useful when editing existing crop) */
  useEffect(() => {
    setSelectedPests(value?.pests || []);
    setSelectedDiseases(value?.diseases || []);
  }, [value]);

  /** 🌐 Fetch pest and disease options from API */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pestDataRes, diseaseDataRes] = await Promise.all([
          get(
            "/cms/crop-pest-attack-observations-type-service/?page_size=100&start_record=1"
          ),
          get(
            "/cms/crop-disease-attack-observations-type-service/?page_size=100&start_record=1"
          ),
        ]);

        // Correctly map API fields
        const pestData =
          pestDataRes?.data?.map((p: any) => ({
            id: p.id, // fixed from undefined
            label: p.pest_attack_observations_type_name,
          })) || [];

        const diseaseData =
          diseaseDataRes?.data?.map((d: any) => ({
            id: d.id, // fixed from undefined
            label: d.disease_attack_observations_type_name,
          })) || [];

        setPestOptions(pestData);
        setDiseaseOptions(diseaseData);
      } catch (error) {
        console.error("❌ Error fetching pest/disease options:", error);
      }
    };

    fetchData();
  }, [get]);

  /** ✅ Toggle selection for pest or disease */
  const toggleSelection = (item: ObservationItem, type: "pest" | "disease") => {
    if (type === "pest") {
      const exists = selectedPests.some((p) => p.id === item.id);
      const updated = exists
        ? selectedPests.filter((p) => p.id !== item.id)
        : [...selectedPests, item];
      setSelectedPests(updated);
      onChange({ pests: updated, diseases: selectedDiseases });
    } else {
      const exists = selectedDiseases.some((d) => d.id === item.id);
      const updated = exists
        ? selectedDiseases.filter((d) => d.id !== item.id)
        : [...selectedDiseases, item];
      setSelectedDiseases(updated);
      onChange({ pests: selectedPests, diseases: updated });
    }
  };

  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        <span className="font-bold">Pest & Disease Observations</span>
      </h2>

      <div className="max-h-[500px] overflow-auto space-y-6">
        {/* 🐛 Pest Section */}
        <div className="space-y-4 bg-gray-50 p-4 border rounded-lg">
          <h3 className="text-base font-semibold">
            <span className="font-bold">Pest Attack Observations</span>{" "}
            <span className="text-sm text-gray-400">(Multiple Selection)</span>
          </h3>

          {pestOptions.length === 0 && (
            <p className="text-sm text-gray-400">Loading pest options...</p>
          )}

          {pestOptions.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`pest-${item.id}`}
                checked={selectedPests.some((p) => p.label === item.label)}
                onChange={() => toggleSelection(item, "pest")}
                className="mt-1 cursor-pointer accent-blue-600 custom-checkbox"
              />
              <label
                htmlFor={`pest-${item.id}`}
                className="text-gray-700 cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        {/* 🦠 Disease Section */}
        <div className="space-y-4 bg-gray-50 p-4 border rounded-lg">
          <h3 className="text-base font-semibold">
            <span className="font-bold">Disease Attack Observations</span>{" "}
            <span className="text-sm text-gray-400">(Multiple Selection)</span>
          </h3>

          {diseaseOptions.length === 0 && (
            <p className="text-sm text-gray-400">Loading disease options...</p>
          )}

          {diseaseOptions.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`disease-${item.id}`}
                checked={selectedDiseases.some((d) => d.id === item.id)}
                onChange={() => toggleSelection(item, "disease")}
                className="mt-1 cursor-pointer accent-green-600 custom-checkbox"
              />
              <label
                htmlFor={`disease-${item.id}`}
                className="text-gray-700 cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default PestsDisease;
