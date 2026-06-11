// All measurements are stored in INCHES (the single base unit).
// Display conversion to feet/inches or metric happens only in the UI.

export type Units = "imperial" | "metric";

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
}

export interface PlacedItem {
  id: string;
  catalogId: string; // links to a CatalogItem
  x: number; // center position, inches
  y: number;
  rotation: number; // degrees
  width: number; // current size (may differ from catalog default if resized)
  depth: number;
}

export interface Floor {
  id: string;
  name: string;
  walls: Wall[];
  furniture: PlacedItem[];
}

export interface Project {
  id: string;
  name: string;
  units: Units;
  floors: Floor[];
}

export interface CatalogItem {
  id: string;
  name: string;
  category: Category;
  defaultWidth: number; // inches
  defaultDepth: number; // inches
  price?: number; // used by the cost estimator (Phase 2)
}

export type Category =
  | "Seating"
  | "Tables"
  | "Beds"
  | "Storage"
  | "Appliances"
  | "Other";
