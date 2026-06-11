import {
  CATALOG,
  CATEGORY_ORDER,
  CATEGORY_COLORS,
} from "../data/catalog";
import { formatLength } from "../utils/geometry";
import type { Units } from "../types";

interface Props {
  units: Units;
  onAdd: (catalogId: string) => void;
}

export default function FurniturePanel({ units, onAdd }: Props) {
  return (
    <aside className="panel left">
      <h2>Furniture catalog</h2>
      {CATEGORY_ORDER.map((cat) => {
        const items = CATALOG.filter((c) => c.category === cat);
        if (items.length === 0) return null;
        return (
          <div className="cat-group" key={cat}>
            <div className="cat-label">
              <span
                className="cat-dot"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
              {cat}
            </div>
            {items.map((it) => (
              <button className="item" key={it.id} onClick={() => onAdd(it.id)}>
                <span className="nm">{it.name}</span>
                <span className="dim">
                  {formatLength(it.defaultWidth, units)} ×{" "}
                  {formatLength(it.defaultDepth, units)}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </aside>
  );
}
