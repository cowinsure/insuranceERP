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
    <div className="lg:p-3 max-h-[60vh] overflow-auto space-y-5">
      <div className="space-y-5 mb-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg lg:text-xl font-medium mb-5">{t('fertilizers')}</h2>
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
