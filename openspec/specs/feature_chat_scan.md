# Chat Integration for PlantScan Feature Spec

## Muc tieu
- Cho phep "Hoi them" tren ket qua scan.
- Tai su dung ket qua scan de chat tiep ma khong can vision lai.

## Du lieu chinh
- Chat message them:
  - scan_id (string, nullable)
  - context_type (enum: scan | general)

## Flow chinh
- UI bam "Hoi them" -> gui scanId + question.
- Backend lay PlantScan -> build prompt (disease, confidence, treatment, warning).
- ChatModule tra loi va luu message gan scanId.

## UI lien quan
- Nut "Hoi them" tren trang ket qua scan.
- Hien thi nguon scan trong chat log.

## Lien ket
- PlantScan: lay du lieu scan lam context.
