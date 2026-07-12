## Why

The current Plant Scan UI is a mock prototype using a fake blur meter, random analysis timeouts, and hardcoded AI diagnosis results. Now that the backend Plant Scan API is fully implemented and hardened (via `harden-plant-scan-api`), we need to connect the frontend to the real backend endpoints to allow users to take real photos and receive actual AI plant diagnoses.

## What Changes

- Replace the static mock viewfinder with a native HTML file input `<input type="file" accept="image/*" capture="environment" />` to trigger the device camera.
- Remove the fake Laplacian blur variance interval and the `setTimeout` analysis simulation.
- Create an API mutation for `POST /api/v1/plant-scans` using `multipart/form-data`.
- Map the backend's returned JSON (disease name, confidence, symptoms, treatment, warnings, and URLs) directly into the existing UI components.
- Handle different backend statuses (`completed`, `cached`, `failed`) and map backend specific error codes (like `SCAN_IMAGE_BLURRY`, `SCAN_QUOTA_EXCEEDED`, etc.) to user-friendly UI messages.

## Capabilities

### New Capabilities
- `plant-scan-ui-integration`: Real camera upload flow, API mutation, and response mapping for the Plant Scan feature.

### Modified Capabilities
- 

## Impact

- **Affected Code**: `src/pages/PlantScan.tsx` and related API/state files in `farmy-fe`.
- **Dependencies**: Depends on the backend API contract being strictly frozen by the `harden-plant-scan-api` change.
- **UX**: The visual design of the page will remain mostly the same, but the data will become dynamic and error states will be appropriately handled.
