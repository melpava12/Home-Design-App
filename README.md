# Home Design & Furniture Cost Planner

> **How to use this file:** This README is the single source of truth for the app.
> Tell your AI coding tool to **read this file before every task**, and to update it
> when something changes. Sections marked **🖊️ FILL IN** are for you to complete —
> do your best, rough answers are fine and you can refine later. Everything else is
> a starting recommendation you can change.

---

## 1. One-line purpose

> A simple, browser-based app that lets me draw the floor plan of my house in 2D, drag and place furniture into it, and (later) see an estimated cost and a 3D view.

---

## 2. Who it's for

> - Primary user: Me — a first-time homebuyer planning furniture for a new place.
> - Skill assumption: Non-technical end user. The UI must be simple and intuitive.
> - Devices: Web-first (runs in a browser on laptop and phone).
> - Sharing: I want to share with my partner, friends, and family so they can see what the layout looks like.

---

## 3. Goals and non-goals

Goals:
> - I want to be able to upload my furniture ideas and able to place them in my house layout. 
> - I want a intuitive house plan tool that can provide the options to design my home and scrawl sites to esitmate prices of the specifc furniture I like. 
> - I should be able to upload a URL of a item and my app should be able to pick out the image to place in my layout. 

> **Reality check on the URL feature:** A browser-only app can't fetch outside
> websites (CORS), so grabbing an image/price from a product URL needs a small
> backend (a serverless function). Also, a product photo is an angled marketing
> shot, not a top-down floor-plan symbol — so it's placed as a labeled thumbnail,
> not auto-converted into a clean overhead icon. Because of this, the URL feature
> is its own phase **after** the core 2D editor works (see section 6).

### In scope (what we ARE building)
- Draw rooms and straight walls in 2D.
- Auto-calculate room area and perimeter.
- A furniture catalog you can drag onto the plan.
- Move, rotate, and resize placed furniture.
- Save and load projects.
- Paste a product URL: the app pulls the item's image and price and lets you place
  it on the layout as a labeled thumbnail with a footprint you set. (See note below —
  this needs a small backend and belongs in a later phase, not the MVP.)
- Cost estimate per project (later phase).
- 3D view using pre-made models (later phase).

### Out of scope (what we are NOT building, at least for now)
- Automatically detecting walls from an uploaded photo (too hard — we'll trace
  over an uploaded image instead).
- Generating 3D models from furniture photos (we use a fixed library of models).
- Curved or diagonal-thickness walls (straight walls only for v1).
- User accounts / cloud sync (browser storage is fine to start).

---

## 4. Tech stack (recommended)

- **Build tool:** Vite
- **Framework:** React + TypeScript
- **2D canvas:** Konva via `react-konva` (handles drag, rotate, resize)
- **Styling:** plain CSS or a lightweight option — keep it minimal
- **Storage (v1):** browser `localStorage`
- **Backend (only for the URL feature, later):** a small serverless function to fetch
  product pages — not needed for the MVP.
- **3D (later phase):** Three.js via `react-three-fiber`

---

## 5. Data model

Everything drawn is just data; the canvas is a picture of that data. Pin this down
before building UI. (TypeScript types double as a contract the AI must follow.)

```ts
type Project = {
  id: string;
  name: string;
  units: "metric" | "imperial";
  floors: Floor[];
};

type Floor = {
  id: string;
  name: string;            // e.g. "Ground floor"
  walls: Wall[];
  furniture: PlacedItem[];
};

type Wall = {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number;       // in the project's units
};

type PlacedItem = {
  id: string;
  catalogId: string;       // links to a CatalogItem
  x: number;               // position on the canvas
  y: number;
  rotation: number;        // degrees
  width: number;           // override of default size if resized
  depth: number;
};

type CatalogItem = {
  id: string;
  name: string;            // e.g. "Queen bed"
  category: string;        // see section 7
  defaultWidth: number;
  defaultDepth: number;
  price?: number;          // used by the cost estimator (later)
  modelUrl?: string;       // used by the 3D view (later)
};
```

---

## 6. Features by phase (build in this order)

Build and test each item **before** starting the next. The whole **Phase 1** list
is your first usable version.

