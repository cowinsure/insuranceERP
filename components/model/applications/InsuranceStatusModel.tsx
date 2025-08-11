interface InsuranceStatus {
  is_active: boolean;
  created_at: string | null;  // null or ISO date string
  created_by: number;
  modified_at: string | null; // null or ISO date string
  modified_by: number | null;
  status_name: string;
  insurance_status_id: number;
}