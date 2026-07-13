# Connect Plant Scan UI

Replace the mock PlantScan UI in `farmy-fe` with real API integration to the hardened backend contract.

## Open Questions

None at this time. The backend contract has been strictly verified.

## Proposed Changes

### `src/types/plantScan.ts`

- [NEW] Create this file to define the types exactly as specified in the frozen contract.
- Define `PlantScanErrorCode`, `PlantTreatment`, `PlantDiagnosis`, `PlantScanResult`, and `ApiError`.

### `src/api/plantScan.ts`

- [NEW] Create a helper function `extractPlantScanErrorCode(error: unknown): PlantScanErrorCode`.

### `src/store/api/farmApi.ts`

- [MODIFY] Add `uploadPlantScan` mutation using RTK Query `builder.mutation`.
- Specify the input as `FormData` (containing `image` file and `crop_type` string).
- Request URL: `POST /api/v1/plant-scans`.

### `src/pages/PlantScan.tsx`

- [MODIFY] Replace fake `setInterval` laplacian and random viewfinder.
- [MODIFY] Add hidden `<input type="file" accept="image/*" capture="environment" />`.
- [MODIFY] Add object URL preview mechanism for the chosen image (`URL.createObjectURL(file)` and `URL.revokeObjectURL(url)`).
- [MODIFY] On capture/upload, invoke the `uploadPlantScan` RTK Query mutation.
- [MODIFY] Tie the `analyzing` state to `isLoading`.
- [MODIFY] Render real diagnosis results from `response.data`, mapping fields such as confidence percentage, warning badges (`safety_alert`, `phi_warning`, `low_confidence_warning`).
- [MODIFY] Map error codes (using `extractPlantScanErrorCode`) to informative error messages via `alert()` or UI states (e.g. `SCAN_IMAGE_BLURRY`, `AI_SCAN_QUOTA_BUSY`).
- [MODIFY] Replace mock preview with real `data.image_url` or `data.thumbnail_url`.

## Verification Plan

### Automated Tests
- Run `npm test` locally if any UI tests exist for the page, or write new ones as requested in section 5 of the tasks.

### Manual Verification
- Start the frontend, navigate to `/scan`, choose an image.
- Ensure the mock "analyzing" no longer runs on timeout.
- Verify the network tab sends `multipart/form-data` to `/api/v1/plant-scans`.
- Verify the UI maps backend diagnosis response accurately without errors.
- Verify error codes fall back correctly.
