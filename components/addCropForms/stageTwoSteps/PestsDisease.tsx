"use client";

import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";

interface PestsDiseaseProps {
  data: {
    pestIds?: number[];
    diseaseIds?: number[];
  };
  onChange: (updatedData: {
    pestIds: number[];
    pestNames?: string[]; // added for preview
    diseaseIds: number[];
    diseaseNames?: string[]; // added for preview
  }) => void;
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

  // Sync with parent data if it changes
  useEffect(() => {
    setSelectedPests(data.pestIds || []);
    setSelectedDiseases(data.diseaseIds || []);
  }, [data]);

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
    const updatedIds = selectedPests.includes(id)
      ? selectedPests.filter((pid) => pid !== id)
      : [...selectedPests, id];

    setSelectedPests(updatedIds);

    // Get names of selected pests
    const updatedNames = pestOptions
      .filter((p) => updatedIds.includes(p.id))
      .map((p) => p.name);

    onChange({
      pestIds: updatedIds,
      pestNames: updatedNames, // new field for preview
      diseaseIds: selectedDiseases,
      diseaseNames: diseaseOptions
        .filter((d) => selectedDiseases.includes(d.id))
        .map((d) => d.name), // maintain disease names
    });
  };

  /** Handle disease toggle */
  const toggleDisease = (id: number) => {
    const updatedIds = selectedDiseases.includes(id)
      ? selectedDiseases.filter((did) => did !== id)
      : [...selectedDiseases, id];

    setSelectedDiseases(updatedIds);

    // Get names of selected diseases
    const updatedNames = diseaseOptions
      .filter((d) => updatedIds.includes(d.id))
      .map((d) => d.name);

    onChange({
      pestIds: selectedPests,
      pestNames: pestOptions
        .filter((p) => selectedPests.includes(p.id))
        .map((p) => p.name), // maintain pest names
      diseaseIds: updatedIds,
      diseaseNames: updatedNames, // new field for preview
    });
  };

  console.log(data);

  return (
    <div>
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
          ) : pestOptions.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No pest options available.
            </p>
          ) : (
            pestOptions.map((pest) => (
              <div
                key={pest.id}
                className="flex items-center gap-2 font-semibold text-[15px]"
              >
                <input
                  type="checkbox"
                  id={`pest-${pest.id}`}
                  checked={selectedPests.includes(pest.id)}
                  onChange={() => togglePest(pest.id)}
                  className="cursor-pointer accent-blue-600 custom-checkbox mt-2"
                />
                <label htmlFor={`pest-${pest.id}`} className="cursor-pointer">
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
          ) : diseaseOptions.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No disease options available.
            </p>
          ) : (
            diseaseOptions.map((disease) => (
              <div
                key={disease.id}
                className="flex items-center gap-2 font-semibold text-[15px]"
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
                  className="cursor-pointer"
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
