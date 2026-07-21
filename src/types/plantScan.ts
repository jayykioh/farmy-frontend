export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type PlantScanErrorCode =
  | 'SCAN_INVALID_FILE'
  | 'SCAN_INVALID_INPUT'
  | 'SCAN_IMAGE_BLURRY'
  | 'SCAN_QUOTA_EXCEEDED'
  | 'AI_SCAN_QUOTA_BUSY'
  | 'NOT_A_PLANT_IMAGE'
  | 'PLANT_SCAN_PERSISTENCE_FAILED'
  | 'SCAN_NOT_FOUND'
  | 'INVALID_IMAGE_TYPE'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'LLM_ERROR'
  | 'UNKNOWN';

export interface ApiError {
  success: false;
  errorCode: PlantScanErrorCode;
  message: string;
}

export interface PlantTreatment {
  chemical?: string;
  organic?: string;
  phi_warning?: string | null;
  safety_alert?: string | null;
}

export interface PlantDiagnosis {
  is_plant: boolean;
  disease_name?: string;
  confidence: number;
  symptoms: string[];
  treatment: PlantTreatment;
  low_confidence_warning?: string | null;
  disclaimer: string;
}

export interface PlantScanResult {
  scan_id: string;
  status: 'completed' | 'cached';
  crop_type: string;
  diagnosis?: PlantDiagnosis;
  image_url?: string;
  thumbnail_url?: string;
  cache_hit_from_scan_id?: string | null;
  created_at?: string;
}

export interface PlantScanHistoryResponse {
  items: PlantScanResult[];
  total: number;
}
