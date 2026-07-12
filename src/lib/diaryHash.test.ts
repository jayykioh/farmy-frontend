import { describe, expect, it } from 'vitest';
import { buildCanonicalDiaryJson, createDiaryRequestHash } from './diaryHash';

describe('diaryHash', () => {
  it('builds the canonical JSON fixture with A-Z keys and NFC text', () => {
    const json = buildCanonicalDiaryJson({
      diaryId: 'diary-1',
      activityType: 'Tưới nước',
      content: 'Café cây lúa',
      diaryDate: '2026-07-12T03:30:00.000Z',
      cropType: 'Lúa',
      imageDigests: ['abc', 'def'],
    });

    expect(json).toBe(
      '{"activityType":"Tưới nước","content":"Café cây lúa","cropType":"Lúa","diaryDate":"2026-07-12T03:30:00.000Z","diaryId":"diary-1","imageDigests":["abc","def"]}',
    );
  });

  it('matches the shared SHA-256 lowercase hex fixture', async () => {
    await expect(
      createDiaryRequestHash({
        diaryId: 'diary-1',
        activityType: 'Tưới nước',
        content: 'Café cây lúa',
        diaryDate: new Date('2026-07-12T03:30:00.000Z'),
        cropType: 'Lúa',
        imageDigests: ['abc', 'def'],
      }),
    ).resolves.toBe('751d61c46cb61b9a2655ec3da754a50d2fe5be31da64d776f75b8333d732ba36');
  });
});
