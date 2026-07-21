import { describe, expect, it } from 'vitest';
import { getImageQuality } from './PlantScan';

describe('PlantScan image evidence quality', () => {
  it('blocks very small images from analysis', () => {
    expect(getImageQuality({ size: 5 }).usable).toBe(false);
  });

  it('accepts a normal camera image', () => {
    const quality = getImageQuality({ size: 1_200_000 });
    expect(quality.usable).toBe(true);
    expect(quality.score).toBeGreaterThanOrEqual(85);
  });

  it('caps the display score below 100 because it is an input-quality score', () => {
    expect(getImageQuality({ size: 20_000_000 }).score).toBe(96);
  });
});
