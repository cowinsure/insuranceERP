"use client";

import DropdownField from "@/components/DropDownField";
import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import { useLocalization } from "@/core/context/LocalizationContext";
import InputField from "@/components/InputField";

interface IrrigationCultivationProps {
  data: any;
  onChange: (updatedData: any) => void;
}

const IrrigationCultivation = ({
  data,
  onChange,
}: IrrigationCultivationProps) => {
  const { get } = useApi();
  const { t } = useLocalization();

  const [irrigationFacilityOptions, setIrrigationFacilityOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [cultivationSystemOptions, setCultivationSystemOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [landSuitabilityOptions, setLandSuitabilityOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [irrigationSourceOptions, setIrrigationSourceOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [irrigationStatusOptions, setIrrigationStatusOptions] = useState<
    { value: number; label: string }[]
  >([]);

  // Fetch options from API
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          irrigationRes,
          cultivationRes,
          landRes,
          irrigationFacilityRes,
          irrigationStatusRes,
        ] = await Promise.all([
          get("/cms/crop-irrigation-facility-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/crop-cultivation-system-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/crop-land-suitability-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/crop-irrigation-source-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          fetch("/irrigation_status.json").then((res) => res.json()),
        ]);

        if (irrigationRes.status === "success") {
          setIrrigationFacilityOptions(
            irrigationRes.data.map((item: any) => ({
              value: item.id,
              label: item.irrigation_facility,
            })),
          );
        }

        if (cultivationRes.status === "success") {
          setCultivationSystemOptions(
            cultivationRes.data.map((item: any) => ({
              value: item.id,
              label: item.crop_cultivation_system_name,
            })),
          );
        }

        if (landRes.status === "success") {
          setLandSuitabilityOptions(
            landRes.data.map((item: any) => ({
              value: item.id,
              label: item.crop_land_suitability_name,
            })),
          );
        }

        if (irrigationFacilityRes.status === "success") {
          setIrrigationSourceOptions(
            irrigationFacilityRes.data.map((item: any) => ({
              value: item.id,
              label: item.irrigation_source,
            })),
          );
        }

        // Actual API will need this block. Comment the one down below and uncomment this one after caliing original API

        // if (irrigationStatusRes.status === "success") {
        //   setIrrigationStatusOptions(
        //     irrigationStatusRes.data.map((item: any) => ({
        //       value: item.id,
        //       label: item.irrigation_source,
        //     })),
        //   );
        // }
        setIrrigationStatusOptions(
          irrigationStatusRes.map((item: any) => ({
            value: item.id,
            label: item.irrigation_status,
          })),
        );
      } catch (err) {
        console.error("Failed to fetch crop CMS options", err);
      }
    };

    fetchAll();
  }, [get]);

  // Handle dropdown change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    // Map the selected ID to its label
    let selectedLabel = "";
    switch (name) {
      case "irrigation_facility_id":
        selectedLabel =
          irrigationFacilityOptions.find((opt) => opt.value === numericValue)
            ?.label || "";
        break;
      case "irrigation_source_id":
        selectedLabel =
          irrigationSourceOptions.find((opt) => opt.value === numericValue)
            ?.label || "";
        break;
      case "cultivation_system_id":
        selectedLabel =
          cultivationSystemOptions.find((opt) => opt.value === numericValue)
            ?.label || "";
        break;
      case "land_suitability_id":
        selectedLabel =
          landSuitabilityOptions.find((opt) => opt.value === numericValue)
            ?.label || "";
        break;
      case "irrigation_status_id":
        selectedLabel =
          irrigationStatusOptions.find((opt) => opt.value === numericValue)
            ?.label || "";
        break;
    }

    // Send both ID and name to parent
    onChange({
      ...data,
      [name]: numericValue,
      [`${name}_name`]: selectedLabel,
    });
  };
  console.log(data);
  return (
    <form className="lg:p-3">
      <h2 className="text-lg lg:text-xl font-semibold mb-5 text-center underline">
        {t("cultivation_details")}
      </h2>
      <div className="space-y-5">
        <DropdownField
          label={t("irrigation_facility")}
          id="irrigationFacility"
          name="irrigation_facility_id"
          value={data.irrigation_facility_id || ""}
          onChange={handleChange}
          options={irrigationFacilityOptions}
        />
        <DropdownField
          label={t("irrigation_source")}
          id="irrigationSource"
          name="irrigation_source_id"
          value={data.irrigation_source_id || ""}
          onChange={handleChange}
          options={irrigationSourceOptions}
        />
        <DropdownField
          label={t("irrigation_status")}
          id="irrigationStatus"
          name="irrigation_status_id"
          value={data.irrigation_status_id || ""}
          onChange={handleChange}
          options={irrigationStatusOptions}
        />
        <InputField
          type="number"
          id="number_of_irrigations"
          name="number_of_irrigations"
          value={data.number_of_irrigations || ""}
          label="Number of Irrigations"
          placeholder="Enter the number of irrigations"
          onChange={(e) =>
            onChange({
              ...data,
              number_of_irrigations: Number(e.target.value),
            })
          }
        />
        <DropdownField
          label={t("cultivation_system")}
          id="cultivationSystem"
          name="cultivation_system_id"
          value={data.cultivation_system_id || ""}
          onChange={handleChange}
          options={cultivationSystemOptions}
        />
        <DropdownField
          label={t("land_suitability_for_commercial")}
          id="landSuitability"
          name="land_suitability_id"
          value={data.land_suitability_id || ""}
          onChange={handleChange}
          options={landSuitabilityOptions}
        />
      </div>
    </form>
  );
};

export default IrrigationCultivation;
