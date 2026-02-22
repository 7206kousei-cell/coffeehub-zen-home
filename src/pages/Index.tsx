import { useState, useEffect } from "react";
import { Clock, Bean, BarChart3, Moon, Sun, ChevronRight, FlaskConical, Droplets } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import TPSLineChart from "@/components/TPSLineChart";

// Mock data
const tpsHistory = [
  { day: "M", value: 68 },
  { day: "T", value: 71 },
  { day: "W", value: 69 },
  { day: "T", value: 74 },
  { day: "F", value: 73 },
  { day: "S", value: 76 },
  { day: "S", value: 78 },
];

const quickActions = [
  { icon: FlaskConical, label: "抽出をはじめる", accent: true },
  { icon: Clock, label: "抽出履歴", accent: false },
  { icon: Bean, label: "豆一覧", accent: false },
  { icon: BarChart3, label: "分析", accent: false },
];

const Index = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Droplets size={22} className="text-primary" strokeWidth={1.5} />
          <span className="text-sm font-semibold tracking-wide text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
            Togaro
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-light">
          2026年2月21日 金
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" />
              <AvatarFallback className="bg-secondary text-primary text-xs">YK</AvatarFallback>
            </Avatar>
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent border-2 border-background" />
          </div>
        </div>
      </header>

      {/* Greeting */}
      <section className="px-6 pt-6 pb-2">
        <h1
          className="text-4xl font-light tracking-tight text-primary"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          おはよう
        </h1>
      </section>

      {/* TPS Score */}
      <section className="px-6 pt-6 pb-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-muted-foreground tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
            TPS
          </span>
          <span
            className="text-3xl font-light text-primary tabular-nums"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            78
          </span>
          <span className="text-sm text-accent font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            +2
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          Consistency improving.
        </p>
      </section>

      {/* TPS Line Chart */}
      <section className="px-6 pt-2 pb-2">
        <TPSLineChart data={tpsHistory} />
      </section>

      {/* Improvement Suggestion */}
      <section className="px-6 pt-8 pb-8">
        <p className="text-[13px] text-muted-foreground leading-[1.6]">
          抽出がやや濃くなっています。
        </p>
        <p className="text-[13px] text-primary leading-[1.6] mt-2 font-medium">
          次回：抽出時間 −10秒
        </p>
      </section>

      {/* Pending Rating CTA */}
      <section className="px-6 pb-8">
        <button
          onClick={() => navigate("/rating")}
          className="w-full flex items-center justify-between bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-4 transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col gap-1 text-left">
            <p className="text-sm font-medium text-primary">昨日の抽出：評価待ち（1件）</p>
            <p className="text-[11px] text-muted-foreground">評価すると改善精度が高まります</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground/50 flex-shrink-0" />
        </button>
      </section>

      {/* Quick Actions */}
      <section className="px-6 pb-10 pt-2">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, accent }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-2.5 py-4 rounded-2xl transition-all active:scale-95 ${
                accent
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "bg-card text-primary shadow-sm border border-border/50"
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
