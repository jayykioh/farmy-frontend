# FarmDiaries AI — EmbeddingModule Specification
### text-embedding-004 · Chunk Strategy · BullMQ Async Trigger · Atlas Vector Search

| Thuộc tính | Giá trị |
|---|---|
| **Dự án** | FarmDiaries AI (SDN392 Capstone Project) |
| **Tài liệu** | EmbeddingModule Specification |
| **Đường dẫn** | `openspec/specs/embedding_spec.md` |
| **Trạng thái** | Active · specs folder |

---

> **MongoDB-first update:** Embeddings should be stored in MongoDB collections and queried through MongoDB Atlas Vector Search. Treat older PostgreSQL/pgvector references in this file as legacy wording.

## 1. Mục đích & Phạm vi (Purpose & Scope)

`EmbeddingModule` là module trung tâm chịu trách nhiệm **chuyển đổi văn bản thành vector 768 chiều** bằng Google `text-embedding-004` và lưu vào MongoDB collection `memory_embeddings` hoặc `knowledge_chunks` có Atlas Vector Search index. Module này là nền tảng cho toàn bộ tính năng RAG của hệ thống.

Module phục vụ 2 nguồn dữ liệu chính:
1. **Diary Entries** — Nhật ký nông trại của nông dân (real-time, async via BullMQ)
2. **Knowledge Docs** — Tài liệu kỹ thuật nông nghiệp do Admin upload (batch embed)

---

## 2. Chiến lược Phân đoạn Văn bản (Chunk Strategy)

### 2.1 Quy tắc chung

```typescript
// Trước khi embed, luôn áp dụng pre-processing:
function preprocessText(text: string): string {
  return text.trim().replace(/\s+/g, ' '); // Normalize whitespace
}
```

### 2.2 Phân đoạn Diary Notes

| Điều kiện | Chiến lược | Mô tả |
|---|---|---|
| `notes.length < 20` chars (sau trim) | **Skip** | Văn bản quá ngắn, không có giá trị semantic. Không tạo embedding, không insert vào `memory_embeddings`. |
| `20 <= notes.length < 500` chars | **Embed toàn bộ** | Coi toàn bộ `notes` là 1 chunk duy nhất. |
| `notes.length >= 500` chars | **Sliding Window** | Chia thành các chunk 300 chars, bước trượt 100 chars (overlap 200 chars). Tối đa 10 chunks/entry. |

```typescript
function chunkText(text: string): string[] {
  const WINDOW = 300;
  const STEP = 100;
  const MAX_CHUNKS = 10;

  if (text.length < 20) return []; // Skip — quá ngắn
  if (text.length < 500) return [text]; // Embed toàn bộ

  // Sliding Window
  const chunks: string[] = [];
  for (let i = 0; i < text.length && chunks.length < MAX_CHUNKS; i += STEP) {
    chunks.push(text.slice(i, i + WINDOW));
  }
  return chunks;
}
```

### 2.3 Phân đoạn Knowledge Docs

Knowledge Docs được Admin upload là các tài liệu dài (sách kỹ thuật, hướng dẫn canh tác). Áp dụng **Sliding Window** cố định:
- **Window size:** 500 chars
- **Step size:** 150 chars (overlap 350 chars — để không mất context câu dở dang)
- **Tối đa:** 50 chunks/document

---

## 3. Cơ chế Kích hoạt (Trigger Mechanism)

### 3.1 Trigger khi tạo Diary Entry mới

```typescript
// DiaryService.create() → sau khi tạo document thành công trong MongoDB:
await this.embedQueue.add(
  'embed_diary',
  { diaryId: newEntry.id, userId: newEntry.userId },
  { priority: 3, attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
);
// Queue: 'embed_queue' | Priority: 3 (thấp hơn chat=1 và plant-scan=2)
```

### 3.2 Trigger khi cập nhật Diary Entry

```typescript
// DiaryService.update() → chỉ trigger re-embed nếu 'notes' hoặc 'cropType' thay đổi:
const shouldReEmbed = (
  updateDto.notes !== undefined ||
  updateDto.cropType !== undefined
);

if (shouldReEmbed) {
  // 1. Xóa embedding cũ (đánh dấu inactive)
  await this.memoryEmbeddingRepo.update(
    { sourceId: diaryId },
    { isActive: false }
  );
  // 2. Đưa job re-embed mới vào queue
  await this.embedQueue.add('embed_diary', { diaryId, userId }, { priority: 3 });
}
```

