import { useEffect } from "react";
import { X, Target, ArrowUpDown, BarChart2, Activity, Radar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TasteRadarChart from "@/components/TasteRadarChart";

/* ── Mock Data ── */
const paramDiff = [
  { label: "抽出時間", current: "3:20", best: "3:10", unit: "" },
  { label: "湯温", current: "92℃", best: "90℃", unit: "" },
  { label: "挽き目", current: "中細", best: "中細", unit: "" },
];

const paramImpact = [
  { label: "抽出時間", impact: 82, level: "高" },
  { label: "湯温", impact: 58, level: "中" },
  { label: "挽き目", impact: 34, level: "低" },
  { label: "豆量", impact: 22, level: "低" },
];

const ratingDistribution = [
  { rating: 1, count: 0 },
  { rating: 2, count: 1 },
  { rating: 3, count: 4 },
  { rating: 4, count: 6 },
  { rating: 5, count: 3 },
];

const learningLog = [
  { text: "湯温を90℃に下げた → 評価+1", effective: true },
  { text: "挽き目を細かくした → 変化なし", effective: false },
  { text: "抽出時間を-15秒 → 評価+0.5", effective: true },
  { text: "豆量+2g → 変化なし", effective: false },
];

const tasteModel = { sweetness: 7, acidity: 4, bitterness: 5, body: 6 };
const tasteRecent = { sweetness: 6, acidity: 5, bitterness: 6, body: 5 };

/* ── Mini Distribution Chart ── */
const MiniDistribution = ({ data }: { data: typeof ratingDistribution }) => {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-10">
      {data.map((d) => (
        <div key={d.rating} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm bg-accent/30"
            style={{ height: max > 0 ? `${(d.count / max) * 28}px` : "2px", minHeight: "2px" }}
          />
          <span className="text-[9px] text-muted-foreground tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
            {d.rating}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Dual-Layer Radar ── */
const DualRadarChart = () => {
  const size = 160;
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
      {/* Grid */}
      {Array.from({ length: GRID_LEVELS }, (_, i) => {
        const pts = AXES.map((a) => getPoint(a.angle, ((i + 1) / GRID_LEVELS) * MAX));
        const path = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={i} d={path} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.4} />;
      })}
      {/* Axes */}
      {AXES.map((a) => {
        const end = getPoint(a.angle, MAX);
        return <line key={a.key} x1={center} y1={center} x2={end.x} y2={end.y} stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.3} />;
      })}
      {/* Model layer */}
      <path d={makePath(tasteModel)} fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent))" strokeWidth={1.2} strokeLinejoin="round" />
      {/* Recent layer */}
      <path d={makePath(tasteRecent)} fill="hsl(var(--muted) / 0.08)" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="3 2" strokeLinejoin="round" />
      {/* Labels */}
      {AXES.map((a) => {
        const lp = getPoint(a.angle, MAX + 2.5);
        const isLeft = a.angle === Math.PI;
        const isTop = a.angle === -Math.PI / 2;
        const isBottom = a.angle === Math.PI / 2;
        return (
          <text
            key={a.key}
            x={lp.x}
            y={lp.y}
            textAnchor={isLeft ? "end" : a.angle === 0 ? "start" : "middle"}
            dominantBaseline={isTop ? "auto" : isBottom ? "hanging" : "central"}
            className="fill-muted-foreground"
            fontSize={9}
            fontFamily="'Noto Sans JP', sans-serif"
          >
            {a.label}
          </text>
        );
      })}
    </svg>
  );
};

/* ── Main Page ── */
const Analysis = () => {
  const navigate = useNavigate();

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
        <div className="w-8" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40" style={{ fontFamily: "Inter, sans-serif" }}>
          分析
        </span>
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <X size={15} strokeWidth={1.5} />
        </button>
      </header>

      <section className="px-6 pt-4 pb-6">
        <h1
          className="text-[22px] font-light text-primary leading-[1.6] tracking-wide"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          戦略コックピット
        </h1>
      </section>

      {/* Card 1: Verification Theme */}
      <section className="px-6 pb-5">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                今週の検証テーマ
              </h2>
              <p className="text-[15px] text-primary mt-3 font-medium leading-relaxed">
                抽出時間の安定化
              </p>
              <p className="text-[11px] text-muted-foreground mt-2 leading-[1.7]">
                理由：評価ばらつき ±1.2
              </p>
              <p className="text-[12px] text-primary/80 mt-2 font-medium leading-[1.7]">
                推奨：-10秒で3回固定検証
              </p>
            </div>
            <Target size={20} strokeWidth={1.2} className="text-muted-foreground/40 mt-0.5 flex-shrink-0 ml-4" />
          </div>
        </div>
      </section>

      {/* Card 2: Best Session Diff */}
      <section className="px-6 pb-5">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpDown size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              最高評価との差分
            </h2>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 text-[10px] text-muted-foreground/50 tracking-wide pb-1">
              <span />
              <span className="text-center">現在</span>
              <span className="text-center">最高時</span>
            </div>
            {paramDiff.map((p) => (
              <div key={p.label} className="grid grid-cols-3 items-center">
                <span className="text-[12px] text-primary/70" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {p.label}
                </span>
                <span className="text-[12px] text-primary text-center tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
                  {p.current}
                </span>
                <span className="text-[12px] text-muted-foreground text-center tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
                  {p.best}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card 3: Parameter Impact Ranking */}
      <section className="px-6 pb-5">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              パラメータ影響度
            </h2>
          </div>
          <div className="space-y-3.5">
            {paramImpact.map((p) => (
              <div key={p.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-primary/70" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {p.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 tracking-wide">{p.level}</span>
                </div>
                <div className="h-[3px] bg-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/40 rounded-full transition-all"
                    style={{ width: `${p.impact}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card 4: Reproducibility */}
      <section className="px-6 pb-5">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              再現性
            </h2>
          </div>
          <MiniDistribution data={ratingDistribution} />
          <div className="mt-4 space-y-1">
            <p className="text-[12px] text-primary/80">
              評価ばらつき：<span className="tabular-nums font-medium" style={{ fontFamily: "Inter, sans-serif" }}>±1.2</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              主因：抽出時間
            </p>
          </div>
        </div>
      </section>

      {/* Card 5: Taste Model */}
      <section className="px-6 pb-5">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Radar size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              味モデル
            </h2>
          </div>
          <DualRadarChart />
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] rounded-full bg-accent" />
              <span className="text-[10px] text-muted-foreground">モデル</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] rounded-full bg-muted-foreground/50 border-dashed" style={{ borderTop: "1px dashed" }} />
              <span className="text-[10px] text-muted-foreground">直近</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            直近は苦味がやや強く、甘さが不足
          </p>
        </div>
      </section>

      {/* Card 6: Learning Log */}
      <section className="px-6 pb-10">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} strokeWidth={1.5} className="text-muted-foreground/50" />
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              学習ログ
            </h2>
          </div>
          <div className="space-y-3">
            {learningLog.map((entry, i) => (
              <p
                key={i}
                className={`text-[12px] leading-[1.7] ${
                  entry.effective ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {entry.text}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analysis;
