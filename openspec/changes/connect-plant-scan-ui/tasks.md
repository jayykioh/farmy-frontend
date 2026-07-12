## 0. Backend Contract Freeze Gate (MUST complete before any coding)

- [x] 0.1 Read the `Backend Contract Freeze Report` produced from `harden-plant-scan-api` (task 5.1–5.8 in that change's `tasks.md`).
- [x] 0.2 Confirm the exact response wrapper format: success path is `{ success: true, data: PlantScanResult }` and error path is `{ success: false, errorCode, message }`.
- [x] 0.3 Confirm the final list of `errorCode` values from the backend report and update `PlantScanErrorCode` union type if any differ from the spec.
- [x] 0.4 If backend contract in the report differs from the frontend spec — STOP, update the frontend spec first before implementing.

## 1. Preparation and API Client Setup

- [x] 1.1 Create or update the API mutation/hook (e.g. `useUploadPlantScanMutation`) pointing to `POST /api/v1/plant-scans`.
- [x] 1.2 Define TypeScript types exactly as specified in the spec: `ApiSuccess<PlantScanResult>`, `ApiError`, `PlantScanErrorCode`, `PlantDiagnosis`, `PlantTreatment` (treatment as object with `chemical`, `organic`, `phi_warning`, `safety_alert`).
- [x] 1.3 Implement `extractPlantScanErrorCode(error: unknown): PlantScanErrorCode` helper using type guards to support both RTK Query (`error.data.errorCode`) and Axios (`error.response.data.errorCode`) shapes, falling back to `'UNKNOWN'` safely.

## 2. UI Refactoring for Input

- [x] 2.1 Remove the static mockup viewfinder image and the fake Laplacian variance (blur) `setInterval` logic from `PlantScan.tsx`.
- [x] 2.2 Add a hidden `<input type="file" accept="image/*" capture="environment" />` element triggered by the "Scan" / "Capture" button.
- [x] 2.3 Implement local file selection state and use `URL.createObjectURL` to show a preview of the selected image.
- [x] 2.4 Call `URL.revokeObjectURL` when the component unmounts or when a new image is selected to prevent memory leaks.

## 3. Connecting to the Backend

- [x] 3.1 Replace the fake `setTimeout` analyzing logic with the real API mutation call using `FormData` (appending `image` and `crop_type`).
- [x] 3.2 Tie the "analyzing" UI state (MascotLottie animation) directly to the API request's `isLoading` status.
- [x] 3.3 Ensure network errors or timeout exceptions fall back gracefully, avoiding app crashes.

## 4. Mapping Results and Error States

- [x] 4.1 Update the `result` UI state to display dynamic data accessed via `response.data` (not `response`): render `data.diagnosis.disease_name`, `data.diagnosis.confidence` as `Math.round(confidence * 100)%`, `data.diagnosis.symptoms`, `data.diagnosis.treatment.chemical`, `data.diagnosis.treatment.organic`.
- [x] 4.2 Render all warning/disclaimer fields: `diagnosis.disclaimer` (always), `treatment.phi_warning` (PHI caution badge), `treatment.safety_alert` (danger badge for banned pesticides), `diagnosis.low_confidence_warning` (accuracy caution).
- [x] 4.3 Implement `extractPlantScanErrorCode`-based error handling: map all 8 error codes to distinct user-facing strings; never render `undefined` to the user; network failures fall back to generic retry message.
- [x] 4.4 Handle `status === 'cached'` response: render same result card, add optional subtle "Kết quả từ lần quét gần đây" note.
- [x] 4.5 Verify mobile camera invocation on Android Chrome and iOS Safari and confirm image preview renders from `data.image_url` or `data.thumbnail_url` (not internal keys).

## 5. Frontend Automated Tests

- [x] 5.1 Write unit tests for `extractPlantScanErrorCode` covering RTK, Axios, and unknown network error shapes.
- [x] 5.2 Mock `completed` response: verify component successfully renders `diagnosis.disease_name` and `diagnosis.treatment.chemical`.
- [x] 5.3 Mock `cached` response: verify component renders the result and optionally the cached badge.
- [x] 5.4 Mock `SCAN_IMAGE_BLURRY` error: verify component renders the retake photo message.
- [x] 5.5 Mock `UNKNOWN` error: verify component does not crash and displays generic retry message.
- [x] 5.6 Write a test to verify that `FormData` correctly appends the `image` blob and `crop_type`.
- [x] 5.7 Verify that `URL.revokeObjectURL` is called appropriately (via spy/mock).
