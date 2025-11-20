// "use client";

// import { useState } from "react";
// import { X } from "lucide-react";
// import InputField from "@/components/InputField";
// import { ChemicalUsage } from "@/components/model/crop/CropCoreModel";
// import "animate.css";
// import { SelectedCropMeta } from "@/components/model/crop/CropRegisterModel";
// interface ChemicalsProps {
//   cropMeta: SelectedCropMeta;
//   chemicals: ChemicalUsage[];
//   onChange: (updatedChemicals: ChemicalUsage[]) => void;
// }

// const Chemicals = ({ chemicals, cropMeta, onChange }: ChemicalsProps) => {
//   const [removing, setRemoving] = useState<number | null>(null);

//   const fertilizers = chemicals.filter((c) => c.chemical_type_id === 1);
//   const pesticides = chemicals.filter((c) => c.chemical_type_id === 2);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     index: number,
//     type: "fertilizer" | "pesticide"
//   ) => {
//     const { name, value } = e.target;
//     const updated = [...chemicals];
//     const typeId = type === "fertilizer" ? 1 : 2;
//     const filteredList = updated.filter((c) => c.chemical_type_id === typeId);

//     if (index < filteredList.length) {
//       const globalIndex = updated.indexOf(filteredList[index]);
//       if (globalIndex !== -1) {
//         updated[globalIndex] = {
//           ...updated[globalIndex],
//           chemical_name:
//             name === "chemical_name"
//               ? value
//               : updated[globalIndex].chemical_name,
//           qty: name === "quantity" ? Number(value) : updated[globalIndex].qty,
//           qty_unit:
//             updated[globalIndex].qty_unit ||
//             (type === "fertilizer" ? "kg" : "litre"),
//         };
//         onChange(updated);
//       }
//     }
//   };

//   const addField = (type: "fertilizer" | "pesticide") => {
//     const typeId = type === "fertilizer" ? 1 : 2;
//     const newChemical: ChemicalUsage = {
//       crop_id: 0,
//       chemical_usage_id: Date.now(),
//       chemical_name: "",
//       chemical_type_id: typeId,
//       qty: 0,
//       qty_unit: type === "fertilizer" ? "kg" : "litre",
//       remarks: "",
//       crop_name: cropMeta.crop_name || "",
//       land_name: cropMeta.land_name || "",
//       farmer_name: cropMeta.farmer_name || "",
//       mobile_number: cropMeta.mobile_number || "",
//       created_at: new Date().toISOString(),
//       modified_at: null,
//       stage_name: null,
//     };

//     onChange([...chemicals, newChemical]);
//   };

//   const removeField = (index: number, type: "fertilizer" | "pesticide") => {
//     setRemoving(index);
//     const typeId = type === "fertilizer" ? 1 : 2;

//     setTimeout(() => {
//       let count = -1;
//       const updated = chemicals.filter((c) => {
//         if (c.chemical_type_id === typeId) count++;
//         return !(count === index && c.chemical_type_id === typeId);
//       });
//       onChange(updated);
//       setRemoving(null);
//     }, 300);
//   };

//   const renderFields = (type: "fertilizer" | "pesticide") => {
//     const list = type === "fertilizer" ? fertilizers : pesticides;
//     return list.map((item, index) => {
//       const isRemoving = removing === index;
//       return (
//         <div
//           key={item.chemical_usage_id}
//           className={`flex items-center gap-2 animate__animated ${
//             isRemoving ? "animate__fadeOut" : "animate__fadeIn"
//           }`}
//         >
//           <div className="w-6 h-6 border rounded-sm mt-1 flex items-center justify-center text-sm">
//             {index + 1}
//           </div>
//           <div className="flex items-center justify-between w-full">
//             <InputField
//               id={`${type}-name-${index}`}
//               name="chemical_name"
//               value={item.chemical_name ?? ""}
//               onChange={(e) => handleChange(e, index, type)}
//               placeholder={`Enter ${type} name`}
//             />
//             <InputField
//               id={`${type}-qty-${index}`}
//               name="quantity"
//               type="number"
//               value={item.qty ?? ""}
//               onChange={(e) => handleChange(e, index, type)}
//               placeholder={`Quantity ${
//                 type === "fertilizer" ? "(kg)" : "(litre)"
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => removeField(index, type)}
//               className="p-1.5 text-red-600 border rounded-md hover:bg-red-700 hover:text-white cursor-pointer"
//             >
//               <X size={15} />
//             </button>
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="p-3 max-h-[60vh] overflow-auto">
//       {/* Fertilizers */}
//       <div className="space-y-5 mb-3 bg-gray-50 p-3 border rounded-lg">
//         <h2 className="text-lg font-medium mb-5">Fertilizers</h2>
//         {renderFields("fertilizer")}
//         <button
//           type="button"
//           onClick={() => addField("fertilizer")}
//           className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
//         >
//           + Add Fertilizer
//         </button>
//       </div>

