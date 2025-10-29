// ✅ Root object
export interface CropGetData {
  season: string;
  crop_id: number;
  land_id: number;
  variety: string;
  created_at: string;
  updated_at: string;
  crop_type_id: number;
  harvest_date: string;
  planting_date: string;
  estimated_yield: number;
  current_stage_id: number;

  crop_asset_seed_details: CropAssetSeedDetails[];
  crop_asset_pest_attack_details: CropAssetPestAttackDetails[];
  crop_asset_stage_history_details: CropAssetStageHistoryDetails[];
  crop_asset_chemical_usage_details: CropAssetChemicalUsageDetails[];
  crop_asset_disease_attack_details: CropAssetDiseaseAttackDetails[];
  crop_asset_weather_effect_history: CropAssetWeatherEffectHistory[];
  crop_asset_irrigation_cultivation_details: CropAssetIrrigationCultivationDetails[];
  crop_asset_previous_season_history_details: CropAssetPreviousSeasonHistoryDetails[];
}

// 🌱 Seed details
export interface CropAssetSeedDetails {
  crop_id: number;
  seed_id: number;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string;
  farmer_name: string;
  modified_at: string;
  seed_type_id: number;
  seed_variety: string;
  mobile_number: string;
  seed_type_name: string;
  seed_variety_id: number;
  seed_common_name: string;
  seed_company_name: string;
  seed_company_type_id: number;
  seed_company_type_name: string;
}

// 🐛 Pest attack details
export interface CropAssetPestAttackDetails {
  crop_id: number;
  remarks: string | null;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string | null;
  attack_date: string;
  farmer_name: string;
  modified_at: string | null;
  mobile_number: string;
  crop_pest_attack_id: number;
  pest_attack_type_id: number;
  pest_attack_observations_type_name: string | null;
}

// 🦠 Disease attack details
export interface CropAssetDiseaseAttackDetails {
  crop_id: number;
  remarks: string | null;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string | null;
  attack_date: string | null;
  farmer_name: string;
  modified_at: string | null;
  mobile_number: string;
  crop_disease_attack_id: number;
  disease_attack_type_id: number;
  disease_attack_observations_type_name: string;
}

// 🧪 Chemical usage
export interface CropAssetChemicalUsageDetails {
  qty: number;
  crop_id: number;
  remarks: string;
  qty_unit: string;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string | null;
  farmer_name: string;
  modified_at: string | null;
  chemical_name: string;
  mobile_number: string;
  chemical_type_id: number;
  chemical_usage_id: number;
}

// 💧 Irrigation & cultivation
export interface CropAssetIrrigationCultivationDetails {
  crop_id: number;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string | null;
  farmer_name: string;
  modified_at: string | null;
  mobile_number: string;
  irrigation_source: string;
  irrigation_facility: string;
  land_suitability_id: number;
  irrigation_source_id: number;
  cultivation_system_id: number;
  irrigation_facility_id: number;
  irrigation_cultivation_id: number;
  crop_land_suitability_name: string;
  crop_cultivation_system_name: string;
}

// 🌦️ Weather effect
export interface CropAssetWeatherEffectHistory {
  crop_id: number;
  remarks: string;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string;
  farmer_name: string;
  modified_at: string;
  mobile_number: string;
  weather_effect_type_id: number;
  weather_effect_type_name: string;
  land_weather_effect_history_id: number;
}

// 🕓 Stage history
export interface CropAssetStageHistoryDetails {
  crop_id: number;
  remarks: string;
  stage_id: number;
  crop_name: string;
  created_at: string;
  created_by: number;
  stage_name: string;
  modified_at: string;
  modified_by: number | null;
  transition_date: string;
  stage_history_id: number;
}

// 🌾 Previous season
export interface CropAssetPreviousSeasonHistoryDetails {
  crop_id: number;
  crop_name: string;
  land_name: string;
  created_at: string;
  stage_name: string | null;
  farmer_name: string;
  modified_at: string | null;
  sowing_date: string;
  harvest_date: string;
  mobile_number: string;
  seed_used_last_year: string;
  last_year_production: number;
  last_year_crop_type_id: number;
  immediate_previous_crop: string;
  last_year_crop_type_name: string | null;
  reason_for_changing_seed: string;
  previous_season_history_id: number;
}
