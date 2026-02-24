interface MiniTPSChartProps {
  data: { session: string; value: number }[];
}

const MiniTPSChart = ({ data }: MiniTPSChartProps) => {
  const width = 260;
  const height = 64;
  const padX = 12;
  const padTop = 4;
  const padBottom = 16;

  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;

  const values = data.map((d) => d.value);
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - ((d.value - min) / (max - min)) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {/* Baseline */}
      <line
        x1={padX}
        y1={padTop + chartH}
        x2={padX + chartW}
        y2={padTop + chartH}
        stroke="hsl(var(--border))"
        strokeWidth={0.5}
        opacity={0.5}
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 3 : 2.5}
          fill="hsl(var(--accent))"
        />
      ))}

      {/* Session labels */}
      {data.map((d, i) => (
        <text
          key={d.session}
          x={points[i].x}
          y={height - 3}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={9}
          fontFamily="Inter, sans-serif"
        >
          {d.session}
        </text>
      ))}
    </svg>
  );
};

export default MiniTPSChart;
