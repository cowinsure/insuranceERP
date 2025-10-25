// ✅ Root Crop Object
export interface CropData {
  season: string;
  crop_id: number;
  land_id: number;
  variety: string;
  created_at?: string;
  updated_at?: string;
  crop_type_id: number;
  harvest_date: string;
  planting_date: string;
  estimated_yield: number;

  // Nested details
  crop_asset_seed_details?: SeedDetails[];
  crop_asset_pest_attack_details?: PestAttack[];
  crop_asset_stage_history_details?: StageHistory[];
  crop_asset_chemical_usage_details?: ChemicalUsage[];
  crop_asset_disease_attack_details?: DiseaseAttack[];
  crop_asset_irrigation_cultivation_details?: IrrigationCultivation[];
  crop_asset_previous_season_history_details?: PreviousSeasonHistory[];
  crop_asset_weather_effect_history?: CropAssetWeatherEffectHistory[];
}

// ✅ 1. Seed Details
export interface SeedDetails {
  crop_id: number;
  seed_id: number;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  farmer_name: string | null;
  modified_at: string | null;
  seed_type_id: number;
  seed_variety: string | null;
  mobile_number: string | null;
  seed_type_name: string;
  seed_variety_id: number;
  seed_common_name: string;
  seed_company_name: string;
  seed_company_type_id: number;
  seed_company_type_name: string;
}

// ✅ 2. Pest Attack Details
export interface PestAttack {
  crop_id: number;
  remarks: string;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  attack_date: string;
  farmer_name: string | null;
  modified_at: string | null;
  mobile_number: string | null;
  crop_pest_attack_id: number;
  pest_attack_type_id: number;
  pest_attack_observations_type_name: string;
}

// ✅ 3. Stage History Details
export interface StageHistory {
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

// ✅ 4. Chemical Usage Details
export interface ChemicalUsage {
  qty: number;
  crop_id: number;
  remarks: string;
  qty_unit: string;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  farmer_name: string | null;
  modified_at: string | null;
  chemical_name: string;
  mobile_number: string | null;
  chemical_type_id: number;
  chemical_usage_id?: number;
}

// ✅ 5. Disease Attack Details
export interface DiseaseAttack {
  crop_id: number;
  remarks: string;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  attack_date: string;
  farmer_name: string | null;
  modified_at: string | null;
  mobile_number: string | null;
  crop_disease_attack_id: number;
  disease_attack_type_id: number;
  disease_attack_observations_type_name: string;
}

// ✅ 6. Irrigation & Cultivation Details
export interface IrrigationCultivation {
  crop_id: number;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  farmer_name: string | null;
  modified_at: string | null;
  mobile_number: string | null;
  irrigation_source: string;
  irrigation_facility: string;
  land_suitability_id: number;
  irrigation_source_id: number;
  cultivation_system_id: number;
  irrigation_facility_id: number;
  irrigation_cultivation_id: number;
  crop_land_suitability_name: string | null;
  crop_cultivation_system_name: string;
}

// ✅ 7. Previous Season History
export interface PreviousSeasonHistory {
  crop_id: number;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  farmer_name: string | null;
  modified_at: string | null;
  sowing_date: string;
  harvest_date: string;
  mobile_number: string | null;
  seed_used_last_year: string;
  last_year_production: number;
  last_year_crop_type_id: number;
  immediate_previous_crop: string;
  last_year_crop_type_name: string;
  reason_for_changing_seed: string;
  previous_season_history_id: number;
}

export interface CropAssetWeatherEffectHistory {
  period_to: string;
  period_from: string;
  crop_id: number;  
  remarks: string;
  crop_name: string;
  land_name: string | null;
  created_at: string;
  stage_name: string | null;
  farmer_name: string | null;
  modified_at: string | null;
  mobile_number: string | null;
  weather_effect_type_id: number;
  weather_effect_type_name: string | null;
  land_weather_effect_history_id: number;
  }
