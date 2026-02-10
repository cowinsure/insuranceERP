"use client";

import React from "react";
import { useLocalization } from "@/core/context/LocalizationContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StageTwoPreviewProps {
  data: any;
  attachments?: any[];
}

const truncate = (text: string, limit = 60) => {
  if (!text) return;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const renderRow = (label: string, value: any) => (
  <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span
      className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
      title={value || ""}
    >
      {value || <span className="text-gray-400">N/A</span>}
    </span>
  </div>
);

const renderList = (label: string, items: any[]) => (
  <div className="border rounded-lg p-2 bg-gray-50 mb-2">
    <span className="font-semibold text-gray-700">{label}</span>
    {items && items.length > 0 ? (
      <ul className="list-disc list-inside text-gray-600 mt-1">
        {items.map((i, idx) => (
          <li key={idx}>{i.name || "N/A"}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 italic mt-1">No data provided</p>
    )}
  </div>
);

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

export default function StageTwoPreview({
  data,
  attachments,
}: StageTwoPreviewProps) {
  const { t } = useLocalization();
  if (!data)
    return <p className="text-gray-400 italic">{t("no_data_available")}</p>;

  const stage3Attachments = attachments?.filter(
    (attachment) => attachment.stage_id === 3,
  );

  return (
    <div className="max-w-4xl mx-auto text-gray-700 bg-white space-y-6">
      <h2 className="text-lg lg:text-xl font-semibold text-center text-gray-800 mb-4">
        {t("stage_2_crop_data_preview")}
      </h2>

      <Accordion
        type="single"
        collapsible
        defaultValue={t("harvest")}
        className="max-h-[500px] overflow-auto"
      >
        {/* 🌾 Harvest */}
        <AccordionSection title={t("harvest")}>
          <div className="rounded-lg bg-white shadow-sm p-3 space-y-2">
            {renderRow(t("harvest_date"), data.harvest?.harvest_date)}

            {/* ✅ Total Production (array display) */}
            <div className="p-2 flex items-center justify-between">
              <span className="font-medium text-gray-600 text-sm">
                {t("total_production_kg_cap")}
              </span>
              {Array.isArray(data.harvest?.crop_harvest_production_details) &&
              data.harvest.crop_harvest_production_details.length > 0 ? (
                <ul className="list-inside text-gray-800 font-semibold mt-1 text-right">
                  {data.harvest.crop_harvest_production_details.map(
                    (val: any, idx: number) => (
                      <li
                        key={idx}
                        className="bg-gray-50 rounded-full border px-4 py-1 mb-1"
                      >
                        {val.production_kg} kg
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-right">
                  {t("no_data_provided")}
                </p>
              )}
            </div>

            {/* ✅ Moisture Content (array display) */}
            <div className="p-2 flex items-center justify-between">
              <span className="font-medium text-gray-600 text-sm">
                {t("moisture_content_percent_cap")}
              </span>
              {Array.isArray(
                data.harvest?.crop_harvest_moisture_content_details,
              ) &&
              data.harvest.crop_harvest_moisture_content_details.length > 0 ? (
                <ul className="list-inside text-gray-800 font-semibold mt-1 text-right">
                  {data.harvest.crop_harvest_moisture_content_details.map(
                    (val: any, idx: number) => (
                      <li
                        key={idx}
                        className="bg-gray-50 rounded-full border px-4 py-1 mb-1"
                      >
                        {val.moisture_content_per} %
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-right">
                  {t("no_data_provided")}
                </p>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* 🌾 Observation */}
        <AccordionSection title={t("observation")}>
          <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
            {/* Seed Variety Observation */}
            {data.harvest?.harvest_seed_variety_observation_name && (
              <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                <span className="font-medium text-gray-600">
                  {t("seed_variety")}
                </span>
                <span
                  className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                  title={data.harvest.harvest_seed_variety_observation_name}
                >
                  {data.harvest.harvest_seed_variety_observation_name}
                </span>
              </div>
            )}

            {/* Harvesting Timing */}
            {data.harvest?.harvesting_timing_name && (
              <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                <span className="font-medium text-gray-600">
                  {t("harvesting_timing")}
                </span>
                <span
                  className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                  title={data.harvest.harvesting_timing_name}
                >
                  {data.harvest.harvesting_timing_name}
                </span>
              </div>
            )}

            {/* Good Agricultural Practices */}
            {data.harvest?.crop_harvest_details?.length > 0 ? (
              <div className="border rounded-lg p-3 bg-gray-50">
                <span className="font-medium text-gray-600">
                  {t("good_agricultural_practices")}
                </span>
                <ul className="list-disc list-inside text-gray-700 mt-1">
                  {data.harvest.crop_harvest_details.map(
                    (d: any, idx: number) => (
                      <li key={idx} className="py-2 font-semibold">
                        {d.good_agricultural_practices_type_name || "N/A"}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic mt-1">
                {t("no_practices_selected")}
              </p>
            )}
          </div>
        </AccordionSection>

        {/* 🐛 Pests & Diseases + Manageable Harvest */}
        <AccordionSection title={t("pests_disease")}>
          <div className="rounded-lg bg-white shadow-sm p-3">
            {/* Neighbour Field Status */}
            {data.pestsDisease?.neighbour_field_status_id && (
              <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
                <span className="font-medium text-gray-600">
                  Neighbour Field Status
                </span>
                <span
                  className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
                  title={data.pestsDisease?.neighbour_field_status_label}
                >
                  {data.pestsDisease?.neighbour_field_status_label || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </span>
              </div>
            )}

            {/* ✅ Manageable Harvest */}
            {typeof data.pestsDisease?.is_manageable_harvest === "boolean" && (
              <>
                {renderRow(
                  t("manageable_harvest"),
                  data.pestsDisease.is_manageable_harvest ? "Yes" : "No",
                )}
                {!data.pestsDisease.is_manageable_harvest &&
                  data.pestsDisease.reason_for_is_manageable_harvest &&
                  renderRow(
                    t("remarks"),
                    data.pestsDisease.reason_for_is_manageable_harvest,
                  )}
              </>
            )}

            {renderList(
              t("pests"),
              data.pestsDisease?.pestNames?.map((name: string) => ({ name })) ||
                [],
            )}
            {renderList(
              t("diseases"),
              data.pestsDisease?.diseaseNames?.map((name: string) => ({
                name,
              })) || [],
            )}
          </div>
        </AccordionSection>

        {/* ☁️ Weather Effects */}
        <AccordionSection title={t("weather_effects")}>
          {data.weather?.length ? (
            <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
              {renderRow(t("period_from"), data.weather[0].date_from)}
              {renderRow(t("period_to"), data.weather[0].date_to)}
              {/* {renderRow(t("general_remarks"), data.weather.remarks)} */}

              {/* List of Weather Effects */}
              <div className="mt-2 space-y-2">
                {data.weather.map((w: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded-lg bg-gray-50 p-2 shadow-sm"
                  >
                    {renderRow(t("effect_type"), w.weather_effect_type_name)}
                    {renderRow(t("remarks"), w.remarks || "")}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              {t("no_weather_effects_recorded")}
            </p>
          )}
        </AccordionSection>

        {/* 📎 Attachments */}
        {stage3Attachments?.length > 0 && (
          <AccordionSection title={t("attachments")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stage3Attachments?.map((attachment, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden shadow-sm bg-white"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_ATTACHMENT_IMAGE_URL}${attachment.attachment_path}`}
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
