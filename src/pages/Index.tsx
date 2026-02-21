import { useState, useEffect } from "react";
import { Coffee, Clock, Bean, BarChart3, Star, Droplets, Moon, Sun, Lightbulb, ChevronRight, FlaskConical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const recentBrews = [
  {
    id: 1,
    name: "エチオピア イルガチェフェ",
    roaster: "LIGHT UP COFFEE",
    rating: 4.5,
    method: "V60",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "グアテマラ アンティグア",
    roaster: "FUGLEN COFFEE",
    rating: 4.0,
    method: "AeroPress",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "コロンビア ウィラ",
    roaster: "ONIBUS COFFEE",
    rating: 4.8,
    method: "French Press",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=200&h=200&fit=crop",
  },
];

const quickActions = [
  { icon: FlaskConical, label: "抽出をはじめる", accent: true },
  { icon: Clock, label: "抽出履歴", accent: false },
  { icon: Bean, label: "豆一覧", accent: false },
  { icon: BarChart3, label: "分析", accent: false },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={12}
        className={
          star <= Math.floor(rating)
            ? "fill-accent text-accent"
            : star - 0.5 <= rating
              ? "fill-accent/50 text-accent"
              : "text-muted-foreground/30"
        }
      />
    ))}
  </div>
);

const Index = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative transition-colors duration-300">
      {/* App Bar */}
      <header className="flex items-center justify-between px-6 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Droplets size={22} className="text-primary" strokeWidth={1.5} />
          <span className="text-sm font-semibold tracking-wide text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
            CoffeeHub
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

      {/* Hero / Caffeine Dashboard */}
      <section className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-5xl font-light tracking-tight text-primary mb-2"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              おはよう
            </h1>
            <p className="text-sm text-muted-foreground mb-6">今日の摂取カフェイン</p>
          </div>
          {/* TPS Score — Goal 2: 控えめに右上 */}
          <div className="flex flex-col items-end gap-0.5 pt-2">
            <span className="text-[10px] text-muted-foreground tracking-wide">TPS</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>72</span>
              <span className="text-xs text-accent font-medium">+3</span>
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="text-7xl font-bold tracking-tighter text-primary"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1 }}
          >
            142
          </span>
          <span className="text-2xl font-light text-primary/60" style={{ fontFamily: 'Inter, sans-serif' }}>
            mg
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          安全摂取目安まであと<span className="text-accent font-medium">258mg</span>
        </p>
      </section>

      {/* Goal 1: Optimization State + Goal 6: Loop Trajectory — サブ情報行 */}
      <section className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground tracking-wide">最適化状態</span>
            <span className="text-[11px] font-medium text-primary">探索中</span>
            <span className="text-[10px] text-muted-foreground">· 安定度 中</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">直近</span>
            {[3, 4, 4].map((r, i) => (
              <span key={i} className="text-[11px] text-primary/70 font-medium">
                ★{r}{i < 2 && <span className="text-muted-foreground/40 mx-0.5">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Goal 3: 評価待ちCTA — 静かな導線 */}
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

      {/* Quick Action Cards */}
      <section className="px-6 pb-8">
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

      {/* Recent Brews */}
      <section className="pb-8">
        <h2 className="text-sm font-medium text-primary px-6 mb-4">最近の抽出</h2>
        <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {recentBrews.map((brew) => (
            <div
              key={brew.id}
              className="flex-shrink-0 w-[72%] bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex"
            >
              <img
                src={brew.image}
                alt={brew.name}
                className="w-24 h-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-col justify-center py-4 px-4 gap-1.5 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{brew.name}</p>
                <p className="text-[11px] text-muted-foreground">{brew.roaster}</p>
                <StarRating rating={brew.rating} />
                <span className="text-[10px] text-muted-foreground/70 mt-0.5">{brew.method}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Goal 4: Daily Insight — 改善フィードバックに変更 */}
      <section className="px-6 pb-10">
        <div className="bg-card rounded-3xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Lightbulb size={16} className="text-accent" strokeWidth={1.5} />
            <h3 className="text-sm font-medium text-primary">改善メモ</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            前回より評価が上がりました（+1）。湯温92℃の提案が効果を出しています。
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
