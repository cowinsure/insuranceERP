"use client";
import { DashboardStats } from "@/components/dashboard-stats";
import { ClaimsChart } from "@/components/claims-chart";
// import { QuickStats } from "@/components/quick-stats"
// import { ClaimsTable } from "@/components/claims-table"
import { useLocalization } from "../../core/context/LocalizationContext";

export default function Page() {
  const { t } = useLocalization();

  return (
    <div className="flex-1 space-y-6 p-3 md:px-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {t("dashboard")}
        </h1>
        <p className="text-gray-600 text-sm pr-12 lg:pr-0">{t("welcome_back_message")}</p>
      </div>

      <div className="animate__animated animate__fadeIn">
        <DashboardStats />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 animate__animated animate__fadeIn">
          <ClaimsChart />
        </div>
        <div>{/* <QuickStats /> */}</div>
      </div>

      {/* <ClaimsTable /> */}
    </div>
  );
}
