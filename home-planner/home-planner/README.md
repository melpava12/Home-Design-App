# Home Planner — first draft (Phase 1)

A 2D home layout editor: draw walls, drag furniture from a catalog, and arrange a
room. Built with Vite + React + TypeScript + Konva, matching the project spec README.

## Run it

You need Node.js (version 18 or newer). Then, in this folder:

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## What works in this draft (Phase 1)

- Grid canvas with pan (drag empty space) and zoom (scroll or the +/− buttons).
- Draw straight walls: switch to "Draw walls", click to drop points (they chain),
  then switch back to "Select".
- Furniture catalog (left) with standard sizes — click an item to add it.
- Select a piece to move (drag), rotate, resize, duplicate, or delete (right panel).
- Imperial/metric toggle.
- Auto-saves to your browser; Save/Load buttons export and import a `.json` plan.

## Known gaps (intended next steps)

- **Room area/perimeter** currently shows total wall length and an approximate
  bounding-box footprint. True per-room area needs detecting closed loops of walls —
  that's the next thing to build in Phase 1.
- New furniture is added at the center of the work area; drag it where you want.
- Resize/rotate is done from the right panel (not yet with on-canvas handles).

## How to keep building (for your AI coding tool)

Read the project spec README first, then work **one checklist item at a time** and
test before moving on. The code is organized as:

```
src/
  types.ts              data model (single source of truth for shapes)
  data/catalog.ts       furniture list + category colors
  utils/geometry.ts     units, snapping, area helpers
  state/useProject.ts   project state + localStorage persistence + actions
  components/
    Toolbar.tsx         top bar (tools, units, save/load)
    FurniturePanel.tsx  left catalog
    Canvas.tsx          the Konva drawing surface
    Inspector.tsx       right properties + summary panel
  App.tsx               wires it all together
```

Good next tasks: real room detection for accurate area; on-canvas resize/rotate
handles (Konva Transformer); then Phase 2 (prices + running cost total).
