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
  if (!text) return;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const renderRow = (label: string, value: any) => (
  <div className="grid grid-cols-3 border-b border-gray-100 p-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span
      className="text-gray-800 font-semibold tracking-wide col-span-2 text-right"
      title={String(value || "")}
    >
      {value || <span className="text-gray-400">N/A</span>}
    </span>
  </div>
);

const renderRowPestDisease = (label: string, value: any) => (
  <div className="flex justify-start items-center border-b border-gray-100 p-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span
      className="text-gray-800 font-semibold"
      title={String(value || "N/A")}
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
  const [irrigationFacilities, setIrrigationFacilities] = useState<LookupMap>(
    {}
  );
  const [cultivationSystems, setCultivationSystems] = useState<LookupMap>({});
  const [landSuitability, setLandSuitability] = useState<LookupMap>({});
  const [weatherEffects, setWeatherEffects] = useState<LookupMap>({});

  const toMap = (arr: any[], key: string, label: string) =>
    Array.isArray(arr)
      ? arr.reduce((acc, cur) => {
          if (cur && cur[key] !== undefined && cur[label] !== undefined) {
            acc[cur[key]] = cur[label];
          }
          return acc;
        }, {} as Record<string, string>)
      : {};

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [varietyRes, irrigationRes, cultivationRes] = await Promise.all([
          get("/cms/seed-variety-service"),
          get("/cms/crop-irrigation-facility-service"),
          // get("/api/cms/get-asset-crop-cultivation-system"),
          // get("/api/cms/get-asset-crop-land-suitability"),
          get("/cms/crop-adverse-weather-effect-type-service/?page_size=100"),
        ]);

        // ✅ FIX: most CMS endpoints return paginated objects with .results
        const extract = (res: any) =>
          Array.isArray(res?.data?.results) ? res.data.results : res.data;

        const varietyData = extract(varietyRes);
        const irrigationData = extract(irrigationRes);
        const cultivationData = extract(cultivationRes);
        // const landData = extract(landRes);
        // const weatherData = extract(weatherRes);

        setSeedVarieties(toMap(varietyData, "id", "seed_variety"));
        setIrrigationFacilities(
          toMap(irrigationData, "id", "irrigation_facility_name")
        );
        setCultivationSystems(
          toMap(cultivationData, "id", "cultivation_system_name")
        );
        // setLandSuitability(toMap(landData, "id", "land_suitability_name"));
        // setWeatherEffects(toMap(weatherData, "id", "weather_effect_type_name"));
      } catch (err) {
        console.error("❌ Failed to load lookup data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  if (loading) return <Loading />;

  //("🌾 data passed to preview from parent:", data);

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
          <div className="grid gap-4">
            {data.seed.map((s: any, i: number) => (
              <div key={i} className="border rounded-xl bg-white shadow-sm p-3">
                {renderRow("Seed Name", s.seed_common_name)}
                {renderRow("Company", s.seed_company_name)}
                {renderRow(
                  "Variety",
                  s.seed_variety_name || seedVarieties[s.seed_variety_id]
                )}
                {renderRow("Seed Company Type", s.seed_company_type_name)}
                <div className="flex justify-between border-b border-gray-100 p-2 text-sm">
                  <span className="font-medium text-gray-600">
                    Type of Seed Used
                  </span>
                  <span
                    className="text-gray-800 font-semibold truncate max-w-xs"
                    title={s.seed_type_name}
                  >
                    {s.seed_type_name || "N/A"}
                  </span>
                </div>
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
            {renderRow(
              "Irrigation Facility",
              data.cultivation.irrigation_facility_id_name ||
                data.cultivation.irrigation_facility
            )}
            {renderRow(
              "Irrigation Source",
              data.cultivation.irrigation_source_id_name ||
                data.cultivation.irrigation_source
            )}
            {renderRow(
              "Cultivation System",
              data.cultivation.cultivation_system_id_name ||
                data.cultivation.crop_cultivation_system_name
            )}
            {renderRow(
              "Land Suitability",
              data.cultivation.land_suitability_id_name ||
                data.cultivation.crop_land_suitability_name
            )}
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
            {renderRow(
              "Immediate Previous Crop",
              data.history.immediate_previous_crop
            )}
            {renderRow(
              "Last years Crop",
              data.history.last_year_crop_type_name
            )}
            {/* {renderRow("Sowing Date", data.history.sowing_date)} */}
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

        {data.weather?.weather_effects?.some(
          (w: any) => w.weather_effect_type_id !== 0
        ) ? (
          <>
            {data.weather ? (
              <div className="rounded-lg bg-white shadow-sm p-3 space-y-3">
                {renderRow("Period From", data.weather.date_from)}
                {renderRow("Period To", data.weather.date_to)}
                {renderRow("Remarks", data.weather.remarks)}

                {data.weather.weather_effects?.length ? (
                  <div className="mt-2 space-y-2">
                    {data.weather.weather_effects
                      .filter((w: any) => w.weather_effect_type_id !== 0)
                      .map((w: any, i: number) => (
                        <div
                          key={i}
                          className="border rounded-lg bg-gray-50 p-2 shadow-sm"
                        >
                          {renderRow("Effect Type", w.weather_effect_type_name)}
                          {renderRow("Remarks", w.remarks || "")}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic mt-2">
                    No weather effects recorded
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic">No weather data</p>
            )}
          </>
        ) : (
          <p className="text-gray-400 italic">No weather effects recorded</p>
        )}
      </section>

      {/* 🐛 Pests & Diseases */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Pest & Disease Observations
        </h3>

        {data.pestDetails?.length ? (
          <div className="mb-3">
            <h4 className="font-semibold text-gray-700">Pests:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {data.pestDetails.map((p: any) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 italic">No pest data provided</p>
        )}

        {data.diseaseDetails?.length ? (
          <div>
            <h4 className="font-semibold text-gray-700">Diseases:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {data.diseaseDetails.map((d: any) => (
                <li key={d.id}>{d.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 italic">No disease data provided</p>
        )}
      </section>

      {/* 🧪 Chemicals */}
      <section className="bg-gray-50 rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
          Chemicals
        </h3>
        {data.chemicals ? (
          <>
            <h4 className="font-semibold mt-2 mb-2 text-gray-800">
              Fertilizers
            </h4>
            {data.chemicals.fertilizers?.length ? (
              <div className="grid gap-3">
                {data.chemicals.fertilizers.map((f: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded-lg bg-white p-3 shadow-sm"
                  >
                    {renderRow("Name", f.chemical_name)}
                    {renderRow(
                      "Quantity",
                      `${f.qty || 0} ${f.qty_unit || ""}kg`
                    )}
                    {renderRow("Remarks", truncate(f.remarks))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic mb-2">No fertilizers added</p>
            )}

            <h4 className="font-semibold mt-4 mb-2 text-gray-800">
              Pesticides
            </h4>
            {data.chemicals.pesticides?.length ? (
              <div className="grid gap-3">
                {data.chemicals.pesticides.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded-lg bg-white p-3 shadow-sm"
                  >
                    {renderRow("Name", p.chemical_name)}
                    {renderRow(
                      "Quantity",
                      `${p.qty || 0} ${p.qty_unit || ""}kg`
                    )}
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
