"use client";
import CropReportingDashboard from "@/components/Crop/Report/CropReport";
import { useLocalization } from "@/core/context/LocalizationContext";
import React from "react";

const page = () => {
  const { t } = useLocalization();
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("dashboard")}</h1>
        <p className="text-gray-600">{t("welcome_back_message")}</p>
      </div>
      <CropReportingDashboard apiEndpoint="" />
    </div>
  );
};

export default page;
