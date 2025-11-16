"use client";

import React from "react";

interface SurveyViewProps {
  survey: any;
}

const SurveyView: React.FC<SurveyViewProps> = ({ survey }) => {
  if (!survey) return null;

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };
  console.log("Survey VIew", survey);

  return (
    <div className="w-full space-y-6">
      {/* Basic Info */}
      <Section title="Basic Information">
        <InfoRow label="Farmer Name" value={survey.farmer_name} />
        <InfoRow label="Mobile Number" value={survey.mobile_number} />
        <InfoRow label="Survey Date" value={formatDate(survey.survey_date)} />
        <InfoRow label="Created At" value={formatDate(survey.created_at)} />
      </Section>

      {/* Production Details */}
      <Section title="Production">
        <InfoRow
          label="Last Year's Avg Production"
          value={survey.avg_prod_last_year}
        />
        <InfoRow
          label="Current Year's Avg Production"
          value={survey.avg_prod_current_year}
        />
      </Section>

      {/* Yield Loss Types */}
      <Section title="Yield Loss Types">
        {survey.key_reasons_yield_losses?.length ? (
          survey.key_reasons_yield_losses.map((item: any, i: number) => (
            <ListItem key={i} text={item} />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Pest Attacks */}
      <Section title="Pest Attacks">
        {survey.survey_pest_attack_details?.length ? (
          survey.survey_pest_attack_details.map((item: any, i: number) => (
            <ListItem key={i} text={`Type ID: ${item.pest_attack_type_id}`} />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Weather Events */}
      <Section title="Weather Events">
        {survey.survey_weather_event_details?.length ? (
          survey.survey_weather_event_details.map((item: any, i: number) => (
            <ListItem
              key={i}
              text={`Event ID: ${item.weather_event_type_id}`}
            />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Disease Attacks */}
      <Section title="Disease Attacks">
        {survey.survey_disease_attack_details?.length ? (
          survey.survey_disease_attack_details.map((item: any, i: number) => (
            <ListItem
              key={i}
              text={`Type ID: ${item.disease_attack_type_id}`}
            />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Seed Varieties */}
      <Section title="Seed Varieties Used">
        {survey.top_three_varieties?.length ? (
          survey.top_three_varieties.map((item: any, i: number) => (
            <ListItem key={i} text={item} />
          ))
        ) : (
          <Empty />
        )}
      </Section>
    </div>
  );
};

export default SurveyView;

/* ---- UI Utility Components ---- */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
    <h3 className="font-semibold text-gray-800">{title}</h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-900">{value ?? "N/A"}</span>
  </div>
);

const ListItem = ({ text }: { text: string }) => (
  <div className="text-gray-800 text-sm pl-2 border-l-2 border-gray-300">
    • {text}
  </div>
);

const Empty = () => (
  <div className="text-gray-500 text-sm italic">No data available</div>
);
