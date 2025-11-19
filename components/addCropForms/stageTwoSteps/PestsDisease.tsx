"use client";

import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";

interface PestsDiseaseProps {
  data: {
    pestIds?: number[];
    diseaseIds?: number[];
    is_manageable_harvest?: boolean;
    reason_for_is_manageable_harvest?: string;
  };
  onChange: (updatedData: {
    pestIds: number[];
    pestNames?: string[]; // for preview
    diseaseIds: number[];
    diseaseNames?: string[]; // for preview
    is_manageable_harvest?: boolean;
    reason_for_is_manageable_harvest?: string;
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
  const [manageable, setManageable] = useState(
    data.is_manageable_harvest ? "Yes" : "No"
  );
  const [remarks, setRemarks] = useState(
    data.reason_for_is_manageable_harvest || ""
  );

  console.log(data.reason_for_is_manageable_harvest);

  /** Sync with parent data if it changes */
  useEffect(() => {
    setSelectedPests(data.pestIds || []);
    setSelectedDiseases(data.diseaseIds || []);
    setManageable(data.is_manageable_harvest ? "Yes" : "No");
    setRemarks(data.reason_for_is_manageable_harvest || "");
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

  /** Handlers */
  const updateParent = (updated: Partial<PestsDiseaseProps["data"]>) => {
    onChange({
      pestIds: selectedPests,
      pestNames: pestOptions
        .filter((p) => selectedPests.includes(p.id))
        .map((p) => p.name),
      diseaseIds: selectedDiseases,
      diseaseNames: diseaseOptions
        .filter((d) => selectedDiseases.includes(d.id))
        .map((d) => d.name),
      is_manageable_harvest: manageable === "Yes",
      reason_for_is_manageable_harvest: manageable === "No" ? remarks : "",
      ...updated,
    });
  };

  const togglePest = (id: number) => {
    const updatedIds = selectedPests.includes(id)
      ? selectedPests.filter((pid) => pid !== id)
      : [...selectedPests, id];
    setSelectedPests(updatedIds);

    updateParent({
      pestIds: updatedIds,
      diseaseIds: selectedDiseases,
      is_manageable_harvest: manageable === "Yes",
      reason_for_is_manageable_harvest: remarks || undefined,
    });
  };

  const toggleDisease = (id: number) => {
    const updatedIds = selectedDiseases.includes(id)
      ? selectedDiseases.filter((did) => did !== id)
      : [...selectedDiseases, id];
    setSelectedDiseases(updatedIds);

    updateParent({
      pestIds: selectedPests,
      diseaseIds: updatedIds,
      is_manageable_harvest: manageable === "Yes",
      reason_for_is_manageable_harvest: remarks || undefined,
    });
  };

  const handleManageableChange = (value: string) => {
    setManageable(value);
    if (value === "Yes") setRemarks("");

    updateParent({
      pestIds: selectedPests,
      diseaseIds: selectedDiseases,
      is_manageable_harvest: value === "Yes",
      reason_for_is_manageable_harvest: value === "Yes" ? undefined : remarks,
    });
  };

  const handleRemarksChange = (val: string) => {
    setRemarks(val);

    updateParent({
      pestIds: selectedPests,
      diseaseIds: selectedDiseases,
      is_manageable_harvest: manageable === "Yes",
      reason_for_is_manageable_harvest: val,
    });
  };

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
                  className="cursor-pointer accent-blue-600 custom-checkbox mt-2 shrink-0"
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
                  className="cursor-pointer accent-green-600 custom-checkbox mt-2 shrink-0"
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

        {/* Manageable Harvest Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-3">
          <h3 className="font-semibold">Was the pest & disease manageable?</h3>
          <div className="flex gap-6">
            {["Yes", "No"].map((val) => (
              <label
                key={val}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="manageable"
                  value={val}
                  checked={manageable === val}
                  onChange={(e) => handleManageableChange(e.target.value)}
                  className="accent-green-600 cursor-pointer"
                />
                {val}
              </label>
            ))}
          </div>

          {manageable === "No" && (
            <div className="mt-2">
              <label className="mb-2 text-sm font-bold text-gray-400 tracking-wide">
                Remarks / Comments
              </label>
              <textarea
                value={remarks}
                onChange={(e) => handleRemarksChange(e.target.value)}
                placeholder="Please provide remarks or comments"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none min-h-[80px] font-medium"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestsDisease;
