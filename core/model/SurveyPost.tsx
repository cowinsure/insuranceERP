// Main Survey POST Payload Structure
export interface SurveyPostPayload {
  farmer_id: number;
  avg_prod_last_year: number;
  avg_prod_current_year: number;
  survey_date: string | null;

  survey_varieties_of_seeds_details: SurveyVarietyDetail[];
  survey_yield_loss_details: SurveyYieldLossDetail[];
  survey_weather_event_details: SurveyWeatherEventDetail[];
  survey_pest_attack_details: SurveyPestAttackDetail[];
  survey_disease_attack_details: SurveyDiseaseAttackDetail[];
}

export interface SurveyVarietyDetail {
  survey_varieties_of_seeds: string; // e.g. "Hybrid-22"
}

export interface SurveyYieldLossDetail {
  yield_loss_type_id: number;
}

export interface SurveyWeatherEventDetail {
  weather_event_type_id: number;
}

export interface SurveyPestAttackDetail {
  pest_attack_type_id: number;
}

export interface SurveyDiseaseAttackDetail {
  disease_attack_type_id: number;
}
