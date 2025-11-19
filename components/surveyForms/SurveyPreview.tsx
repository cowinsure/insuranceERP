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
    <Card className="border rounded-2xl shadow-sm py-5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Survey Data Preview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-sm text-gray-700">
        {/* Basic Info */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <Separator />

        {/* Varieties */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">
            Varieties of Seeds
          </h3>
          {preview.variety_labels?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {preview.variety_labels.map((label: string, i: number) => (
                <li key={i}>{label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No varieties selected.</p>
          )}
        </section>

        <Separator />

        {/* Yield Loss */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">
            Yield Loss Reasons
          </h3>
          {preview.yield_loss_labels?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {preview.yield_loss_labels.map((label: string, i: number) => (
                <li key={i}>{label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No yield loss reasons provided.</p>
          )}
        </section>

        <Separator />

        {/* Weather Events */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">Weather Events</h3>
          {preview.weather_event_labels?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {preview.weather_event_labels.map((label: string, i: number) => (
                <li key={i}>{label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No weather impacts reported.</p>
          )}
        </section>

        <Separator />

        {/* Pest Attacks */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">Pest Attacks</h3>
          {preview.pest_attack_labels?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {preview.pest_attack_labels.map((label: string, i: number) => (
                <li key={i}>{label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No pest attacks recorded.</p>
          )}
        </section>

        <Separator />

        {/* Disease Attacks */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">Disease Attacks</h3>
          {preview.disease_attack_labels?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {preview.disease_attack_labels.map((label: string, i: number) => (
                <li key={i}>{label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No disease attacks recorded.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

function PreviewField({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">
        {value !== undefined && value !== "" ? value : "-"}
      </span>
    </div>
  );
}
