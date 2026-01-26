"use client";

import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import Loading from "@/components/utils/Loading";
import { useLocalization } from "@/core/context/LocalizationContext";
import DropdownField from "@/components/DropDownField";

interface PestsDiseaseProps {
  data: {
    pestIds?: number[];
    diseaseIds?: number[];
    diseaseControlId?: number | undefined;
    neighbourFieldStatusId?: number | undefined;
  };
  onChange: (
    pestIds: number[],
    diseaseIds: number[],
    pestDetails?: { id: number; name: string }[],
    diseaseDetails?: { id: number; name: string }[],
    diseaseControlId?: number,
    neighbourFieldStatusId?: number,
  ) => void;
}

interface DropdownOption {
  value: number;
  label: string;
}

const PestsDisease = ({ data, onChange }: PestsDiseaseProps) => {
  const { get, loading } = useApi();
  const { t } = useLocalization();

  const [pestOptions, setPestOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [diseaseOptions, setDiseaseOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [diseaseControlOptions, setDiseaseControlOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [neighbourFieldStatusOptions, setNeighbourFieldStatusOptions] =
    useState<{ value: number; label: string }[]>([]);

  const [selectedPests, setSelectedPests] = useState<number[]>(
    data.pestIds || [],
  );
  const [selectedDiseases, setSelectedDiseases] = useState<number[]>(
    data.diseaseIds || [],
  );
  const [diseaseControlId, setDiseaseControlId] = useState<
    number | undefined
  >();

  const [neighbourFieldStatusId, setNeighbourFieldStatusId] = useState<
    number | undefined
  >();

  // Sync with parent when data changes (for persistence)
  useEffect(() => {
    setSelectedPests(data.pestIds || []);
    setSelectedDiseases(data.diseaseIds || []);
    setDiseaseControlId(data.diseaseControlId ?? undefined);
    setNeighbourFieldStatusId(data.neighbourFieldStatusId ?? undefined);
  }, [data]);

  // Fetch options from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          pestRes,
          diseaseRes,
          diseaseControlRes,
          neighbourFieldStatusRes,
        ] = await Promise.all([
          get("/cms/crop-pest-attack-observations-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/crop-disease-attack-observations-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/disease-control-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/neighbour-field-status-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
        ]);

        if (pestRes.status === "success")
          setPestOptions(
            pestRes.data.map((item: any) => ({
              id: item.id,
              name: item.pest_attack_observations_type_name,
            })),
          );

        if (diseaseRes.status === "success")
          setDiseaseOptions(
            diseaseRes.data.map((item: any) => ({
              id: item.id,
              name: item.disease_attack_observations_type_name,
            })),
          );

        if (neighbourFieldStatusRes.status === "success")
          setNeighbourFieldStatusOptions(
            neighbourFieldStatusRes.data.map((item: any) => ({
              value: item.id,
              label: item.field_status_type,
            })),
          );
        if (diseaseControlRes.status === "success")
          setDiseaseControlOptions(
            diseaseControlRes.data.map((item: any) => ({
              value: item.id,
              label: item.disease_control_type,
            })),
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
      selectedDiseases.includes(d.id),
    );

    // ✅ Send IDs + names for preview
    onChange(
      updated,
      selectedDiseases,
      pestDetails.map((p) => ({ id: p.id, name: p.name })),
      diseaseDetails.map((d) => ({ id: d.id, name: d.name })),
      diseaseControlId,
      neighbourFieldStatusId,
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
      diseaseDetails.map((d) => ({ id: d.id, name: d.name })),
      diseaseControlId,
      neighbourFieldStatusId,
    );
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    const numericValue = value === "" ? undefined : Number(value);

    let newDiseaseControl = diseaseControlId;
    let newNeighbourStatus = neighbourFieldStatusId;

    if (name === "disease_control_id") {
      newDiseaseControl = numericValue;
      setDiseaseControlId(numericValue);
    } else if (name === "neighbour_field_status_id") {
      newNeighbourStatus = numericValue;
      setNeighbourFieldStatusId(numericValue);
    }

    const pestDetails = pestOptions.filter((p) => selectedPests.includes(p.id));
    const diseaseDetails = diseaseOptions.filter((d) =>
      selectedDiseases.includes(d.id),
    );

    onChange(
      selectedPests,
      selectedDiseases,
      pestDetails.map((p) => ({ id: p.id, name: p.name })),
      diseaseDetails.map((d) => ({ id: d.id, name: d.name })),
      newDiseaseControl,
      newNeighbourStatus,
    );
  };

  return (
    <div className="lg:p-3">
      <h2 className="text-lg lg:text-xl font-semibold mb-5 underline text-center">
        {t("pest_disease_observations")}
      </h2>

      <div className="space-y-6 max-h-[400px] overflow-auto">
        <DropdownField
          label="Disease Control"
          id="diseaseControl"
          name="disease_control_id"
          value={diseaseControlId}
          onChange={handleChange}
          options={diseaseControlOptions}
        />
        <DropdownField
          label="Neighbour Field Status"
          id="neighbourFieldStatus"
          name="neighbour_field_status_id"
          value={neighbourFieldStatusId}
          onChange={handleChange}
          options={neighbourFieldStatusOptions}
        />
        {/* Pest Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">
            {t("pest_attack_observations")}{" "}
            <span className="text-sm text-gray-400">
              {t("multiple_selection")}
            </span>
          </h3>

          {loading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              {pestOptions.map((pest) => (
                <div
                  key={pest.id}
                  className="flex items-center gap-2 font-medium lg:text-[15px]"
                >
                  <input
                    type="checkbox"
                    id={`pest-${pest.id}`} // ✅ add this line
                    checked={selectedPests.includes(pest.id)}
                    onChange={() => togglePest(pest.id)}
                    className="cursor-pointer accent-blue-600 custom-checkbox shrink-0"
                  />
                  <label
                    htmlFor={`pest-${pest.id}`} // ✅ connect label to input
                    className="cursor-pointer col-span-2"
                  >
                    {pest.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disease Section */}
        <div className="bg-gray-50 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">
            {t("disease_attack_observations")}{" "}
            <span className="text-sm text-gray-400">
              {t("multiple_selection")}
            </span>
          </h3>

          {loading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              {diseaseOptions.map((disease) => (
                <div
                  key={disease.id}
                  className="flex items-center gap-2 font-medium lg:text-[15px]"
                >
                  <input
                    type="checkbox"
                    id={`disease-${disease.id}`}
                    checked={selectedDiseases.includes(disease.id)}
                    onChange={() => toggleDisease(disease.id)}
                    className="cursor-pointer accent-green-600 custom-checkbox shrink-0"
                  />
                  <label
                    htmlFor={`disease-${disease.id}`} // ✅ connect label to input
                    className="cursor-pointer"
                  >
                    {disease.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestsDisease;
