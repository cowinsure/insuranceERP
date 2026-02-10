import { useLocalization } from "@/core/context/LocalizationContext";
import React from "react";
interface PageHeaderProps {
  heading: string;
  description: string;
}
const PageHeader = ({ heading, description }: PageHeaderProps) => {
  const { t } = useLocalization();
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="col-span-2">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-700">
          {t(heading)}
        </h1>
        <p className="text-gray-400 mt-1 text-sm lg:text-base font-medium lg:tracking-wide">
          {t(description)}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
