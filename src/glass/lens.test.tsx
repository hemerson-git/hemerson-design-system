import { describe, expect, it } from "vitest";
import { lensDisplacementMap, lensSettings } from "./lens";

// Where feDisplacementMap samples the backdrop for each pixel along one row
function sourcePositions(width: number, height: number, radius: number, y: number) {
  const { rim, scale } = lensSettings(height);
  const map = lensDisplacementMap(width, height, radius, rim);
  return Array.from({ length: width }, (_, x) => x + scale * (map[(y * width + x) * 4] / 255 - 0.5));
}

describe("lens displacement map", () => {
  it("leaves the middle of the shape untouched", () => {
    const map = lensDisplacementMap(200, 56, 28, 16);
    const center = (28 * 200 + 100) * 4;

    expect([map[center], map[center + 1]]).toEqual([128, 128]);
  });

  it("samples from further inside near the edges, in both directions", () => {
    const width = 200;
    const height = 56;
    const map = lensDisplacementMap(width, height, 28, 16);
    const row = 28;

    // Right edge: red below 128 shifts the sample left, inwards; left edge: the reverse
    expect(map[(row * width + width - 1) * 4]).toBeLessThan(128);
    expect(map[(row * width + 0) * 4]).toBeGreaterThan(128);
    // Top edge, away from the corners: green above 128 shifts the sample down, inwards
    expect(map[(0 * width + 100) * 4 + 1]).toBeGreaterThan(128);
  });

  it("never mirrors content: samples keep their order across every row", () => {
    for (const [width, height, radius] of [
      [600, 56, 28],
      [220, 220, 110],
      [320, 120, 24],
    ]) {
      for (const y of [0, Math.floor(height / 4), Math.floor(height / 2), height - 1]) {
        const positions = sourcePositions(width, height, radius, y);
        for (let x = 1; x < width; x++) {
          expect(positions[x], `${width}×${height} row ${y} at x=${x}`).toBeGreaterThan(positions[x - 1]);
        }
      }
    }
  });

  it("caps the shift at 45% of the rim", () => {
    for (const height of [40, 56, 120, 400]) {
      const { rim, maxShift } = lensSettings(height);
      const positions = sourcePositions(300, height, 12, Math.floor(height / 2));
      const largest = Math.max(...positions.map((position, x) => Math.abs(position - x)));

      expect(maxShift).toBeCloseTo(rim * 0.45);
      expect(largest).toBeLessThanOrEqual(maxShift + 0.01);
    }
  });

  it("keeps the rim within a third of short shapes and at most 16px", () => {
    expect(lensSettings(30).rim).toBe(10);
    expect(lensSettings(56).rim).toBe(16);
    expect(lensSettings(600).rim).toBe(16);
  });
});
