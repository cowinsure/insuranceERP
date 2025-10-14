"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import InputField from "@/components/InputField";

interface Item {
  name: string;
  quantity: string;
}

const Chemicals = () => {
  const [fertilizers, setFertilizers] = useState<Item[]>([
    { name: "", quantity: "" },
  ]);
  const [pesticides, setPesticides] = useState<Item[]>([
    { name: "", quantity: "" },
  ]);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "fertilizer" | "pesticide"
  ) => {
    const { name, value } = e.target;
    if (type === "fertilizer") {
      const updated = [...fertilizers];
      updated[index] = { ...updated[index], [name]: value };
      setFertilizers(updated);
    } else {
      const updated = [...pesticides];
      updated[index] = { ...updated[index], [name]: value };
      setPesticides(updated);
    }
  };

  const addField = (type: "fertilizer" | "pesticide") => {
    const newItem = { name: "", quantity: "" };
    if (type === "fertilizer") {
      setFertilizers([...fertilizers, newItem]);
    } else {
      setPesticides([...pesticides, newItem]);
    }
  };

  const removeField = (index: number, type: "fertilizer" | "pesticide") => {
    if (type === "fertilizer") {
      const updated = fertilizers.filter((_, i) => i !== index);
      setFertilizers(updated);
    } else {
      const updated = pesticides.filter((_, i) => i !== index);
      setPesticides(updated);
    }
  };

  return (
    <div className="p-3 max-h-[60vh] overflow-auto">
      {/* Fertilizers */}
      <div className="space-y-5 mb-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">Fertilizers</h2>
        {fertilizers.map((item, index) => (
          <div
            key={index}
            className="flex items-end justify-between mb-3 w-full"
          >
            <InputField
              label="Name"
              id={`fertilizer-name-${index}`}
              name="name"
              value={item.name}
              onChange={(e) => handleChange(e, index, "fertilizer")}
              placeholder="Enter fertilizer name"
            />
            <InputField
              label="Quantity (kg)"
              id={`fertilizer-qty-${index}`}
              name="quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(e, index, "fertilizer")}
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => removeField(index, "fertilizer")}
              className="p-1.5 text-red-600 border rounded-md hover:bg-red-700 hover:text-white cursor-pointer"
            >
              <X />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("fertilizer")}
          className="px-4 py-2 mt-2 bg-gray-200 cursor-pointer rounded-md hover:bg-gray-300"
        >
          + Add Fertilizer
        </button>
      </div>

      <hr />

      {/* Pesticides & Fungicides */}
      <div className="space-y-5 mt-3 bg-gray-50 p-3 border rounded-lg">
        <h2 className="text-lg font-medium mb-5">Pesticides & Fungicides</h2>
        {pesticides.map((item, index) => (
          <div
            key={index}
            className="flex items-end justify-between mb-3 w-full"
          >
            <InputField
              label="Name"
              id={`pesticide-name-${index}`}
              name="name"
              value={item.name}
              onChange={(e) => handleChange(e, index, "pesticide")}
              placeholder="Enter pesticide name"
            />
            <InputField
              label="Quantity (litre)"
              id={`pesticide-qty-${index}`}
              name="quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(e, index, "pesticide")}
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => removeField(index, "pesticide")}
              className="p-1.5 text-red-600 border rounded-md hover:bg-red-700 hover:text-white cursor-pointer"
            >
              <X />
            </button>
          </div>
        ))}
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
