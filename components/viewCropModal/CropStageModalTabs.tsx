"use client";
import React, { useState } from "react";
import { GiPlantRoots } from "react-icons/gi";
import { PiCalendar, PiPlantDuotone } from "react-icons/pi";
import StageOneData from "./StageOneData";
import StageTwoData from "./StageTwoData";
import { LandPlot } from "lucide-react";

interface CropStageModalTabsProps {
  stageOneData: any;
  stageTwoData?: any;
}

const CropStageModalTabs: React.FC<CropStageModalTabsProps> = ({
  stageOneData,
  stageTwoData,
}) => {
  const [activeTab, setActiveTab] = useState("stage1");

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
        return <StageOneData data={stageOneData} />;
      case "stage2":
        return <StageTwoData data={stageTwoData} />;
      default:
        return null;
    }
  };
  console.log(stageOneData);
  return (
    <div className="p-3 md:p-4 text-gray-800">
      {/* Master Details */}
      <div className="bg-white max-h-[80vh] overflow-y-auto mb-10">
        <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
          <GiPlantRoots className="text-2xl text-green-700" />
          Crop Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Crop Name */}
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm transition">
            <span className="p-2 bg-green-100 text-green-700 rounded-full">
              <GiPlantRoots className="text-xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Crop</p>
              <p className="font-medium text-gray-800">
                {stageOneData.crop_name || "N/A"}
              </p>
            </div>
          </div>

          {/* Variety */}
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm transition">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-full">
              <PiPlantDuotone className="text-xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Variety</p>
              <p className="font-medium text-gray-800">
                {stageOneData.variety || "N/A"}
              </p>
            </div>
          </div>

          {/* Plantation Date */}
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm transition">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-full">
              <PiCalendar className="text-xl" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Plantation Date</p>
              <p className="font-medium text-gray-800">
                {stageOneData.plantation_date || "N/A"}
              </p>
            </div>
          </div>

          {/* Land Information */}
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm transition">
            <span className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
              <LandPlot className="text-" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Land</p>
              <p className="font-medium text-gray-800">
                {stageOneData.land || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="relative flex justify-between items-center bg-gray-100 rounded-lg p-1 shadow-sm mb-">
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
              {tab === "stage1" ? "Stage 1 Details" : "Stage 2 Details"}
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
      <div className="rounded bg-white shadow-inner max-h-[80vh] overflow-y-auto p-4 md:p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CropStageModalTabs;
