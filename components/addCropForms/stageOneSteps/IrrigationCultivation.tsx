"use client";

import DropdownField from "@/components/DropDownField";
import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";

interface IrrigationCultivationProps {
  data: any;
  onChange: (updatedData: any) => void;
}

const IrrigationCultivation = ({
  data,
  onChange,
}: IrrigationCultivationProps) => {
  const { get } = useApi();

  const [irrigationFacilityOptions, setIrrigationFacilityOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [cultivationSystemOptions, setCultivationSystemOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [landSuitabilityOptions, setLandSuitabilityOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [irrigationSourceOptions] = useState([
    { value: 1, label: "Mostly Natural Water Supply" },
    { value: 2, label: "Canal" },
    { value: 3, label: "Well" },
  ]);

  // Fetch irrigation facility
  useEffect(() => {
    const fetchIrrigationFacility = async () => {
      try {
        const res = await get("/cms/crop-irrigation-facility-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          setIrrigationFacilityOptions(
            res.data.map((item: any) => ({
              value: item.id,
              label: item.irrigation_facility,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch irrigation facility options", err);
      }
    };
    fetchIrrigationFacility();
  }, [get]);

  // Fetch cultivation system
  useEffect(() => {
    const fetchCultivationSystem = async () => {
      try {
        const res = await get("/cms/crop-cultivation-system-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          setCultivationSystemOptions(
            res.data.map((item: any) => ({
              value: item.id,
              label: item.crop_cultivation_system_name,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch cultivation system options", err);
      }
    };
    fetchCultivationSystem();
  }, [get]);

  // Fetch land suitability
  useEffect(() => {
    const fetchLandSuitability = async () => {
      try {
        const res = await get("/cms/crop-land-suitability-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          setLandSuitabilityOptions(
            res.data.map((item: any) => ({
              value: item.id,
              label: item.crop_land_suitability_name,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch land suitability options", err);
      }
    };
    fetchLandSuitability();
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
    }//(irrigationFacilityOptions, selectedLabel);
    // Send both ID and name to parent
    onChange({
      ...data,
      [name]: numericValue,
      [`${name}_name`]: selectedLabel,
    });
  };
//(cultivationSystemOptions);
  return (
    <form className="p-3">
      <h2 className="text-xl font-semibold mb-5 text-center underline">
        Cultivation Details
      </h2>
      <div className="space-y-5">
        <DropdownField
          label="Irrigation Facility"
          id="irrigationFacility"
          name="irrigation_facility_id"
          value={data.irrigation_facility_id || ""}
          onChange={handleChange}
          options={irrigationFacilityOptions}
        />
        <DropdownField
          label="Irrigation Source"
          id="irrigationSource"
          name="irrigation_source_id"
          value={data.irrigation_source_id || ""}
          onChange={handleChange}
          options={irrigationSourceOptions}
        />
        <DropdownField
          label="Cultivation System"
          id="cultivationSystem"
          name="cultivation_system_id"
          value={data.cultivation_system_id || ""}
          onChange={handleChange}
          options={cultivationSystemOptions}
        />
        <DropdownField
          label="Land Suitability for Commercial"
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
