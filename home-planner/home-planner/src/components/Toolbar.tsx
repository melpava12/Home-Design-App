import { useRef, type ChangeEvent } from "react";
import type { Project, Units } from "../types";
import type { Tool } from "./Canvas";

interface Props {
  units: Units;
  tool: Tool;
  project: Project;
  onUnits: (u: Units) => void;
  onTool: (t: Tool) => void;
  onClearWalls: () => void;
  onLoad: (p: Project) => void;
}

export default function Toolbar({
  units,
  tool,
  project,
  onUnits,
  onTool,
  onClearWalls,
  onLoad,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my-home-plan.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(String(reader.result)) as Project;
        if (!p.floors) throw new Error("bad file");
        onLoad(p);
      } catch {
        alert("That file couldn't be read as a saved plan.");
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  };

  return (
    <header className="topbar">
      <div className="brand">
        <span className="eyebrow">2D Layout · v0.1</span>
        <h1>Home Planner</h1>
      </div>
      <div className="spacer" />

      <div className="seg" role="group" aria-label="Tool">
        <button aria-pressed={tool === "select"} onClick={() => onTool("select")}>
          SELECT
        </button>
        <button aria-pressed={tool === "wall"} onClick={() => onTool("wall")}>
          DRAW WALLS
        </button>
      </div>
      <button className="toolbtn" onClick={onClearWalls}>
        Clear walls
      </button>

      <div className="seg" role="group" aria-label="Units">
        <button aria-pressed={units === "imperial"} onClick={() => onUnits("imperial")}>
          FT/IN
        </button>
        <button aria-pressed={units === "metric"} onClick={() => onUnits("metric")}>
          METRIC
        </button>
      </div>

      <button className="toolbtn" onClick={save}>
        ↓ Save
      </button>
      <button className="toolbtn" onClick={() => fileRef.current?.click()}>
        ↑ Load
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={onFile}
      />
    </header>
  );
}
