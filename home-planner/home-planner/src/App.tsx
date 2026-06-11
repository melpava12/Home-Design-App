import { useState } from "react";
import "./App.css";
import { useProject } from "./state/useProject";
import { getCatalogItem } from "./data/catalog";
import { uid } from "./utils/geometry";
import Toolbar from "./components/Toolbar";
import FurniturePanel from "./components/FurniturePanel";
import Inspector from "./components/Inspector";
import Canvas, { type Tool } from "./components/Canvas";

export default function App() {
  const {
    project,
    floor,
    setUnits,
    addFurniture,
    updateItem,
    deleteItem,
    addWall,
    clearWalls,
    clearFurniture,
    loadProject,
  } = useProject();

  const [tool, setTool] = useState<Tool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = floor.furniture.find((it) => it.id === selectedId) ?? null;

  // New furniture lands near the center of the working area; the user drags it home.
  const handleAdd = (catalogId: string) => {
    const center = 40 * 12 * 0.5; // middle of the 40ft work area
    const id = addFurniture(catalogId, center, center);
    setSelectedId(id);
  };

  const handleDuplicate = (id: string) => {
    const src = floor.furniture.find((it) => it.id === id);
    if (!src) return;
    const c = getCatalogItem(src.catalogId);
    if (!c) return;
    const newId = addFurniture(src.catalogId, src.x + 12, src.y + 12);
    // copy over current size/rotation
    updateItem(newId, { width: src.width, depth: src.depth, rotation: src.rotation });
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    setSelectedId(null);
  };

  return (
    <div className="app">
      <Toolbar
        units={project.units}
        tool={tool}
        project={project}
        onUnits={setUnits}
        onTool={setTool}
        onClearWalls={clearWalls}
        onLoad={loadProject}
      />
      <FurniturePanel units={project.units} onAdd={handleAdd} />
      <main className="stage">
        <Canvas
          floor={floor}
          units={project.units}
          tool={tool}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMoveItem={(id, x, y) => updateItem(id, { x, y })}
          onAddWall={addWall}
        />
      </main>
      <Inspector
        floor={floor}
        units={project.units}
        selected={selected}
        onUpdate={updateItem}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onClearFurniture={() => {
          clearFurniture();
          setSelectedId(null);
        }}
      />
    </div>
  );
}
