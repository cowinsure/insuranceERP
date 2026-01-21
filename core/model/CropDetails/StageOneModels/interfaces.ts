export interface ChemicalItem {
  chemical_usage_id?: number;
  chemical_type_id?: number;
  chemical_name: string;
  qty: number;
  qty_unit?: string;
  remarks?: string;
}

export interface WeatherEffect {
  weather_effect_type_id: number;
  remarks: string;
  is_active: boolean;
}

export interface WeatherData {
  remarks?: string;
  weather_effects: WeatherEffect[];
  date_from?: string;
  date_to?: string;
}

export interface AttachmentItem {
  attachment_details_id: number;
  stage_id: number | null;
  attachment_path: string; // base64
  remarks: string;
}

export interface AddCropData {
  seed: any[];
  cultivation: any;
  history: any;
  weather: WeatherData;
  pests: any[];
  diseases: any[];
  chemicals: {
    fertilizers: ChemicalItem[];
    pesticides: ChemicalItem[];
  };
  attachments: AttachmentItem[];
  // 🆕 Optional preview-only fields
  pestDetails?: { id: number; name: string }[];
  diseaseDetails?: { id: number; name: string }[];
  // 🆕 NEW
  diseaseControlId?: number | null;
  neighbourFieldStatusId?: number | null;
}

export interface AddCropDetailsModalProps {
  crop: any;
  onClose: (payload?: any) => void;
}