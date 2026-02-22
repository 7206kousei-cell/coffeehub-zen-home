import { useState, useEffect, useCallback } from "react";
import { X, Droplet, Citrus, Coffee, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const flavorAxes = [
  { key: "sweetness", label: "甘さ", icon: Droplet },
  { key: "acidity", label: "酸味", icon: Citrus },
  { key: "bitterness", label: "苦味", icon: Coffee },
  { key: "body", label: "濃さ", icon: Gauge },
] as const;

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [flavors, setFlavors] = useState({ sweetness: 3, acidity: 3, bitterness: 3, body: 3 });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => { if (!wasDark) document.documentElement.classList.remove("dark"); };
  }, []);

  const handleSave = useCallback(() => {
    if (rating === 0) return;
    setSaved(true);
    setTimeout(() => navigate(-1), 1600);
  }, [rating, navigate]);

  const previousRating = 3;

  if (saved) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
            className="text-3xl text-primary"
          >
            <Coffee size={32} strokeWidth={1.2} className="mx-auto" />
          </motion.div>
          <p className="text-muted-foreground text-sm tracking-wider" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            記録しました
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-2">
        <div className="w-8" />
        <div className="text-center">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40" style={{ fontFamily: "Inter, sans-serif" }}>
            評価
          </span>
        </div>
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors">
          <X size={15} strokeWidth={1.5} />
        </button>
      </header>

      {/* Title */}
      <section className="px-6 pt-4 pb-6">
        <h1
          className="text-[22px] font-light text-primary leading-[1.6] tracking-wide"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          この一杯の結果を記録
        </h1>
      </section>

      {/* Card 1: Satisfaction (Primary Data) */}
      <section className="px-6 pb-4">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-6">
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              満足度
            </h2>
          </div>
          <p className="text-[11px] text-muted-foreground mb-6">
            最適化モデルに反映されます
          </p>

          <div className="flex justify-center gap-4 mb-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= rating;
              return (
                <motion.button
                  key={n}
                  onClick={() => setRating(n === rating ? 0 : n)}
                  whileTap={{ scale: 0.85 }}
                  className="relative w-12 h-12 rounded-full focus:outline-none transition-all duration-200"
                  style={{
                    background: active
                      ? "hsl(var(--accent))"
                      : "transparent",
                    border: active
                      ? "1.5px solid hsl(var(--accent))"
                      : "1.5px solid hsl(var(--border) / 0.5)",
                  }}
                >
                  <span
                    className={`text-[14px] font-medium tabular-nums ${
                      active ? "text-accent-foreground" : "text-muted-foreground/40"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {n}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Card 2: Flavor Axes (Analytical Data) */}
      <section className="px-6 pb-4">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5">
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="text-sm font-semibold text-primary" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              味の傾向
              <span className="text-[11px] font-normal text-muted-foreground ml-1.5">（任意）</span>
            </h2>
          </div>
          <p className="text-[11px] text-muted-foreground mb-5">
            入力すると提案精度が向上します
          </p>

          <div className="space-y-5">
            {flavorAxes.map(({ key, label, icon: Icon }) => {
              const val = flavors[key];
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={14} strokeWidth={1.5} className="text-muted-foreground/60" />
                      <span className="text-[12px] text-primary/80 tracking-wider" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                        {label}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/50 tabular-nums" style={{ fontFamily: "Inter, sans-serif" }}>
                      {val}
                    </span>
                  </div>
                  <Slider
                    value={[val]}
                    onValueChange={([v]) => setFlavors((p) => ({ ...p, [key]: v }))}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full [&_[data-radix-slider-track]]:h-[3px] [&_[data-radix-slider-track]]:bg-border/30 [&_[data-radix-slider-range]]:bg-accent [&_[data-radix-slider-thumb]]:h-3.5 [&_[data-radix-slider-thumb]]:w-3.5 [&_[data-radix-slider-thumb]]:border-2 [&_[data-radix-slider-thumb]]:border-accent [&_[data-radix-slider-thumb]]:bg-background"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Card 3: Previous Comparison */}
      <section className="px-6 pb-6">
        <div className="bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-4">
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <span>前回：{previousRating}</span>
            <span className="text-border/60">|</span>
            <AnimatePresence mode="wait">
              {rating > 0 ? (
                <motion.span
                  key={rating}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={rating > previousRating ? "text-accent" : rating < previousRating ? "text-muted-foreground" : "text-muted-foreground"}
                >
                  {rating > previousRating ? `前回より +${rating - previousRating}` : rating < previousRating ? `前回より ${rating - previousRating}` : "前回と同じ"}
                </motion.span>
              ) : (
                <span className="text-muted-foreground/40">今回：未入力</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Fixed Footer Button */}
      <section className="px-6 pb-10 pt-4 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent">
        <motion.button
          onClick={handleSave}
          disabled={rating === 0}
          whileTap={rating > 0 ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl text-[13px] tracking-wider transition-all duration-300 font-medium ${
            rating > 0
              ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
              : "bg-card text-muted-foreground/20 border border-border/30"
          }`}
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          評価を保存
        </motion.button>
      </section>
    </div>
  );
};

export default Rating;
