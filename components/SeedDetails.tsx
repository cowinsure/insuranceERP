"use client";

import { useState, useEffect } from "react";
import InputField from "./InputField";
import DropdownField from "./DropDownField";
import useApi from "@/hooks/use_api";
import { useLocalization } from "@/core/context/LocalizationContext";

interface SeedDetailsProps {
  selectedCropId: number;
  data: any[];
  onChange: (updatedData: any[]) => void;
}

const SeedDetails = ({ selectedCropId, data, onChange }: SeedDetailsProps) => {
  const { get } = useApi();
  const { t } = useLocalization();

  const [seedVarietyOptions, setSeedVarietyOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [seedTypeOptions, setSeedTypeOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const seedCompanyTypeOptions = [
    { value: 1, label: t("government") },
    { value: 2, label: t("private") },
    { value: 3, label: t("local_market_own_stock") },
  ];

  // ✅ Initialize first seed row if empty (run once only)
  useEffect(() => {
    if (!data || data.length === 0) {
      onChange([
        {
          seed_common_name: "",
          seed_variety_id: 0,
          seed_variety_name: "",
          seed_company_name: "",
          seed_company_type_id: 0,
          seed_company_type_name: "",
          seed_type_id: 0,
          seed_type_name: "",
        },
      ]);
    }
  }, []); // <-- only once, prevents overwriting existing data

  // Fetch Seed Variety options
  useEffect(() => {
    const fetchSeedVarieties = async () => {
      try {
        const res = await get("/cms/seed-variety-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          const options = res.data.map((item: any) => ({
            value: item.id,
            label: item.seed_variety,
          }));
          setSeedVarietyOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch seed varieties", err);
      }
    };
    fetchSeedVarieties();
  }, [get]);

  // Fetch Seed Type options
  useEffect(() => {
    const fetchSeedTypes = async () => {
      try {
        const res = await get("/cms/seed-type-service/", {
          params: { page_size: 50, start_record: 1 },
        });
        if (res.status === "success") {
          const options = res.data.map((item: any) => ({
            value: item.id,
            label: item.seed_type_name,
          }));
          setSeedTypeOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch seed types", err);
      }
    };
    fetchSeedTypes();
  }, [get]);

  // ✅ Prefill readable names if data already exists
  useEffect(() => {
    if (data && data.length > 0) {
      const updated = data.map((item) => {
        const variety = seedVarietyOptions.find(
          (v) => v.value === item.seed_variety_id,
        );
        const type = seedTypeOptions.find((t) => t.value === item.seed_type_id);
        const companyType = seedCompanyTypeOptions.find(
          (c) => c.value === item.seed_company_type_id,
        );

        return {
          ...item,
          seed_variety_name: variety?.label || item.seed_variety_name || "",
          seed_type_name: type?.label || item.seed_type_name || "",
          seed_company_type_name:
            companyType?.label || item.seed_company_type_name || "",
        };
      });

      onChange(updated);
    }
  }, [seedVarietyOptions, seedTypeOptions]); // run after options load

  // ✅ Update and include human-readable names for preview
  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...data];
    const current = { ...updated[index], [field]: value };

    // ✅ Add corresponding readable names for preview
    if (field === "seed_variety_id") {
      const selected = seedVarietyOptions.find((v) => v.value === value);
      current.seed_variety_name = selected?.label || "";
    }
    if (field === "seed_company_type_id") {
      const selected = seedCompanyTypeOptions.find((v) => v.value === value);
      current.seed_company_type_name = selected?.label || "";
    }

    if (field === "seed_type_id") {
      const selected = seedTypeOptions.find((v) => v.value === value);
      current.seed_type_name = selected?.label || "";
    }

    updated[index] = current;
    onChange(updated);
  };

  // //("Seed Details Data:", data);

  return (
    <div className="lg:p-3">
      <h2 className="text-lg lg:text-xl font-semibold mb-5 text-center underline">
        {t("seed_details")}
      </h2>

      <div className="space-y-5 max-h-[500px] overflow-auto">
        {/* Common Name of Seed */}
        <InputField
          id="seed_common_name"
          label={t("common_name_of_seed")}
          type="text"
          name="seed_common_name"
          value={data[0]?.seed_common_name || ""}
          onChange={(e) => handleChange(0, "seed_common_name", e.target.value)}
          placeholder={t("enter_common_name")}
        />

        {/* Variety of Seed */}
        <DropdownField
          label={t("variety_of_seed")}
          id="seed_variety_id"
          name="seed_variety_id"
          value={data[0]?.seed_variety_id || 0}
          onChange={(e) =>
            handleChange(0, "seed_variety_id", Number(e.target.value))
          }
          options={seedVarietyOptions}
        />

        {/* Seed Company Name */}
        <InputField
          id="seed_company_name"
          label={t("name_of_the_seed_company")}
          type="text"
          name="seed_company_name"
          value={data[0]?.seed_company_name || ""}
          onChange={(e) => handleChange(0, "seed_company_name", e.target.value)}
          placeholder={t("ex_local_open_market")}
        />

        {/* Seed Company Type */}
        <DropdownField
          label={t("seed_company_type")}
          id="seed_company_type_id"
          name="seed_company_type_id"
          value={data[0]?.seed_company_type_id || 0}
          onChange={(e) =>
            handleChange(0, "seed_company_type_id", Number(e.target.value))
          }
          options={seedCompanyTypeOptions}
        />

        {/* Seed Type */}
        <DropdownField
          label={t("type_of_the_seed_used")}
          id="seed_type_id"
          name="seed_type_id"
          value={data[0]?.seed_type_id || 0}
          onChange={(e) =>
            handleChange(0, "seed_type_id", Number(e.target.value))
          }
          options={seedTypeOptions}
        />
      </div>
    </div>
  );
};

SeedDetails.displayName = "SeedDetails";
export default SeedDetails;
