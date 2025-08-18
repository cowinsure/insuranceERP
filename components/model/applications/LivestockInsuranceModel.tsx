interface LivestockInsurance {
  id: number;
  name: string;
  color: string;
  gender: string;
  remarks: string | null;
  asset_id: number;
  latitude: number;
  owner_id: number;
  longitude: number;
  status_id: number;
  weight_kg: number;
  asset_type: string;
  created_at: string; // ISO date string
  is_claimed: boolean;
  updated_at: string; // ISO date string
  view_count: number;
  period_name: string;
  sum_insured: number;
  product_terms: string | null;
  reference_id: string;
  special_mark: string;
  age_in_months: number;
  created_by_id: number;
  health_issues: string;
  updated_by_id: number | null;
  current_status: string;
  premium_amount: number;
  vaccine_status: string;
  insurance_agent: string | null;
  deworming_status: string;
  insurance_number: string;
  insurance_status: string;
  insurance_type_id: number;
  status_created_at: string; // Time string
  insurance_category: string;
  insurance_end_date: string; // ISO date string
  premium_percentage: number;
  insurance_period_id: number;
  insurance_type_name: string;
  last_deworming_date: string; // ISO date string
  insurance_company_id: number;
  insurance_product_id: number;
  insurance_start_date: string; // ISO date string
  insurance_category_id: number;
  insurance_certificate: string;
  insurance_provider_id: number;
  last_vaccination_date: string; // ISO date string
  renewal_reminder_sent: boolean;
  insurance_company_name: string;
  insurance_company_user_id: number;
}
