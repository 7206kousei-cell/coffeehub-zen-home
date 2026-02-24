import { useEffect } from "react";
import { ChevronLeft, Brain, Scale, Droplets, Percent, Settings2, Thermometer, Clock, Activity } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MiniTPSChart from "@/components/MiniTPSChart";

/* ── Mock detail data ── */
const detailData: Record<string, {
  beanName: string;
  rating: number;
  diagnosis: string;
  cta: string;
  taste: { sweetness: number; acidity: number; bitterness: number; body: number };
  ideal: { sweetness: number; acidity: number; bitterness: number; body: number };
  tasteDiffText: string;
  params: { icon: typeof Scale; label: string; value: string; prev?: string }[];
  tpsHistory: { session: string; value: number }[];
}> = {
  "1": {
    beanName: "エチオピア イルガチェフェ",
    rating: 4,
    diagnosis: "抽出時間が理想よりやや長くなっています。甘さは十分ですが、苦味がわずかに強調されています。",
    cta: "挽き目を+1step粗くしましょう",
    taste: { sweetness: 7, acidity: 5, bitterness: 6, body: 5 },
    ideal: { sweetness: 8, acidity: 4, bitterness: 4, body: 6 },
    tasteDiffText: "苦味がやや強く、甘さが不足",
    params: [
      { icon: Scale, label: "粉量", value: "15g" },
      { icon: Droplets, label: "湯量", value: "225ml" },
      { icon: Percent, label: "比率", value: "1:15" },
      { icon: Settings2, label: "挽き目", value: "8", prev: "前回 7" },
      { icon: Thermometer, label: "湯温", value: "92℃" },
      { icon: Clock, label: "抽出時間", value: "2:30", prev: "前回 +3秒" },
    ],
    tpsHistory: [
      { session: "1", value: 68 },
      { session: "2", value: 72 },
      { session: "3", value: 78 },
      { session: "4", value: 76 },
      { session: "5", value: 85 },
    ],
  },
};

/* ── Dual Radar for Detail ── */
const DetailDualRadar = ({
  current,
  ideal,
}: {
  current: Record<string, number>;
  ideal: Record<string, number>;
}) => {
  const size = 170;
  const center = size / 2;
  const radius = size / 2 - 28;
  const AXES = [
    { key: "sweetness", label: "甘さ", angle: -Math.PI / 2 },
    { key: "acidity", label: "酸味", angle: 0 },
    { key: "bitterness", label: "苦味", angle: Math.PI / 2 },
    { key: "body", label: "濃さ", angle: Math.PI },
  ] as const;
  const MAX = 10;
  const GRID_LEVELS = 4;

  const getPoint = (angle: number, value: number) => ({
    x: center + (value / MAX) * radius * Math.cos(angle),
    y: center + (value / MAX) * radius * Math.sin(angle),
  });

  const makePath = (values: Record<string, number>) =>
    AXES.map((a, i) => {
      const p = getPoint(a.angle, values[a.key]);
      return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
    }).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block mx-auto">
      {Array.from({ length: GRID_LEVELS }, (_, i) => {
        const pts = AXES.map((a) => getPoint(a.angle, ((i + 1) / GRID_LEVELS) * MAX));
        const path = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={i} d={path} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.4} />;
      })}
      {AXES.map((a) => {
        const end = getPoint(a.angle, MAX);
        return <line key={a.key} x1={center} y1={center} x2={end.x} y2={end.y} stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.3} />;
      })}
      {/* Ideal (dashed) */}
      <path d={makePath(ideal)} fill="hsl(var(--muted) / 0.08)" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="3 2" strokeLinejoin="round" />
      {/* Current */}
      <path d={makePath(current)} fill="hsl(var(--accent) / 0.12)" stroke="hsl(var(--accent))" strokeWidth={1.2} strokeLinejoin="round" />
      {AXES.map((a) => {
        const lp = getPoint(a.angle, MAX + 2.5);
        const isLeft = a.angle === Math.PI;
        const isTop = a.angle === -Math.PI / 2;
        const isBottom = a.angle === Math.PI / 2;
        return (
          <text key={a.key} x={lp.x} y={lp.y}
            textAnchor={isLeft ? "end" : a.angle === 0 ? "start" : "middle"}
            dominantBaseline={isTop ? "auto" : isBottom ? "hanging" : "central"}
            className="fill-muted-foreground" fontSize={10} fontFamily="'Noto Sans JP', sans-serif"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
};

/* ── Main Page ── */
const BrewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = detailData[id || "1"] || detailData["1"];

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => {
      if (!wasDark) document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <span className="text-[14px] text-primary font-medium" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
          {data.beanName}
        </span>
        <span className="text-[28px] font-bold text-primary tabular-nums leading-none" style={{ fontFamily: "Inter, sans-serif" }}>
          {data.rating}
        </span>
      </header>

      {/* Section 1: AI Diagnosis */}
      <section className="px-6 pt-5 pb-4">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              AI診断
            </h2>
          </div>
          <p className="text-[13px] text-primary/80 leading-[1.7]" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {data.diagnosis}
          </p>
          <button className="mt-4 border border-border/40 rounded-xl text-[12px] px-4 py-2.5 text-primary/80 hover:text-primary transition-colors" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {data.cta}
          </button>
        </div>
      </section>

      {/* Section 2: Taste Profile */}
      <section className="px-6 pb-4">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <h2 className="text-sm font-semibold text-primary mb-3" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            味覚プロファイル
          </h2>
          <DetailDualRadar current={data.taste} ideal={data.ideal} />
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] rounded-full bg-accent" />
              <span className="text-[10px] text-muted-foreground">今回</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] rounded-full bg-muted-foreground/50" style={{ borderTop: "1px dashed" }} />
              <span className="text-[10px] text-muted-foreground">理想</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">{data.tasteDiffText}</p>
        </div>
      </section>

      {/* Section 3: Brew Parameters */}
      <section className="px-6 pb-4">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <h2 className="text-sm font-semibold text-primary mb-3" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            抽出パラメータ
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {data.params.map((p) => (
              <div key={p.label} className="bg-card rounded-[14px] border border-border/40 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <p.icon size={12} strokeWidth={1.5} className="text-muted-foreground/50" />
                  <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {p.label}
                  </span>
                </div>
                <span className="text-[14px] font-medium text-primary tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
                  {p.value}
                </span>
                {p.prev && (
                  <span className="block text-[12px] text-muted-foreground/60 mt-0.5 tabular-nums" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {p.prev}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: TPS Trend */}
      <section className="px-6 pb-10">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              TPS推移（直近5回）
            </h2>
          </div>
          <MiniTPSChart data={data.tpsHistory} />
        </div>
      </section>
    </div>
  );
};

export default BrewDetail;
