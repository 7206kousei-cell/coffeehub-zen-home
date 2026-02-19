import { useState, useEffect } from "react";
import { Star, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const axes = [
  { key: "sweetness", label: "甘さ" },
  { key: "acidity", label: "酸味" },
  { key: "bitterness", label: "苦味" },
  { key: "body", label: "濃さ" },
] as const;

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sliders, setSliders] = useState({ sweetness: 50, acidity: 50, bitterness: 50, body: 50 });
  const [tappedStar, setTappedStar] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("dark");
    return () => {
      if (!wasDark) document.documentElement.classList.remove("dark");
    };
  }, []);

  const handleStarTap = (star: number) => {
    setRating(star);
    setTappedStar(star);
    setTimeout(() => setTappedStar(null), 400);
  };

  const activeStar = hoveredStar || rating;

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col" style={{ background: "#121212" }}>
      {/* Header - transparent blur */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{ backdropFilter: "blur(20px)", background: "rgba(18,18,18,0.7)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E07A5F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
        <span
          className="text-[11px] tracking-[0.08em] uppercase text-white/25"
          style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.12em" }}
        >
          Togafin
        </span>
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full text-white/25 hover:text-white/50 transition-colors"
        >
          <X size={16} strokeWidth={1.3} />
        </button>
      </header>

      {/* Title area - generous spacing */}
      <section className="px-8 pt-16 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xl font-extralight tracking-wide text-white/90 leading-relaxed"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          今回の一杯は
          <br />
          どうでしたか？
        </motion.h1>
      </section>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center text-[12px] text-white/20 mb-16 tracking-wider"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        直感でOKです。
      </motion.p>

      {/* Star Rating - refined */}
      <section className="flex justify-center gap-5 px-6 mb-16">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= activeStar;
          const isTapped = tappedStar === star;
          return (
            <motion.button
              key={star}
              onClick={() => handleStarTap(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              animate={
                isTapped
                  ? { scale: [1, 1.25, 0.95, 1.05, 1] }
                  : { scale: 1 }
              }
              transition={
                isTapped
                  ? { duration: 0.45, ease: "easeOut" }
                  : { duration: 0.2 }
              }
              className="focus:outline-none relative"
              aria-label={`${star} star`}
            >
              {/* Glow behind filled star */}
              {filled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 -m-1 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(224,122,95,0.15) 0%, transparent 70%)",
                    filter: "blur(4px)",
                  }}
                />
              )}
              <Star
                size={26}
                strokeWidth={1}
                className="relative z-10 transition-all duration-300"
                style={{
                  fill: filled ? "#E07A5F" : "transparent",
                  color: filled ? "#E07A5F" : "rgba(255,255,255,0.12)",
                  filter: filled ? "drop-shadow(0 0 6px rgba(224,122,95,0.3))" : "none",
                }}
              />
            </motion.button>
          );
        })}
      </section>

      {/* Save Button - premium gradient pill */}
      <section className="px-10 mb-16">
        <motion.button
          disabled={rating === 0}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          animate={{
            scale: pressed && rating > 0 ? 0.96 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="w-full relative overflow-hidden rounded-full transition-all duration-300"
          style={
            rating > 0
              ? {
                  background: "linear-gradient(135deg, #E07A5F 0%, #C4624A 100%)",
                  boxShadow: "0 4px 20px rgba(224,122,95,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  padding: "15px 0",
                }
              : {
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "14px 0",
                }
          }
        >
          <span
            className={`text-[13px] tracking-[0.06em] font-medium relative z-10 ${
              rating > 0 ? "text-white" : "text-white/15"
            }`}
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            保存して次へ
          </span>
        </motion.button>
      </section>

      {/* Collapsible Detail Rating */}
      <section className="px-6 mt-auto pb-12">
        <button
          onClick={() => setDetailOpen(!detailOpen)}
          className="flex items-center justify-center gap-2 w-full py-3 text-white/20 hover:text-white/35 transition-colors"
        >
          <span className="text-[11px] tracking-wider" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            味を詳しく記録する（任意）
          </span>
          <motion.span animate={{ rotate: detailOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={13} strokeWidth={1.3} />
          </motion.span>
        </button>

        <AnimatePresence>
          {detailOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 pb-4 space-y-8">
                {axes.map(({ key, label }) => {
                  const val = sliders[key];
                  return (
                    <div key={key} className="space-y-3">
                      <span
                        className="text-[11px] text-white/30 block text-center tracking-[0.1em]"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {label}
                      </span>
                      <div className="flex items-center gap-4 px-2">
                        <span className="text-[9px] text-white/15 w-4 text-right tracking-wider">低</span>
                        <div className="flex-1 relative h-10 flex items-center">
                          {/* Track bg */}
                          <div
                            className="absolute inset-x-0 h-[2px] rounded-full"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                          />
                          {/* Track fill */}
                          <div
                            className="absolute left-0 h-[2px] rounded-full"
                            style={{
                              width: `${val}%`,
                              background: `linear-gradient(90deg, rgba(224,122,95,0.3), rgba(224,122,95,0.6))`,
                            }}
                          />
                          {/* Native range input */}
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={val}
                            onChange={(e) =>
                              setSliders((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                            }
                            className="rating-range-input absolute inset-0 w-full appearance-none bg-transparent cursor-pointer"
                          />
                        </div>
                        <span className="text-[9px] text-white/15 w-4 tracking-wider">高</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Rating;
