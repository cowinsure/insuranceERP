"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PreviewProps {
  data: any; // this is [survey, preview] from parent
}

export default function SurveyPreview({ data }: PreviewProps) {
  // If parent sends [survey, preview], get the preview
  const preview = Array.isArray(data) ? data[1] : data;

  return (
    <Card className="border rounded-3xl shadow-md py-2 bg-gradient-to-br from-white to-slate-200 gap-3">
      <CardHeader className="">
        <CardTitle className="text-2xl font-semibold text-gray-800 tracking-tight">
          Survey Data Preview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 text-sm text-gray-700">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 tracking-wide">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PreviewField label="Farmer ID" value={preview.farmer_id} />
            {/* <PreviewField label="Survey Date" value={preview.survey_date} /> */}
            <PreviewField
              label="Avg Prod Last Year"
              value={preview.avg_prod_last_year}
            />
            <PreviewField
              label="Avg Prod Current Year"
              value={preview.avg_prod_current_year}
            />
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* Varieties */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 tracking-wide">
            Varieties of Seeds
          </h3>
          {preview.variety_labels?.length ? (
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {preview.variety_labels.map((label: string, i: number) => (
                <li key={i} className="leading-relaxed">
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No varieties selected.</p>
          )}
        </section>

        <Separator className="opacity-50" />

        {/* Yield Loss */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 tracking-wide">
            Yield Loss Reasons
          </h3>
          {preview.yield_loss_labels?.length ? (
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {preview.yield_loss_labels.map((label: string, i: number) => (
                <li key={i} className="leading-relaxed">
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">
              No yield loss reasons provided.
            </p>
          )}
        </section>

        <Separator className="opacity-50" />

        {/* Weather Events */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 tracking-wide">
            Weather Events
          </h3>
          {preview.weather_event_labels?.length ? (
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {preview.weather_event_labels.map((label: string, i: number) => (
                <li key={i} className="leading-relaxed">
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No weather impacts reported.</p>
          )}
        </section>

        <Separator className="opacity-50" />

        {/* Pest Attacks */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 tracking-wide">
            Pest Attacks
          </h3>
          {preview.pest_attack_labels?.length ? (
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {preview.pest_attack_labels.map((label: string, i: number) => (
                <li key={i} className="leading-relaxed">
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No pest attacks recorded.</p>
          )}
        </section>

        <Separator className="opacity-50" />

        {/* Disease Attacks */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 tracking-wide">
            Disease Attacks
          </h3>
          {preview.disease_attack_labels?.length ? (
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {preview.disease_attack_labels.map((label: string, i: number) => (
                <li key={i} className="leading-relaxed">
                  {label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No disease attacks recorded.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

function PreviewField({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col p-3 rounded-xl bg-gray-50 border shadow-sm">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="font-semibold text-gray-900 text-base">
        {value !== undefined && value !== "" ? value : "-"}
      </span>
    </div>
  );
}
