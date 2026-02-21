import { useMemo } from "react";

interface TasteRadarChartProps {
  values: { sweetness: number; acidity: number; bitterness: number; body: number };
  size?: number;
}

const AXES = [
  { key: "sweetness", label: "甘さ", angle: -Math.PI / 2 },
  { key: "acidity", label: "酸味", angle: 0 },
  { key: "bitterness", label: "苦味", angle: Math.PI / 2 },
  { key: "body", label: "濃さ", angle: Math.PI },
] as const;

const MAX = 10;
const GRID_LEVELS = 4;

const TasteRadarChart = ({ values, size = 170 }: TasteRadarChartProps) => {
  const center = size / 2;
  const radius = size / 2 - 28; // leave room for labels

  const getPoint = (angle: number, value: number) => ({
    x: center + (value / MAX) * radius * Math.cos(angle),
    y: center + (value / MAX) * radius * Math.sin(angle),
  });

  const dataPoints = useMemo(
    () => AXES.map((axis) => getPoint(axis.angle, values[axis.key])),
    [values, radius]
  );

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {/* Grid rings */}
      {Array.from({ length: GRID_LEVELS }, (_, i) => {
        const r = ((i + 1) / GRID_LEVELS) * radius;
        const points = AXES.map((axis) => getPoint(axis.angle, ((i + 1) / GRID_LEVELS) * MAX));
        const path = points.map((p, j) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={0.5}
            opacity={0.5}
          />
        );
      })}

      {/* Axis lines */}
      {AXES.map((axis) => {
        const end = getPoint(axis.angle, MAX);
        return (
          <line
            key={axis.key}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="hsl(var(--border))"
            strokeWidth={0.5}
            opacity={0.4}
          />
        );
      })}

      {/* Data polygon fill */}
      <path
        d={polygonPath}
        fill="hsl(var(--accent) / 0.15)"
        stroke="hsl(var(--accent))"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={AXES[i].key}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill="hsl(var(--accent))"
        />
      ))}

      {/* Axis labels */}
      {AXES.map((axis) => {
        const labelPos = getPoint(axis.angle, MAX + 2.5);
        const isTop = axis.angle === -Math.PI / 2;
        const isBottom = axis.angle === Math.PI / 2;
        const isLeft = axis.angle === Math.PI;
        return (
          <text
            key={axis.key}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor={isLeft ? "end" : axis.angle === 0 ? "start" : "middle"}
            dominantBaseline={isTop ? "auto" : isBottom ? "hanging" : "central"}
            className="fill-muted-foreground"
            fontSize={10}
            fontFamily="'Noto Sans JP', sans-serif"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
};

export default TasteRadarChart;
