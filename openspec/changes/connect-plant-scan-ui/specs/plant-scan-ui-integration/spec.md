## ADDED Requirements

### Requirement: Camera/Image Upload Flow
The system MUST allow users to select an image from their device (or take a new photo via the native camera) using an HTML file input, replacing the static mock viewfinder.

#### Scenario: User selects a photo
- **WHEN** the user clicks the upload button on the Plant Scan page
- **THEN** their device's native file chooser (or camera interface) SHOULD open, allowing them to capture or select a valid image file.

### Requirement: Plant Scan API Integration
The system MUST send the selected image as `multipart/form-data` to the `POST /api/v1/plant-scans` endpoint instead of using fake timeouts. The frontend MUST type the response as `ApiSuccess<PlantScanResult>` and access the scan data via `response.data`, not `response.scan_id` directly.

The frontend TypeScript types MUST match the frozen backend contract:

```ts
interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  errorCode: PlantScanErrorCode;
  message: string;
}

type PlantScanErrorCode =
  | 'SCAN_INVALID_FILE'
  | 'SCAN_INVALID_INPUT'
  | 'SCAN_IMAGE_BLURRY'
  | 'SCAN_QUOTA_EXCEEDED'
  | 'AI_SCAN_QUOTA_BUSY'
  | 'NOT_A_PLANT_IMAGE'
  | 'PLANT_SCAN_PERSISTENCE_FAILED'
  | 'SCAN_NOT_FOUND'
  | 'UNKNOWN';

interface PlantTreatment {
  chemical?: string;
  organic?: string;
  phi_warning?: string | null;
  safety_alert?: string | null;
}

interface PlantDiagnosis {
  is_plant: boolean;
  disease_name?: string;
  confidence: number;
  symptoms: string[];
  treatment: PlantTreatment;
  low_confidence_warning?: string | null;
  disclaimer: string;
}

interface PlantScanResult {
  scan_id: string;
  status: 'completed' | 'cached';
  crop_type: string;
  diagnosis?: PlantDiagnosis;
  image_url?: string;
  thumbnail_url?: string;
  cache_hit_from_scan_id?: string | null;
}
```

The frontend MUST implement an `extractPlantScanErrorCode(error: unknown): PlantScanErrorCode` helper that uses type guards to read the error code from `error.response.data.errorCode` (Axios-like), `error.data.errorCode` (RTK Query), or safely returns `'UNKNOWN'` for network/unrecognized errors.

#### Scenario: User submits an image
- **WHEN** the user confirms the selected image and initiates the scan
- **THEN** the UI MUST transition to an "analyzing" loading state and invoke the backend mutation with the image file and `crop_type`.

### Requirement: Rendering API Results
The system MUST accurately map the backend JSON response to the UI fields, including disease name, confidence (as a percentage), symptoms, treatments, warnings, and disclaimer.

#### Scenario: API returns a successful diagnosis
- **WHEN** the backend returns `{ success: true, data: { status: 'completed', diagnosis: {...}, image_url, thumbnail_url } }`
- **THEN** the UI MUST read from `response.data` (not `response` directly)
- **THEN** the UI MUST display `diagnosis.disease_name`, `diagnosis.treatment.chemical`, `diagnosis.treatment.organic`
- **THEN** the confidence bar MUST reflect `Math.round(diagnosis.confidence * 100)` as a percentage
- **THEN** the UI MUST render `diagnosis.disclaimer` always
- **THEN** if `diagnosis.treatment.phi_warning` is set, the UI MUST render it clearly as a PHI caution
- **THEN** if `diagnosis.treatment.safety_alert` is set, the UI MUST render it as a danger/banned pesticide warning
- **THEN** if `diagnosis.low_confidence_warning` is set, the UI MUST render it visibly to alert user
- **THEN** the image preview MUST use `data.image_url` or `data.thumbnail_url` — never `image_key` or `thumbnail_key`

#### Scenario: API returns a cached result
- **WHEN** the backend returns `{ success: true, data: { status: 'cached', cache_hit_from_scan_id: '...' } }`
- **THEN** the UI MUST display the result card identically to a `completed` result
- **THEN** the UI MAY show a small non-intrusive note such as "Kết quả từ lần quét gần đây" to indicate the result is cached.

### Requirement: Error Handling and Fallbacks
The system MUST map backend error codes to user-friendly UI messages and gracefully handle network failures without crashing.

#### Scenario: Image is blurry
- **WHEN** `extractPlantScanErrorCode(error)` returns `SCAN_IMAGE_BLURRY`
- **THEN** the UI MUST prompt the user to retake a clearer photo and allow them to re-select.

#### Scenario: Image is not a plant
- **WHEN** `extractPlantScanErrorCode(error)` returns `NOT_A_PLANT_IMAGE`
- **THEN** the UI MUST inform the user that Bé Thóc only analyzes plant photos.

#### Scenario: User quota exceeded
- **WHEN** `extractPlantScanErrorCode(error)` returns `SCAN_QUOTA_EXCEEDED`
- **THEN** the UI MUST tell the user their daily scan quota is used up.

#### Scenario: AI system is busy
- **WHEN** `extractPlantScanErrorCode(error)` returns `AI_SCAN_QUOTA_BUSY`
- **THEN** the UI MUST tell the user the AI is busy and ask them to retry in a few minutes.

#### Scenario: Upload/persistence failure
- **WHEN** `extractPlantScanErrorCode(error)` returns `PLANT_SCAN_PERSISTENCE_FAILED`
- **THEN** the UI MUST tell the user the upload failed and ask them to retry.

#### Scenario: Invalid image file
- **WHEN** `extractPlantScanErrorCode(error)` returns `SCAN_INVALID_FILE`
- **THEN** the UI MUST ask the user to upload a valid JPG, PNG, or WebP image under 5MB.

#### Scenario: Unknown error
- **WHEN** `extractPlantScanErrorCode(error)` returns `UNKNOWN`
- **THEN** the UI MUST show a generic retry message without crashing or rendering `undefined`.
