"use client";

import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";
import { StageTwoData } from "../StageTwo";

interface PestsDiseaseProps {
  data: any;
  onChange: (field: keyof StageTwoData, value: any) => void;
}

const PestsDisease: React.FC<PestsDiseaseProps> = ({ data, onChange }) => {
  const { get, loading } = useApi();

  const [pestOptions, setPestOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [diseaseOptions, setDiseaseOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [selectedPests, setSelectedPests] = useState<number[]>(
    data.pestIds || []
  );
  const [selectedDiseases, setSelectedDiseases] = useState<number[]>(
    data.diseaseIds || []
  );

  /** Fetch pest & disease options from API */
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [pestRes, diseaseRes] = await Promise.all([
          get("/cms/crop-pest-attack-observations-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/crop-disease-attack-observations-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
        ]);

        if (pestRes.status === "success" && Array.isArray(pestRes.data)) {
          setPestOptions(
            pestRes.data.map((item: any) => ({
              id: item.id,
              name: item.pest_attack_observations_type_name,
            }))
          );
        }

        if (diseaseRes.status === "success" && Array.isArray(diseaseRes.data)) {
          setDiseaseOptions(
            diseaseRes.data.map((item: any) => ({
              id: item.id,
              name: item.disease_attack_observations_type_name,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching pest/disease data:", err);
      }
    };

    fetchOptions();
  }, [get]);

  /** Handle pest toggle */
  const togglePest = (id: number) => {
    const updated = selectedPests.includes(id)
      ? selectedPests.filter((pid) => pid !== id)
      : [...selectedPests, id];

    setSelectedPests(updated);
    onChange("pestIds", updated);
  };

  /** Handle disease toggle */
  const toggleDisease = (id: number) => {
    const updated = selectedDiseases.includes(id)
      ? selectedDiseases.filter((did) => did !== id)
      : [...selectedDiseases, id];

    setSelectedDiseases(updated);
    onChange("diseaseIds", updated);
  };

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-5 underline text-center">
        Pest & Disease Observations
      </h2>

      <div className="space-y-6 max-h-[500px] overflow-auto">
        {/* Pest Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">
            Pest Attack Observations{" "}
            <span className="text-sm text-gray-400">(Multiple Selection)</span>
          </h3>

          {loading ? (
            <Loading />
          ) : (
            pestOptions.map((pest) => (
              <div
                key={pest.id}
                className="flex items-center gap-2 space-y-2 font-semibold text-[15px]"
              >
                <input
                  type="checkbox"
                  id={`pest-${pest.id}`}
                  checked={selectedPests.includes(pest.id)}
                  onChange={() => togglePest(pest.id)}
                  className="cursor-pointer accent-blue-600 custom-checkbox mt-2"
                />
                <label
                  htmlFor={`pest-${pest.id}`}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {pest.name}
                </label>
              </div>
            ))
          )}
        </div>

        {/* Disease Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">
            Disease Attack Observations{" "}
            <span className="text-sm text-gray-400">(Multiple Selection)</span>
          </h3>

          {loading ? (
            <Loading />
          ) : (
            diseaseOptions.map((disease) => (
              <div
                key={disease.id}
                className="flex items-center gap-2 space-y-2 font-semibold text-[15px]"
              >
                <input
                  type="checkbox"
                  id={`disease-${disease.id}`}
                  checked={selectedDiseases.includes(disease.id)}
                  onChange={() => toggleDisease(disease.id)}
                  className="cursor-pointer accent-green-600 custom-checkbox mt-2"
                />
                <label
                  htmlFor={`disease-${disease.id}`}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {disease.name}
                </label>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PestsDisease;
