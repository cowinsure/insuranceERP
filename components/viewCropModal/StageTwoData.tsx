"use client";

import useApi from "@/hooks/use_api";
import React, { useEffect, useState } from "react";
import { useLocalization } from "@/core/context/LocalizationContext";

/* ---------- Props ---------- */
interface StageTwoDataProps {
  cropData?: any;
}

/* ---------- Labels for display ---------- */

/* ---------- Component ---------- */
const StageTwoData: React.FC<StageTwoDataProps> = ({ cropData }) => {
  const { get } = useApi();
  const { t } = useLocalization();

  /* ---------- Labels for display ---------- */
  const pestLabels: Record<string, string> = {
    stemBorer: t('stem_borer'),
    leafFolder: t('leaf_folder'),
    brownPlanthopper: t('brown_planthopper'),
    greenLeafhopper: t('green_leafhopper'),
    stinkBug: t('stink_bug'),
    others: t('others'),
    none: t('none'),
  };

  const diseaseLabels: Record<string, string> = {
    leafBlast: t('leaf_blast'),
    bacterialLeafBlight: t('bacterial_leaf_blight'),
    sheathBlight: t('sheath_blight'),
    bakanae: t('bakanae'),
    brownSpot: t('brown_spot'),
    leafScald: t('leaf_scald'),
    hispa: t('hispa'),
    tungro: t('tungro'),
    none: t('none'),
  };

  const weatherLabels: Record<string, string> = {
    flood: t('flood'),
    drought: t('drought'),
    excessRainfall: t('excess_rainfall'),
    storms: t('storms'),
    hailstorm: t('hailstorm'),
  };

  const [harvestSeedVarietyOptions, setHarvestSeedVarietyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [harvestTimingOptions, setHarvestTimingOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [goodPracticesList, setGoodPracticesList] = useState<
    { id: number; label: string }[]
  >([]);

  // Call the type api
  useEffect(() => {
    getHarvestSeedVarietyOptions();
    getHarvestTimingOptions();
    getGoodPracticesOptions();
  }, []);

  // Get harvest seed variety options
  const getHarvestSeedVarietyOptions = async () => {
    try {
      const res = await get(
        "/cms/crop-harvest-seed-variety-observation-service/",
        {
          params: { page_size: 50, start_record: 1 },
        }
      );
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          value: item.harvest_seed_variety_observation_id,
          label: item.harvest_seed_variety_observation_type_name,
        }));
        setHarvestSeedVarietyOptions(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getGoodPracticesOptions = async () => {
    try {
      const res = await get(
        "/cms/crop-harvest-good-agricultural-practices-service/",
        {
          params: { page_size: 50, start_record: 1 },
        }
      );
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          id: item.good_agricultural_practices_type_id,
          label: item.good_agricultural_practices_type_name,
        }));
        setGoodPracticesList(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHarvestTimingOptions = async () => {
    try {
      const res = await get("/cms/crop-harvest-harvesting-timing-service/", {
        params: { page_size: 50, start_record: 1 },
      });
      if (res.status === "success" && Array.isArray(res.data)) {
        const formatted = res.data.map((item: any) => ({
          value: item.harvesting_timing_id,
          label: item.harvesting_timing_name,
        }));
        setHarvestTimingOptions(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!cropData) {
    return (
      <div className="text-gray-500 italic">
        {t('no_stage_two_data')}
      </div>
    );
  }
  const crop = cropData.crop_harvest_info[0];

  // Get the seed variety name using id
  const seedVarietyName = crop?.harvest_seed_variety_observation_id
    ? harvestSeedVarietyOptions?.find(
        (option) => option?.value === crop?.harvest_seed_variety_observation_id
      )?.label
    : "";

  // Get the harvest timing names
  const harvestingTimingName = crop?.harvesting_timing_id
    ? harvestTimingOptions?.find(
        (option) => option?.value === crop?.harvesting_timing_id
      )?.label
    : "";

  // Get the good practices
  const goodPracticeNames =
    crop?.crop_harvest_details && crop?.crop_harvest_details.length > 0
      ? crop?.crop_harvest_details
          .map((detail: any) => {
            const match = goodPracticesList?.find(
              (p) => p?.id === detail?.good_agricultural_practices_type_id
            );
            return match ? match.label : null;
          })
          .filter(Boolean) // remove nulls
      : [];

  console.log("View crop for stage 2", cropData);
  console.log(goodPracticesList);
  /* ---------- Render ---------- */
  return (
    <div className="space-y-6 text-gray-700 overflow-y-auto">
      {/* 🌾 Harvest */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">{t('harvest')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayField label={t('harvest_date')} value={crop?.harvest_date} />
          <DisplayField
            label={t('total_production')}
            value={`${
              crop?.total_production_kg === undefined
                ? ""
                : `${crop?.total_production_kg} kg`
            }`}
          />
          <DisplayField
            label={t('moisture_content')}
            value={`${
              crop?.moisture_content_percentage === undefined
                ? ""
                : `${crop?.moisture_content_percentage} %`
            }`}
          />
        </div>
      </section>

      {/* 🌱 Observations */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          {t('observations')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DisplayField
            label={t('seed_variety_observation')}
            value={seedVarietyName}
          />
          <DisplayField
            label={t('harvesting_timing')}
            value={harvestingTimingName}
          />
          <DisplayField
            label={t('manageable')}
            value={
              crop?.is_manageable_harvest === true ? t('it_was_manageable') : t('no')
            }
          />
          <DisplayField
            label={t('remarks')}
            value={crop?.reason_for_is_manageable_harvest}
          />
          <div className="lg:col-span-2">
            <ArrayDisplay
              title={t('good_practices')}
              items={goodPracticeNames.map((name: string) => ({ name }))}
            />
          </div>
        </div>
      </section>

      {/* 🐛 Pest & Disease */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          {t('pest_disease_attacks')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title={t('pest_attacks')}
            items={Object.entries(cropData.pestAttack || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: pestLabels[key] || key }))}
          />
          <ArrayDisplay
            title={t('disease_attacks')}
            items={Object.entries(cropData.diseaseAttack || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: diseaseLabels[key] || key }))}
          />
        </div>
      </section>

      {/* 🌤 Weather */}
      <section className="border rounded-lg p-3">
        <h2 className="text-lg font-semibold mb-3 text-green-800">
          {t('adverse_weather_effects')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArrayDisplay
            title={t('weather_effects')}
            items={Object.entries(cropData.adverseWeatherEffects || {})
              .filter(([_, v]) => v)
              .map(([key]) => ({ name: weatherLabels[key] || key }))}
          />
          <DisplayField label={t('period_from')} value={cropData.periodFrom} />
          <DisplayField label={t('period_to')} value={cropData.periodTo} />
        </div>
      </section>
    </div>
  );
};

/* ---------- Reusable Components ---------- */
const DisplayField = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-gray-500">{label}</span>
    <div className="border border-gray-200 rounded-md p-2 bg-gray-50 text-wrap">
      {value !== undefined && value !== null && value !== "" ? (
        value
      ) : (
        <span className="text-gray-400 italic">Not provided</span>
      )}
    </div>
  </div>
);

const ArrayDisplay = ({
  title,
  items,
}: {
  title: string;
  items: { name: string }[];
}) => {
  const { t } = useLocalization();
  return (
    <div>
      <h3 className="font-semibold mb-2 text-gray-600">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm bg-blue-50 border border-gray-200 p-2 rounded"
            >
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm italic">{t('not_provided')}</p>
      )}
    </div>
  );
};

export default StageTwoData;
