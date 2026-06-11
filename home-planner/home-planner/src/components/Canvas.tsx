import { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Line, Group, Text } from "react-konva";
import type Konva from "konva";
import type { Floor, Point } from "../types";
import { getCatalogItem, CATEGORY_COLORS } from "../data/catalog";
import { INCHES_PER_FOOT, GRID_INCHES, snap } from "../utils/geometry";
import type { Units } from "../types";

type Tool = "select" | "wall";

interface Props {
  floor: Floor;
  units: Units;
  tool: Tool;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMoveItem: (id: string, x: number, y: number) => void;
  onAddWall: (start: Point, end: Point) => void;
}

// Working area (inches) the grid is drawn over: ~40ft x 40ft.
const AREA = 40 * INCHES_PER_FOOT;

export default function Canvas({
  floor,
  units,
  tool,
  selectedId,
  onSelect,
  onMoveItem,
  onAddWall,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1.4);
  const [pos, setPos] = useState({ x: 80, y: 80 });
  const [pending, setPending] = useState<Point | null>(null); // wall start point

  // Measure the container and keep the stage sized to it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Convert a stage pointer position to content (inch) coordinates.
  const pointerToContent = (): Point | null => {
    const stage = stageRef.current;
    if (!stage) return null;
    const p = stage.getPointerPosition();
    if (!p) return null;
    return { x: (p.x - pos.x) / scale, y: (p.y - pos.y) / scale };
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mouseTo = { x: (pointer.x - pos.x) / scale, y: (pointer.y - pos.y) / scale };
    const factor = 1.08;
    const next = e.evt.deltaY > 0 ? scale / factor : scale * factor;
    const clamped = Math.max(0.25, Math.min(5, next));
    setScale(clamped);
    setPos({ x: pointer.x - mouseTo.x * clamped, y: pointer.y - mouseTo.y * clamped });
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only react to clicks on empty canvas (the background), not on furniture.
    const clickedEmpty = e.target === e.target.getStage() || e.target.name() === "bg";
    if (!clickedEmpty) return;

    if (tool === "wall") {
      const c = pointerToContent();
      if (!c) return;
      const snapped = { x: snap(c.x), y: snap(c.y) };
      if (pending) {
        onAddWall(pending, snapped);
        setPending(snapped); // chain walls from the last point
      } else {
        setPending(snapped);
      }
    } else {
      onSelect(null); // deselect
    }
  };

  // Build grid lines once per size/scale-independent (drawn in content coords).
  const gridLines = useMemo(() => {
    const minor: number[][] = [];
    const major: number[][] = [];
    for (let i = 0; i <= AREA; i += GRID_INCHES) {
      const isMajor = i % INCHES_PER_FOOT === 0;
      (isMajor ? major : minor).push([i, 0, i, AREA]);
      (isMajor ? major : minor).push([0, i, AREA, i]);
    }
    return { minor, major };
  }, []);

  const fitView = () => {
    // Center the working area in the viewport.
    const s = Math.min(size.width / (AREA + 120), size.height / (AREA + 120));
    setScale(s);
    setPos({
      x: (size.width - AREA * s) / 2,
      y: (size.height - AREA * s) / 2,
    });
  };

  return (
    <div ref={containerRef} className="canvas-wrap">
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        scaleX={scale}
        scaleY={scale}
        x={pos.x}
        y={pos.y}
        draggable={tool === "select"}
        onWheel={handleWheel}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
        onDragEnd={(e) => {
          // Stage pan finished — sync our position state.
          if (e.target === e.target.getStage()) {
            setPos({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        <Layer listening={false}>
          {/* paper + grid */}
          <Rect x={0} y={0} width={AREA} height={AREA} fill="#ffffff" />
          {gridLines.minor.map((l, i) => (
            <Line key={"mn" + i} points={l} stroke="#d2dde5" strokeWidth={0.5 / scale} />
          ))}
          {gridLines.major.map((l, i) => (
            <Line key={"mj" + i} points={l} stroke="#bccad4" strokeWidth={0.8 / scale} />
          ))}
        </Layer>

        <Layer>
          {/* clickable background for deselect / wall placement */}
          <Rect
            name="bg"
            x={-2000}
            y={-2000}
            width={AREA + 4000}
            height={AREA + 4000}
            fill="transparent"
          />

          {/* walls */}
          {floor.walls.map((w) => (
            <Line
              key={w.id}
              points={[w.start.x, w.start.y, w.end.x, w.end.y]}
              stroke="#3c4a57"
              strokeWidth={w.thickness}
              lineCap="round"
            />
          ))}
          {pending && (
            <Rect
              x={pending.x - 4}
              y={pending.y - 4}
              width={8}
              height={8}
              fill="#2f5fb0"
            />
          )}

          {/* furniture */}
          {floor.furniture.map((it) => {
            const c = getCatalogItem(it.catalogId);
            const color = c ? CATEGORY_COLORS[c.category] : "#888";
            const selected = it.id === selectedId;
            return (
              <Group
                key={it.id}
                x={it.x}
                y={it.y}
                rotation={it.rotation}
                draggable={tool === "select"}
                onClick={() => onSelect(it.id)}
                onTap={() => onSelect(it.id)}
                onDragStart={() => onSelect(it.id)}
                onDragEnd={(e) =>
                  onMoveItem(it.id, snap(e.target.x()), snap(e.target.y()))
                }
              >
                <Rect
                  x={-it.width / 2}
                  y={-it.depth / 2}
                  width={it.width}
                  height={it.depth}
                  cornerRadius={2.5}
                  fill={color}
                  opacity={selected ? 0.95 : 0.85}
                  stroke={selected ? "#2f5fb0" : "#ffffff"}
                  strokeWidth={selected ? 2.5 : 1}
                />
                {Math.min(it.width, it.depth) >= 22 && c && (
                  <Text
                    text={c.name}
                    fontSize={8}
                    fill="#ffffff"
                    width={it.width}
                    align="center"
                    x={-it.width / 2}
                    y={-4}
                    rotation={it.rotation % 180 !== 0 ? -it.rotation : 0}
                    listening={false}
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>

      {/* room/measurement labels are a later enhancement once walls form closed rooms */}
      <div className="canvas-controls">
        <button onClick={() => setScale((s) => Math.min(5, s * 1.2))} aria-label="Zoom in">+</button>
        <button onClick={() => setScale((s) => Math.max(0.25, s / 1.2))} aria-label="Zoom out">−</button>
        <button onClick={fitView} aria-label="Fit to view" style={{ fontSize: 12 }}>FIT</button>
      </div>
      <div className="canvas-hint">
        {tool === "wall"
          ? "Click to drop wall points (they chain). Switch to Select when done."
          : "Tap a piece to select · drag to move · drag empty space to pan · scroll to zoom"}
        {tool === "wall" && pending && " · click again to continue the wall"}
      </div>
      {tool === "wall" && pending && (
        <button className="wall-done" onClick={() => setPending(null)}>
          Finish wall
        </button>
      )}
    </div>
  );
}

export { type Tool };
