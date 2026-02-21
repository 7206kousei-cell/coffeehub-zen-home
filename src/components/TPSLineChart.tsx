interface TPSLineChartProps {
  data: { day: string; value: number }[];
}

const TPSLineChart = ({ data }: TPSLineChartProps) => {
  const width = 280;
  const height = 80;
  const padX = 16;
  const padTop = 8;
  const padBottom = 20;

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
      {/* Subtle baseline */}
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
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2.5}
        fill="hsl(var(--accent))"
      />

      {/* Day labels */}
      {data.map((d, i) => (
        <text
          key={d.day}
          x={points[i].x}
          y={height - 4}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={9}
          fontFamily="Inter, sans-serif"
        >
          {d.day}
        </text>
      ))}
    </svg>
  );
};

export default TPSLineChart;
