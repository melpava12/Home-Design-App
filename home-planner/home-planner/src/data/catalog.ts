import type { CatalogItem, Category } from "../types";

// Standard footprint sizes (inches). Adjust freely — these are typical values.
export const CATALOG: CatalogItem[] = [
  { id: "sofa", name: "Sofa", category: "Seating", defaultWidth: 84, defaultDepth: 36 },
  { id: "loveseat", name: "Loveseat", category: "Seating", defaultWidth: 60, defaultDepth: 36 },
  { id: "armchair", name: "Armchair", category: "Seating", defaultWidth: 35, defaultDepth: 35 },
  { id: "dchair", name: "Dining chair", category: "Seating", defaultWidth: 18, defaultDepth: 18 },
  { id: "stool", name: "Stool", category: "Seating", defaultWidth: 15, defaultDepth: 15 },

  { id: "dtable", name: "Dining table", category: "Tables", defaultWidth: 72, defaultDepth: 40 },
  { id: "ctable", name: "Coffee table", category: "Tables", defaultWidth: 48, defaultDepth: 24 },
  { id: "desk", name: "Desk", category: "Tables", defaultWidth: 60, defaultDepth: 30 },

  { id: "queen", name: "Queen bed", category: "Beds", defaultWidth: 60, defaultDepth: 80 },
  { id: "nstand", name: "Nightstand", category: "Beds", defaultWidth: 18, defaultDepth: 18 },

  { id: "dresser", name: "Dresser", category: "Storage", defaultWidth: 60, defaultDepth: 20 },
  { id: "bookshelf", name: "Bookshelf", category: "Storage", defaultWidth: 36, defaultDepth: 12 },
  { id: "wardrobe", name: "Wardrobe", category: "Storage", defaultWidth: 48, defaultDepth: 24 },
  { id: "cabinet", name: "Cabinet", category: "Storage", defaultWidth: 36, defaultDepth: 18 },

  { id: "fridge", name: "Fridge", category: "Appliances", defaultWidth: 36, defaultDepth: 32 },
  { id: "stove", name: "Stove", category: "Appliances", defaultWidth: 30, defaultDepth: 26 },
  { id: "doven", name: "Double oven", category: "Appliances", defaultWidth: 30, defaultDepth: 27 },
  { id: "dwash", name: "Dishwasher", category: "Appliances", defaultWidth: 24, defaultDepth: 24 },
  { id: "washer", name: "Washer", category: "Appliances", defaultWidth: 27, defaultDepth: 27 },
  { id: "micro", name: "Microwave", category: "Appliances", defaultWidth: 22, defaultDepth: 16 },
  { id: "sink", name: "Sink", category: "Appliances", defaultWidth: 30, defaultDepth: 22 },

  { id: "rug", name: "Rug", category: "Other", defaultWidth: 96, defaultDepth: 60 },
  { id: "lamp", name: "Lamp", category: "Other", defaultWidth: 16, defaultDepth: 16 },
  { id: "tvstand", name: "TV stand", category: "Other", defaultWidth: 60, defaultDepth: 18 },
];

export const CATEGORY_ORDER: Category[] = [
  "Seating",
  "Tables",
  "Beds",
  "Storage",
  "Appliances",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Seating: "#b5775b",
  Tables: "#7e8b6f",
  Beds: "#6b7fa3",
  Storage: "#9a8c73",
  Appliances: "#7c8da0",
  Other: "#a98ba6",
};

export function getCatalogItem(id: string): CatalogItem | undefined {
  return CATALOG.find((c) => c.id === id);
}
