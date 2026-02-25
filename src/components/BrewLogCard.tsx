import { Clock, Thermometer, Settings2, Bean, Star } from "lucide-react";

export type BrewStatus = "improved" | "stable" | "declined" | "unrated";

export interface BrewLogEntry {
  id: string;
  date: string;
  time: string;
  beanName: string;
  roast: string;
  rating: number | null;
  tps: number;
  tpsDiff: number;
  brewTime: string;
  temp: number;
  grind: number;
  status: BrewStatus;
  changes: { label: string; diff: string }[];
  beanImage?: string;
}

const statusLineColor: Record<BrewStatus, string> = {
  improved: "bg-accent",
  stable: "bg-transparent",
  declined: "bg-red-400/50",
  unrated: "bg-muted-foreground/30",
};

const statusText: Record<BrewStatus, { label: string; className: string }> = {
  improved: { label: "改善", className: "text-accent" },
  stable: { label: "横ばい", className: "text-muted-foreground" },
  declined: { label: "悪化", className: "text-red-400/70" },
  unrated: { label: "未評価", className: "text-muted-foreground/50" },
};

interface BrewLogCardProps {
  entry: BrewLogEntry;
  onClick: () => void;
}

const BrewLogCard = ({ entry, onClick }: BrewLogCardProps) => {
  const st = statusText[entry.status];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-2xl border border-border/40 shadow-xs overflow-hidden flex active:scale-[0.98] transition-transform"
    >
      {/* Status line */}
      <div className={`w-[3px] flex-shrink-0 ${statusLineColor[entry.status]}`} />

      {/* Bean thumbnail */}
      <div className="w-[20%] flex-shrink-0 bg-secondary flex items-center justify-center">
        {entry.beanImage ? (
          <img src={entry.beanImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <Bean size={20} strokeWidth={1.2} className="text-muted-foreground/30" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3.5 min-w-0">
        {/* Row 1: date + bean */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-muted-foreground tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
            {entry.date} {entry.time}
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[12px] text-primary/80 truncate" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              {entry.beanName}
            </span>
            <span className="text-[10px] text-muted-foreground border border-border/40 rounded-full px-1.5 py-0.5 flex-shrink-0">
              {entry.roast}
            </span>
          </div>
        </div>

        {/* Row 2: rating + TPS */}
        <div className="flex items-baseline justify-between mt-1.5">
          <div className="flex items-center gap-0.5">
            {entry.rating !== null ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  strokeWidth={1.5}
                  className={i < entry.rating! ? "text-accent fill-accent" : "text-muted-foreground/30"}
                />
              ))
            ) : (
              <span className="text-[13px] text-muted-foreground/40" style={{ fontFamily: "Inter, sans-serif" }}>未評価</span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-muted-foreground tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
              TPS {entry.tps}
            </span>
            {entry.tpsDiff !== 0 && (
              <span className="text-[11px] text-accent font-medium tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
                {entry.tpsDiff > 0 ? "+" : ""}{entry.tpsDiff}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: params */}
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-primary/80">
            <Clock size={12} strokeWidth={1.5} className="text-muted-foreground/70" />
            <span className="text-[11px] tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>{entry.brewTime}</span>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground/70">
            <Thermometer size={12} strokeWidth={1.5} />
            <span className="text-[11px] tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>{entry.temp}℃</span>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground/70">
            <Settings2 size={12} strokeWidth={1.5} />
            <span className="text-[11px] tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>{entry.grind}</span>
          </span>
        </div>

        {/* Row 4: status + changes */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[11px] font-medium ${st.className}`} style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {st.label}
          </span>
          {entry.changes.slice(0, 2).map((c, i) => (
            <span key={i} className="text-[11px] text-muted-foreground/60" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              {c.label} {c.diff}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

export default BrewLogCard;
