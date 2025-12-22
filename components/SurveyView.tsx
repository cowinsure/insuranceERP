"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  CalendarDays,
  Sprout,
  Bug,
  CloudRain,
  Activity,
  Leaf,
} from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
      {/* Basic Info */}
      <Section title="Basic Information" icon={<User className="w-5 h-5" />}>
        <InfoRow
          icon={<User size={16} />}
          label="Farmer Name"
          value={survey.farmer_name}
        />
        <InfoRow
          icon={<Phone size={16} />}
          label="Mobile Number"
          value={survey.mobile_number}
        />
        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Survey Date"
          value={formatDate(survey.survey_date)}
        />
        <InfoRow
          icon={<CalendarDays size={16} />}
          label="Created At"
          value={formatDate(survey.created_at)}
        />
      </Section>

      {/* Production Details */}
      <Section title="Production" icon={<Sprout className="w-5 h-5" />}>
        <InfoRow
          label="Last Year's Avg Production"
          value={survey.avg_prod_last_year + " kg"}
        />
        <InfoRow
          label="Current Year's Avg Production"
          value={survey.avg_prod_current_year + " kg"}
        />
      </Section>

      {/* Yield Loss Types */}
      <Section title="Yield Loss Types" icon={<Activity className="w-5 h-5" />}>
        {survey.key_reasons_yield_losses?.length ? (
          survey.key_reasons_yield_losses.map((item: any, i: number) => (
            <ListItem key={i} text={item} />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Pest Attacks */}
      <Section title="Pest Attacks" icon={<Bug className="w-5 h-5" />}>
        {survey.pests?.length ? (
          survey.pests.map((item: any, i: number) => (
            <ListItem key={i} text={`${item}`} />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Weather Events */}
      <Section title="Weather Events" icon={<CloudRain className="w-5 h-5" />}>
        {survey.weather_effects?.length ? (
          survey.weather_effects.map((item: any, i: number) => (
            <ListItem key={i} text={`${item}`} />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Disease Attacks */}
      <Section title="Disease Attacks" icon={<Activity className="w-5 h-5" />}>
        {survey.diseases?.length ? (
          survey.diseases.map((item: any, i: number) => (
            <ListItem key={i} text={`${item}`} />
          ))
        ) : (
          <Empty />
        )}
      </Section>

      {/* Seed Varieties */}
      <Section title="Seed Varieties Used" icon={<Leaf className="w-5 h-5" />}>
        {survey.top_three_varieties?.length ? (
          survey.top_three_varieties.map((item: any, i: number) => (
            <ListItem key={i} text={item} />
          ))
        ) : (
          <Empty />
        )}
      </Section>
    </motion.div>
  );
};

export default SurveyView;

/* ---- UI Utility Components ---- */

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <motion.div
    // whileHover={{ scale: 1.01 }}
    className="bg-gray-50 rounded-2xl border p-5 lg:space-y-4"
  >
    <div className="flex items-center gap-3 border-b pb-3">
      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">{icon}</div>
      <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between text-sm py-2">
    <div className="flex items-center gap-2 text-gray-600">
      {icon && <span className="text-blue-500">{icon}</span>}
      <span className="font-medium">{label}</span>
    </div>
    <span className="text-gray-900 font-semibold">{value ?? "N/A"}</span>
  </div>
);

const ListItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2 text-gray-700 text-sm bg-gray-50 rounded-lg px-3 py-1 lg:py-2">
    <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
    <span>{text}</span>
  </div>
);

const Empty = () => (
  <div className="text-gray-400 text-sm italic bg-gray-50 rounded-lg p-3">
    No data available
  </div>
);
