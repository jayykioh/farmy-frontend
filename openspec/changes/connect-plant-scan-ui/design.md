## Context

The current `PlantScan.tsx` frontend page relies on purely static/mocked data and timers to simulate a plant scan process. Meanwhile, the backend has implemented a robust, fully-functioning Plant Scan API (`harden-plant-scan-api`). This design document outlines how the frontend will integrate with that real API while maintaining the existing UI aesthetic.

## Goals / Non-Goals

**Goals:**
- Replace the mock analyzing timer with a real API mutation to `POST /api/v1/plant-scans`.
- Render the real data from the backend (confidence, disease name, symptoms, treatment, warnings) accurately in the UI.
- Use native file upload mechanisms (`<input type="file" accept="image/*" capture="environment" />`) that are proven to work on mobile browsers.
- Create user-friendly error states mapped directly from backend error codes.

**Non-Goals:**
- No custom WebRTC camera controls (MVP relies on native OS camera integrations via `capture="environment"`).
- No new screens for scanning history.
- No offline queueing or realtime progress events (WebSocket/SSE).

## Decisions

- **Upload Component**: Use a standard hidden `<input type="file" />` triggered by a styled button. When a file is selected, create a local preview URL using `URL.createObjectURL(file)` so the user can see what they're uploading before submission.
- **Form Data**: Use standard browser `FormData` to construct the payload with `image` and `crop_type` to avoid complex custom multipart boundaries.
- **State Management**: The component state `scanState` will be driven by the API request lifecycle (idle -> loading -> success/error) instead of `setTimeout`.
- **Error Handling Strategy**: Create an explicit mapping object or switch statement for backend error codes (e.g., `SCAN_IMAGE_BLURRY`, `SCAN_QUOTA_EXCEEDED`) to user-friendly UI strings. Any unhandled error will fall back to a generic retry message.
- **Result UI**: Keep the existing result card layout but bind the dynamic fields. If `status === 'cached'`, an additional small badge or note will be shown to indicate it's a recent matching result.

## Risks / Trade-offs

- **Risk: Mobile Camera Compatibility** -> *Trade-off*: Relying on `<input capture="environment">` delegates the camera UI to the OS. It may behave slightly differently between Android Chrome (opens camera directly) and iOS Safari (prompts to choose camera or photo library). This is an acceptable trade-off for MVP simplicity over building a complex WebRTC camera.
- **Risk: Slow Network Uploads** -> *Mitigation*: Ensure the "analyzing" MascotLottie state is shown *during* the API call so the user knows the upload/processing is happening.
