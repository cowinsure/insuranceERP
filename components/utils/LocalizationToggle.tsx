"use client";

import { useLocalization } from "../../core/context/LocalizationContext";
import React from "react";



const LocalizationToggle: React.FC = () => {
  const { locale, setLocale } = useLocalization();

  const toggleLocale = () => {
    setLocale(locale === "en" ? "bn" : "en");
  };

  return (
    <button
      onClick={toggleLocale}
      className="
        fixed top-4 right-4
        bg-green-600 text-white
        px-4 py-2 rounded-full
        shadow-lg hover:bg-green-700
        transition-colors duration-200
        z-50
      "
    >
      {locale === "en" ? "বাংলা" : "English"}
    </button>
  );
};

export default LocalizationToggle;
