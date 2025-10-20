import { useState } from "react";
import { X } from "lucide-react";
import { Item } from "@/components/AddCropDetailsModal";
import InputField from "@/components/InputField";
import "animate.css";

interface ChemicalsProps {
  data: {
    fertilizers: Item[];
    pesticides: Item[];
  };
  onChange: (field: "fertilizers" | "pesticides", value: Item[]) => void;
}

const Chemicals = ({ data, onChange }: ChemicalsProps) => {
  const [removing, setRemoving] = useState<{ [key: string]: number | null }>({
    fertilizers: null,
    pesticides: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "fertilizers" | "pesticides"
  ) => {
    const { name, value } = e.target;
    const updated = [...data[type]];
    updated[index] = { ...updated[index], [name]: value };
    onChange(type, updated);
  };

  const addField = (type: "fertilizers" | "pesticides") => {
    onChange(type, [...data[type], { name: "", quantity: "" }]);
  };

  const removeField = (index: number, type: "fertilizers" | "pesticides") => {
    setRemoving((prev) => ({ ...prev, [type]: index }));
    setTimeout(() => {
      onChange(
        type,
        data[type].filter((_, i) => i !== index)
      );
      setRemoving((prev) => ({ ...prev, [type]: null }));
    }, 500); // match with animation duration
  };

  const renderFields = (type: "fertilizers" | "pesticides") => {
    return data[type].map((item, index) => {
      const isRemoving = removing[type] === index;
      return (
        <div
          key={index}
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
              name="name"
              value={item.name ?? ""}
              onChange={(e) => handleChange(e, index, type)}
              placeholder={`Enter ${type} name`}
            />
            <InputField
              id={`${type}-qty-${index}`}
              name="quantity"
              type="number"
              value={item.quantity ?? ""}
              onChange={(e) => handleChange(e, index, type)}
              placeholder={`Quantity (${
                type === "fertilizers" ? "kg" : "litre"
              })`}
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
        {renderFields("fertilizers")}
        <button
          type="button"
          onClick={() => addField("fertilizers")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          + Add Fertilizer
        </button>
      </div>

      <hr />

      {/* Pesticides */}
      <div className="space-y-5 mt-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">Pesticides & Fungicides</h2>
        {renderFields("pesticides")}
        <button
          type="button"
          onClick={() => addField("pesticides")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          + Add Pesticide
        </button>
      </div>
    </div>
  );
};

export default Chemicals;
