/**
 * A displacement map for the edge lens: near the rim the backdrop is sampled from further
 * inside the shape, so content appears to bend towards the edge; the middle is untouched.
 *
 * Red holds the horizontal shift and green the vertical one, with 128 meaning "no shift".
 * The shift never exceeds `maxShift`, and `maxShift` stays below the rim width, so content
 * is compressed towards the edge but never flipped.
 */
export function lensDisplacementMap(width: number, height: number, radius: number, rim: number): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Distance to the edge of the rounded rectangle and the outward normal there
      const px = x + 0.5 - width / 2;
      const py = y + 0.5 - height / 2;
      const qx = Math.abs(px) - (width / 2 - r);
      const qy = Math.abs(py) - (height / 2 - r);
      let distance: number;
      let nx = 0;
      let ny = 0;

      if (qx > 0 && qy > 0) {
        const length = Math.hypot(qx, qy);
        distance = r - length;
        nx = (qx / length) * Math.sign(px);
        ny = (qy / length) * Math.sign(py);
      } else if (qx > qy) {
        distance = width / 2 - Math.abs(px);
        nx = Math.sign(px);
      } else {
        distance = height / 2 - Math.abs(py);
        ny = Math.sign(py);
      }

      const t = Math.max(0, 1 - distance / rim);
      const strength = t * t;
      const i = (y * width + x) * 4;
      data[i] = 128 - nx * strength * 127;
      data[i + 1] = 128 - ny * strength * 127;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  return data;
}

/** Rim width and the filter scale that keep the largest shift at 45% of the rim. */
export function lensSettings(height: number) {
  const rim = Math.max(4, Math.min(16, height / 3));
  const maxShift = rim * 0.45;
  // feDisplacementMap moves by scale × (channel / 255 − 0.5); the map uses at most ±127
  const scale = maxShift / (127 / 255);
  return { rim, maxShift, scale };
}
