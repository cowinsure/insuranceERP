"use client";
import CropReportingDashboard, {
  CropRow,
} from "@/components/Crop/Report/CropReport";
import { fakeCrops } from "@/components/fakeCrops";
import { useLocalization } from "@/core/context/LocalizationContext";
import React, { useEffect, useState } from "react";

const page = () => {
  const { t } = useLocalization();
  const [apiData, setApiData] = useState<CropRow[]>([]);

  // Simulate GET API
  useEffect(() => {
    // mimic network delay
    setTimeout(() => {
      setApiData(fakeCrops);
    }, 500);
  }, []);
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("Crop Report")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("See all your reports and export from one place")}
        </p>
      </div>
      <CropReportingDashboard
        apiEndpoint="dummy" // still required by component
        pageSize={5}
      />
    </div>
  );
};

export default page;
