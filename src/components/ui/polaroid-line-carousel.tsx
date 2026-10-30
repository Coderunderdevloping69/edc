import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./polaroid-line-carousel.css";

export type DriftItem = { image: string; title?: string; href?: string };

type DriftWallProps = {
  items: DriftItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: React.CSSProperties;
};

const columnFactor = (index: number, variance: number) => 1 + variance * ((((index * 0.6180339887 + 0.35) % 1) * 2) - 1);

export default function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  className = "",
  style,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const offsets = useRef<number[]>([]);
  const velocities = useRef<number[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const dampedPointer = useRef({ x: 0, y: 0 });
  const hoveredColumn = useRef(-1);
  const hovered = useRef(false);
  const raf = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const [height, setHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  const columnItems = useMemo(() => {
    const result = Array.from({ length: Math.max(1, columns) }, () => [] as DriftItem[]);
    items.forEach((item, index) => result[index % result.length].push(item));
    return result;
  }, [columns, items]);
  const metas = useMemo(() => columnItems.map((column) => {
    const copyHeight = Math.max(tileHeight + gap, column.length * (tileHeight + gap));
    return { copyHeight, copies: Math.max(2, Math.ceil((height * 1.6) / copyHeight) + 1) };
  }), [columnItems, gap, height, tileHeight]);
  const baseVelocities = useMemo(() => columnItems.map((_, index) => {
    const sign = direction === "up" ? 1 : -1;
    return speed * columnFactor(index, variance) * sign * (index % 2 === 0 ? 1 : -1);
  }), [columnItems, direction, speed, variance]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height || 600));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    offsets.current = metas.map((meta, index) => meta.copyHeight * ((index * 0.37) % 1));
    velocities.current = columnItems.map(() => 0);
  }, [columnItems, metas]);

  const applyTransform = useCallback((x: number, y: number) => {
    if (planeRef.current) {
      planeRef.current.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt + y}deg) rotateY(${turn + x}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
    }
  }, [depth, roll, tilt, turn]);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTime.current === null) lastTime.current = time;
      const dt = Math.min(0.05, Math.max(0, time - lastTime.current) / 1000);
      lastTime.current = time;
      const damp = 1 - Math.exp(-dt / 0.12);
      dampedPointer.current.x += (pointer.current.x * parallax * 8 - dampedPointer.current.x) * damp;
      dampedPointer.current.y += (-pointer.current.y * parallax * 8 - dampedPointer.current.y) * damp;
      applyTransform(dampedPointer.current.x, dampedPointer.current.y);
      if (!reduced) tracks.current.forEach((track, index) => {
        const meta = metas[index];
        if (!track || !meta) return;
        const paused = hovered.current && pauseOnHover;
        const target = paused || hoveredColumn.current === index ? 0 : baseVelocities[index];
        velocities.current[index] += (target - velocities.current[index]) * (1 - Math.exp(-dt / (target ? 0.28 : 0.16)));
        offsets.current[index] = ((offsets.current[index] + velocities.current[index] * dt) % meta.copyHeight + meta.copyHeight) % meta.copyHeight;
        track.style.transform = `translate3d(0, ${-offsets.current[index]}px, 0)`;
      });
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); lastTime.current = null; };
  }, [applyTransform, baseVelocities, metas, parallax, pauseOnHover, reduced]);

  const cssVars = {
    "--dw-tile-w": `${tileWidth}px`, "--dw-tile-h": `${tileHeight}px`, "--dw-gap": `${gap}px`,
    "--dw-radius": `${radius}px`, "--dw-perspective": `${perspective}px`, "--dw-lift": `${lift}px`,
    "--dw-dim": dim, "--dw-gray": grayscale ? 1 : 0, "--dw-overlay": overlayColor,
    "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`, ...style,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`drift-wall ${reduced ? "drift-wall--reduced" : ""} ${className}`}
      style={cssVars}
      onPointerMove={(event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect && parallax > 0 && !reduced) pointer.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
        const tile = (event.target as HTMLElement).closest<HTMLElement>("[data-tile-id]");
        if (tile) { hoveredColumn.current = Number(tile.dataset.col); setActiveId(tile.dataset.tileId ?? null); }
      }}
      onPointerEnter={() => { hovered.current = true; }}
      onPointerLeave={() => { hovered.current = false; hoveredColumn.current = -1; pointer.current = { x: 0, y: 0 }; setActiveId(null); }}
      role="group"
      aria-label="Drifting wall of past events"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((column, columnIndex) => (
          <div className="drift-wall__col" key={columnIndex}>
            <div className="drift-wall__track" ref={(element) => { tracks.current[columnIndex] = element; }}>
              {Array.from({ length: metas[columnIndex].copies }).flatMap((_, copyIndex) => column.map((item, itemIndex) => {
                const id = `${columnIndex}-${copyIndex}-${itemIndex}`;
                const content = <span className="drift-wall__inner"><img src={item.image} alt={item.title ?? ""} loading="lazy" decoding="async" draggable={false} /><span className="drift-wall__overlay" /></span>;
                return item.href ? <a key={id} href={item.href} target="_blank" rel="noreferrer" className={`drift-wall__tile${activeId === id ? " is-active" : ""}`} data-tile-id={id} data-col={columnIndex}>{content}</a> : <div key={id} tabIndex={0} role="button" aria-label={item.title ?? "event"} className={`drift-wall__tile${activeId === id ? " is-active" : ""}`} data-tile-id={id} data-col={columnIndex}>{content}</div>;
              }))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
