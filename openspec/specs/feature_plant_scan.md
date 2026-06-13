# PlantScan Module Feature Spec

## Muc tieu
- Chan doan benh tu anh cay trong.
- Tra ve ket qua + goi y dieu tri + canh bao an toan.
- Luu scan, gan vao diary theo ngay, sinh reminder.

## Du lieu chinh
- Mongo: plant_scans
- Truong can co:
  - userId (uuid)
  - imageUrl (string)
  - pHash (string)
  - cropType (string)
  - diagnosis { disease, confidence, symptoms[], treatment[], phiWarning, safetyAlert, lowConfidenceWarning, similarCases[] }
  - modelUsed, visionPromptVersion
  - userConfirmed (bool), feedback (string)
  - diaryEntryId (uuid, nullable)
  - createdAt, updatedAt

## API de xuat
- POST /plant-scan
- GET /plant-scan?date=YYYY-MM-DD&cropType=xxx
- GET /plant-scan/phash?pHash=xxx

## Logic chinh
- Upload anh -> goi Vision -> nhan diagnosis.
- Luu plant scan vao Mongo.
- Tim diary entry theo entry_date + cropType:
  - co -> update related_scan_ids
  - chua co -> tao diary entry moi
- Rule-based sinh reminder tu diagnosis.treatment.

## UI lien quan
- Trang scan: chon cropType, upload anh, xem ket qua.
- Nut "Hoi them" -> mo Chat va gui scanId.
- Ket qua co checklist viec can lam.

## Lien ket
- Diary: gan scan vao entry ngay.
- Reminder: auto tao theo treatment.
- Chat: dung scanId de tu van tiep.
