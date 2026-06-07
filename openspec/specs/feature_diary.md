# Diary Module Feature Spec

## Muc tieu
- Ghi nhat ky canh tac theo ngay va theo cropType.
- Luu vet plant scan va checklist viec can lam.
- Lam nguon du lieu cho Pet, Reminder, Chat/RAG.

## Du lieu chinh
- Bang/Entity: diary_entries (PostgreSQL)
- Truong can co:
  - id (uuid)
  - user_id (uuid)
  - crop_type (text)
  - entry_date (date, yyyy-mm-dd)
  - notes (text, nullable)
  - photo_urls (text[])
  - related_scan_ids (text[])
  - source (enum: manual | scan)
  - watered, fertilized (bool)
  - weather (jsonb, nullable)
  - location_text (text, nullable)
  - is_deleted (bool)
  - created_at, updated_at (timestamptz)

## API de xuat
- GET /diary?date=YYYY-MM-DD&cropType=xxx
- GET /diary/:id
- POST /diary
- PATCH /diary/:id
- DELETE /diary/:id (soft delete)

## Logic chinh
- Quy tac 1 entry/ngay/cropType.
- Khi co plant scan, neu entry_date + crop_type da ton tai -> append related_scan_ids.
- Neu chua co -> tao entry moi va gan related_scan_ids.

## UI lien quan
- Lich ngay -> 1 diary entry/cropType.
- Ben trong entry: timeline scan theo gio + checklist reminder.

## Lien ket
- PlantScan: gan scan vao diary theo ngay.
- Reminder: hien thi cac viec can lam trong diary.
- Pet: streak thay doi theo viec ghi nhat ky va hoan thanh reminder.