//       <hr />

//       {/* Pesticides */}
//       <div className="space-y-5 mt-3 bg-gray-50 p-3 border rounded-lg">
//         <h2 className="text-lg font-medium mb-5">Pesticides & Fungicides</h2>
//         {renderFields("pesticide")}
//         <button
//           type="button"
//           onClick={() => addField("pesticide")}
//           className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
//         >
//           + Add Pesticide
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chemicals;

// Fresh start
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import InputField from "@/components/InputField";
import { useLocalization } from "@/core/context/LocalizationContext";

interface ChemicalItem {
  chemical_usage_id?: number;
  chemical_type_id?: number;
  chemical_name: string;
  qty: number;
  qty_unit?: string;
  remarks?: string;
}

interface ChemicalsProps {
  data: {
    fertilizers: ChemicalItem[];
    pesticides: ChemicalItem[];
  };
  onChange: (updatedData: {
    fertilizers: ChemicalItem[];
    pesticides: ChemicalItem[];
  }) => void;
}

const Chemicals = ({ data, onChange }: ChemicalsProps) => {
  const { t } = useLocalization();
  // Initialize state once
  const [fertilizers, setFertilizers] = useState<ChemicalItem[]>(
    () => data.fertilizers || []
  );
  const [pesticides, setPesticides] = useState<ChemicalItem[]>(
    () => data.pesticides || []
  );
  const [removing, setRemoving] = useState<number | null>(null);

  const handleChange = (
    index: number,
    type: "fertilizer" | "pesticide",
    field: keyof ChemicalItem,
    value: any
  ) => {
    const list = type === "fertilizer" ? [...fertilizers] : [...pesticides];
    list[index] = { ...list[index], [field]: value };

    if (type === "fertilizer") {
      setFertilizers(list);
      onChange({ fertilizers: list, pesticides });
    } else {
      setPesticides(list);
      onChange({ fertilizers, pesticides: list });
    }
  };

  const addField = (type: "fertilizer" | "pesticide") => {
    const newItem = { chemical_name: "", qty: 0 };
    if (type === "fertilizer") {
      const updated = [...fertilizers, newItem];
      setFertilizers(updated);
      onChange({ fertilizers: updated, pesticides });
    } else {
      const updated = [...pesticides, newItem];
      setPesticides(updated);
      onChange({ fertilizers, pesticides: updated });
    }
  };

  const removeField = (index: number, type: "fertilizer" | "pesticide") => {
    setRemoving(index);
    setTimeout(() => {
      if (type === "fertilizer") {
        const updated = [...fertilizers];
        updated.splice(index, 1);
        setFertilizers(updated);
        onChange({ fertilizers: updated, pesticides });
      } else {
        const updated = [...pesticides];
        updated.splice(index, 1);
        setPesticides(updated);
        onChange({ fertilizers, pesticides: updated });
      }
      setRemoving(null);
    }, 300);
  };

  const renderFields = (type: "fertilizer" | "pesticide") => {
    const list = type === "fertilizer" ? fertilizers : pesticides;
    return list.map((item, index) => {
      const isRemoving = removing === index;
      return (
        <div
          key={item.chemical_usage_id ?? index}
          className={`flex items-center gap-2 animate__animated ${
            isRemoving ? "animate__fadeOut" : "animate__fadeIn"
          }`}
        >
          <div className="w-6 h-6 border rounded-sm mt-1 flex items-center justify-center text-sm shrink-0">
            {index + 1}
          </div>
          <div className="flex items-center w-full gap-2">
            <InputField
              id={`${type}-name-${index}`}
              name="chemical_name"
              value={item.chemical_name}
              onChange={(e) =>
                handleChange(index, type, "chemical_name", e.target.value)
              }
              placeholder={type === "fertilizer" ? t('enter_fertilizer_name') : t('enter_pesticide_name')}
            />
            <InputField
              id={`${type}-qty-${index}`}
              name="qty"
              type="number"
              value={item.qty}
              onChange={(e) =>
                handleChange(index, type, "qty", Number(e.target.value))
              }
              placeholder={t('quantity')}
              className="w-[50px] md:w-full"
            />
            <button
              type="button"
              onClick={() => removeField(index, type)}
              className="p-1.5 text-red-600 border rounded-md hover:bg-red-700 hover:text-white cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="p-3 max-h-[60vh] overflow-auto space-y-5">
      <div className="space-y-5 mb-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">{t('fertilizers')}</h2>
        {renderFields("fertilizer")}
        <button
          type="button"
          onClick={() => addField("fertilizer")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          {t('add_fertilizer')}
        </button>
      </div>

      <div className="space-y-5 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">{t('pesticides_fungicides')}</h2>
        {renderFields("pesticide")}
        <button
          type="button"
          onClick={() => addField("pesticide")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          {t('add_pesticide')}
        </button>
      </div>
    </div>
  );
};

export default Chemicals;
