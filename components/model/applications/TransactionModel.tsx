export interface Transaction {
  id: number;
  amount: number;
  trx_id: string;
  remarks: string | null;
  trx_date: string; // format: YYYY-MM-DD
  trx_type: string; // e.g., "cash"
  created_at: string; // ISO datetime string
  sum_insured: number;
  trx_through: string; // e.g., "bank"
  created_by_id: number;
  insurance_number: string;
  insurance_status: string; // e.g., "under_review"
  asset_insurance_id: number;
  insurance_company_name: string;
  transaction_document: string;
}
