// model/crop/CropCoreModel.ts
export interface SelectedCropMeta {
  crop_id: number;
  crop_name?: string;
  land_name?: string;
  farmer_name?: string;
  mobile_number?: string;
  land_id: number;
  crop_type_id: number;
  variety?: string;
}

export interface CropRegisterData {
  land_id: number;
  crop_type_id: number;
  variety: string;
  season: string;
  planting_date: string;
  harvest_date: string;
  estimated_yield: number;
  created_at: string;
  farmer_name?: string,
  mobile_number?: string,

  crop_asset_seed_details: CropAssetSeedDetail[];
  crop_asset_chemical_usage_details: CropAssetChemicalUsageDetail[];
  crop_asset_disease_attack_details: CropAssetDiseaseAttackDetail[];
  crop_asset_irrigation_cultivation_details: CropAssetIrrigationCultivationDetail[];
  crop_asset_pest_attack_details: CropAssetPestAttackDetail[];
  crop_asset_previous_season_history_details: CropAssetPreviousSeasonHistoryDetail[];
  crop_asset_weather_effect_history: CropAssetWeatherEffectHistory[];
}

export interface CropAssetSeedDetail {
  seed_id: number;
  seed_common_name: string;
  seed_variety_id: number;
  seed_company_name: string;
  seed_company_type_id: number;
  seed_type_id: number;
  created_at: string;
  created_by: number;
}

export interface CropAssetChemicalUsageDetail {
  chemical_type_id: number;
  chemical_name: string;
  qty: number;
  qty_unit: string;
  remarks: string;
  created_at: string;
  created_by: number;
}

export interface CropAssetDiseaseAttackDetail {
  disease_attack_type_id: number;
  attack_date: string;
  remarks: string;
  created_at: string;
  created_by: number;
}

export interface CropAssetIrrigationCultivationDetail {
  irrigation_facility_id: number;
  irrigation_source_id: number;
  cultivation_system_id: number;
  land_suitability_id: number;
  created_at: string;
  created_by: number;
}

export interface CropAssetPestAttackDetail {
  pest_attack_type_id: number;
  attack_date: string;
  remarks: string;
  created_at: string;
  created_by: number;
}

export interface CropAssetPreviousSeasonHistoryDetail {
  immediate_previous_crop: string;
  harvest_date?: string;
  last_year_crop_type_id: number;
  last_year_production: number;
  sowing_date: string;
  seed_used_last_year: string;
  reason_for_changing_seed: string;
  created_at: string;
  created_by: number;
}

export interface CropAssetWeatherEffectHistory {
  weather_effect_type_id: number;
  remarks: string;
}
