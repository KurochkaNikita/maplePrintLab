export type Scale = { min: number; max: number; ticks: number[] };

/** Axis from `min` to `max` rounded outwards to a 1/2/2.5/5 × 10ⁿ step; always includes zero. */
export function niceScale(rawMin: number, rawMax: number, tickCount = 4): Scale {
  const min = Math.min(0, rawMin);
  const max = Math.max(0, rawMax);
  const range = max - min || 1;
  const rough = range / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const residual = rough / magnitude;
  const step = (residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 2.5 ? 2.5 : residual <= 5 ? 5 : 10) * magnitude;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step / 2; v += step) ticks.push(Math.round(v * 100) / 100);
  return { min: niceMin, max: niceMax, ticks };
}

export type Point = { x: number; y: number };

/** SVG path through the points as a smooth monotone cubic curve (no overshoot between points). One point gives just a move. */
export function smoothPath(pts: Point[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0].x},${pts[0].y}`;
  const slope = pts.slice(1).map((p, i) => (p.y - pts[i].y) / (p.x - pts[i].x));
  const tan = pts.map((_, i) => {
    if (i === 0) return slope[0];
    if (i === n - 1) return slope[n - 2];
    return slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  });
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tan[i] = 0;
      tan[i + 1] = 0;
      continue;
    }
    const a = tan[i] / slope[i];
    const b = tan[i + 1] / slope[i];
    const h = Math.hypot(a, b);
    if (h > 3) {
      tan[i] = (3 * a * slope[i]) / h;
      tan[i + 1] = (3 * b * slope[i]) / h;
    }
  }
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (pts[i + 1].x - pts[i].x) / 3;
    d += `C${pts[i].x + dx},${pts[i].y + tan[i] * dx} ${pts[i + 1].x - dx},${pts[i + 1].y - tan[i + 1] * dx} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

export const CHART_WIDTH = 480;
export const CHART_HEIGHT = 280;
const PAD = { left: 46, right: 16, top: 14, bottom: 32 };

export type ChartGeometry = {
  scale: Scale;
  /** Data x to picture x. */
  px: (x: number) => number;
  /** Data value to picture y. */
  py: (value: number) => number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** Picture y of the zero line. */
  zero: number;
};

/** Where things go in the picture: the y axis fits every value, the x axis spans the first to the last position. */
export function chartGeometry(xs: number[], values: number[]): ChartGeometry {
  const scale = niceScale(Math.min(...values, 0), Math.max(...values, 0));
  const left = PAD.left;
  const right = CHART_WIDTH - PAD.right;
  const top = PAD.top;
  const bottom = CHART_HEIGHT - PAD.bottom;
  const first = xs[0];
  const span = xs[xs.length - 1] - first;
  const px = (x: number) => (span === 0 ? (left + right) / 2 : left + ((right - left) * (x - first)) / span);
  const py = (value: number) => top + (bottom - top) * (1 - (value - scale.min) / (scale.max - scale.min));
  return { scale, px, py, left, right, top, bottom, zero: py(0) };
}

/** Index of the position closest to `at` (a picture x). */
export function nearestIndex(positions: number[], at: number): number {
  let best = 0;
  positions.forEach((p, i) => {
    if (Math.abs(p - at) < Math.abs(positions[best] - at)) best = i;
  });
  return best;
}
