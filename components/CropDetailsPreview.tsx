"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/utils/Loading";
import useApi from "@/hooks/use_api";

interface CropDetailsPreviewProps {
  data: any;
}

interface LookupMap {
  [key: number]: string;
}

const truncate = (text: string, limit = 60) => {
  if (!text) return "—";
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const renderRow = (label: string, value: any) => (
  <div className="flex justify-start items-center border-b border-gray-100 p-2 text-sm">
    <span className="font-semibold text-gray-600">{label}</span>
    <span
      className="text-gray-800 "
      title={String(value || "—")}
    >
      {value || <span className="text-gray-400">—</span>}
    </span>
  </div>
);

export default function CropDetailsPreview({ data }: CropDetailsPreviewProps) {
  const { get } = useApi();
  const [loading, setLoading] = useState(true);

  // Lookup tables
  const [seedVarieties, setSeedVarieties] = useState<LookupMap>({});
  const [irrigationFacilities, setIrrigationFacilities] = useState<LookupMap>({});
  const [cultivationSystems, setCultivationSystems] = useState<LookupMap>({});
  const [landSuitability, setLandSuitability] = useState<LookupMap>({});
  const [weatherEffects, setWeatherEffects] = useState<LookupMap>({});

  const toMap = (arr: any[], key = "id", valueKey = "name") =>
    arr.reduce((acc: any, cur: any) => {
      acc[cur[key]] = cur[valueKey];
      return acc;
    }, {});

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [varietyRes, irrigationRes, cultivationRes, landRes, weatherRes] =
          await Promise.all([
            get("/cms/seed-variety-service"),
            get("/cms/crop-irrigation-facility-service"),
            get("/api/cms/get-asset-crop-cultivation-system"),
            get("/api/cms/get-asset-crop-land-suitability"),
            get("/api/cms/crop-adverse-weather-effect-type-service/?page_size=100"),
          ]);

        setSeedVarieties(toMap(varietyRes.data, "id", "variety_name"));
        setIrrigationFacilities(toMap(irrigationRes.data, "id", "irrigation_facility_name"));
        setCultivationSystems(toMap(cultivationRes.data, "id", "cultivation_system_name"));
        setLandSuitability(toMap(landRes.data, "id", "land_suitability_name"));
        setWeatherEffects(toMap(weatherRes.data, "id", "weather_effect_type_name"));
      } catch (err) {
        console.error("Failed to load lookup data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto text-gray-700 max-h-[75vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Crop Details Preview
      </h2>

      {/* 🌱 Seed Details */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Seed Details
        </h3>
        {data.seed && data.seed.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.seed.map((s: any, i: number) => (
              <div key={i} className="border rounded-xl bg-white shadow-sm p-3">
                {renderRow("Seed Name", s.seed_common_name)}
                {renderRow("Variety", seedVarieties[s.seed_variety_id])}
                {renderRow("Company", s.seed_company_name)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No seed details provided</p>
        )}
      </section>

      {/* 🚿 Cultivation Details */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Cultivation
        </h3>
        {data.cultivation ? (
          <div className="rounded-lg bg-white shadow-sm p-3">
            {renderRow("Irrigation Facility", irrigationFacilities[data.cultivation.irrigation_facility_id])}
            {renderRow("Irrigation Source", data.cultivation.irrigation_source_id)}
            {renderRow("Cultivation System", cultivationSystems[data.cultivation.cultivation_system_id])}
            {renderRow("Land Suitability", landSuitability[data.cultivation.land_suitability_id])}
          </div>
        ) : (
          <p className="text-gray-400 italic">No cultivation data</p>
        )}
      </section>

      {/* 📜 History */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Previous Season History
        </h3>
        {data.history ? (
          <div className="rounded-lg bg-white shadow-sm p-3">
            {renderRow("Immediate Previous Crop", data.history.immediate_previous_crop)}
            {renderRow("Sowing Date", data.history.sowing_date)}
            {renderRow("Harvest Date", data.history.harvest_date)}
            {renderRow("Production", data.history.last_year_production)}
          </div>
        ) : (
          <p className="text-gray-400 italic">No history data</p>
        )}
      </section>

      {/* ☁️ Weather Effects */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Weather Effects
        </h3>
        {data.weather?.weather_effects?.length ? (
          <div className="grid gap-2">
            {data.weather.weather_effects.map((w: any, i: number) => (
              <div key={i} className="border rounded-lg bg-white p-3 shadow-sm">
                {renderRow("Effect Type", weatherEffects[w.weather_effect_type_id] || "Unknown Effect")}
                {renderRow("Remarks", truncate(w.remarks))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No weather effect data</p>
        )}
      </section>

      {/* 🐛 Pests & Diseases */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Pests & Diseases
        </h3>
        <div className="grid md:grid-cols-1 gap-4">
          {/* Pests */}
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Pests</h4>
            {data.pestDetails?.length ? (
              data.pestDetails.map((p: any, i: number) => (
                <div key={i} className="border rounded-lg bg-blue-50 p-1 mb-2 shadow-sm">
                  {renderRow("", p.name)}
                  {/* {renderRow("", truncate(p.remarks))} */}
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No pests recorded</p>
            )}
          </div>

          {/* Diseases */}
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Diseases</h4>
            {data.diseaseDetails?.length ? (
              data.diseaseDetails.map((d: any, i: number) => (
                <div key={i} className="border rounded-lg bg-blue-50 p-1 mb-2 shadow-sm">
                  {renderRow("", d.name)}
                  {/* {renderRow("", truncate(d.remarks))} */}
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No diseases recorded</p>
            )}
          </div>
        </div>
      </section>

      {/* 🧪 Chemicals */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Chemicals
        </h3>
        {data.chemicals ? (
          <>
            <h4 className="font-semibold mt-2 mb-2 text-gray-800">Fertilizers</h4>
            {data.chemicals.fertilizers?.length ? (
              <div className="grid gap-3">
                {data.chemicals.fertilizers.map((f: any, i: number) => (
                  <div key={i} className="border rounded-lg bg-white p-3 shadow-sm">
                    {renderRow("Name", f.chemical_name)}
                    {renderRow("Quantity", `${f.qty || 0} ${f.qty_unit || ""}`)}
                    {renderRow("Remarks", truncate(f.remarks))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic mb-2">No fertilizers added</p>
            )}

            <h4 className="font-semibold mt-4 mb-2 text-gray-800">Pesticides</h4>
            {data.chemicals.pesticides?.length ? (
              <div className="grid gap-3">
                {data.chemicals.pesticides.map((p: any, i: number) => (
                  <div key={i} className="border rounded-lg bg-white p-3 shadow-sm">
                    {renderRow("Name", p.chemical_name)}
                    {renderRow("Quantity", `${p.qty || 0} ${p.qty_unit || ""}`)}
                    {renderRow("Remarks", truncate(p.remarks))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No pesticides added</p>
            )}
          </>
        ) : (
          <p className="text-gray-400 italic">No chemical usage data</p>
        )}
      </section>

      <p className="text-center text-sm text-gray-500 mt-4">
        Please review all information carefully before submitting.
      </p>
    </div>
  );
}
