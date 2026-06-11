import { useCallback, useEffect, useState } from "react";
import type { Floor, PlacedItem, Point, Project, Units, Wall } from "../types";
import { getCatalogItem } from "../data/catalog";
import { uid } from "../utils/geometry";

const STORAGE_KEY = "home-planner-project";

function emptyProject(): Project {
  return {
    id: uid(),
    name: "My Home",
    units: "imperial",
    floors: [{ id: uid(), name: "Ground floor", walls: [], furniture: [] }],
  };
}

export function useProject() {
  const [project, setProject] = useState<Project>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Project;
    } catch {
      /* ignore corrupt storage */
    }
    return emptyProject();
  });

  // Auto-save to localStorage on every change (README: storage v1 = localStorage).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      /* storage may be full or blocked */
    }
  }, [project]);

  // For the first draft we work on the first floor only. Multi-floor is a later phase.
  const updateFloor = useCallback(
    (fn: (f: Floor) => Floor) =>
      setProject((p) => ({
        ...p,
        floors: p.floors.map((f, i) => (i === 0 ? fn(f) : f)),
      })),
    []
  );

  const setUnits = useCallback(
    (units: Units) => setProject((p) => ({ ...p, units })),
    []
  );

  const addFurniture = useCallback(
    (catalogId: string, x: number, y: number): string => {
      const c = getCatalogItem(catalogId);
      if (!c) return "";
      const item: PlacedItem = {
        id: uid(),
        catalogId,
        x,
        y,
        rotation: 0,
        width: c.defaultWidth,
        depth: c.defaultDepth,
      };
      updateFloor((f) => ({ ...f, furniture: [...f.furniture, item] }));
      return item.id;
    },
    [updateFloor]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<PlacedItem>) =>
      updateFloor((f) => ({
        ...f,
        furniture: f.furniture.map((it) =>
          it.id === id ? { ...it, ...patch } : it
        ),
      })),
    [updateFloor]
  );

  const deleteItem = useCallback(
    (id: string) =>
      updateFloor((f) => ({
        ...f,
        furniture: f.furniture.filter((it) => it.id !== id),
      })),
    [updateFloor]
  );

  const addWall = useCallback(
    (start: Point, end: Point, thickness = 5) =>
      updateFloor((f) => ({
        ...f,
        walls: [...f.walls, { id: uid(), start, end, thickness }],
      })),
    [updateFloor]
  );

  const clearWalls = useCallback(
    () => updateFloor((f) => ({ ...f, walls: [] })),
    [updateFloor]
  );

  const clearFurniture = useCallback(
    () => updateFloor((f) => ({ ...f, furniture: [] })),
    [updateFloor]
  );

  const loadProject = useCallback((p: Project) => setProject(p), []);
  const newProject = useCallback(() => setProject(emptyProject()), []);

  return {
    project,
    floor: project.floors[0],
    setUnits,
    addFurniture,
    updateItem,
    deleteItem,
    addWall,
    clearWalls,
    clearFurniture,
    loadProject,
    newProject,
  };
}
