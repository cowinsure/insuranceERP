export interface InsuranceClaim {
  id: number;
  reason: string;
  remarks: string;
  claim_date: string; // ISO date string (e.g., "2025-08-07")
  created_at: string; // ISO date-time string
  is_claimed: boolean;
  updated_at: string; // ISO date-time string
  view_count: number;
  period_name: string;
  sum_insured: number;
  claim_muzzle: string;
  claim_status: "claim_pending" | "claim_approved" | "claim_rejected" | string;
  product_terms: string | null;
  reference_id: string;
  created_by_id: number;
  updated_by_id: number | null;
  amount_claimed: number | null;
  claim_doc_file: string;
  premium_amount: number;
  processed_date: string | null; // ISO date string or null
  amount_approved: number | null;
  claim_file_name: string;
  insurance_agent: string | null;
  insurance_number: string;
  insurance_status: "active" | "inactive" | "expired" | string;
  insured_asset_id: number;
  rejection_reason: string | null;
  insurance_type_id: number;
  asset_insurance_id: number;
  insurance_category: string;
  insurance_end_date: string; // ISO date string
  premium_percentage: number;
  insurance_period_id: number;
  insurance_type_name: string;
  insurance_company_id: number;
  insurance_product_id: number;
  insurance_start_date: string; // ISO date string
  settlement_documents: string;
  claim_doc_uploaded_at: string; // ISO date-time string
  insurance_category_id: number;
  insurance_certificate: string;
  insurance_provider_id: number;
  renewal_reminder_sent: boolean;
  insurance_company_name: string;
  insurance_company_user_id: number;
}
