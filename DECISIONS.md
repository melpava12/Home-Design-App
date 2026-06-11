# Decisions & Context — Home Design Planner

> Living document. Append a dated line whenever something meaningful is decided.
> Last updated: **June 11, 2026**

---

## Project Context

A home design / floor planning application, modeled on **Planner5D** (https://planner5d.com/) as the reference for capabilities and overall look-and-feel. The goal is a tool for laying out floor plans (walls, rooms, furniture, fixtures) with measurement, export, and sharing.

**Reference docs in repo:** the Planner5D reference note and the recommended-features list. This sheet records the *why* and the decisions; those docs record the *what* and the requirements.

---

## Decisions Made

*(Settled as of the date above. Each is something we should not re-litigate without a reason.)*

- **2026-06-11 — Reference standard:** Planner5D is the benchmark for feature scope and UX. New functionality should be measured against what it offers.
- **2026-06-11 — Walls are straight only:** Rooms can be any shape, but built from straight wall segments. Curved walls are out of scope (at least for the initial version).
- **2026-06-11 — Units:** Support both metric and imperial, with the ability to switch.
- **2026-06-11 — Cross-platform target:** Intended to run as a native Android app *and* an HTML5 version that works on any computer or mobile device.

---

## Target Feature Set (Requirements)

These come from the recommended-features list — treat as the intended scope, not yet broken into versions:

- Multiple floors per project; rooms of any (straight-walled) shape
- Import an existing plan and use it as a template
- Automatic calculation of room / wall / level area, perimeter, and symbol counts
- Symbol library: doors, windows, furniture, electrical, fire survey
- User symbol library — store rooms, symbols (including grouped) and labels for quick reuse
- User-defined dimension lines to show and modify distances/sizes
- Cloud synchronization — automatic backup and sharing across devices
- Export: image, PDF (print to scale), DXF (2D), SVG
- Generate Wavefront `.obj` files for import into 3D rendering programs / game engines
- Share projects with others for collaboration

---

## Open Questions — NOT Yet Decided

*(Flagged so they don't get treated as settled. Move items up to "Decisions Made" with a date as they're resolved.)*

- **Tech stack / framework** — what are we building the HTML5 client and Android app in? Shared codebase or separate?
- **2D vs 3D scope for v1** — Planner5D does both. Is the first version 2D-only, with 3D/`.obj` export coming later?
- **MVP cut** — which of the target features are v1 vs. later? (e.g. is collaboration / cloud sync in the first release or deferred?)
- **Backend & cloud sync** — what service/architecture handles storage, auth, and sync?
- **Rendering approach** — canvas, SVG, WebGL? Affects how walls/symbols are drawn and how export is implemented.
- **Data model** — how are plans, floors, rooms, walls, and symbols represented and stored?

---

## How to Maintain This File

- When a planning conversation lands on something, add a dated line under **Decisions Made**.
- When a decision reverses or evolves, add a new dated line rather than deleting the old one — the history is the point.
- In Claude Code, the `#` shortcut can append notes to memory while you build.
- Note: decisions made in *other* chats aren't captured here automatically — add those manually.
