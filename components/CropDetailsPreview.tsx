"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from "@/components/utils/Loading";
import useApi from "@/hooks/use_api";
import { useLocalization } from "@/core/context/LocalizationContext";

interface CropDetailsPreviewProps {
  data: any;
  attachments?: any[];
}

interface LookupMap {
  [key: number]: string;
}

const truncate = (text: string, limit = 60) => {
  if (!text) return;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const AccordionSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <AccordionItem
    value={title}
    className="bg-gray-50 rounded-xl shadow-sm border mb-4 animate__animated animate__fadeIn"
  >
    <AccordionTrigger className="px-5 py-4 text-lg font-medium text-blue-950 hover:bg-blue-100 transition-all duration-500 rounded-t-xl cursor-pointer hover:font-semibold hover:text-[19px]">
      {title}
    </AccordionTrigger>
    <AccordionContent className="px-5 pb-4">{children}</AccordionContent>
  </AccordionItem>
);

const renderRow = (label: string, value: any) => (
  <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span
      className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
      title={String(value || "")}
    >
      {value || <span className="text-gray-400">N/A</span>}
    </span>
  </div>
);

const renderRowPestDisease = (label: string, value: any) => (
  <div className="flex justify-start items-center border-b border-gray-100 p-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span
      className="text-gray-800 font-semibold"
      title={String(value || "N/A")}
    >
      {value || <span className="text-gray-400">—</span>}
    </span>
  </div>
);

