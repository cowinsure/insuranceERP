export interface SurveyFormData {
  farmer_id: string;
  farmer_name?: string;
  plot_id: string;
  survey_date: string;
  crop_type: string;
  soil_type: string;
  irrigation_source: string;
  land_preparation_status: string;
  expected_sowing_date: string;
  fertilizer_requirements: string;
  pest_risk_assessment: string;
  additional_notes: string;

  // Extended survey fields
  top_three_varieties: string[];
  avg_production_this_year: string;
  avg_production_last_year: string;
  yield_loss: string;
  key_reasons_yield_losses: string[];
  weather_effects: string[];
  pests: string[];
  diseases: string[];
  remarks: string;
}