# Pet Module Feature Spec

## Muc tieu
- Tao dong luc ghi nhat ky hang ngay.
- Mood thay doi theo streak va hoan thanh reminder.

## Du lieu chinh
- Bang/Entity: pet_state (PostgreSQL)
- Truong can co:
  - user_id (uuid)
  - mood (enum: happy | neutral | sad | worried | excited)
  - streak_count (int)
  - last_diary_at (timestamptz)
  - mood_reason (text, nullable)
  - updated_at

## Logic chinh
- Khi tao diary entry trong ngay -> tang streak neu hom truoc co entry.
- Khi bo qua nhieu ngay -> giam mood.
- Hoan thanh reminder som -> mood tang (excited/happy).
- Bo nhac nho qua gio -> mood giam (worried/sad).

## UI lien quan
- Pet hien thi trang thai (icon/animation).
- Co thong diep ngan tuong ung mood.

## Lien ket
- Diary: cap nhat streak.
- Reminder: cap nhat mood theo tinh trang hoan thanh.
