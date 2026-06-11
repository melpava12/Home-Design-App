import type { Floor, PlacedItem, Units } from "../types";
import type { ReactNode } from "react";
import { getCatalogItem, CATEGORY_COLORS } from "../data/catalog";
import {
  formatLength,
  formatArea,
  totalWallLength,
  footprintArea,
} from "../utils/geometry";

interface Props {
  floor: Floor;
  units: Units;
  selected: PlacedItem | null;
  onUpdate: (id: string, patch: Partial<PlacedItem>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onClearFurniture: () => void;
}

const SIZE_STEP = 6; // inches

export default function Inspector({
  floor,
  units,
  selected,
  onUpdate,
  onDelete,
  onDuplicate,
  onClearFurniture,
}: Props) {
  const c = selected ? getCatalogItem(selected.catalogId) : undefined;

  return (
    <aside className="panel right">
      <h2>Selected item</h2>
      {!selected || !c ? (
        <div className="empty">
          Nothing selected. Tap a piece on the plan, or add one from the catalog.
        </div>
      ) : (
        <div className="insp">
          <div className="tag" style={{ color: CATEGORY_COLORS[c.category] }}>
            {c.category}
          </div>
          <div className="name">{c.name}</div>

          <Field label="Width">
            <Stepper
              value={formatLength(selected.width, units)}
              onDec={() =>
                onUpdate(selected.id, {
                  width: Math.max(6, selected.width - SIZE_STEP),
                })
              }
              onInc={() =>
                onUpdate(selected.id, {
                  width: Math.min(360, selected.width + SIZE_STEP),
                })
              }
            />
          </Field>

          <Field label="Depth">
            <Stepper
              value={formatLength(selected.depth, units)}
              onDec={() =>
                onUpdate(selected.id, {
                  depth: Math.max(6, selected.depth - SIZE_STEP),
                })
              }
              onInc={() =>
                onUpdate(selected.id, {
                  depth: Math.min(360, selected.depth + SIZE_STEP),
                })
              }
            />
          </Field>

          <Field label={`Rotation · ${Math.round(((selected.rotation % 360) + 360) % 360)}°`}>
            <div className="row">
              <Stepper
                value="15°"
                decLabel="↺"
                incLabel="↻"
                onDec={() => onUpdate(selected.id, { rotation: selected.rotation - 15 })}
                onInc={() => onUpdate(selected.id, { rotation: selected.rotation + 15 })}
              />
              <button
                className="toolbtn"
                style={{ justifyContent: "center" }}
                onClick={() => onUpdate(selected.id, { rotation: selected.rotation + 90 })}
              >
                Turn 90°
              </button>
            </div>
          </Field>

          <div className="btns">
            <button onClick={() => onDuplicate(selected.id)}>Duplicate</button>
            <button className="del" onClick={() => onDelete(selected.id)}>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="summary">
        <h2 style={{ paddingLeft: 0, position: "static" }}>Plan summary</h2>
        <Row label="Walls">{floor.walls.length}</Row>
        <Row label="Total wall length">
          {formatLength(totalWallLength(floor.walls), units)}
        </Row>
        <Row label="Footprint (approx.)">
          {floor.walls.length ? formatArea(footprintArea(floor.walls), units) : "—"}
        </Row>
        <Row label="Furniture placed">{floor.furniture.length}</Row>
        <button
          className="toolbtn"
          style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
          onClick={onClearFurniture}
        >
          Clear all furniture
        </button>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Stepper({
  value,
  onDec,
  onInc,
  decLabel = "−",
  incLabel = "+",
}: {
  value: string;
  onDec: () => void;
  onInc: () => void;
  decLabel?: string;
  incLabel?: string;
}) {
  return (
    <div className="stepper">
      <button onClick={onDec}>{decLabel}</button>
      <span className="val">{value}</span>
      <button onClick={onInc}>{incLabel}</button>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="srow">
      <span>{label}</span>
      <b>{children}</b>
    </div>
  );
}
