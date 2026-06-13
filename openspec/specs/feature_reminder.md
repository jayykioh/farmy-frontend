# Reminder Module Feature Spec

## Muc tieu
- Nhac nho theo khung gio sang/trua/chieu/toi.
- Tao checklist viec can lam tu PlantScan va Diary.
- Ho tro hoan thanh som va cap nhat Pet mood.

## Du lieu chinh
- Bang/Entity: reminders (PostgreSQL)
- Truong can co:
  - id (uuid)
  - user_id (uuid)
  - diary_entry_id (uuid)
  - scan_id (string, nullable)
  - type (enum: diary, water, fertilize, weekly_insight, streak_milestone, plant_alert)
  - action_type (text)
  - action_detail (text)
  - schedule_slot (enum: morning | noon | afternoon | evening)
  - scheduled_at (timestamptz)
  - status (pending | delivered | failed | cancelled)
  - completed_at (timestamptz, nullable)
  - retry_count
  - created_at

## API de xuat
- POST /reminder
- GET /reminder/pending
- PATCH /reminder/:id/complete

## Rule-based (vi du)
- treatment co "tuoi" -> schedule_slot = morning.
- treatment co "phun" -> schedule_slot = afternoon.
- treatment co "theo doi" -> tao daily reminder 2-3 ngay.
- treatment co "sau X ngay" -> scheduled_at = today + X days.

## UI lien quan
- Checklist viec can lam trong diary.
- Lich nhac theo khung gio kieu Duolingo.

## Lien ket
- PlantScan: auto tao reminder tu treatment.
- Diary: hien thi checklist.
- Pet: hoan thanh som -> mood tot hon.