> **Lý do dùng `isActive = false` thay vì DELETE ngay:** Tránh race condition nếu query RAG đang chạy song song. Background cleanup job sẽ DELETE các bản ghi `isActive = false` sau 24 giờ.

### 3.3 Trigger khi Soft-delete Diary Entry

```typescript
// DiaryService.softDelete() → đánh dấu embedding tương ứng là inactive:
await this.memoryEmbeddingRepo.update(
  { sourceId: diaryId },
  { isActive: false }
);
// Không cần tạo job embed mới — cascade deactivate là đủ
```

### 3.4 Trigger khi Admin upload Knowledge Doc

```typescript
// KnowledgeService.create() → sau khi INSERT thành công:
await this.embedQueue.add(
  'embed_knowledge',
  { knowledgeDocId: newDoc.id },
  { priority: 5, attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
);
// Priority 5 (thấp nhất) — batch embed không urgent
```

---

## 4. Cập nhật Schema `memory_embeddings`

Cần thêm column `is_active` để hỗ trợ soft-deactivate:

```sql
ALTER TABLE memory_embeddings
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Index để RAG query chỉ lấy embedding active:
CREATE INDEX idx_memory_embeddings_active
ON memory_embeddings (source_id, is_active)
WHERE is_active = TRUE;
```

> **Lưu ý quan trọng:** Tất cả RAG query trong [ai_chat_spec.md](file:///d:/coding/farmdiary/openspec/specs/ai_chat_spec.md) bắt buộc thêm `AND is_active = TRUE` vào WHERE clause.

---

## 5. EmbedWorker — Xử lý BullMQ Job

```typescript
@Processor('embed_queue')
export class EmbedWorker {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly diaryRepo: DiaryRepository,
    private readonly knowledgeRepo: KnowledgeDocRepository,
    private readonly memoryEmbedRepo: MemoryEmbeddingRepository,
  ) {}

  @Process('embed_diary')
  async handleDiaryEmbed(job: Job<{ diaryId: string; userId: string }>) {
    const diary = await this.diaryRepo.findOne(job.data.diaryId);
    if (!diary || diary.isDeleted) return; // Skip nếu đã bị xóa

    const chunks = chunkText(preprocessText(diary.notes ?? ''));
    if (chunks.length === 0) return; // Skip nếu notes quá ngắn

    // Check embedding quota trước khi gọi API
    const canEmbed = await this.embeddingService.checkEmbedLimit();
    if (!canEmbed) throw new Error('Embed quota exceeded — BullMQ sẽ retry');

    for (const chunk of chunks) {
      const vector = await this.embeddingService.embed(chunk); // text-embedding-004
      await this.memoryEmbedRepo.upsert({
        sourceId: diary.id,
        sourceType: 'diary_entry',
        sourceModel: 'text-embedding-004',
        embedding: vector,
        chunkText: chunk,
        metadata: { cropType: diary.cropType, growthStage: diary.growthStage },
        isActive: true,
      });
    }
  }

  @Process('embed_knowledge')
  async handleKnowledgeEmbed(job: Job<{ knowledgeDocId: string }>) {
    // Logic tương tự — chunk với window=500/step=150, embed từng chunk
  }
}
```

---

## 6. Kịch bản Kiểm thử (Testing Checklist)

- [ ] **TC-EMBED-01:** Tạo diary entry với `notes = "Tưới"` (< 20 chars) → Verify **không có** bản ghi nào được insert vào `memory_embeddings`.
- [ ] **TC-EMBED-02:** Tạo diary entry với notes bình thường (50 chars) → Verify BullMQ job được thêm vào `embed_queue` với `priority=3`, sau đó 1 bản ghi embedding được tạo.
- [ ] **TC-EMBED-03:** Tạo diary entry với notes dài 600 chars → Verify có **nhiều hơn 1** bản ghi embedding (sliding window chunks) trong `memory_embeddings`.
- [ ] **TC-EMBED-04:** PUT `/diary/:id` thay đổi `notes` → Verify bản ghi `memory_embeddings` cũ bị đánh dấu `isActive=false` trước khi embedding mới được tạo.
- [ ] **TC-EMBED-05:** DELETE `/diary/:id` (soft delete) → Verify toàn bộ `memory_embeddings` của diary đó bị đánh dấu `isActive=false`.
- [ ] **TC-EMBED-06:** Admin upload Knowledge Doc → Verify job `embed_knowledge` được push vào queue với `priority=5`.
- [ ] **TC-EMBED-07:** RAG query trong chat → Verify chỉ trả về kết quả có `isActive=TRUE`.