### Phase 1 — 2D editor (MVP) ⭐ current priority
- [ ] Canvas with a grid; pan and zoom.
- [ ] Wall-drawing tool: click points to lay straight walls.
- [ ] Auto-calculate and display each room's area and perimeter.
- [ ] Side panel listing furniture; drag an item onto the canvas.
- [ ] Select a placed item to move, rotate, and resize it; delete it.
- [ ] Save and load a project (localStorage).

### Phase 2 — Cost estimate
- [ ] Add a price to each catalog item.
- [ ] Show a running total of all placed furniture.
- [ ] Set a budget and show how close the plan is to it.

### Phase 3 — Furniture from a URL (needs a small backend)
- [ ] Serverless function that fetches a product page and returns its main image + price.
- [ ] Paste-a-URL box in the app; show the fetched image and price.
- [ ] Place the fetched item on the layout as a labeled thumbnail with a footprint I set.

### Phase 4 — Floor plan from upload (simple)
- [ ] Upload an image and place it as a background layer to trace over.
- [ ] Lock / dim / scale the background image.

### Phase 5 — 3D view
- [ ] Orbiting 3D view of the same plan using pre-made furniture models.

### Phase 6 — Polish
- [ ] Metric / imperial toggle.
- [ ] Export plan as image and PDF.
- [ ] Multiple floors.

---

## 7. Furniture catalog

The categories the app should support, with the specific items you actually need.

> Seating: Sofa, Armchair, dining chair, stool, loveseat
> Tables: Dining table, coffee table, desk
> Beds: Queen bed, mirror, nightstand
> Storage: Dresser, bookshelf, wardrobe, cabinet, closet, Plastic containers
> Appliances: Double oven, fridge, washer, stove, mircowave, dishwasher, sink, teapot, coffee machine
> Other: Rug, lamp, TV stand, Cabinet 

---

## 8. My rooms

A quick description of the space you're planning for, so the app fits real life.

> 🖊️ FILL IN — list each room with rough dimensions if you have them
> (e.g. "Living room ~12 ft x 14 ft"). Don't worry about precision:
>
> - Living Room
> - Kitchen
> - Guest Bathroom
> - Master Bathroom
> - Second Floor Bathroom
> - Dining Room
> - Backyard
>
> 🖊️ STILL TO ADD: rough dimensions for each (e.g. "Living room ~14×16 ft"), and
> any bedrooms (a master bath usually implies a master bedroom). Backyard is outdoor,
> so treat it as an open area rather than a walled room.


---

## 9. Units and conventions

- **Default units:** Metric or imperial — 🖊️ PICK ONE (both can still be shown, but
  the app needs one default). Choose whichever you naturally think in.
- **Grid spacing:** 1 grid square or .5 grid square — 🖊️ PICK ONE, and say what one
  square equals (e.g. "1 square = 1 ft").
- Internally store all measurements in one base unit; only convert for display.

---

## 10. Project structure (keep files small)

To stop the codebase from turning into one giant file, aim for something like:

```
src/
  types.ts            // the data model from section 5
  state/              // project state, save/load
  components/
    Canvas/           // grid, pan, zoom, rendering
    WallTool/         // drawing walls
    FurniturePanel/   // catalog + drag source
    PlacedItem/       // a single placed furniture item
    Toolbar/
  data/
    catalog.ts        // the furniture catalog
  utils/
    geometry.ts       // area, perimeter, rotation math
```

> Rule for the AI: when a file gets long, split it. One component per file.

---

## 11. Working agreement (instructions for the AI assistant)

- Read this README before starting any task.
- Build one Phase-1 checklist item at a time; don't bundle several together.
- Stop after each item so I can run the app and confirm it works.
- Follow the data model and types exactly; if a change is needed, update section 5.
- Keep files small and split components when they grow.
- Prefer simple, readable code over clever code — I'm not a developer.
- Update the checklists and any changed decisions in this file as we go.

---

## 12. Open questions / TODO

> 🖊️ FILL IN — anything you're unsure about or want to decide later:
>
> More acurrate estimations when not provided with exact measurements. 
> Render a image of the finished product to get a better view of what it would look like in real life. 