# Feature Flow Overview

## Flow lien mach (Diary + PlantScan + Reminder + Pet + Chat)

1) User tao diary thu cong hoac scan anh.
2) PlantScan: Vision chan doan, luu scan vao Mongo.
3) Diary: tim entry_date + cropType:
   - co -> append related_scan_ids
   - chua co -> tao entry moi
4) Reminder: rule-based sinh viec can lam tu treatment.
5) Pet: cap nhat streak/mood theo diary va completion.
6) UI: hien ket qua scan + checklist + pet mood.
7) User "Hoi them": ChatModule dung scanId -> tra loi va luu log.

## Giai thich lien ket
- PlantScan -> Diary: gop scan vao entry ngay.
- Diary -> Reminder: checklist theo entry.
- Reminder -> Pet: hoan thanh som tang mood.
- PlantScan -> Chat: reuse ket qua scan.
