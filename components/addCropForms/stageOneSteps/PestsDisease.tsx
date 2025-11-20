"use client";

import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";

interface PestsDiseaseProps {
  data: { pestIds?: number[]; diseaseIds?: number[] };
  onChange: (
    pestIds: number[],
    diseaseIds: number[],
    pestDetails?: { id: number; name: string }[],
    diseaseDetails?: { id: number; name: string }[]
  ) => void;
}

const PestsDisease = ({ data, onChange }: PestsDiseaseProps) => {
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

  // Sync with parent when data changes (for persistence)
  useEffect(() => {
    setSelectedPests(data.pestIds || []);
    setSelectedDiseases(data.diseaseIds || []);
  }, [data]);

  // Fetch options from API
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

        if (pestRes.status === "success")
          setPestOptions(
            pestRes.data.map((item: any) => ({
              id: item.id,
              name: item.pest_attack_observations_type_name,
            }))
          );

        if (diseaseRes.status === "success")
          setDiseaseOptions(
            diseaseRes.data.map((item: any) => ({
              id: item.id,
              name: item.disease_attack_observations_type_name,
            }))
          );
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, [get]);

  // Select pest
  const togglePest = (id: number) => {
    //("Toggling pest ID:", id);
    const updated = selectedPests.includes(id)
      ? selectedPests.filter((i) => i !== id)
      : [...selectedPests, id];

    setSelectedPests(updated);

    const pestDetails = pestOptions.filter((p) => updated.includes(p.id));
    const diseaseDetails = diseaseOptions.filter((d) =>
      selectedDiseases.includes(d.id)
    );

    // ✅ Send IDs + names for preview
    onChange(
      updated,
      selectedDiseases,
      pestDetails.map((p) => ({ id: p.id, name: p.name })),
      diseaseDetails.map((d) => ({ id: d.id, name: d.name }))
    );
  };

  // Select disease
  const toggleDisease = (id: number) => {
    const updated = selectedDiseases.includes(id)
      ? selectedDiseases.filter((i) => i !== id)
      : [...selectedDiseases, id];

    setSelectedDiseases(updated);

    const pestDetails = pestOptions.filter((p) => selectedPests.includes(p.id));
    const diseaseDetails = diseaseOptions.filter((d) => updated.includes(d.id));

    onChange(
      selectedPests,
      updated,
      pestDetails.map((p) => ({ id: p.id, name: p.name })),
      diseaseDetails.map((d) => ({ id: d.id, name: d.name }))
    );
  };
console.log(data);
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
            <>
              {pestOptions.map((pest) => (
                <div
                  key={pest.id}
                  className="flex items-center gap-2 space-y-2 font-semibold text-[15px]"
                >
                  <input
                    type="checkbox"
                    id={`pest-${pest.id}`} // ✅ add this line
                    checked={selectedPests.includes(pest.id)}
                    onChange={() => togglePest(pest.id)}
                    className="cursor-pointer accent-blue-600 custom-checkbox mt-2 shrink-0"
                  />
                  <label
                    htmlFor={`pest-${pest.id}`} // ✅ connect label to input
                    className="cursor-pointer col-span-2"
                  >
                    {pest.name}
                  </label>
                </div>
              ))}
            </>
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
            <>
              {diseaseOptions.map((disease) => (
                <div
                  key={disease.id}
                  className="flex items-center gap-2 space-y-2 font-semibold text-[15px]"
                >
                  <input
                    type="checkbox"
                    id={`disease-${disease.id}`}
                    checked={selectedDiseases.includes(disease.id)}
                    onChange={() => toggleDisease(disease.id)}
                    className="cursor-pointer accent-green-600 custom-checkbox mt-2 shrink-0"
                  />
                  <label
                    htmlFor={`disease-${disease.id}`} // ✅ connect label to input
                    className="cursor-pointer"
                  >
                    {disease.name}
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestsDisease;
