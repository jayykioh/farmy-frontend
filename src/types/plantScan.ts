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
  source_citation?: string | null;
  safe_immediate_actions?: string[];
}

export interface PossibleCause {
  name: string;
  matched_points: string[];
  uncertain_points: string[];
  confidence_level?: 'low' | 'medium' | 'high';
}

export interface ImageQualityInfo {
  score: number;
  status: 'poor' | 'fair' | 'usable' | 'good';
  checks: {
    is_enough_light: boolean;
    is_centered: boolean;
    is_blurry: boolean;
    tips: string[];
  };
}

export interface UserScanContext {
  organ?: string; // 'Lá' | 'Thân' | 'Quả' | 'Rễ'
  onset?: string; // 'Hôm nay' | 'Vài ngày' | 'Lâu'
  progress?: string; // 'Ổn định' | 'Lan chậm' | 'Lan nhanh'
  crop_type?: string;
  season_id?: string;
}

export interface PlantDiagnosis {
  is_plant: boolean;
  assessment_state?: 'insufficient_evidence' | 'no_clear_signs' | 'signs_to_monitor' | 'probable_issue' | 'expert_review_recommended';
  assessment_summary?: string;
  disease_name?: string;
  confidence: number;
  symptoms: string[];
  evidence_observed?: string[];
  possible_causes?: PossibleCause[];
  missing_evidence?: string[];
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
  additional_images?: string[];
  user_context?: UserScanContext;
  image_quality?: ImageQualityInfo;
  rag_sources?: string[];
  rag_degraded?: boolean;
  cache_hit_from_scan_id?: string | null;
  is_cached?: boolean;
  cached_at?: string;
  created_at?: string;
}

export interface PlantScanHistoryResponse {
  items: PlantScanResult[];
  total: number;
}
