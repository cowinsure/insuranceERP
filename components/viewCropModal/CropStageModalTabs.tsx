"use client";
import React, { useEffect, useState } from "react";
import { GiPlantRoots } from "react-icons/gi";
import { PiCalendar, PiPlantDuotone } from "react-icons/pi";
import StageOneData from "./StageOneData";
import StageTwoData from "./StageTwoData";
import { LandPlot, User } from "lucide-react";
import useApi from "@/hooks/use_api";
import { toast } from "sonner";
import { CropAssetSeedDetails } from "../model/crop/CropGetModel";
import { IoMdKeypad } from "react-icons/io";
import { useLocalization } from "@/core/context/LocalizationContext";

interface CropStageModalTabsProps {
  data: any;
}

const CropStageModalTabs: React.FC<CropStageModalTabsProps> = ({ data }) => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState("stage1");

  // ✅ Tabs setup (kept exactly as before)
  const tabs = ["stage1", "stage2"];
  const numTabs = tabs.length;
  const tabWidthPercent = 100 / numTabs;
  const slidingWidthPercent = tabWidthPercent * 0.98;
  const activeIndex = tabs.findIndex((tab) => tab === activeTab);
  const slidingLeftPercent =
    tabWidthPercent * activeIndex + (tabWidthPercent - slidingWidthPercent) / 2;

  const renderTabContent = () => {
    switch (activeTab) {
      case "stage1":
        return <StageOneData data={data} />;
      case "stage2":
        return <StageTwoData cropData={data} />;
      default:
        return null;
    }
  };

  console.log("Crop Data:", data);

  return (
    <div className="text-gray-800 relative">
      {/* Master Details */}
      <div className="bg-white min-h-[25vh] overflow-y-auto mb-7 p-2">
        <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
          <GiPlantRoots className="text-2xl text-green-700" />
          {t("crop_details")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Crop Name */}
          <div className="flex items-center gap-3 p-3 border-gray-200 rounded-lg rounded-l-full bg-gray-50 drop-shadow-md transition">
            <span className="p-2 bg-green-100 text-green-700 rounded-full">
              <GiPlantRoots className="text-3xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("crop")}</p>
              <p className="font-medium text-gray-800">
                {data.crop_asset_seed_details?.[0]?.crop_name || "N/A"}
              </p>
            </div>
          </div>

          {/* Variety */}
          <div className="flex items-center gap-3 p-3 border-gray-200 rounded-lg rounded-l-full bg-gray-50 drop-shadow-md transition">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-full">
              <PiPlantDuotone className="text-3xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("variety")}</p>
              <p className="font-medium text-gray-800">
                {data.crop_asset_seed_details?.[0]?.seed_variety ||
                  data.variety ||
                  "N/A"}
              </p>
            </div>
          </div>

          {/* Plantation Date */}
          <div className="flex items-center gap-3 p-3 border-gray-200 rounded-lg rounded-l-full bg-gray-50 drop-shadow-md transition">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-full">
              <PiCalendar className="text-3xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("plantation_date")}</p>
              <p className="font-medium text-gray-800">
                {data.planting_date || "N/A"}
              </p>
            </div>
          </div>

          {/* Land Information */}
          <div className="flex items-center gap-3 p-3 border-gray-200 rounded-lg rounded-l-full bg-gray-50 drop-shadow-md transition">
            <span className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
              <LandPlot className="text-3xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("land")}</p>
              <p className="font-medium text-gray-800">
                {data?.land_name || "N/A"}
              </p>
            </div>
          </div>

          {/* Farmer name */}
          <div className="flex items-center gap-3 p-3 border-gray-200 rounded-lg rounded-l-full bg-gray-50 drop-shadow-md transition">
            <span className="p-2 bg-pink-100 text-pink-600 rounded-full">
              <User className="text-3xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("farmer_name")}</p>
              <p className="font-medium text-gray-800">
                {data?.farmer_name || "N/A"}
              </p>
            </div>
          </div>

          {/* Farmer mobile*/}
          <div className="flex items-center gap-3 p-3 border-gray-200 rounded-lg rounded-l-full bg-gray-50 drop-shadow-md transition">
            <span className="p-2 bg-purple-100 text-purple-600 rounded-full">
              <IoMdKeypad className="text-2xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{t("farmer_mobile")}</p>
              <p className="font-medium text-gray-800">
                {data?.mobile_number || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-xl p-2 sticky top-40">
        {/* Tabs Header */}
        <div className="relative flex justify-between items-center bg-gray-100 rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col md:flex-row items-center gap-2 flex-1 justify-center py-2 rounded-md text-sm z-10 transition-all duration-200 cursor-pointer
              ${
                activeTab === tab
                  ? "text-green-800 font-bold md:text-[17px]"
                  : "text-gray-600 hover:text-green-600 hover:scale-105 font-semibold"
              }`}
            >
              {tab === "stage1" && <GiPlantRoots className="text-xl" />}
              {tab === "stage2" && <PiPlantDuotone className="text-xl" />}
              <span>
                {tab === "stage1" ? t("stage_1_details") : t("stage_2_details")}
              </span>
            </button>
          ))}

          {/* Sliding Active Background */}
          <div
            className="absolute top-1 left-0 h-[calc(100%-0.5rem)] bg-white rounded-md shadow transition-all duration-300 ease-in-out"
            style={{
              width: `${slidingWidthPercent}%`,
              left: `${slidingLeftPercent}%`,
            }}
          />
        </div>
        {/* Tab Content */}
        <div className=" bg-white pt-2 max-h-[650px] overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CropStageModalTabs;
