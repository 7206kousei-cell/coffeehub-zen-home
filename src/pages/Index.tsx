import { Coffee, Clock, Bean, BarChart3, Star, Droplets, Lightbulb } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  { icon: Coffee, label: "記録する", accent: true },
  { icon: Clock, label: "直近の抽出", accent: false },
  { icon: Bean, label: "豆一覧", accent: false },
  { icon: BarChart3, label: "統計", accent: false },
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
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {/* App Bar */}
      <header className="flex items-center justify-between px-6 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Droplets size={22} className="text-primary" strokeWidth={1.5} />
          <span className="text-sm font-semibold tracking-wide text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
            CoffeeHub
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-light">
          2026年2月13日 金
        </span>
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" />
            <AvatarFallback className="bg-secondary text-primary text-xs">YK</AvatarFallback>
          </Avatar>
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent border-2 border-background" />
        </div>
      </header>

      {/* Hero / Caffeine Dashboard */}
      <section className="px-6 pt-6 pb-8">
        <h1
          className="text-5xl font-light tracking-tight text-primary mb-2"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          おはよう
        </h1>
        <p className="text-sm text-muted-foreground mb-6">今日の摂取カフェイン</p>
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

      {/* Daily Insight Card */}
      <section className="px-6 pb-10">
        <div className="bg-card rounded-3xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Lightbulb size={16} className="text-accent" strokeWidth={1.5} />
            <h3 className="text-sm font-medium text-primary">今日のひとこと</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            この豆は92℃で最も高評価が出ています
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
