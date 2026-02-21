import { useState, useEffect } from "react";
import { Clock, Bean, BarChart3, Droplets, Moon, Sun, ChevronRight, FlaskConical, Lightbulb } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import TasteRadarChart from "@/components/TasteRadarChart";

// Mock EMA values (user_model_state)
const tasteProfile = { sweetness: 6.2, acidity: 7.8, bitterness: 4.1, body: 5.5 };

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

      {/* Taste Profile Hero */}
      <section className="px-6 pt-4 pb-2">
        <p className="text-[11px] text-muted-foreground tracking-wide mb-4">
          あなたの味のプロファイル
        </p>
        <div className="flex justify-center">
          <TasteRadarChart values={tasteProfile} size={170} />
        </div>
      </section>

      {/* Improvement Feedback — single line */}
      <section className="px-6 pt-3 pb-6">
        <div className="flex items-center gap-2 justify-center">
          <Lightbulb size={13} className="text-accent flex-shrink-0" strokeWidth={1.5} />
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            前回より評価が上がりました（+1）。提案（湯温）が効果を出しています。
          </p>
        </div>
      </section>

      {/* Pending Rating CTA */}
      <section className="px-6 pb-6">
        <button
          onClick={() => navigate("/rating")}
          className="w-full flex items-center justify-between bg-card rounded-2xl border border-border/50 shadow-sm px-5 py-4 transition-all active:scale-[0.98]"
        >
          <div className="flex flex-col gap-1 text-left">
            <p className="text-sm font-medium text-primary">昨日の抽出：評価待ち（1件）</p>
            <p className="text-[11px] text-muted-foreground">評価すると改善精度が高まります</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground/50 flex-shrink-0" />
        </button>
      </section>

      {/* Quick Actions */}
      <section className="px-6 pb-10">
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
