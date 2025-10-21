"use client";

import { useState } from "react";
import { X } from "lucide-react";
import InputField from "@/components/InputField";
import { ChemicalUsage, CropData } from "@/components/model/crop/CropCoreModel";
import "animate.css";

interface ChemicalsProps {
  data: CropData;
  onChange: (updatedChemicals: ChemicalUsage[]) => void;
}

const Chemicals = ({ data, onChange }: ChemicalsProps) => {
  const [removing, setRemoving] = useState<number | null>(null);

  const fertilizers = data.crop_asset_chemical_usage_details.filter(
    (c) => c.chemical_type_id === 1
  );
  const pesticides = data.crop_asset_chemical_usage_details.filter(
    (c) => c.chemical_type_id === 2
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "fertilizer" | "pesticide"
  ) => {
    const { name, value } = e.target;
    const updated = [...data.crop_asset_chemical_usage_details];
    const typeId = type === "fertilizer" ? 1 : 2;

    let count = -1;
    const targetIndex = updated.findIndex((c) => {
      if (c.chemical_type_id === typeId) count++;
      return count === index && c.chemical_type_id === typeId;
    });

    if (targetIndex !== -1) {
      updated[targetIndex] = {
        ...updated[targetIndex],
        [name === "quantity" ? "qty" : "chemical_name"]:
          name === "quantity" ? Number(value) : value,
      };
      onChange(updated);
    }
  };

  const addField = (type: "fertilizer" | "pesticide") => {
    const typeId = type === "fertilizer" ? 1 : 2;
    const newChemical: ChemicalUsage = {
      chemical_usage_id: Date.now(),
      chemical_name: "",
      chemical_type_id: typeId,
      qty: 0,
      qty_unit: type === "fertilizer" ? "kg" : "litre",
      remarks: "",
      crop_name: data.crop_asset_seed_details[0]?.crop_name || "",
      land_name: data.crop_asset_seed_details[0]?.land_name || "",
      farmer_name: data.crop_asset_seed_details[0]?.farmer_name || "",
      mobile_number: data.crop_asset_seed_details[0]?.mobile_number || "",
      created_at: new Date().toISOString(),
      modified_at: null,
      stage_name: null,
    };

    // Add new chemical and trigger parent update
    onChange([...data.crop_asset_chemical_usage_details, newChemical]);
  };

  const removeField = (index: number, type: "fertilizer" | "pesticide") => {
    setRemoving(index);
    const typeId = type === "fertilizer" ? 1 : 2;

    setTimeout(() => {
      let count = -1;
      const updated = data.crop_asset_chemical_usage_details.filter((c) => {
        if (c.chemical_type_id === typeId) count++;
        return !(count === index && c.chemical_type_id === typeId);
      });
      onChange(updated);
      setRemoving(null);
    }, 300);
  };

  const renderFields = (type: "fertilizer" | "pesticide") => {
    const list = type === "fertilizer" ? fertilizers : pesticides;
    return list.map((item, index) => {
      const isRemoving = removing === index;
      return (
        <div
          key={item.chemical_usage_id}
          className={`flex items-center gap-2 animate__animated ${
            isRemoving ? "animate__fadeOut" : "animate__fadeIn"
          }`}
        >
          <div className="w-6 h-6 border rounded-sm mt-1 flex items-center justify-center text-sm">
            {index + 1}
          </div>
          <div className="flex items-center justify-between w-full">
            <InputField
              id={`${type}-name-${index}`}
              name="chemical_name"
              value={item.chemical_name ?? ""}
              onChange={(e) => handleChange(e, index, type)}
              placeholder={`Enter ${type} name`}
            />
            <InputField
              id={`${type}-qty-${index}`}
              name="quantity"
              type="number"
              value={item.qty ?? ""}
              onChange={(e) => handleChange(e, index, type)}
              placeholder={`Quantity ${
                type === "fertilizer" ? "(kg)" : "(litre)"
              }`}
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
    <div className="p-3 max-h-[60vh] overflow-auto">
      {/* Fertilizers */}
      <div className="space-y-5 mb-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">Fertilizers</h2>
        {renderFields("fertilizer")}
        <button
          type="button"
          onClick={() => addField("fertilizer")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          + Add Fertilizer
        </button>
      </div>

      <hr />

      {/* Pesticides */}
      <div className="space-y-5 mt-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">Pesticides & Fungicides</h2>
        {renderFields("pesticide")}
        <button
          type="button"
          onClick={() => addField("pesticide")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          + Add Pesticide
        </button>
      </div>
    </div>
  );
};

export default Chemicals;
