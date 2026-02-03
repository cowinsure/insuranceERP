"use client";
import React from "react";
import { useLocalization } from "@/core/context/LocalizationContext";
import { formatDate } from "./StageTwoData";

interface StageOneDataProps {
  data: Record<string, any>;
}

const StageOneData: React.FC<StageOneDataProps> = ({ data }) => {
  const { t } = useLocalization();
  const safeArray = (arr: any[]) => (Array.isArray(arr) ? arr : []);

  // 🔥 Filter array items by their own stage_id
  const filterByItemStage = (arr: any[], stageId: number) =>
    safeArray(arr).filter((item) => item?.stage_id === stageId);

  const uniqueByIdAndName = (arr: any[], idKey: string, nameKey: string) => {
    const map = new Map();

    arr.forEach((item) => {
      const key = `${item?.[idKey]}_${item?.[nameKey]}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

    return Array.from(map.values());
  };

  console.log("Stage one data", data);

  return (
    <div className="space-y-6 text-gray-700 overflow-y-auto">
      {/* 🌱 Seed Information */}
      <Section title={t("seed_information")}>
        <Grid>
          <InputField
            label={t("seed_name")}
            value={
              safeArray(data?.crop_asset_seed_details)[0]?.seed_common_name
            }
          />
          <InputField
            label={t("variety")}
            value={safeArray(data?.crop_asset_seed_details)[0]?.seed_variety}
          />
          <InputField
            label={t("seed_company")}
            value={
              safeArray(data?.crop_asset_seed_details)[0]?.seed_company_name
            }
          />
          <InputField
            label={t("seed_type")}
            value={safeArray(data?.crop_asset_seed_details)[0]?.seed_type_name}
          />
        </Grid>
      </Section>

      {/* 💧 Irrigation & Cultivation */}
      <Section title={t("irrigation_cultivation")}>
        <Grid>
          <InputField
            label={t("irrigation_facility")}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.irrigation_facility
            }
          />
          <InputField
            label={t("irrigation_source")}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.irrigation_source
            }
          />
          <InputField
            label={"Irrigation Status"}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.irrigation_status
            }
          />
          <InputField
            label={"Number of Irrigation"}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.number_of_irrigations
            }
          />
          <InputField
            label={t("cultivation_system")}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.crop_cultivation_system_name
            }
          />
          <InputField
            label={t("land_suitability")}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.crop_land_suitability_name
            }
          />
          <InputField
            label={"Earthing Up type"}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.earthing_up_type
            }
          />
          <InputField
            label={"Weed Presence"}
            value={
              safeArray(data?.crop_asset_irrigation_cultivation_details)[0]
                ?.weed_presence_type
            }
          />
        </Grid>
      </Section>

      {/* 🌾 Crop History */}
      <Section title={t("crop_history")}>
        <Grid>
          <InputField
            label={t("immediate_previous_crop")}
            value={
              safeArray(data?.crop_asset_previous_season_history_details)[0]
                ?.immediate_previous_crop
            }
          />
          <InputField
            label={t("harvest_date")}
            value={formatDate(
              safeArray(data?.crop_asset_previous_season_history_details)[0]
                ?.harvest_date,
            )}
          />
          <InputField
            label={t("last_years_crop")}
            value={
              safeArray(data?.crop_asset_previous_season_history_details)[0]
                ?.last_year_crop_type_name
            }
          />
          <InputField
            label={t("last_year_production")}
            value={safeArray(
              data?.crop_asset_previous_season_history_details,
            )[0]?.last_year_production?.toString()}
          />
          <InputField
            label={t("seed_used_last_year")}
            value={
              safeArray(data?.crop_asset_previous_season_history_details)[0]
                ?.seed_used_last_year
            }
          />
          <InputField
            label={t("reason_for_changing_seed")}
            value={
              safeArray(data?.crop_asset_previous_season_history_details)[0]
                ?.reason_for_changing_seed
            }
          />
        </Grid>
      </Section>

      {/* 🌦️ Weather Effects */}
      <Section title={t("weather_effects")}>
        <div>
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <InputField
              label="Date from"
              value={formatDate(
                filterByItemStage(
                  data?.crop_asset_weather_effect_history,
                  2,
                )[0]?.date_from?.slice(0, 10),
              )}
            />
            <InputField
              label="Date to"
              value={formatDate(
                filterByItemStage(
                  data?.crop_asset_weather_effect_history,
                  2,
                )[0]?.date_to?.slice(0, 10),
              )}
            />
          </div>

          <ArrayDisplay
            title={t("weather_events")}
            items={uniqueByIdAndName(
              filterByItemStage(data?.crop_asset_weather_effect_history, 2),
              "weather_effect_type_id",
              "weather_effect_type_name",
            ).map((item) => ({
              name: item.weather_effect_type_name,
            }))}
          />
        </div>
      </Section>

      {/* 🐛 Pest & Disease Attacks */}
      <Section title={t("pest_disease_attacks")}>
        <div className="space-y-3 mb-5">
          <InputField
            label={"Disease Control Type"}
            value={
              safeArray(data?.crop_asset_disease_attack_details)[0]
                ?.disease_control_type
            }
          />
          <InputField
            label={"Neighbour Field Status"}
            value={
              safeArray(data?.crop_asset_disease_attack_details)[0]
                ?.field_status_type
            }
          />
        </div>
        <Grid>
          <ArrayDisplay
            title={t("Pests")}
            items={uniqueByIdAndName(
              filterByItemStage(data?.crop_asset_pest_attack_details, 2),
              "pest_attack_type_id",
              "pest_attack_observations_type_name",
            ).map((item) => ({
              name: item.pest_attack_observations_type_name,
            }))}
          />

          <ArrayDisplay
            title={t("Diseases")}
            items={uniqueByIdAndName(
              filterByItemStage(data?.crop_asset_disease_attack_details, 2),
              "disease_attack_type_id",
              "disease_attack_observations_type_name",
            ).map((item) => ({
              name: item.disease_attack_observations_type_name,
            }))}
          />
        </Grid>
      </Section>

      {/* 🧪 Chemicals Used */}
      <Section title={t("fertilizers_pesticides")}>
        <ArrayDisplay
          title={t("chemicals")}
          items={safeArray(data?.crop_asset_chemical_usage_details).map(
            (c: any) => ({
              name: c?.chemical_name || "Not Provided",
              quantity:
                c?.qty || c?.qty === 0
                  ? `${c.qty} ${c.qty_unit || ""}`.trim()
                  : undefined,
              remarks: c?.remarks,
              date: c?.created_at,
            }),
          )}
        />
      </Section>

      {/* 📸 Attachments */}
      {safeArray(data?.crop_asset_attachment_details).length > 0 && (
        <Section title={t("attachments")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filterByItemStage(data?.crop_asset_attachment_details, 2).map(
              (attachment: any, index: number) => {
                const imageSrc = attachment?.attachment_path.startsWith("data:")
                  ? attachment?.attachment_path
                  : `${process.env.NEXT_PUBLIC_API_ATTACHMENT_IMAGE_URL}${attachment?.attachment_path}`;

                return (
                  <div
                    key={index}
                    className="relative border rounded-lg overflow-hidden shadow-sm bg-white"
                  >
                    <img
                      src={imageSrc}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(imageSrc, "_blank")}
                      title="View Image"
                    />

                    <div className="p-2 bg-gray-50 border-t">
                      <p className="text-xs text-gray-600">
                        {attachment?.remarks || "No remarks"}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          {filterByItemStage(data.crop_asset_attachment_details, 2).length ===
            0 && <p className="text-gray-400 text-sm italic">{t("no_data")}</p>}
        </Section>
      )}
    </div>
  );
};

/* ---------- Reusable Subcomponents ---------- */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="border rounded-lg p-3">
    <h2 className="text-lg font-semibold mb-3 text-green-800">{title}</h2>
    {children}
  </section>
);

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const InputField = ({ label, value }: { label: string; value: any }) => {
  const { t } = useLocalization();
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold mb-1 text-gray-400">{label}</span>
      <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
        {value && value !== "null" ? (
          value
        ) : (
          <span className="text-gray-400 italic">{t("not_provided")}</span>
        )}
      </div>
    </div>
  );
};

const ArrayDisplay = ({
  title,
  items,
}: {
  title: string;
  items: { name: string; quantity?: string; remarks?: string; date?: string }[];
}) => {
  const { t } = useLocalization();
  const hasData = Array.isArray(items) && items.some((i) => i && i.name);

  return (
    <div>
      <h3 className="font-semibold mb-2 text-gray-600">{title}</h3>
      {!hasData ? (
        <p className="text-gray-400 text-sm italic">{t("no_data")}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li
              key={i}
              className={`${
                hasData
                  ? "text-sm bg-blue-50 border border-gray-200 p-2 rounded"
                  : "bg-transparent"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div>{item.name}</div>
                {item.quantity && (
                  <div className="text-gray-500 font-semibold">
                    {item.quantity}
                  </div>
                )}
              </div>

              {item.remarks && item.remarks !== "" && (
                <div className="text-xs text-gray-500 italic mt-1">
                  Remarks: {item.remarks}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StageOneData;
