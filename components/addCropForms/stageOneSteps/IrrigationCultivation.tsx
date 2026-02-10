"use client";

import DropdownField from "@/components/DropDownField";
import React, { useEffect, useState } from "react";
import useApi from "@/hooks/use_api";
import { useLocalization } from "@/core/context/LocalizationContext";
import InputField from "@/components/InputField";
import { DropdownSkeleton } from "@/components/ui/form-skeleton";

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
  const [earthingUpOptions, setEarthingUpOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [weedPresenceOptions, setWeedPresenceOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

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
          earthingUpRes,
          weedPresenceRes,
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
          get("/cms/irrigation-status-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/earthing-up-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
          get("/cms/weed-presence-type-service/", {
            params: { page_size: 50, start_record: 1 },
          }),
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

        if (irrigationStatusRes.status === "success") {
          setIrrigationStatusOptions(
            irrigationStatusRes.data.map((item: any) => ({
              value: item.id,
              label: item.irrigation_status,
            })),
          );
        }

        if (earthingUpRes.status === "success") {
          setEarthingUpOptions(
            earthingUpRes.data.map((item: any) => ({
              value: item.id,
              label: item.earthing_up_type,
            })),
          );
        }

        if (weedPresenceRes.status === "success") {
          setWeedPresenceOptions(
            weedPresenceRes.data.map((item: any) => ({
              value: item.id,
              label: item.weed_presence_type,
            })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch crop CMS options", err);
      } finally {
        setIsLoadingOptions(false);
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
      case "earthing_up_type_id":
        selectedLabel =
          earthingUpOptions.find((opt) => opt.value === numericValue)?.label ||
          "";
        break;
      case "weed_presence_type_id":
        selectedLabel =
          weedPresenceOptions.find((opt) => opt.value === numericValue)
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
      <div className="space-y-8 max-h-[400px] overflow-auto">
        {/* Irrigation Section */}
        <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            💧 {t("Irrigation Information")}
          </h3>

          <div className="space-y-5">
            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("irrigation_facility")}
                id="irrigationFacility"
                name="irrigation_facility_id"
                value={data.irrigation_facility_id || ""}
                onChange={handleChange}
                options={irrigationFacilityOptions}
              />
            )}

            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("irrigation_source")}
                id="irrigationSource"
                name="irrigation_source_id"
                value={data.irrigation_source_id || ""}
                onChange={handleChange}
                options={irrigationSourceOptions}
              />
            )}

            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("irrigation_status")}
                id="irrigationStatus"
                name="irrigation_status_id"
                value={data.irrigation_status_id || ""}
                onChange={handleChange}
                options={irrigationStatusOptions}
              />
            )}

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
          </div>
        </div>

        {/* Cultivation Section */}
        <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            🌱 {t("Cultivation System")}
          </h3>

          <div className="space-y-5">
            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("cultivation_system")}
                id="cultivationSystem"
                name="cultivation_system_id"
                value={data.cultivation_system_id || ""}
                onChange={handleChange}
                options={cultivationSystemOptions}
              />
            )}
          </div>
        </div>

        {/* Land & Field Condition Section */}
        <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            🌾 {t("Land & Field Condition")}
          </h3>

          <div className="space-y-5">
            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("land_suitability_for_commercial")}
                id="landSuitability"
                name="land_suitability_id"
                value={data.land_suitability_id || ""}
                onChange={handleChange}
                options={landSuitabilityOptions}
              />
            )}

            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("Earthing Up")}
                id="earthing_up_type_id"
                name="earthing_up_type_id"
                value={data.earthing_up_type_id || ""}
                onChange={handleChange}
                options={earthingUpOptions}
              />
            )}

            {isLoadingOptions ? (
              <DropdownSkeleton />
            ) : (
              <DropdownField
                label={t("Weed Presence")}
                id="weed_presence_type_id"
                name="weed_presence_type_id"
                value={data.weed_presence_type_id || ""}
                onChange={handleChange}
                options={weedPresenceOptions}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default IrrigationCultivation;