export default function CropDetailsPreview({
  data,
  attachments,
}: CropDetailsPreviewProps) {
  const { get } = useApi();
  const { t } = useLocalization();
  const [loading, setLoading] = useState(true);

  // Lookup tables
  const [seedVarieties, setSeedVarieties] = useState<LookupMap>({});
  const [irrigationFacilities, setIrrigationFacilities] = useState<LookupMap>(
    {},
  );
  const [cultivationSystems, setCultivationSystems] = useState<LookupMap>({});
  const [landSuitability, setLandSuitability] = useState<LookupMap>({});
  const [weatherEffects, setWeatherEffects] = useState<LookupMap>({});

  const toMap = (arr: any[], key: string, label: string) =>
    Array.isArray(arr)
      ? arr.reduce(
          (acc, cur) => {
            if (cur && cur[key] !== undefined && cur[label] !== undefined) {
              acc[cur[key]] = cur[label];
            }
            return acc;
          },
          {} as Record<string, string>,
        )
      : {};

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [varietyRes, irrigationRes, cultivationRes] = await Promise.all([
          get("/cms/seed-variety-service"),
          get("/cms/crop-irrigation-facility-service"),
          // get("/api/cms/get-asset-crop-cultivation-system"),
          // get("/api/cms/get-asset-crop-land-suitability"),
          get("/cms/crop-adverse-weather-effect-type-service/?page_size=100"),
        ]);

        // ✅ FIX: most CMS endpoints return paginated objects with .results
        const extract = (res: any) =>
          Array.isArray(res?.data?.results) ? res.data.results : res.data;

        const varietyData = extract(varietyRes);
        const irrigationData = extract(irrigationRes);
        const cultivationData = extract(cultivationRes);
        // const landData = extract(landRes);
        // const weatherData = extract(weatherRes);

        setSeedVarieties(toMap(varietyData, "id", "seed_variety"));
        setIrrigationFacilities(
          toMap(irrigationData, "id", "irrigation_facility_name"),
        );
        setCultivationSystems(
          toMap(cultivationData, "id", "cultivation_system_name"),
        );
        // setLandSuitability(toMap(landData, "id", "land_suitability_name"));
        // setWeatherEffects(toMap(weatherData, "id", "weather_effect_type_name"));
      } catch (err) {
        console.error("❌ Failed to load lookup data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  if (loading) return <Loading className="h-[400px]" />;

  console.log(data);

  return (
    <div className="max-w-4xl mx-auto text-gray-700 bg-white space-y-6">
      <h2 className="text-lg lg:text-xl font-semibold text-center text-gray-800 mb-4">
        {t("crop_details_preview")}
      </h2>

      <Accordion
        type="single"
        collapsible
        defaultValue={t("seed_details")}
        className="max-h-[500px] overflow-auto"
      >
        {/* 🌱 Seed Details */}
        <AccordionSection title={t("seed_details")}>
          {data.seed && data.seed.length > 0 ? (
            <div className="grid gap-4">
              {data.seed.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="border rounded-xl bg-white shadow-sm p-3"
                >
                  {renderRow(t("seed_name"), s.seed_common_name)}
                  {renderRow(t("company"), s.seed_company_name)}
                  {renderRow(
                    t("variety"),
                    s.seed_variety_name || seedVarieties[s.seed_variety_id],
                  )}
                  {renderRow(t("seed_company_type"), s.seed_company_type_name)}
                  <div className="grid grid-cols-2 border-b border-gray-100 p-2 text-sm">
                    <span className="font-medium text-gray-600">
                      {t("type_of_seed_used")}
                    </span>
                    <span
                      className="text-gray-800 font-semibold  max-w-xs"
                      title={s.seed_type_name}
                    >
                      {s.seed_type_name || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">
              {t("no_seed_details_provided")}
            </p>
          )}
        </AccordionSection>

        {/* 🚿 Cultivation Details */}
        <AccordionSection title={t("cultivation")}>
          {data.cultivation ? (
            <div className="rounded-lg bg-white shadow-sm p-3">
              {renderRow(
                t("irrigation_facility"),
                data.cultivation.irrigation_facility_id_name ||
                  data.cultivation.irrigation_facility,
              )}
              {renderRow(
                t("irrigation_source"),
                data.cultivation.irrigation_source_id_name ||
                  data.cultivation.irrigation_source,
              )}
              {renderRow(
                t("cultivation_system"),
                data.cultivation.cultivation_system_id_name ||
                  data.cultivation.crop_cultivation_system_name,
              )}
              {renderRow(
                t("land_suitability"),
                data.cultivation.land_suitability_id_name ||
                  data.cultivation.crop_land_suitability_name,
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic">{t("no_cultivation_data")}</p>
          )}
        </AccordionSection>

        {/* 📜 History */}
        <AccordionSection title={t("previous_season_history")}>
          {data.history ? (
            <div className="rounded-lg bg-white shadow-sm p-3">
              {renderRow(
                t("immediate_previous_crop"),
                data.history.immediate_previous_crop,
              )}
              {renderRow(
                t("last_years_crop"),
                data.history.last_year_crop_type_name,
              )}
              {/* {renderRow("Sowing Date", data.history.sowing_date)} */}
              {renderRow(t("harvest_date"), data.history.harvest_date)}
              {renderRow(t("production"), data.history.last_year_production)}
            </div>
          ) : (
            <p className="text-gray-400 italic">{t("no_history_data")}</p>
          )}
        </AccordionSection>

        {/* ☁️ Weather Effects */}
        <AccordionSection title={t("weather_effects")}>
          {data.weather?.weather_effects?.some(
            (w: any) => w.weather_effect_type_id !== 0,
          ) ? (
            <>
              {data.weather ? (
                <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
                  {renderRow(t("period_from"), data.weather.date_from)}
                  {renderRow(t("period_to"), data.weather.date_to)}
                  {renderRow(t("remarks"), data.weather.remarks)}

                  {data.weather.weather_effects?.length ? (
                    <div className="mt-2 space-y-2">
                      {data.weather.weather_effects
                        .filter((w: any) => w.weather_effect_type_id !== 0)
                        .map((w: any, idx: number) => (
                          <div
                            key={idx}
                            className="border rounded-lg bg-gray-50 p-2 shadow-sm"
                          >
                            {renderRow(
                              t("effect_type"),
                              w.weather_effect_type_name,
                            )}
                            {renderRow(t("remarks"), w.remarks || "")}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic mt-2">
                      {t("no_weather_effects_recorded")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 italic">{t("no_weather_data")}</p>
              )}
            </>
          ) : (
            <p className="text-gray-400 italic">
              {t("no_weather_effects_recorded")}
            </p>
          )}
        </AccordionSection>

        {/* 🐛 Pests & Diseases */}
        <AccordionSection title={t("pest_disease_observations")}>
          {data.pestDetails?.length ? (
            <div className="mb-3  rounded-xl bg-white shadow-sm p-3">
              <h4 className="font-semibold text-gray-700">{t("pests")}</h4>
              <ul className="list-disc list-inside text-gray-600">
                {data.pestDetails.map((p: any, idx: number) => (
                  <li key={idx}>{p.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">{t("no_pest_data_provided")}</p>
          )}

          {data.diseaseDetails?.length ? (
            <div className=" rounded-xl bg-white shadow-sm p-3">
              <h4 className="font-semibold text-gray-700">{t("diseases")}</h4>
              <ul className="list-disc list-inside text-gray-600 ">
                {data.diseaseDetails.map((d: any, idx: number) => (
                  <li key={idx}>{d.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              {t("no_disease_data_provided")}
            </p>
          )}
        </AccordionSection>

        {/* 🧪 Chemicals */}
        <AccordionSection title={t("chemicals")}>
          {data.chemicals ? (
            <>
              <h4 className="font-semibold mt-2 mb-2 text-gray-800">
                {t("fertilizers")}
              </h4>
              {data.chemicals.fertilizers?.length ? (
                <div className="grid gap-3">
                  {data.chemicals.fertilizers.map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className="border rounded-lg bg-white p-3 shadow-sm"
                    >
                      {renderRow(t("name"), f.chemical_name)}
                      {renderRow(
                        t("quantity"),
                        `${f.qty || 0} ${f.qty_unit || ""}kg`,
                      )}
                      {renderRow(t("remarks"), truncate(f.remarks))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic mb-2">
                  {t("no_fertilizers_added")}
                </p>
              )}

              <h4 className="font-semibold mt-4 mb-2 text-gray-800">
                {t("pesticides")}
              </h4>
              {data.chemicals.pesticides?.length ? (
                <div className="grid gap-3">
                  {data.chemicals.pesticides.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="border rounded-lg bg-white p-3 shadow-sm"
                    >
                      {renderRow(t("name"), p.chemical_name)}
                      {renderRow(
                        t("quantity"),
                        `${p.qty || 0} ${p.qty_unit || ""}kg`,
                      )}
                      {renderRow(t("remarks"), truncate(p.remarks))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  {t("no_pesticides_added")}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400 italic">
              {t("no_chemical_usage_data")}
            </p>
          )}
        </AccordionSection>

        {/* 📎 Attachments */}
        {attachments && attachments.length > 0 && (
          <AccordionSection title={t("attachments")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden shadow-sm bg-white"
                >
                  <img
                    src={attachment.attachment_path}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2 bg-gray-50 border-t">
                    <p className="text-xs text-gray-600">
                      {attachment.remarks || "No remarks"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}
      </Accordion>

      <p className="text-center text-sm text-gray-500 mt-4">
        {t("please_review_all_information_carefully_before_submitting")}
      </p>
    </div>
  );
}
