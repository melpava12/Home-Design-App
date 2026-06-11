import type { Units, Wall } from "../types";

export const INCHES_PER_FOOT = 12;
export const GRID_INCHES = 6; // 6-inch snap grid (the README's chosen spacing)

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function snap(value: number, grid: number = GRID_INCHES): number {
  return Math.round(value / grid) * grid;
}

// Format a length given in inches, for the chosen unit system.
export function formatLength(inches: number, units: Units): string {
  if (units === "metric") {
    const cm = inches * 2.54;
    if (cm >= 100) return (cm / 100).toFixed(2) + " m";
    return Math.round(cm) + " cm";
  }
  if (inches < 12) return Math.round(inches) + '"';
  const ft = Math.floor(inches / 12);
  const inch = Math.round(inches - ft * 12);
  return inch ? `${ft}' ${inch}"` : `${ft}'`;
}

// Format an area given in square inches, for the chosen unit system.
export function formatArea(squareInches: number, units: Units): string {
  const sqft = squareInches / 144;
  if (units === "metric") return (sqft * 0.092903).toFixed(1) + " m²";
  return Math.round(sqft) + " sq ft";
}

export function wallLength(w: Wall): number {
  return Math.hypot(w.end.x - w.start.x, w.end.y - w.start.y);
}

export function totalWallLength(walls: Wall[]): number {
  return walls.reduce((sum, w) => sum + wallLength(w), 0);
}

// Rough footprint area: bounding box of all wall points (square inches).
// NOTE: true per-room area requires detecting closed loops of walls — that is a
// later enhancement (see README). This bounding-box estimate is a placeholder.
export function footprintArea(walls: Wall[]): number {
  if (walls.length === 0) return 0;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const w of walls) {
    for (const p of [w.start, w.end]) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }
  return (maxX - minX) * (maxY - minY);
}
